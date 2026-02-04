import Phaser from 'phaser';
import { seededRNG, jitter } from '../rng.js';
import { selectFeaturesWithArchetype } from '../selectFeatures.js';
import { defaultAvatarConfig } from '../avatarConfig.js';
import manifest from '../manifest.json';
import { AVATAR_MANIFEST_VERSION } from './manifestTypes.js';

const BASE_URL = typeof import.meta !== 'undefined' && import.meta?.env?.BASE_URL
  ? import.meta.env.BASE_URL
  : '/';

const manifestLayerIndex = new Map(manifest.layers.map(layer => [layer.name, layer]));

const BLEND_MODE_MAP = {
  NORMAL: Phaser.BlendModes.NORMAL,
  ADD: Phaser.BlendModes.ADD,
  MULTIPLY: Phaser.BlendModes.MULTIPLY,
  SCREEN: Phaser.BlendModes.SCREEN,
  OVERLAY: Phaser.BlendModes.OVERLAY
};

const toneToTint = {
  warm_light: 0xffd7b5,
  warm_medium: 0xd1997a,
  warm_deep: 0x8a4b2b,
  cool_light: 0xd3e0ff,
  cool_medium: 0x9ab9ff,
  cool_deep: 0x4f74a8,
  neutral_light: 0xe6d6c8,
  neutral_medium: 0xbca99a,
  neutral_deep: 0x7a5b45
};

const LIGHTING_PRESETS = {
  stage: {
    ambient: 0x555555,
    lights: [
      { x: 0.25, y: 0.15, radius: 1.25, color: 0xfff2dd, intensity: 1.0 },
      { x: 0.75, y: 0.3, radius: 0.9, color: 0x7ec4ff, intensity: 0.7 },
      { x: 0.5, y: 1.1, radius: 1.5, color: 0xff5e99, intensity: 0.3 }
    ]
  },
  studio: {
    ambient: 0x777777,
    lights: [
      { x: 0.4, y: 0.1, radius: 1.4, color: 0xffffff, intensity: 0.9 },
      { x: 0.6, y: 0.2, radius: 1.2, color: 0xf6eddc, intensity: 0.6 }
    ]
  },
  noir: {
    ambient: 0x333333,
    lights: [
      { x: 0.2, y: 0.15, radius: 1.6, color: 0xffffff, intensity: 0.7 },
      { x: 0.85, y: 0.3, radius: 1.1, color: 0x88bfff, intensity: 0.4 }
    ]
  },
  none: {
    ambient: 0x999999,
    lights: []
  }
};

const resolveAssetPath = (path) => {
  if (!path || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const base = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (!base) {
    return normalizedPath;
  }

  return `${base}${normalizedPath}`;
};

/**
 * AvatarScene - small Phaser scene to compose an avatar from layered PNGs.
 * PoC: loads PNGs from public/avatar/assets/* via ids in defaultAvatarConfig.
 */
class AvatarScene extends Phaser.Scene {
  constructor() {
    super({ key: 'AvatarScene' });
    this.selection = null;
    this.manifestVersion = manifest.version ?? 1;
    this.options = {
      lightingPreset: 'stage',
      applyTint: true,
      ambientOverride: null,
      debugSelection: false
    };
  }

  init(data = {}) {
    this.seed = data.seed ?? 'unknown';
    this.archetype = data.archetype;
    this.size = data.size ?? defaultAvatarConfig.canvasSize;
    this.options = {
      lightingPreset: data.lightingPreset ?? this.options.lightingPreset,
      applyTint: data.applyTint ?? this.options.applyTint,
      ambientOverride: data.ambientColor ?? this.options.ambientOverride,
      debugSelection: data.debugSelection ?? this.options.debugSelection
    };

    if (manifest.version !== AVATAR_MANIFEST_VERSION) {
      console.warn(`Avatar manifest version mismatch. Scene expects ${AVATAR_MANIFEST_VERSION}, found ${manifest.version}.`);
    }
  }

  preload() {
    // Load image assets used by config. Use feature.id as key.
    const textureManager = this.textures;
    const imageCache = this.cache?.image;

    for (const layer of defaultAvatarConfig.layers) {
      for (const feat of layer.features) {
        if (!feat.path || feat.path === '') continue;

        const alreadyLoaded = (textureManager && typeof textureManager.exists === 'function' && textureManager.exists(feat.id))
          || (imageCache && typeof imageCache.exists === 'function' && imageCache.exists(feat.id));

        if (!alreadyLoaded) {
          this.load.image(feat.id, resolveAssetPath(feat.path));
          if (feat.normalMap) {
            this.load.image(`${feat.id}__normal`, resolveAssetPath(feat.normalMap));
          }
          if (feat.roughnessMap) {
            this.load.image(`${feat.id}__roughness`, resolveAssetPath(feat.roughnessMap));
          }
        }
      }
    }
  }

  create() {
    const rng = seededRNG(this.seed);
    this.selection = selectFeaturesWithArchetype(rng, defaultAvatarConfig, this.archetype);

    const selectionPayload = Array.from(this.selection.entries()).map(([layerName, feature]) => ({
      layer: layerName,
      id: feature.id,
      category: feature.category ?? null,
      tone: feature.tone ?? null,
      genderTags: feature.genderTags ?? [],
      styleTags: feature.styleTags ?? []
    }));

    if (this.options.debugSelection) {
      console.table?.(selectionPayload);
    }

    this.game.events.emit('avatar:selection', {
      seed: this.seed,
      archetype: this.archetype,
      features: selectionPayload
    });

    if (this.lights) {
      this.lights.disable();
    }

    if (this.lights && this.renderer?.pipelines?.has('Light2D')) {
      const preset = LIGHTING_PRESETS[this.options.lightingPreset] ?? LIGHTING_PRESETS.stage;
      const ambient = this.options.ambientOverride ?? preset.ambient;
      this.lights.enable().setAmbientColor(ambient);
      preset.lights.forEach(light => {
        this.lights.addLight(
          this.size * light.x,
          this.size * light.y,
          this.size * light.radius,
          light.color,
          light.intensity
        );
      });
    }

    const size = this.size;
    const centerX = size / 2;
    const centerY = size / 2;

    // RenderTexture compositor
    const rt = this.add.renderTexture(0, 0, size, size).setOrigin(0);

    // Optional: draw white background
    rt.fill(0xffffff, 1);

    const drawQueue = [];

    defaultAvatarConfig.layers.forEach((layer, index) => {
      const feat = this.selection.get(layer.name);
      if (!feat || !feat.path) return;
      if (!this.textures.exists(feat.id)) return;

      const manifestLayer = manifestLayerIndex.get(layer.manifestLayer ?? layer.name);
      const baseZ = (manifestLayer?.zIndex ?? 0) + index * 10;
      const featureZ = feat.zIndex ?? 0;

      drawQueue.push({
        layer,
        feature: feat,
        manifestLayer,
        order: baseZ + featureZ * 0.01
      });
    });

    drawQueue.sort((a, b) => a.order - b.order);

    for (const entry of drawQueue) {
      const { layer, feature, manifestLayer } = entry;

      const jitterX = jitter(rng, layer.jitter?.x ?? 0);
      const jitterY = jitter(rng, layer.jitter?.y ?? 0);
      const rotation = jitter(rng, layer.jitter?.rotation ?? 0);
      const opacityRange = layer.jitter?.opacity ?? [1, 1];
      const alpha = Array.isArray(opacityRange)
        ? Phaser.Math.FloatBetween(opacityRange[0], opacityRange[1])
        : opacityRange;

      const sprite = this.add.image(centerX + jitterX, centerY + jitterY, feature.id)
        .setOrigin(0.5)
        .setRotation(rotation)
        .setAlpha(alpha);

      const tintHex = this.options.applyTint && feature.supportsTint && feature.tone ? toneToTint[feature.tone] : null;
      if (tintHex) {
        sprite.setTint(tintHex);
      }

      const blendMode = manifestLayer?.blendMode ? (BLEND_MODE_MAP[manifestLayer.blendMode] ?? Phaser.BlendModes.NORMAL) : Phaser.BlendModes.NORMAL;
      sprite.setBlendMode(blendMode);

      if (feature.normalMap && this.textures.exists(`${feature.id}__normal`)) {
        sprite.setPipeline('Light2D');
        sprite.setNormalMap(`${feature.id}__normal`);
      }

      if (feature.intensity != null) {
        sprite.setAlpha(alpha * feature.intensity);
      }

      rt.draw(sprite, sprite.x, sprite.y);
      sprite.destroy();
    }

    // Simple blink demo: periodically draw eyes overlay with quick alpha fade
    this.time.addEvent({
      delay: 1200,
      loop: true,
      callback: () => {
        const eyeFeat = this.selection.get('eyes');
        if (!eyeFeat || !this.textures.exists(eyeFeat.id)) { return; }

        const blinkImg = this.add.image(centerX, centerY, eyeFeat.id)
          .setOrigin(0.5)
          .setAlpha(0);

        this.tweens.timeline({
          targets: blinkImg,
          tweens: [
            { alpha: 1, duration: 80 },
            { alpha: 0, duration: 120 }
          ],
          onComplete: () => { blinkImg.destroy(); }
        });
      }
    });

    // After a short delay to let any tweens run, snapshot the render texture to a dataURL
    this.time.delayedCall(200, () => {
      rt.snapshot((image) => {
        if (image && image.src) {
          this.game.events.emit('avatar:generated', image.src);
        } else if (image instanceof HTMLCanvasElement) {
          this.game.events.emit('avatar:generated', image.toDataURL('image/png'));
        } else {
          this.game.events.emit('avatar:generated', '');
        }
      });
    });
  }
}

export default AvatarScene;
