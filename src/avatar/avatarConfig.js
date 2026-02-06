import manifest from './manifest.json';

const MANIFEST_INDEX = new Map(
  manifest.layers.map(layer => [
    layer.name,
    new Map(layer.features.map(feature => [feature.id, feature]))
  ])
);

function cloneFeature(feature) {
  if (!feature) return null;
  return {
    ...feature,
    genderTags: [...feature.genderTags],
    styleTags: [...feature.styleTags],
    ageRange: [...feature.ageRange],
    variants: [...feature.variants],
    hueVariants: [...feature.hueVariants]
  };
}

function getFeatureById(layerName, featureId) {
  const layerMap = MANIFEST_INDEX.get(layerName);
  if (!layerMap || !layerMap.has(featureId)) {
    throw new Error(`Feature ${featureId} missing from manifest layer ${layerName}`);
  }
  return cloneFeature(layerMap.get(featureId));
}

function expandCategory(layerName, category, ids, weightOverride = {}) {
  return ids.map(id => {
    const base = getFeatureById(layerName, id);
    return {
      ...base,
      weight: weightOverride[id] ?? base.weight ?? 1,
      category
    };
  });
}

const layerSpecs = [
  {
    name: 'paper',
    manifestLayer: 'paper',
    required: true,
    jitter: { x: 0, y: 0, rotation: 0, opacity: [1, 1] },
    categories: {
      default: ['paper_1']
    }
  },
  {
    name: 'head',
    manifestLayer: 'heads',
    required: true,
    jitter: { x: 2, y: 2, rotation: 0.01, opacity: [0.95, 1.0] },
    categories: {
      base: ['head_1', 'head_2', 'head_3', 'head_4', 'head_5']
    }
  },
  {
    name: 'eyes',
    manifestLayer: 'eyes',
    required: true,
    jitter: { x: 2, y: 2, rotation: 0.01, opacity: [0.92, 1.0] },
    categories: {
      tired: ['eyes_tired_01', 'eyes_tired_02', 'eyes_tired_03'],
      narrow: ['eyes_narrow_01', 'eyes_narrow_02'],
      heavyLid: ['eyes_heavyLid_01', 'eyes_heavyLid_02'],
      squinting: ['eyes_squinting_01', 'eyes_squinting_02'],
      open: ['eyes_open_01', 'eyes_open_02'],
      wide: ['eyes_wide_01'],
      neutral: ['eyes_neutral_01', 'eyes_neutral_02', 'eyes_neutral_03'],
      angry: ['eyes_angry_01'],
      intense: ['eyes_intense_01'],
      sad: ['eyes_sad_01'],
      droopy: ['eyes_droopy_01'],
      asymmetric: ['eyes_asymmetric_01']
    }
  },
  {
    name: 'nose',
    manifestLayer: 'noses',
    required: true,
    jitter: { x: 2, y: 2, rotation: 0.01, opacity: [0.92, 1.0] },
    categories: {
      narrow: ['nose_narrow_01', 'nose_narrow_02'],
      crooked: ['nose_crooked_left_01', 'nose_crooked_left_02', 'nose_crooked_right_01', 'nose_crooked_right_02'],
      wide: ['nose_wide_01', 'nose_wide_02'],
      hooked: ['nose_hooked_01', 'nose_hooked_02'],
      straight: ['nose_straight_01', 'nose_straight_02'],
      prominent: ['nose_prominent_01', 'nose_prominent_02'],
      neutral: ['nose_neutral_01', 'nose_neutral_02'],
      upturned: ['nose_upturned_01', 'nose_upturned_02'],
      button: ['nose_button_01', 'nose_button_02'],
      broken: ['nose_broken_01']
    }
  },
  {
    name: 'mouth',
    manifestLayer: 'mouths',
    required: true,
    jitter: { x: 2, y: 2, rotation: 0.01, opacity: [0.92, 1.0] },
    categories: {
      flat: ['mouth_flat_01', 'mouth_flat_02', 'mouth_flat_03'],
      downturned: ['mouth_downturned_01', 'mouth_downturned_02'],
      smirk: ['mouth_smirk_01', 'mouth_smirk_02', 'mouth_smirk_left_01', 'mouth_smirk_right_01'],
      neutral: ['mouth_neutral_01', 'mouth_neutral_02', 'mouth_neutral_03'],
      thin: ['mouth_thin_01', 'mouth_thin_02'],
      wide: ['mouth_wide_01', 'mouth_wide_02'],
      smile: ['mouth_smile_01', 'mouth_smile_02', 'mouth_smile_wide_01'],
      frown: ['mouth_frown_01', 'mouth_frown_02'],
      open: ['mouth_open_01', 'mouth_open_02', 'mouth_open_singing_01'],
      asymmetric: ['mouth_asymmetric_01'],
      fullLips: ['mouth_fullLips_01'],
      thinLips: ['mouth_thinLips_01']
    }
  },
  {
    name: 'facialHair',
    manifestLayer: 'facialHair',
    required: false,
    jitter: { x: 2, y: 2, rotation: 0.01, opacity: [0.90, 1.0] },
    includeNone: { weight: 3 },
    categories: {
      patchy: ['facialHair_patchy_01', 'facialHair_patchy_02', 'facialHair_patchy_03'],
      heavyStubble: ['facialHair_heavyStubble_01', 'facialHair_heavyStubble_02'],
      beard: ['facialHair_beard_01', 'facialHair_beard_02', 'facialHair_beard_03', 'facialHair_beard_long_01', 'facialHair_beard_short_01'],
      stubble: ['facialHair_stubble_01', 'facialHair_stubble_02'],
      mustache: ['facialHair_mustache_01', 'facialHair_mustache_02', 'facialHair_mustache_thin_01', 'facialHair_mustache_thick_01'],
      goatee: ['facialHair_goatee_01', 'facialHair_goatee_02'],
      sideburns: ['facialHair_sideburns_01', 'facialHair_sideburns_long_01']
    }
  },
  {
    name: 'hair',
    manifestLayer: 'hair',
    required: true,
    jitter: { x: 3, y: 3, rotation: 0.02, opacity: [0.92, 1.0] },
    categories: {
      messy: ['hair_messy_01', 'hair_messy_02', 'hair_messy_03'],
      pulledBack: ['hair_pulledBack_01', 'hair_pulledBack_02', 'hair_ponytail_01', 'hair_bun_01'],
      beanie: ['hair_beanie_low_01', 'hair_beanie_low_02', 'hair_cap_01'],
      wild: ['hair_wild_01', 'hair_wild_02', 'hair_wild_03', 'hair_curly_wild_01'],
      clean: ['hair_clean_01', 'hair_clean_02', 'hair_clean_03', 'hair_short_clean_01'],
      bald: ['hair_bald_01', 'hair_bald_02'],
      neutral: ['hair_neutral_01', 'hair_neutral_02', 'hair_neutral_03'],
      long: ['hair_long_01', 'hair_long_02', 'hair_long_straight_01'],
      short: ['hair_short_01', 'hair_short_02', 'hair_short_spiky_01'],
      curly: ['hair_curly_01', 'hair_curly_02'],
      wavy: ['hair_wavy_01', 'hair_wavy_02'],
      mohawk: ['hair_mohawk_01', 'hair_mohawk_02'],
      fade: ['hair_fade_01'],
      undercut: ['hair_undercut_01']
    }
  },
  {
    name: 'accessories',
    manifestLayer: 'accessories',
    required: false,
    jitter: { x: 2, y: 2, rotation: 0.01, opacity: [0.90, 1.0] },
    includeNone: { weight: 5 },
    categories: {
      headphones: ['accessory_headphones_01', 'accessory_headphones_02', 'accessory_headphones_over_ear_01'],
      pencilBehindEar: ['accessory_pencil_behind_ear'],
      glasses: ['accessory_glasses_crooked_01', 'accessory_glasses_02', 'accessory_glasses_round_01', 'accessory_glasses_sunglasses_01', 'accessory_glasses_aviator_01'],
      earplug: ['accessory_earplug_01', 'accessory_earplug_02'],
      scar: ['accessory_scar_01', 'accessory_scar_02'],
      coffeeStain: ['accessory_coffee_stain_01'],
      earring: ['accessory_earring_01', 'accessory_earring_02', 'accessory_earring_stud_01'],
      piercing: ['accessory_piercing_nose_01', 'accessory_piercing_lip_01', 'accessory_piercing_eyebrow_01'],
      bandana: ['accessory_bandana_01'],
      headband: ['accessory_headband_01']
    }
  },
  {
    name: 'shading',
    manifestLayer: 'shading',
    required: false,
    jitter: { x: 1, y: 1, rotation: 0, opacity: [0.85, 0.95] },
    categories: {
      base: ['shading_1', 'shading_2']
    }
  }
];

function createLayer(spec) {
  const features = [];

  if (spec.includeNone) {
    features.push({
      id: 'none',
      path: '',
      filename: 'none',
      weight: spec.includeNone.weight ?? 1,
      category: 'none',
      genderTags: [],
      styleTags: [],
      ageRange: [],
      variants: [],
      hueVariants: [],
      supportsTint: false
    });
  }

  for (const [category, ids] of Object.entries(spec.categories)) {
    features.push(...expandCategory(spec.manifestLayer, category, ids, spec.weights));
  }

  return {
    name: spec.name,
    manifestLayer: spec.manifestLayer,
    required: spec.required,
    jitter: spec.jitter,
    features
  };
}

/**
 * Avatar Configuration
 *
 * Defines available features, layers, and generation rules for procedural avatars.
 */
export const defaultAvatarConfig = {
  canvasSize: 1024,
  layers: layerSpecs.map(createLayer),
  archetypes: {
    'synth-nerd': {
      eyes: {
        narrow: 1.4,
        tired: 1.3
      },
      nose: {
        narrow: 1.2
      },
      mouth: {
        flat: 1.4
      },
      hair: {
        pulledBack: 1.3,
        messy: 1.1
      },
      facialHair: {
        patchy: 1.2
      },
      accessories: {
        headphones: 1.6,
        pencilBehindEar: 1.5,
        glasses: 1.4
      }
    },
    drummer: {
      eyes: {
        heavyLid: 1.3,
        tired: 1.2
      },
      nose: {
        crooked: 1.5,
        wide: 1.3,
        broken: 1.2
      },
      mouth: {
        downturned: 1.2,
        open: 1.3
      },
      hair: {
        messy: 1.5,
        wild: 1.3,
        short: 1.2
      },
      facialHair: {
        heavyStubble: 1.4,
        stubble: 1.3
      },
      accessories: {
        earplug: 1.6,
        bandana: 1.3
      }
    },
    guitarist: {
      eyes: {
        squinting: 1.3,
        intense: 1.2
      },
      nose: {
        hooked: 1.2,
        broken: 1.3
      },
      mouth: {
        smirk: 1.3,
        open: 1.2
      },
      hair: {
        beanie: 1.4,
        wild: 1.3,
        mohawk: 1.5,
        messy: 1.2
      },
      facialHair: {
        beard: 1.5,
        stubble: 1.3
      },
      accessories: {
        scar: 1.3,
        piercing: 1.4,
        earring: 1.3
      }
    },
    vocalist: {
      eyes: {
        open: 1.3,
        wide: 1.2
      },
      nose: {
        straight: 1.3,
        neutral: 1.2
      },
      mouth: {
        neutral: 1.4,
        open: 1.5,
        smile: 1.3
      },
      hair: {
        clean: 1.4,
        long: 1.3,
        wavy: 1.2
      },
      facialHair: {
        none: 1.3
      },
      accessories: {
        glasses: 1.2,
        earring: 1.3
      }
    },
    producer: {
      eyes: {
        tired: 1.5,
        narrow: 1.3
      },
      nose: {
        prominent: 1.2,
        straight: 1.2
      },
      mouth: {
        flat: 1.5,
        thin: 1.3
      },
      hair: {
        bald: 1.4,
        pulledBack: 1.3,
        short: 1.2
      },
      facialHair: {
        stubble: 1.3,
        goatee: 1.2
      },
      accessories: {
        headphones: 1.7,
        coffeeStain: 1.4,
        glasses: 1.5,
        pencilBehindEar: 1.3
      }
    }
  }
};

/**
 * Get feature list for a layer
 * @param {Object} config - Avatar configuration
 * @param {string} layerName - Layer name
 * @returns {Array} Feature list
 */
export function getLayerFeatures(config, layerName) {
  const layer = config.layers.find(l => l.name === layerName);
  return layer?.features || [];
}

/**
 * Get layer configuration
 * @param {Object} config - Avatar configuration
 * @param {string} layerName - Layer name
 * @returns {Object|undefined} Layer configuration
 */
export function getLayerConfig(config, layerName) {
  return config.layers.find(l => l.name === layerName);
}
