/**
 * Avatar manifest builder
 * - Scans public/avatar/assets
 * - Merges optional *.meta.json files per asset and per layer
 * - Emits src/avatar/manifest.json with enriched metadata
 *
 * CLI flags:
 *   node tools/build-avatar-manifest.js [--dry-run] [--validate] [--verbose]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const assetsRoot = path.join(__dirname, '..', 'public', 'avatar', 'assets');
const outPath = path.join(__dirname, '..', 'src', 'avatar', 'manifest.json');

const args = process.argv.slice(2);
const options = {
  dryRun: args.includes('--dry-run'),
  validate: args.includes('--validate'),
  verbose: args.includes('--verbose')
};

const errors = [];
const warnings = [];

function logVerbose(message) {
  if (options.verbose) {
    console.log(message);
  }
}

function readJSON(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    errors.push(`Unable to parse JSON: ${filePath}\n  ${err.message}`);
    return null;
  }
}

function normalizePath(layerName, fileName) {
  return `/avatar/assets/${layerName}/${fileName}`.replace(/\\/g, '/');
}

function ensureArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

function resolveAssetReference(layerName, reference) {
  if (!reference) return null;
  if (/^https?:\/\//i.test(reference) || reference.startsWith('/')) {
    return reference;
  }
  return normalizePath(layerName, reference);
}

function gatherLayerMeta(layerDir) {
  const layerMetaPath = path.join(layerDir, '_layer.meta.json');
  if (!fs.existsSync(layerMetaPath)) {
    return {};
  }
  const meta = readJSON(layerMetaPath) || {};
  return meta;
}

function gatherFeatures(layerName, layerDir) {
  const entries = fs.readdirSync(layerDir);
  const artFiles = entries.filter(f => /\.(png|svg)$/i.test(f));

  return artFiles.map(fileName => {
    const id = path.parse(fileName).name;
    const featureMetaPath = path.join(layerDir, `${id}.meta.json`);
    const hasMeta = fs.existsSync(featureMetaPath);
    const meta = hasMeta ? (readJSON(featureMetaPath) || {}) : {};

    if (!hasMeta) {
      warnings.push(`Missing metadata for ${layerName}/${fileName}`);
    }

    return {
      id,
      path: normalizePath(layerName, fileName),
      filename: fileName,
      weight: meta.weight ?? 1,
      resolution: meta.resolution ?? null,
      tone: meta.tone ?? null,
      genderTags: ensureArray(meta.genderTags),
      styleTags: ensureArray(meta.styleTags),
      ageRange: ensureArray(meta.ageRange),
      variants: ensureArray(meta.variants),
      hueVariants: ensureArray(meta.hueVariants),
      supportsTint: Boolean(meta.supportsTint),
      normalMap: resolveAssetReference(layerName, meta.normalMap),
      roughnessMap: resolveAssetReference(layerName, meta.roughnessMap),
      atlas: meta.atlas ?? null,
      frame: meta.frame ?? null,
      zIndex: meta.zIndex ?? null,
      intensity: meta.intensity ?? null,
      metadataAuthor: meta.author ?? null,
      metadataNotes: meta.notes ?? null
    };
  });
}

function buildManifest() {
  if (!fs.existsSync(assetsRoot)) {
    errors.push(`Assets directory not found: ${assetsRoot}`);
    return null;
  }

  const layerDirs = fs.readdirSync(assetsRoot)
    .filter(entry => fs.statSync(path.join(assetsRoot, entry)).isDirectory())
    .sort();

  const manifest = {
    generatedAt: new Date().toISOString(),
    version: 2,
    layers: []
  };

  for (const layerName of layerDirs) {
    const layerDir = path.join(assetsRoot, layerName);
    logVerbose(`Processing layer: ${layerName}`);
    const layerMeta = gatherLayerMeta(layerDir);
    const features = gatherFeatures(layerName, layerDir);

    if (options.validate && features.length === 0) {
      warnings.push(`Layer ${layerName} has no feature art assets.`);
    }

    manifest.layers.push({
      name: layerName,
      order: layerMeta.order ?? null,
      description: layerMeta.description ?? '',
      defaultPalette: layerMeta.defaultPalette ?? null,
      zIndex: layerMeta.zIndex ?? null,
      blendMode: layerMeta.blendMode ?? 'NORMAL',
      features
    });
  }

  return manifest;
}

function validateManifest(manifest) {
  if (!manifest) return;

  for (const layer of manifest.layers) {
    for (const feature of layer.features) {
      if (!feature.resolution) {
        warnings.push(`Feature ${layer.name}/${feature.filename} missing resolution metadata.`);
      }
      if (!feature.tone) {
        warnings.push(`Feature ${layer.name}/${feature.filename} missing tone.`);
      }
      if (feature.genderTags.length === 0) {
        warnings.push(`Feature ${layer.name}/${feature.filename} missing genderTags.`);
      }
      if (feature.styleTags.length === 0) {
        warnings.push(`Feature ${layer.name}/${feature.filename} missing styleTags.`);
      }
      if (feature.ageRange.length === 0) {
        warnings.push(`Feature ${layer.name}/${feature.filename} missing ageRange.`);
      }
    }
  }
}

function writeManifest(manifest) {
  if (!manifest) {
    return;
  }

  const payload = JSON.stringify(manifest, null, 2);

  if (options.dryRun) {
    console.log(payload);
    return;
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, payload, 'utf8');
  console.log(`Wrote avatar manifest to ${outPath}`);
}

const manifest = buildManifest();

if (options.validate) {
  validateManifest(manifest);
}

if (errors.length > 0) {
  console.error('Manifest build failed with errors:');
  for (const err of errors) {
    console.error(` - ${err}`);
  }
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn('Manifest build warnings:');
  for (const warn of warnings) {
    console.warn(` - ${warn}`);
  }
}

writeManifest(manifest);
