/**
 * Tuning Presets
 * Predefined tuning styles for different musical personalities and genres
 * Each preset provides a complete set of knob values for instant character
 */

import { TUNING_PROFILES } from './TuningProfiles.js';

export const TUNING_PRESETS = {
  // Professional/Studio Presets
  studio_clean: {
    name: 'Studio Clean',
    description: 'Professional, clear sound perfect for recording',
    category: 'professional',
    values: {
      attitude: 20,   // Laid-back
      presence: 70,  // Forward
      ambience: 15,  // Dry
      warmth: 60,    // Warm
      energy: 30     // Tight
    }
  },

  studio_bright: {
    name: 'Studio Bright',
    description: 'Crisp, present sound with enhanced highs',
    category: 'professional',
    values: {
      attitude: 40,   // Balanced
      presence: 80,  // Very forward
      ambience: 10,  // Very dry
      warmth: 20,    // Bright
      energy: 40     // Controlled
    }
  },

  studio_warm: {
    name: 'Studio Warm',
    description: 'Rich, full sound with enhanced lows',
    category: 'professional',
    values: {
      attitude: 30,   // Balanced
      presence: 60,  // Present
      ambience: 25,  // Slightly wet
      warmth: 80,    // Very warm
      energy: 35     // Tight
    }
  },

  // Genre-Specific Presets
  rock_aggressive: {
    name: 'Rock Aggressive',
    description: 'High-energy rock sound with edge and power',
    category: 'genre',
    values: {
      attitude: 85,   // Very aggressive
      presence: 75,  // Forward
      ambience: 20,  // Dry
      warmth: 40,    // Balanced
      energy: 70     // Loose
    }
  },

  jazz_smooth: {
    name: 'Jazz Smooth',
    description: 'Smooth, sophisticated jazz sound',
    category: 'genre',
    values: {
      attitude: 25,   // Laid-back
      presence: 55,  // Balanced
      ambience: 45,  // Moderate reverb
      warmth: 70,    // Warm
      energy: 45     // Controlled
    }
  },

  pop_polished: {
    name: 'Pop Polished',
    description: 'Commercial pop sound with presence and clarity',
    category: 'genre',
    values: {
      attitude: 35,   // Balanced
      presence: 85,  // Very forward
      ambience: 30,  // Moderate
      warmth: 50,    // Balanced
      energy: 50     // Balanced
    }
  },

  blues_soulful: {
    name: 'Blues Soulful',
    description: 'Rich, emotive blues sound with warmth',
    category: 'genre',
    values: {
      attitude: 45,   // Balanced
      presence: 65,  // Present
      ambience: 55,  // Wet
      warmth: 75,    // Warm
      energy: 60     // Moderate
    }
  },

  metal_extreme: {
    name: 'Metal Extreme',
    description: 'Heavy, aggressive metal sound',
    category: 'genre',
    values: {
      attitude: 95,   // Extremely aggressive
      presence: 80,  // Very forward
      ambience: 15,  // Dry
      warmth: 25,    // Bright
      energy: 80     // Very loose
    }
  },

  folk_intimate: {
    name: 'Folk Intimate',
    description: 'Warm, close-miked folk sound',
    category: 'genre',
    values: {
      attitude: 20,   // Laid-back
      presence: 50,  // Balanced
      ambience: 65,  // Wet
      warmth: 85,    // Very warm
      energy: 25     // Tight
    }
  },

  electronic_digital: {
    name: 'Electronic Digital',
    description: 'Clean, processed electronic sound',
    category: 'genre',
    values: {
      attitude: 50,   // Balanced
      presence: 90,  // Extremely forward
      ambience: 5,   // Very dry
      warmth: 15,   // Very bright
      energy: 85     // Very loose
    }
  },

  classical_refined: {
    name: 'Classical Refined',
    description: 'Elegant, balanced classical sound',
    category: 'genre',
    values: {
      attitude: 15,   // Very laid-back
      presence: 45,  // Balanced
      ambience: 40,  // Moderate
      warmth: 65,    // Warm
      energy: 20     // Very tight
    }
  },

  // Personality-Based Presets
  the_showoff: {
    name: 'The Showoff',
    description: 'Flashy, attention-grabbing sound',
    category: 'personality',
    values: {
      attitude: 80,   // Aggressive
      presence: 90,  // Very forward
      ambience: 35,  // Moderate
      warmth: 30,    // Bright
      energy: 75     // Loose
    }
  },

  the_perfectionist: {
    name: 'The Perfectionist',
    description: 'Precise, controlled sound',
    category: 'personality',
    values: {
      attitude: 25,   // Laid-back
      presence: 70,  // Forward
      ambience: 10,  // Dry
      warmth: 55,    // Balanced
      energy: 20     // Tight
    }
  },

  the_rebel: {
    name: 'The Rebel',
    description: 'Edgy, unconventional sound',
    category: 'personality',
    values: {
      attitude: 90,   // Very aggressive
      presence: 60,  // Present
      ambience: 25,  // Dry
      warmth: 20,    // Bright
      energy: 85     // Very loose
    }
  },

  the_soulful_one: {
    name: 'The Soulful One',
    description: 'Emotional, expressive sound',
    category: 'personality',
    values: {
      attitude: 40,   // Balanced
      presence: 55,  // Balanced
      ambience: 70,  // Wet
      warmth: 80,    // Warm
      energy: 55     // Moderate
    }
  },

  the_technician: {
    name: 'The Technician',
    description: 'Clean, analytical sound',
    category: 'personality',
    values: {
      attitude: 30,   // Balanced
      presence: 75,  // Forward
      ambience: 5,   // Very dry
      warmth: 45,    // Balanced
      energy: 25     // Tight
    }
  },

  the_party_animal: {
    name: 'The Party Animal',
    description: 'Fun, energetic sound',
    category: 'personality',
    values: {
      attitude: 65,   // Aggressive
      presence: 80,  // Very forward
      ambience: 45,  // Moderate
      warmth: 50,    // Balanced
      energy: 90     // Very loose
    }
  },

  // Special Effect Presets
  underwater: {
    name: 'Underwater',
    description: 'Muffled, distant sound like underwater',
    category: 'effect',
    values: {
      attitude: 10,   // Very laid-back
      presence: 20,  // Recessed
      ambience: 80,  // Very wet
      warmth: 90,    // Very warm
      energy: 15     // Very tight
    }
  },

  telephone: {
    name: 'Telephone',
    description: 'Narrow, filtered sound like old telephone',
    category: 'effect',
    values: {
      attitude: 5,    // Extremely laid-back
      presence: 95,  // Extremely forward
      ambience: 0,   // Completely dry
      warmth: 10,    // Very bright
      energy: 5      // Extremely tight
    }
  },

  robot: {
    name: 'Robot',
    description: 'Digital, processed sound',
    category: 'effect',
    values: {
      attitude: 70,   // Aggressive
      presence: 85,  // Very forward
      ambience: 10,  // Dry
      warmth: 5,     // Extremely bright
      energy: 95     // Extremely loose
    }
  },

  cathedral: {
    name: 'Cathedral',
    description: 'Grand, spacious sound with long reverb',
    category: 'effect',
    values: {
      attitude: 20,   // Laid-back
      presence: 40,  // Balanced
      ambience: 95,  // Extremely wet
      warmth: 60,    // Warm
      energy: 30     // Tight
    }
  }
};

/**
 * Get all presets
 * @returns {Object} All tuning presets
 */
export function getAllPresets() {
  return { ...TUNING_PRESETS };
}

/**
 * Get presets by category
 * @param {string} category - Category name
 * @returns {Object} Presets in the specified category
 */
export function getPresetsByCategory(category) {
  const filtered = {};
  for (const [key, preset] of Object.entries(TUNING_PRESETS)) {
    if (preset.category === category) {
      filtered[key] = preset;
    }
  }
  return filtered;
}

/**
 * Get preset categories
 * @returns {Array} List of available categories
 */
export function getPresetCategories() {
  const categories = new Set();
  for (const preset of Object.values(TUNING_PRESETS)) {
    categories.add(preset.category);
  }
  return Array.from(categories);
}

/**
 * Get preset by name
 * @param {string} name - Preset name
 * @returns {Object} Preset definition or null
 */
export function getPreset(name) {
  return TUNING_PRESETS[name] || null;
}

/**
 * Validate preset values
 * @param {Object} values - Knob values to validate
 * @returns {boolean} Whether values are valid
 */
export function validatePresetValues(values) {
  const requiredKnobs = ['attitude', 'presence', 'ambience', 'warmth', 'energy'];

  for (const knob of requiredKnobs) {
    if (!(knob in values)) return false;
    if (!TUNING_PROFILES[knob.toUpperCase()]) return false;

    const profile = TUNING_PROFILES[knob.toUpperCase()];
    const value = values[knob];
    if (value < profile.range.min || value > profile.range.max) return false;
  }

  return true;
}

/**
 * Create a custom preset
 * @param {string} name - Preset name
 * @param {Object} values - Knob values
 * @param {string} description - Description
 * @param {string} category - Category (defaults to 'custom')
 * @returns {Object} New preset definition
 */
export function createCustomPreset(name, values, description = '', category = 'custom') {
  if (!validatePresetValues(values)) {
    throw new Error('Invalid preset values');
  }

  return {
    name,
    description: description || `Custom preset: ${name}`,
    category,
    values: { ...values }
  };
}

/**
 * Get random preset
 * @param {string} category - Optional category filter
 * @returns {Object} Random preset
 */
export function getRandomPreset(category = null) {
  let candidates = Object.values(TUNING_PRESETS);

  if (category) {
    candidates = candidates.filter(preset => preset.category === category);
  }

  if (candidates.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

/**
 * Find similar presets
 * @param {Object} targetValues - Target knob values
 * @param {number} limit - Maximum number of results
 * @returns {Array} Similar presets with similarity scores
 */
export function findSimilarPresets(targetValues, limit = 5) {
  const similarities = [];

  for (const [key, preset] of Object.entries(TUNING_PRESETS)) {
    const distance = calculatePresetDistance(targetValues, preset.values);
    similarities.push({
      preset: preset,
      key: key,
      distance: distance,
      similarity: 1 / (1 + distance) // Convert distance to similarity (0-1)
    });
  }

  // Sort by similarity (highest first)
  similarities.sort((a, b) => b.similarity - a.similarity);

  return similarities.slice(0, limit);
}

/**
 * Calculate distance between two preset value sets
 * @param {Object} values1 - First set of values
 * @param {Object} values2 - Second set of values
 * @returns {number} Euclidean distance
 */
function calculatePresetDistance(values1, values2) {
  const knobs = ['attitude', 'presence', 'ambience', 'warmth', 'energy'];
  let sumSquaredDiff = 0;

  for (const knob of knobs) {
    const diff = (values1[knob] || 50) - (values2[knob] || 50);
    sumSquaredDiff += diff * diff;
  }

  return Math.sqrt(sumSquaredDiff);
}

/**
 * Get preset statistics
 * @returns {Object} Statistics about presets
 */
export function getPresetStatistics() {
  const stats = {
    total: Object.keys(TUNING_PRESETS).length,
    categories: {},
    averageValues: {
      attitude: 0,
      presence: 0,
      ambience: 0,
      warmth: 0,
      energy: 0
    }
  };

  const sums = { attitude: 0, presence: 0, ambience: 0, warmth: 0, energy: 0 };
  let count = 0;

  for (const preset of Object.values(TUNING_PRESETS)) {
    // Count categories
    stats.categories[preset.category] = (stats.categories[preset.category] || 0) + 1;

    // Sum values
    for (const knob of ['attitude', 'presence', 'ambience', 'warmth', 'energy']) {
      sums[knob] += preset.values[knob];
    }
    count++;
  }

  // Calculate averages
  for (const knob of ['attitude', 'presence', 'ambience', 'warmth', 'energy']) {
    stats.averageValues[knob] = sums[knob] / count;
  }

  return stats;
}