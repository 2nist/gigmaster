/**
 * Band Member Tuning System
 * Provides player-friendly controls for customizing instrument sounds
 * Maps intuitive knobs to multiple Tone.js parameters for dramatic effects
 */

import { TUNING_PRESETS } from './TuningPresets.js';

export default class MemberTuningSystem {
  constructor() {
    this.members = new Map(); // memberId -> tuning settings
    this.presets = new Map(); // presetName -> tuning profile
    this.activePreset = null;

    // Load built-in presets
    this._loadBuiltInPresets();
  }

  /**
   * Load built-in presets from TuningPresets
   */
  _loadBuiltInPresets() {
    for (const [key, preset] of Object.entries(TUNING_PRESETS)) {
      this.presets.set(key, {
        name: preset.name,
        values: { ...preset.values },
        description: preset.description,
        category: preset.category,
        created: Date.now()
      });
    }
  }

  /**
   * Initialize tuning for a band member
   * @param {string} memberId - Unique member identifier
   * @param {Object} defaultSettings - Default tuning values
   */
  initializeMember(memberId, defaultSettings = {}) {
    const tuning = {
      // Intuitive player-facing knobs (0-100 scale)
      attitude: defaultSettings.attitude || 50,     // Aggressive vs Laid-back
      presence: defaultSettings.presence || 50,     // Forward vs Recessed
      ambience: defaultSettings.ambience || 50,     // Dry vs Wet
      warmth: defaultSettings.warmth || 50,         // Bright vs Warm
      energy: defaultSettings.energy || 50,         // Tight vs Loose

      // Internal parameter mappings (calculated from knobs)
      parameters: this._calculateParameters({
        attitude: defaultSettings.attitude || 50,
        presence: defaultSettings.presence || 50,
        ambience: defaultSettings.ambience || 50,
        warmth: defaultSettings.warmth || 50,
        energy: defaultSettings.energy || 50
      }),

      // Metadata
      lastModified: Date.now(),
      preset: null
    };

    this.members.set(memberId, tuning);
    return tuning;
  }

  /**
   * Update a tuning knob for a member
   * @param {string} memberId - Member identifier
   * @param {string} knob - Knob name (attitude, presence, ambience, warmth, energy)
   * @param {number} value - Value 0-100
   */
  updateKnob(memberId, knob, value) {
    if (!this.members.has(memberId)) {
      throw new Error(`Member ${memberId} not initialized`);
    }

    const tuning = this.members.get(memberId);
    const clampedValue = Math.max(0, Math.min(100, value));

    // Update the knob
    tuning[knob] = clampedValue;

    // Recalculate all parameters based on new knob values
    tuning.parameters = this._calculateParameters({
      attitude: tuning.attitude,
      presence: tuning.presence,
      ambience: tuning.ambience,
      warmth: tuning.warmth,
      energy: tuning.energy
    });

    tuning.lastModified = Date.now();
    tuning.preset = null; // Clear preset when manually adjusted

    return tuning;
  }

  /**
   * Apply a preset to a member
   * @param {string} memberId - Member identifier
   * @param {string} presetName - Name of preset to apply
   */
  applyPreset(memberId, presetName) {
    if (!this.presets.has(presetName)) {
      throw new Error(`Preset ${presetName} not found`);
    }

    if (!this.members.has(memberId)) {
      throw new Error(`Member ${memberId} not initialized`);
    }

    const preset = this.presets.get(presetName);
    const tuning = this.members.get(memberId);

    // Apply preset values
    Object.assign(tuning, preset.values);
    tuning.parameters = this._calculateParameters(preset.values);
    tuning.preset = presetName;
    tuning.lastModified = Date.now();

    return tuning;
  }

  /**
   * Get current tuning for a member
   * @param {string} memberId - Member identifier
   * @returns {Object} Current tuning settings
   */
  getTuning(memberId) {
    return this.members.get(memberId) || null;
  }

  /**
   * Get all member tunings
   * @returns {Object} Map of member tunings
   */
  getAllTunings() {
    const result = {};
    for (const [memberId, tuning] of this.members) {
      result[memberId] = tuning;
    }
    return result;
  }

  /**
   * Register a tuning preset
   * @param {string} name - Preset name
   * @param {Object} values - Knob values {attitude, presence, ambience, warmth, energy}
   * @param {string} description - Human-readable description
   */
  registerPreset(name, values, description = '') {
    this.presets.set(name, {
      name,
      values: { ...values },
      description,
      created: Date.now()
    });
  }

  /**
   * Get available presets
   * @returns {Array} List of preset names
   */
  getPresets() {
    return Array.from(this.presets.keys());
  }

  /**
   * Get preset details
   * @param {string} name - Preset name
   * @returns {Object} Preset details
   */
  getPreset(name) {
    return this.presets.get(name) || null;
  }

  /**
   * Save current member tuning as a custom preset
   * @param {string} memberId - Member identifier
   * @param {string} presetName - Name for the new preset
   * @param {string} description - Description of the preset
   */
  saveAsPreset(memberId, presetName, description = '') {
    if (!this.members.has(memberId)) {
      throw new Error(`Member ${memberId} not initialized`);
    }

    const tuning = this.members.get(memberId);
    const values = {
      attitude: tuning.attitude,
      presence: tuning.presence,
      ambience: tuning.ambience,
      warmth: tuning.warmth,
      energy: tuning.energy
    };

    this.registerPreset(presetName, values, description);
    tuning.preset = presetName;

    return this.presets.get(presetName);
  }

  /**
   * Calculate Tone.js parameters from knob values
   * @param {Object} knobs - Knob values {attitude, presence, ambience, warmth, energy}
   * @returns {Object} Tone.js parameter mappings
   */
  _calculateParameters(knobs) {
    const { attitude, presence, ambience, warmth, energy } = knobs;

    // Normalize knob values to 0-1 scale
    const n = (val) => val / 100;

    return {
      // Volume & Dynamics
      volume: this._mapRange(presence, 0, 100, -12, 6), // dB
      dynamics: n(attitude) * 0.8 + 0.2, // 0.2-1.0

      // Tone Shaping
      brightness: n(warmth),
      warmth: 1 - n(warmth),
      edge: n(attitude),

      // Effects
      reverb: {
        wet: n(ambience) * 0.6, // 0-0.6
        decay: n(ambience) * 2 + 1, // 1-3 seconds
        preDelay: n(presence) * 0.1 // 0-0.1 seconds
      },

      delay: {
        wet: n(energy) * 0.4, // 0-0.4
        delayTime: n(energy) * 0.5 + 0.1, // 0.1-0.6 seconds
        feedback: n(energy) * 0.3 // 0-0.3
      },

      distortion: {
        wet: n(attitude) * 0.3, // 0-0.3
        distortion: n(attitude) * 0.8 // 0-0.8
      },

      chorus: {
        wet: n(energy) * 0.5, // 0-0.5
        frequency: n(energy) * 2 + 1, // 1-3 Hz
        delayTime: n(energy) * 10 + 5, // 5-15 ms
        depth: n(energy) * 0.8 + 0.2 // 0.2-1.0
      },

      phaser: {
        wet: n(warmth) * 0.4, // 0-0.4
        frequency: n(warmth) * 0.5 + 0.5, // 0.5-1 Hz
        octaves: 2,
        baseFrequency: 1000
      },

      compressor: {
        threshold: this._mapRange(presence, 0, 100, -24, -6), // -24 to -6 dB
        ratio: n(attitude) * 10 + 2, // 2-12
        attack: n(energy) * 0.1, // 0-0.1 seconds
        release: n(energy) * 0.5 + 0.1 // 0.1-0.6 seconds
      },

      eq: {
        low: this._mapRange(warmth, 0, 100, -6, 6), // -6 to 6 dB
        mid: this._mapRange(presence, 0, 100, -6, 6), // -6 to 6 dB
        high: this._mapRange(attitude, 0, 100, -6, 6) // -6 to 6 dB
      },

      // Instrument-specific parameters
      instrument: {
        attack: n(attitude) * 0.2, // 0-0.2 seconds
        decay: n(energy) * 0.5 + 0.1, // 0.1-0.6 seconds
        sustain: n(presence) * 0.8 + 0.2, // 0.2-1.0
        release: n(ambience) * 1.0 + 0.1 // 0.1-1.1 seconds
      }
    };
  }

  /**
   * Utility function to map a value from one range to another
   */
  _mapRange(value, fromMin, fromMax, toMin, toMax) {
    return ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin;
  }

  /**
   * Export tuning data for persistence
   * @returns {Object} Serializable tuning data
   */
  exportData() {
    return {
      members: Object.fromEntries(this.members),
      presets: Object.fromEntries(this.presets),
      activePreset: this.activePreset,
      version: '1.0'
    };
  }

  /**
   * Import tuning data from persistence
   * @param {Object} data - Previously exported tuning data
   */
  importData(data) {
    if (data.members) {
      this.members = new Map(Object.entries(data.members));
    }
    if (data.presets) {
      this.presets = new Map(Object.entries(data.presets));
    }
    this.activePreset = data.activePreset || null;
  }

  /**
   * Reset member tuning to defaults
   * @param {string} memberId - Member identifier
   */
  resetMember(memberId) {
    if (this.members.has(memberId)) {
      const tuning = this.members.get(memberId);
      tuning.attitude = 50;
      tuning.presence = 50;
      tuning.ambience = 50;
      tuning.warmth = 50;
      tuning.energy = 50;
      tuning.parameters = this._calculateParameters(tuning);
      tuning.preset = null;
      tuning.lastModified = Date.now();
    }
  }

  /**
   * Get tuning statistics for analytics
   * @returns {Object} Usage statistics
   */
  getStatistics() {
    const stats = {
      totalMembers: this.members.size,
      totalPresets: this.presets.size,
      averageKnobValues: {
        attitude: 0,
        presence: 0,
        ambience: 0,
        warmth: 0,
        energy: 0
      },
      mostUsedPreset: null
    };

    if (this.members.size > 0) {
      const sums = { attitude: 0, presence: 0, ambience: 0, warmth: 0, energy: 0 };
      const presetCounts = new Map();

      for (const tuning of this.members.values()) {
        sums.attitude += tuning.attitude;
        sums.presence += tuning.presence;
        sums.ambience += tuning.ambience;
        sums.warmth += tuning.warmth;
        sums.energy += tuning.energy;

        if (tuning.preset) {
          presetCounts.set(tuning.preset, (presetCounts.get(tuning.preset) || 0) + 1);
        }
      }

      stats.averageKnobValues.attitude = sums.attitude / this.members.size;
      stats.averageKnobValues.presence = sums.presence / this.members.size;
      stats.averageKnobValues.ambience = sums.ambience / this.members.size;
      stats.averageKnobValues.warmth = sums.warmth / this.members.size;
      stats.averageKnobValues.energy = sums.energy / this.members.size;

      if (presetCounts.size > 0) {
        stats.mostUsedPreset = Array.from(presetCounts.entries())
          .sort((a, b) => b[1] - a[1])[0][0];
      }
    }

    return stats;
  }
}