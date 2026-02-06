/**
 * Tuning Profiles
 * Maps intuitive tuning knobs to specific Tone.js parameters
 * Each profile defines how knobs affect multiple audio parameters for dramatic results
 */

export const TUNING_PROFILES = {
  // Base parameter mappings for each knob
  ATTITUDE: {
    name: 'Attitude',
    description: 'Aggressive vs Laid-back',
    range: { min: 0, max: 100, default: 50 },
    parameters: {
      // Attack characteristics
      attack: { min: 0.01, max: 0.3, curve: 'linear' },
      // Distortion amount
      distortion: { min: 0, max: 0.8, curve: 'exponential' },
      // Compression ratio
      compressionRatio: { min: 2, max: 12, curve: 'linear' },
      // High frequency boost
      highBoost: { min: -6, max: 6, curve: 'linear' },
      // Transient emphasis
      transientEmphasis: { min: 0, max: 1, curve: 'linear' }
    }
  },

  PRESENCE: {
    name: 'Presence',
    description: 'Forward vs Recessed',
    range: { min: 0, max: 100, default: 50 },
    parameters: {
      // Overall volume
      volume: { min: -12, max: 6, curve: 'linear' },
      // Mid-range boost/cut
      midBoost: { min: -6, max: 6, curve: 'linear' },
      // Pre-delay for reverb
      preDelay: { min: 0, max: 0.1, curve: 'linear' },
      // Compression threshold
      compressionThreshold: { min: -24, max: -6, curve: 'linear' },
      // Stereo width
      stereoWidth: { min: 0, max: 1, curve: 'linear' }
    }
  },

  AMBIENCE: {
    name: 'Ambience',
    description: 'Dry vs Wet',
    range: { min: 0, max: 100, default: 50 },
    parameters: {
      // Reverb wet/dry mix
      reverbWet: { min: 0, max: 0.6, curve: 'linear' },
      // Reverb decay time
      reverbDecay: { min: 0.5, max: 3, curve: 'exponential' },
      // Reverb room size
      reverbSize: { min: 0.1, max: 1, curve: 'linear' },
      // Early reflections
      earlyReflections: { min: 0, max: 0.3, curve: 'linear' },
      // Release time
      release: { min: 0.1, max: 1.5, curve: 'exponential' }
    }
  },

  WARMTH: {
    name: 'Warmth',
    description: 'Bright vs Warm',
    range: { min: 0, max: 100, default: 50 },
    parameters: {
      // Low frequency boost
      lowBoost: { min: -6, max: 6, curve: 'linear' },
      // High frequency cut
      highCut: { min: -6, max: 6, curve: 'linear' },
      // Phaser wet mix
      phaserWet: { min: 0, max: 0.4, curve: 'linear' },
      // Filter cutoff
      filterCutoff: { min: 200, max: 8000, curve: 'exponential' },
      // Harmonic richness
      harmonics: { min: 0, max: 1, curve: 'linear' }
    }
  },

  ENERGY: {
    name: 'Energy',
    description: 'Tight vs Loose',
    range: { min: 0, max: 100, default: 50 },
    parameters: {
      // Delay wet mix
      delayWet: { min: 0, max: 0.4, curve: 'linear' },
      // Delay time
      delayTime: { min: 0.05, max: 0.6, curve: 'exponential' },
      // Delay feedback
      delayFeedback: { min: 0, max: 0.4, curve: 'linear' },
      // Chorus wet mix
      chorusWet: { min: 0, max: 0.5, curve: 'linear' },
      // Decay time
      decay: { min: 0.1, max: 0.8, curve: 'exponential' }
    }
  }
};

/**
 * Calculate parameter value based on knob value and profile
 * @param {number} knobValue - Knob value (0-100)
 * @param {Object} parameter - Parameter definition from profile
 * @returns {number} Calculated parameter value
 */
export function calculateParameterValue(knobValue, parameter) {
  const normalizedValue = knobValue / 100; // 0-1

  let value;
  if (parameter.curve === 'exponential') {
    // Exponential curve for more dramatic changes at higher values
    value = parameter.min + (parameter.max - parameter.min) * (Math.pow(normalizedValue, 2));
  } else if (parameter.curve === 'logarithmic') {
    // Logarithmic curve for subtle changes at low values
    value = parameter.min + (parameter.max - parameter.min) * Math.log10(normalizedValue * 9 + 1);
  } else {
    // Linear curve
    value = parameter.min + (parameter.max - parameter.min) * normalizedValue;
  }

  return value;
}

/**
 * Get all parameters affected by a knob
 * @param {string} knobName - Name of the knob
 * @returns {Object} Parameter definitions
 */
export function getKnobParameters(knobName) {
  const profile = TUNING_PROFILES[knobName.toUpperCase()];
  return profile ? profile.parameters : {};
}

/**
 * Get knob definition
 * @param {string} knobName - Name of the knob
 * @returns {Object} Knob definition
 */
export function getKnobDefinition(knobName) {
  return TUNING_PROFILES[knobName.toUpperCase()] || null;
}

/**
 * Get all knob names
 * @returns {Array} Array of knob names
 */
export function getAllKnobNames() {
  return Object.keys(TUNING_PROFILES);
}

/**
 * Validate knob value
 * @param {string} knobName - Name of the knob
 * @param {number} value - Value to validate
 * @returns {boolean} Whether value is valid
 */
export function validateKnobValue(knobName, value) {
  const profile = getKnobDefinition(knobName);
  if (!profile) return false;

  return value >= profile.range.min && value <= profile.range.max;
}

/**
 * Get default knob values
 * @returns {Object} Default values for all knobs
 */
export function getDefaultKnobValues() {
  const defaults = {};
  for (const [name, profile] of Object.entries(TUNING_PROFILES)) {
    defaults[name.toLowerCase()] = profile.range.default;
  }
  return defaults;
}

/**
 * Calculate parameter set from all knob values
 * @param {Object} knobValues - {attitude, presence, ambience, warmth, energy}
 * @returns {Object} Complete parameter set
 */
export function calculateParameterSet(knobValues) {
  const parameters = {};

  for (const [knobName, knobValue] of Object.entries(knobValues)) {
    const profile = getKnobDefinition(knobName);
    if (profile) {
      for (const [paramName, paramDef] of Object.entries(profile.parameters)) {
        parameters[paramName] = calculateParameterValue(knobValue, paramDef);
      }
    }
  }

  return parameters;
}

/**
 * Get parameter ranges for UI scaling
 * @returns {Object} Parameter ranges for UI components
 */
export function getParameterRanges() {
  const ranges = {};

  for (const [knobName, profile] of Object.entries(TUNING_PROFILES)) {
    ranges[knobName.toLowerCase()] = profile.range;
    for (const [paramName, paramDef] of Object.entries(profile.parameters)) {
      ranges[paramName] = {
        min: paramDef.min,
        max: paramDef.max,
        curve: paramDef.curve
      };
    }
  }

  return ranges;
}