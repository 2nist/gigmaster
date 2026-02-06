/**
 * ChordonomiconProcessor - Processes Chordonomicon chord progressions
 * 
 * Converts chord progressions into constraint-ready schemas with:
 * - Basic progression data (chords, mode, key)
 * - Psychological resonance analysis
 * - Industry context classification
 * - Harmonic analysis
 * - Gameplay adaptation hints
 */

import { PsychologicalMapper } from '../base/PsychologicalMapper.js';
import { GenreClassifier } from '../base/GenreClassifier.js';

export class ChordonomiconProcessor {
  /**
   * Generate a unique progression ID
   * @param {Object} progressionData - Raw progression data
   * @returns {string} Unique ID
   */
  static _generateProgressionId(progressionData) {
    // Create a simple hash from the chord progression
    const chords = progressionData.chords || progressionData.progression || [];
    const chordStr = chords.join('-');
    let hash = 0;
    for (let i = 0; i < chordStr.length; i++) {
      const char = chordStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `prog_${Math.abs(hash)}`;
  }

  /**
   * Process a single chord progression
   * @param {Object} progressionData - Raw progression data
   * @param {Object} options - Processing options
   * @returns {Object} Processed progression with analysis
   */
  static processProgression(progressionData, options = {}) {
    const {
      id = this._generateProgressionId(progressionData),
      name = 'Unnamed Progression'
    } = options;

    // Step 1: Extract basic progression
    const basicProgression = this._extractBasicProgression(progressionData);

    // Step 2: Analyze psychological resonance
    const psychologicalResonance = this._analyzePsychologicalResonance(basicProgression);

    // Step 3: Analyze industry context
    const industryContext = this._analyzeIndustryContext(basicProgression);

    // Step 4: Harmonic analysis
    const harmonicAnalysis = this._analyzeHarmony(basicProgression);

    // Step 5: Gameplay adaptations
    const gameplayAdaptations = this._analyzeGameplayAdaptations(basicProgression);

    // Step 6: Calculate catchiness and familiarity
    const catchiness = this._calculateCatchiness(basicProgression);
    const familiarity = this._calculateFamiliarity(basicProgression);
    const complexity = this._calculateComplexity(basicProgression);

    // Step 7: Determine mode and vibe
    const mode = this._determineMode(basicProgression.chords);
    const vibe = this._determineVibe(basicProgression, psychologicalResonance);
    const era = this._determineEra(basicProgression);

    // ENHANCEMENT 1: Extract enhanced metadata for better genre recognition
    const enhancedMetadata = this._extractEnhancedMetadata(basicProgression);

    // ENHANCEMENT 2: Quality testing for better looping patterns
    const loopQuality = this._analyzeLoopQuality(basicProgression);

    // ENHANCEMENT 3: Extend data based on metadata and quality analysis
    const extendedData = this._extendProgressionData(basicProgression, enhancedMetadata, loopQuality);

    return {
      // Basic fields
      chords: basicProgression.chords,
      name,
      catchiness,
      familiarity,
      complexity,
      vibe,
      era,
      mode,

      // Enhanced psychological resonance
      psychological_resonance: psychologicalResonance,

      // Industry context
      industry_context: industryContext,

      // Harmonic analysis
      harmonic_analysis: harmonicAnalysis,

      // Gameplay adaptations
      gameplay_adaptations: gameplayAdaptations,

      // ENHANCEMENT 1: Enhanced metadata for genre recognition
      enhanced_metadata: enhancedMetadata,

      // ENHANCEMENT 2: Loop quality analysis
      loop_quality: loopQuality,

      // ENHANCEMENT 3: Extended progression data
      extended_data: extendedData,

      // Metadata
      source: 'Chordonomicon',
      processed_at: Date.now()
    };
  }

  /**
   * Extract basic progression structure
   * @param {Object} progressionData - Raw progression data
   * @returns {Object} Basic progression
   */
  static _extractBasicProgression(progressionData) {
    // If already structured, return it
    if (progressionData.chords && Array.isArray(progressionData.chords)) {
      return progressionData;
    }

    // Otherwise, extract from various formats
    return {
      chords: progressionData.chords || progressionData.progression || [],
      name: progressionData.name || 'Unnamed'
    };
  }

  /**
   * Analyze psychological resonance
   * @param {Object} progression - Basic progression
   * @returns {Object} Psychological resonance scores
   */
  static _analyzePsychologicalResonance(progression) {
    const darkness = PsychologicalMapper.analyzeHarmonicDarkness(progression.chords);
    const repetitiveness = this._calculateRepetitiveness(progression.chords);
    
    return {
      corruption_level: darkness * 0.8, // Dark progressions = corruption
      addiction_spiral: repetitiveness * 0.7, // Repetitive = addictive
      depression_weight: darkness * 0.9, // Dark = depressive
      manic_energy: this._calculateEnergy(progression.chords),
      paranoia_tension: this._calculateTension(progression.chords),
      redemption_potential: this._calculateRedemptionPotential(progression.chords)
    };
  }

  /**
   * Analyze industry context
   * @param {Object} progression - Basic progression
   * @returns {Object} Industry context scores
   */
  static _analyzeIndustryContext(progression) {
    const catchiness = this._calculateCatchiness(progression);
    const familiarity = this._calculateFamiliarity(progression);
    const complexity = this._calculateComplexity(progression);
    
    return {
      commercial_safety: (catchiness + familiarity) / 2, // Safe = catchy + familiar
      underground_cred: (1 - catchiness) * 0.6 + (1 - familiarity) * 0.4, // Underground = not commercial
      label_friendly: catchiness > 0.7 && familiarity > 0.6 ? 0.9 : 0.3,
      experimental_factor: complexity > 0.6 ? 0.8 : 0.2
    };
  }

  /**
   * Analyze harmonic properties
   * @param {Object} progression - Basic progression
   * @returns {Object} Harmonic analysis
   */
  static _analyzeHarmony(progression) {
    const chords = progression.chords;
    
    return {
      key_center_stability: this._calculateKeyStability(chords),
      modulation_complexity: this._calculateModulationComplexity(chords),
      resolution_strength: this._calculateResolutionStrength(chords),
      dissonance_level: this._calculateDissonance(chords),
      voice_leading_quality: this._calculateVoiceLeading(chords)
    };
  }

  /**
   * Analyze gameplay adaptations
   * @param {Object} progression - Basic progression
   * @returns {Object} Adaptation hints
   */
  static _analyzeGameplayAdaptations(progression) {
    const complexity = this._calculateComplexity(progression);
    
    return {
      skill_scalable: complexity > 0.3, // Can be simplified if complex
      tempo_flexible: true, // Most progressions work at different tempos
      arrangement_hints: this._suggestArrangements(progression.chords),
      emotional_pivot_points: this._identifyPivotPoints(progression.chords)
    };
  }

  /**
   * Calculate catchiness (0-1)
   */
  static _calculateCatchiness(progression) {
    const chords = progression.chords;
    if (!chords || chords.length === 0) return 0.5;
    
    // Common catchy progressions
    const catchyPatterns = [
      ['C', 'G', 'Am', 'F'], // vi-IV-I-V
      ['C', 'Am', 'F', 'G'], // i-vi-IV-V
      ['Am', 'F', 'C', 'G'], // vi-IV-I-V in minor
    ];
    
    const chordStr = chords.join('-');
    for (const pattern of catchyPatterns) {
      if (chordStr.includes(pattern.join('-'))) {
        return 0.9;
      }
    }
    
    // Simpler progressions tend to be catchier
    const complexity = this._calculateComplexity(progression);
    return Math.max(0.3, 1 - complexity * 0.5);
  }

  /**
   * Calculate familiarity (0-1)
   */
  static _calculateFamiliarity(progression) {
    const chords = progression.chords;
    if (!chords || chords.length === 0) return 0.5;
    
    // Very common progressions
    const commonPatterns = [
      ['C', 'G', 'Am', 'F'],
      ['C', 'Am', 'F', 'G'],
      ['Am', 'F', 'C', 'G'],
      ['C', 'F', 'G', 'C'],
      ['C', 'G', 'F', 'C']
    ];
    
    const chordStr = chords.join('-');
    for (const pattern of commonPatterns) {
      if (chordStr === pattern.join('-')) {
        return 0.95;
      }
    }
    
    // Shorter progressions are more familiar
    return Math.max(0.3, 1 - (chords.length - 3) * 0.1);
  }

  /**
   * Calculate complexity (0-1)
   */
  static _calculateComplexity(progression) {
    const chords = progression.chords;
    if (!chords || chords.length === 0) return 0.5;
    
    let complexity = 0;
    
    // More chords = more complex
    complexity += Math.min(0.3, (chords.length - 3) * 0.1);
    
    // Extended chords = more complex
    chords.forEach(chord => {
      if (chord.includes('7') || chord.includes('9') || chord.includes('11')) {
        complexity += 0.15;
      }
      if (chord.includes('dim') || chord.includes('aug')) {
        complexity += 0.1;
      }
    });
    
    return Math.min(1, complexity);
  }

  /**
   * Calculate repetitiveness
   */
  static _calculateRepetitiveness(chords) {
    if (!chords || chords.length < 2) return 0.5;
    
    // Check for repeated patterns
    const uniqueChords = new Set(chords);
    return 1 - (uniqueChords.size / chords.length);
  }

  /**
   * Calculate energy level
   */
  static _calculateEnergy(chords) {
    if (!chords || chords.length === 0) return 0.5;
    
    // Major chords = more energy
    let majorCount = 0;
    chords.forEach(chord => {
      if (!chord.toLowerCase().includes('m') || chord.toLowerCase().includes('maj')) {
        majorCount++;
      }
    });
    
    return majorCount / chords.length;
  }

  /**
   * Calculate harmonic tension
   */
  static _calculateTension(chords) {
    if (!chords || chords.length < 2) return 0.3;
    
    // Dissonant intervals and unresolved progressions = tension
    let tension = 0;
    
    for (let i = 0; i < chords.length - 1; i++) {
      const chord1 = chords[i];
      const chord2 = chords[i + 1];
      
      // Tritone relationships = high tension
      if (this._hasTritoneRelationship(chord1, chord2)) {
        tension += 0.3;
      }
      
      // Dissonant chords
      if (chord2.includes('dim') || chord2.includes('aug')) {
        tension += 0.2;
      }
    }
    
    return Math.min(1, tension);
  }

  /**
   * Calculate redemption potential (can resolve to hopeful)
   */
  static _calculateRedemptionPotential(chords) {
    if (!chords || chords.length === 0) return 0.5;
    
    const lastChord = chords[chords.length - 1];
    const firstChord = chords[0];
    
    // Ends on major = redemption potential
    if (!lastChord.toLowerCase().includes('m') || lastChord.toLowerCase().includes('maj')) {
      return 0.8;
    }
    
    // Starts minor, ends major = redemption arc
    if (firstChord.toLowerCase().includes('m') && 
        (!lastChord.toLowerCase().includes('m') || lastChord.toLowerCase().includes('maj'))) {
      return 0.9;
    }
    
    return 0.4;
  }

  /**
   * Calculate key stability
   */
  static _calculateKeyStability(chords) {
    // Simplified: shorter progressions = more stable
    return Math.max(0.5, 1 - (chords.length - 3) * 0.1);
  }

  /**
   * Calculate modulation complexity
   */
  static _calculateModulationComplexity(chords) {
    // Simplified: more chords = potential for modulation
    return Math.min(1, (chords.length - 3) * 0.2);
  }

  /**
   * Calculate resolution strength
   */
  static _calculateResolutionStrength(chords) {
    if (!chords || chords.length < 2) return 0.5;
    
    // V-I or V-i cadence = strong resolution
    const lastTwo = chords.slice(-2);
    // Simplified check
    return 0.7;
  }

  /**
   * Calculate dissonance level
   */
  static _calculateDissonance(chords) {
    let dissonance = 0;
    chords.forEach(chord => {
      if (chord.includes('dim') || chord.includes('aug')) {
        dissonance += 0.3;
      }
      if (chord.includes('7') && !chord.includes('maj7')) {
        dissonance += 0.2;
      }
    });
    return Math.min(1, dissonance / chords.length);
  }

  /**
   * Calculate voice leading quality
   */
  static _calculateVoiceLeading(chords) {
    // Simplified: shorter progressions = smoother voice leading
    return Math.max(0.6, 1 - (chords.length - 3) * 0.1);
  }

  /**
   * Determine musical mode
   */
  static _determineMode(chords) {
    if (!chords || chords.length === 0) return 'major';
    
    const minorCount = chords.filter(c => 
      c.toLowerCase().includes('m') && !c.toLowerCase().includes('maj')
    ).length;
    
    if (minorCount > chords.length / 2) {
      return 'minor';
    }
    return 'major';
  }

  /**
   * Determine vibe/emotional character
   */
  static _determineVibe(progression, psychologicalResonance) {
    if (psychologicalResonance.depression_weight > 0.7) return 'melancholic';
    if (psychologicalResonance.manic_energy > 0.7) return 'energetic';
    if (psychologicalResonance.corruption_level > 0.7) return 'dark';
    if (psychologicalResonance.redemption_potential > 0.7) return 'hopeful';
    return 'neutral';
  }

  /**
   * Determine era
   */
  static _determineEra(progression) {
    const complexity = this._calculateComplexity(progression);
    const familiarity = this._calculateFamiliarity(progression);
    
    if (familiarity > 0.9) return 'classic';
    if (complexity > 0.7) return 'modern';
    return 'contemporary';
  }

  /**
   * Suggest arrangements
   */
  static _suggestArrangements(chords) {
    const hints = [];
    if (chords.length <= 4) {
      hints.push('acoustic', 'stripped_down');
    }
    if (chords.length > 4) {
      hints.push('full_band', 'orchestral');
    }
    return hints;
  }

  /**
   * Identify emotional pivot points
   */
  static _identifyPivotPoints(chords) {
    // Middle of progression is often a pivot point
    return [Math.floor(chords.length / 2)];
  }

  /**
   * Check for tritone relationship
   */
  static _hasTritoneRelationship(chord1, chord2) {
    // Simplified: check for common tritone progressions
    return false; // Would need actual chord analysis
  }

  /**
   * ENHANCEMENT 1: Extract enhanced metadata for better genre recognition
   * @param {Object} progression - Basic progression
   * @returns {Object} Enhanced metadata for genre classification
   */
  static _extractEnhancedMetadata(progression) {
    const chords = progression.chords;
    if (!chords || chords.length === 0) {
      return this._getDefaultEnhancedMetadata();
    }

    // Analyze chord types and qualities
    const chordQualities = this._analyzeChordQualities(chords);
    const chordFunctions = this._analyzeChordFunctions(chords);
    const rhythmicPatterns = this._analyzeRhythmicPatterns(chords);
    const harmonicMotion = this._analyzeHarmonicMotion(chords);

    // Genre-specific indicators
    const genreIndicators = this._extractGenreIndicators(chords, chordQualities, chordFunctions);

    // Structural analysis
    const structure = this._analyzeProgressionStructure(chords);

    return {
      chord_qualities: chordQualities,
      chord_functions: chordFunctions,
      rhythmic_patterns: rhythmicPatterns,
      harmonic_motion: harmonicMotion,
      genre_indicators: genreIndicators,
      structure: structure,
      tempo_suggestions: this._suggestTempos(chords, genreIndicators),
      instrumentation_hints: this._suggestInstrumentation(chords, genreIndicators)
    };
  }

  /**
   * ENHANCEMENT 2: Quality testing for better looping patterns
   * @param {Object} progression - Basic progression
   * @returns {Object} Loop quality analysis
   */
  static _analyzeLoopQuality(progression) {
    const chords = progression.chords;
    if (!chords || chords.length === 0) {
      return this._getDefaultLoopQuality();
    }

    // Analyze loop potential
    const loopPotential = this._calculateLoopPotential(chords);
    const seamlessTransitions = this._analyzeSeamlessTransitions(chords);
    const rhythmicFlow = this._analyzeRhythmicFlow(chords);
    const harmonicClosure = this._analyzeHarmonicClosure(chords);

    // Identify optimal loop points
    const loopPoints = this._identifyLoopPoints(chords);

    // Calculate loop stability metrics
    const stabilityMetrics = this._calculateLoopStability(chords);

    return {
      loop_potential: loopPotential,
      seamless_transitions: seamlessTransitions,
      rhythmic_flow: rhythmicFlow,
      harmonic_closure: harmonicClosure,
      optimal_loop_points: loopPoints,
      stability_metrics: stabilityMetrics,
      recommended_loop_length: this._recommendLoopLength(chords, loopPotential),
      transition_quality_score: this._calculateTransitionQuality(chords)
    };
  }

  /**
   * ENHANCEMENT 3: Extend data based on metadata and quality analysis
   * @param {Object} progression - Basic progression
   * @param {Object} metadata - Enhanced metadata
   * @param {Object} loopQuality - Loop quality analysis
   * @returns {Object} Extended progression data
   */
  static _extendProgressionData(progression, metadata, loopQuality) {
    const chords = progression.chords;
    if (!chords || chords.length === 0) {
      return this._getDefaultExtendedData();
    }

    // Generate variations based on metadata insights
    const variations = this._generateVariations(chords, metadata);

    // Create transition suggestions
    const transitions = this._suggestTransitions(chords, metadata, loopQuality);

    // Generate arrangement variations
    const arrangements = this._generateArrangements(chords, metadata);

    // Create mood variations
    const moodVariations = this._generateMoodVariations(chords, metadata);

    // Generate tempo variations
    const tempoVariations = this._generateTempoVariations(chords, metadata);

    return {
      variations: variations,
      transitions: transitions,
      arrangements: arrangements,
      mood_variations: moodVariations,
      tempo_variations: tempoVariations,
      compatibility_matrix: this._buildCompatibilityMatrix(chords, metadata),
      extension_suggestions: this._suggestExtensions(chords, loopQuality)
    };
  }

  // ===== ENHANCEMENT 1: Enhanced Metadata Extraction Methods =====

  /**
   * Get default enhanced metadata
   */
  static _getDefaultEnhancedMetadata() {
    return {
      chord_qualities: { major: 0, minor: 0, diminished: 0, augmented: 0, seventh: 0, extended: 0 },
      chord_functions: { tonic: 0, dominant: 0, subdominant: 0, mediant: 0, leading: 0 },
      rhythmic_patterns: { repetitive: 0, varied: 0, building: 0, descending: 0 },
      harmonic_motion: { stepwise: 0, leaps: 0, chromatic: 0, diatonic: 0 },
      genre_indicators: { pop: 0, rock: 0, jazz: 0, classical: 0, folk: 0, electronic: 0 },
      structure: { length: 0, unique_chords: 0, repetition_ratio: 0 },
      tempo_suggestions: [],
      instrumentation_hints: []
    };
  }

  /**
   * Analyze chord qualities for genre recognition
   */
  static _analyzeChordQualities(chords) {
    const qualities = { major: 0, minor: 0, diminished: 0, augmented: 0, seventh: 0, extended: 0 };
    const total = chords.length;

    chords.forEach(chord => {
      const chordStr = chord.toLowerCase();

      if (chordStr.includes('dim')) qualities.diminished++;
      else if (chordStr.includes('aug')) qualities.augmented++;
      else if (chordStr.includes('maj7') || chordStr.includes('7') || chordStr.includes('9') || chordStr.includes('11') || chordStr.includes('13')) {
        qualities.seventh++;
        if (chordStr.includes('9') || chordStr.includes('11') || chordStr.includes('13')) {
          qualities.extended++;
        }
      }
      else if (chordStr.includes('m') && !chordStr.includes('maj')) qualities.minor++;
      else qualities.major++;
    });

    // Convert to ratios
    Object.keys(qualities).forEach(key => {
      qualities[key] = qualities[key] / total;
    });

    return qualities;
  }

  /**
   * Analyze chord functions in harmonic context
   */
  static _analyzeChordFunctions(chords) {
    const functions = { tonic: 0, dominant: 0, subdominant: 0, mediant: 0, leading: 0 };
    const total = chords.length;

    // Simplified function analysis (would need key context for accuracy)
    chords.forEach((chord, index) => {
      const chordStr = chord.toLowerCase();

      // Basic heuristics
      if (chordStr.startsWith('c') || chordStr.startsWith('am')) functions.tonic += 0.5;
      if (chordStr.startsWith('g') || chordStr.startsWith('e') || chordStr.includes('7')) functions.dominant += 0.5;
      if (chordStr.startsWith('f') || chordStr.startsWith('dm')) functions.subdominant += 0.5;
      if (chordStr.startsWith('a') || chordStr.startsWith('em')) functions.mediant += 0.5;
      if (chordStr.includes('dim') || chordStr.startsWith('b')) functions.leading += 0.5;
    });

    // Normalize
    Object.keys(functions).forEach(key => {
      functions[key] = Math.min(1, functions[key]);
    });

    return functions;
  }

  /**
   * Analyze rhythmic patterns in progression
   */
  static _analyzeRhythmicPatterns(chords) {
    const patterns = { repetitive: 0, varied: 0, building: 0, descending: 0 };

    if (chords.length < 2) return patterns;

    // Check for repetition
    const uniqueChords = new Set(chords);
    patterns.repetitive = 1 - (uniqueChords.size / chords.length);

    // Check for variety (chord changes)
    let changes = 0;
    for (let i = 1; i < chords.length; i++) {
      if (chords[i] !== chords[i-1]) changes++;
    }
    patterns.varied = changes / (chords.length - 1);

    // Check for building patterns (increasing complexity)
    let complexitySum = 0;
    chords.forEach(chord => {
      if (chord.includes('7') || chord.includes('9')) complexitySum += 0.5;
      if (chord.includes('dim') || chord.includes('aug')) complexitySum += 0.3;
    });
    patterns.building = complexitySum / chords.length;

    // Check for descending patterns (simplifying)
    patterns.descending = 1 - patterns.building;

    return patterns;
  }

  /**
   * Analyze harmonic motion patterns
   */
  static _analyzeHarmonicMotion(chords) {
    const motion = { stepwise: 0, leaps: 0, chromatic: 0, diatonic: 0 };

    if (chords.length < 2) return motion;

    // Simplified motion analysis
    let stepwise = 0;
    let leaps = 0;

    for (let i = 1; i < chords.length; i++) {
      const chord1 = chords[i-1].toLowerCase();
      const chord2 = chords[i].toLowerCase();

      // Check if chords are adjacent in circle of fifths (simplified)
      const circleOfFifths = ['c', 'g', 'd', 'a', 'e', 'b', 'f#', 'c#', 'g#', 'd#', 'a#', 'f'];
      const pos1 = circleOfFifths.indexOf(chord1.replace(/[^a-g#]/g, ''));
      const pos2 = circleOfFifths.indexOf(chord2.replace(/[^a-g#]/g, ''));

      if (pos1 !== -1 && pos2 !== -1) {
        const distance = Math.abs(pos1 - pos2);
        if (distance === 1 || distance === 11) stepwise++;
        else leaps++;
      }
    }

    motion.stepwise = stepwise / (chords.length - 1);
    motion.leaps = leaps / (chords.length - 1);
    motion.diatonic = (stepwise + leaps) / (chords.length - 1);
    motion.chromatic = 1 - motion.diatonic;

    return motion;
  }

  /**
   * Extract genre-specific indicators
   */
  static _extractGenreIndicators(chords, qualities, functions) {
    const indicators = { pop: 0, rock: 0, jazz: 0, classical: 0, folk: 0, electronic: 0 };

    // Pop: Simple progressions, high familiarity, major chords
    indicators.pop = (qualities.major * 0.4) + ((1 - qualities.extended) * 0.3) + (functions.tonic * 0.3);

    // Rock: Power chords, dominant functions, some minor chords
    indicators.rock = (qualities.major * 0.3) + (qualities.minor * 0.3) + (functions.dominant * 0.4);

    // Jazz: Extended chords, complex functions, seventh chords
    indicators.jazz = (qualities.seventh * 0.4) + (qualities.extended * 0.4) + (functions.leading * 0.2);

    // Classical: Complex harmony, all functions represented
    indicators.classical = (qualities.extended * 0.3) + (functions.mediant * 0.3) + (functions.leading * 0.4);

    // Folk: Simple, diatonic, natural progressions
    indicators.folk = ((1 - qualities.extended) * 0.4) + (functions.subdominant * 0.3) + (functions.tonic * 0.3);

    // Electronic: Repetitive patterns, synthetic qualities
    const repetition = this._calculateRepetitiveness(chords);
    indicators.electronic = (repetition * 0.5) + (qualities.seventh * 0.3) + ((1 - qualities.major) * 0.2);

    return indicators;
  }

  /**
   * Analyze progression structure
   */
  static _analyzeProgressionStructure(chords) {
    const uniqueChords = new Set(chords);
    const repetitionRatio = 1 - (uniqueChords.size / chords.length);

    return {
      length: chords.length,
      unique_chords: uniqueChords.size,
      repetition_ratio: repetitionRatio,
      density: uniqueChords.size / chords.length,
      symmetry: this._calculateSymmetry(chords)
    };
  }

  /**
   * Suggest appropriate tempos based on genre indicators
   */
  static _suggestTempos(chords, genreIndicators) {
    const suggestions = [];

    if (genreIndicators.pop > 0.6) suggestions.push({ tempo: 120, genre: 'pop', confidence: genreIndicators.pop });
    if (genreIndicators.rock > 0.6) suggestions.push({ tempo: 140, genre: 'rock', confidence: genreIndicators.rock });
    if (genreIndicators.jazz > 0.6) suggestions.push({ tempo: 100, genre: 'jazz', confidence: genreIndicators.jazz });
    if (genreIndicators.classical > 0.6) suggestions.push({ tempo: 80, genre: 'classical', confidence: genreIndicators.classical });
    if (genreIndicators.folk > 0.6) suggestions.push({ tempo: 110, genre: 'folk', confidence: genreIndicators.folk });
    if (genreIndicators.electronic > 0.6) suggestions.push({ tempo: 128, genre: 'electronic', confidence: genreIndicators.electronic });

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Suggest instrumentation based on genre indicators
   */
  static _suggestInstrumentation(chords, genreIndicators) {
    const suggestions = [];

    if (genreIndicators.pop > 0.6) suggestions.push('piano', 'guitar', 'bass', 'drums');
    if (genreIndicators.rock > 0.6) suggestions.push('electric_guitar', 'bass', 'drums', 'vocals');
    if (genreIndicators.jazz > 0.6) suggestions.push('piano', 'saxophone', 'bass', 'drums');
    if (genreIndicators.classical > 0.6) suggestions.push('orchestra', 'piano', 'strings');
    if (genreIndicators.folk > 0.6) suggestions.push('acoustic_guitar', 'vocals', 'banjo');
    if (genreIndicators.electronic > 0.6) suggestions.push('synthesizer', 'drums', 'bass');

    return [...new Set(suggestions)]; // Remove duplicates
  }

  // ===== ENHANCEMENT 2: Loop Quality Analysis Methods =====

  /**
   * Get default loop quality
   */
  static _getDefaultLoopQuality() {
    return {
      loop_potential: 0,
      seamless_transitions: 0,
      rhythmic_flow: 0,
      harmonic_closure: 0,
      optimal_loop_points: [],
      stability_metrics: { tension_release: 0, rhythmic_consistency: 0, harmonic_consistency: 0 },
      recommended_loop_length: 0,
      transition_quality_score: 0
    };
  }

  /**
   * Calculate loop potential
   */
  static _calculateLoopPotential(chords) {
    if (!chords || chords.length < 2) return 0;

    // Check if first and last chords create good loop
    const firstChord = chords[0];
    const lastChord = chords[chords.length - 1];

    let loopScore = 0;

    // Perfect loop: starts and ends on same chord
    if (firstChord === lastChord) loopScore += 0.8;

    // Good loop: ends on tonic or related chord
    if (this._isRelatedChord(firstChord, lastChord)) loopScore += 0.5;

    // Repetitive patterns are good for looping
    const repetition = this._calculateRepetitiveness(chords);
    loopScore += repetition * 0.3;

    // Shorter progressions loop better
    if (chords.length <= 8) loopScore += 0.2;

    return Math.min(1, loopScore);
  }

  /**
   * Analyze seamless transitions
   */
  static _analyzeSeamlessTransitions(chords) {
    if (!chords || chords.length < 2) return 0;

    let seamlessScore = 0;
    let transitionCount = 0;

    for (let i = 1; i < chords.length; i++) {
      const chord1 = chords[i-1];
      const chord2 = chords[i];

      // Check voice leading smoothness (simplified)
      if (this._smoothVoiceLeading(chord1, chord2)) {
        seamlessScore += 0.8;
      } else {
        seamlessScore += 0.3;
      }
      transitionCount++;
    }

    // Check loop transition (last to first)
    if (this._smoothVoiceLeading(chords[chords.length - 1], chords[0])) {
      seamlessScore += 0.5;
      transitionCount++;
    }

    return seamlessScore / transitionCount;
  }

  /**
   * Analyze rhythmic flow
   */
  static _analyzeRhythmicFlow(chords) {
    if (!chords || chords.length < 2) return 0.5;

    // Analyze chord change patterns
    let flowScore = 0;
    const changes = [];

    for (let i = 1; i < chords.length; i++) {
      changes.push(chords[i] !== chords[i-1] ? 1 : 0);
    }

    // Good flow has some changes but not too many
    const changeRatio = changes.reduce((a, b) => a + b, 0) / changes.length;
    if (changeRatio > 0.3 && changeRatio < 0.8) {
      flowScore = 0.8;
    } else if (changeRatio <= 0.3) {
      flowScore = 0.4; // Too static
    } else {
      flowScore = 0.5; // Too chaotic
    }

    return flowScore;
  }

  /**
   * Analyze harmonic closure
   */
  static _analyzeHarmonicClosure(chords) {
    if (!chords || chords.length === 0) return 0;

    const firstChord = chords[0];
    const lastChord = chords[chords.length - 1];

    // Strong closure if ends on tonic or dominant
    if (this._isTonicChord(firstChord, lastChord) || this._isDominantChord(firstChord, lastChord)) {
      return 0.9;
    }

    // Moderate closure if related chords
    if (this._isRelatedChord(firstChord, lastChord)) {
      return 0.6;
    }

    return 0.3;
  }

  /**
   * Identify optimal loop points
   */
  static _identifyLoopPoints(chords) {
    const points = [];

    // Always suggest full length
    points.push({ position: chords.length, confidence: 0.8, type: 'full' });

    // Suggest half length if even
    if (chords.length % 2 === 0) {
      points.push({ position: chords.length / 2, confidence: 0.6, type: 'half' });
    }

    // Find points where chord repeats
    for (let i = 1; i < chords.length; i++) {
      if (chords[i] === chords[0]) {
        points.push({ position: i, confidence: 0.7, type: 'repeat' });
      }
    }

    return points.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Calculate loop stability metrics
   */
  static _calculateLoopStability(chords) {
    const tensionRelease = this._calculateTensionRelease(chords);
    const rhythmicConsistency = this._calculateRhythmicConsistency(chords);
    const harmonicConsistency = this._calculateHarmonicConsistency(chords);

    return {
      tension_release: tensionRelease,
      rhythmic_consistency: rhythmicConsistency,
      harmonic_consistency: harmonicConsistency,
      overall_stability: (tensionRelease + rhythmicConsistency + harmonicConsistency) / 3
    };
  }

  /**
   * Recommend loop length
   */
  static _recommendLoopLength(chords, loopPotential) {
    if (loopPotential > 0.7) return chords.length; // Full loop
    if (chords.length > 8) return 8; // Shorter loop
    return chords.length; // Keep original
  }

  /**
   * Calculate transition quality score
   */
  static _calculateTransitionQuality(chords) {
    if (!chords || chords.length < 2) return 0;

    let qualitySum = 0;
    let transitionCount = 0;

    // Internal transitions
    for (let i = 1; i < chords.length; i++) {
      qualitySum += this._transitionQuality(chords[i-1], chords[i]);
      transitionCount++;
    }

    // Loop transition
    qualitySum += this._transitionQuality(chords[chords.length - 1], chords[0]);
    transitionCount++;

    return qualitySum / transitionCount;
  }

  // ===== ENHANCEMENT 3: Data Extension Methods =====

  /**
   * Get default extended data
   */
  static _getDefaultExtendedData() {
    return {
      variations: [],
      transitions: [],
      arrangements: [],
      mood_variations: [],
      tempo_variations: [],
      compatibility_matrix: {},
      extension_suggestions: []
    };
  }

  /**
   * Generate variations based on metadata insights
   */
  static _generateVariations(chords, metadata) {
    const variations = [];

    // Add seventh chords if jazz-indicated
    if (metadata.genre_indicators.jazz > 0.6) {
      const jazzVariation = chords.map(chord => {
        if (!chord.includes('7') && !chord.includes('dim')) {
          return chord + '7';
        }
        return chord;
      });
      variations.push({ type: 'jazz_sevenths', chords: jazzVariation, confidence: metadata.genre_indicators.jazz });
    }

    // Simplify for pop if complex
    if (metadata.genre_indicators.pop > 0.6 && metadata.chord_qualities.extended > 0.3) {
      const popVariation = chords.map(chord => chord.replace(/7|9|11|13/g, ''));
      variations.push({ type: 'pop_simplified', chords: popVariation, confidence: metadata.genre_indicators.pop });
    }

    // Add minor variations for rock
    if (metadata.genre_indicators.rock > 0.6) {
      const rockVariation = chords.map(chord => {
        if (!chord.toLowerCase().includes('m') && Math.random() > 0.7) {
          return chord.toLowerCase().replace('maj', '') + 'm';
        }
        return chord;
      });
      variations.push({ type: 'rock_minors', chords: rockVariation, confidence: metadata.genre_indicators.rock });
    }

    return variations;
  }

  /**
   * Suggest transitions
   */
  static _suggestTransitions(chords, metadata, loopQuality) {
    const transitions = [];

    // Suggest intro if progression is complex
    if (metadata.chord_qualities.extended > 0.4) {
      transitions.push({
        type: 'intro',
        suggestion: 'Add simple chord intro',
        chords: [chords[0], chords[1]],
        reason: 'Complex progression needs simpler introduction'
      });
    }

    // Suggest bridge if loop quality is low
    if (loopQuality.loop_potential < 0.5) {
      transitions.push({
        type: 'bridge',
        suggestion: 'Add bridge section',
        chords: this._generateBridgeChords(chords),
        reason: 'Low loop potential suggests need for transitional section'
      });
    }

    return transitions;
  }

  /**
   * Generate arrangement variations
   */
  static _generateArrangements(chords, metadata) {
    const arrangements = [];

    // Suggest based on genre indicators
    Object.entries(metadata.genre_indicators).forEach(([genre, confidence]) => {
      if (confidence > 0.6) {
        arrangements.push({
          genre: genre,
          instruments: metadata.instrumentation_hints,
          tempo_range: metadata.tempo_suggestions.find(t => t.genre === genre)?.tempo || 120,
          complexity: metadata.chord_qualities.extended > 0.3 ? 'complex' : 'simple'
        });
      }
    });

    return arrangements;
  }

  /**
   * Generate mood variations
   */
  static _generateMoodVariations(chords, metadata) {
    const variations = [];

    // Happy variation (more major chords)
    const happyVariation = chords.map(chord => chord.replace(/m/g, '').replace(/dim/g, ''));
    variations.push({ mood: 'happy', chords: happyVariation, confidence: metadata.chord_qualities.major });

    // Sad variation (more minor chords)
    const sadVariation = chords.map(chord => {
      if (!chord.toLowerCase().includes('m') && !chord.includes('dim')) {
        return chord.toLowerCase().replace('maj', '') + 'm';
      }
      return chord;
    });
    variations.push({ mood: 'sad', chords: sadVariation, confidence: metadata.chord_qualities.minor });

    // Tense variation (add diminished chords)
    const tenseVariation = [...chords];
    if (Math.random() > 0.7) tenseVariation.splice(1, 0, 'Bdim');
    variations.push({ mood: 'tense', chords: tenseVariation, confidence: 0.5 });

    return variations;
  }

  /**
   * Generate tempo variations
   */
  static _generateTempoVariations(chords, metadata) {
    const variations = [];

    metadata.tempo_suggestions.forEach(suggestion => {
      variations.push({
        tempo: suggestion.tempo,
        genre: suggestion.genre,
        feel: suggestion.tempo > 130 ? 'fast' : suggestion.tempo < 100 ? 'slow' : 'moderate',
        confidence: suggestion.confidence
      });
    });

    return variations;
  }

  /**
   * Build compatibility matrix
   */
  static _buildCompatibilityMatrix(chords, metadata) {
    const matrix = {};

    // Check compatibility with different genres
    Object.keys(metadata.genre_indicators).forEach(genre => {
      matrix[genre] = {
        compatibility: metadata.genre_indicators[genre],
        reasons: this._getCompatibilityReasons(genre, metadata)
      };
    });

    return matrix;
  }

  /**
   * Suggest extensions
   */
  static _suggestExtensions(chords, loopQuality) {
    const suggestions = [];

    // Extend if loop quality is poor
    if (loopQuality.loop_potential < 0.6) {
      suggestions.push({
        type: 'extension',
        action: 'add_resolution_chord',
        chord: this._suggestResolutionChord(chords),
        reason: 'Poor loop potential - needs better resolution'
      });
    }

    // Shorten if too long
    if (chords.length > 12) {
      suggestions.push({
        type: 'reduction',
        action: 'remove_redundant_chords',
        positions: this._findRedundantChords(chords),
        reason: 'Long progression may benefit from simplification'
      });
    }

    return suggestions;
  }

  // ===== Helper Methods =====

  /**
   * Calculate symmetry
   */
  static _calculateSymmetry(chords) {
    if (chords.length < 3) return 0;

    // Check if progression is palindromic
    let symmetry = 0;
    const half = Math.floor(chords.length / 2);

    for (let i = 0; i < half; i++) {
      if (chords[i] === chords[chords.length - 1 - i]) {
        symmetry += 1;
      }
    }

    return symmetry / half;
  }

  /**
   * Check if chords are related
   */
  static _isRelatedChord(chord1, chord2) {
    const c1 = chord1.toLowerCase().replace(/[^a-g#]/g, '');
    const c2 = chord2.toLowerCase().replace(/[^a-g#]/g, '');

    // Same root
    if (c1 === c2) return true;

    // Adjacent in circle of fifths
    const circleOfFifths = ['c', 'g', 'd', 'a', 'e', 'b', 'f#', 'c#', 'g#', 'd#', 'a#', 'f'];
    const pos1 = circleOfFifths.indexOf(c1);
    const pos2 = circleOfFifths.indexOf(c2);

    if (pos1 !== -1 && pos2 !== -1) {
      return Math.abs(pos1 - pos2) <= 2;
    }

    return false;
  }

  /**
   * Check smooth voice leading
   */
  static _smoothVoiceLeading(chord1, chord2) {
    // Simplified: same root = smooth
    const root1 = chord1.toLowerCase().replace(/[^a-g#]/g, '');
    const root2 = chord2.toLowerCase().replace(/[^a-g#]/g, '');
    return root1 === root2;
  }

  /**
   * Check if chord is tonic
   */
  static _isTonicChord(baseChord, testChord) {
    const base = baseChord.toLowerCase().replace(/[^a-g#]/g, '');
    const test = testChord.toLowerCase().replace(/[^a-g#]/g, '');
    return base === test;
  }

  /**
   * Check if chord is dominant
   */
  static _isDominantChord(baseChord, testChord) {
    // Simplified: check for dominant relationship
    return testChord.includes('7') || testChord.toLowerCase().startsWith('g');
  }

  /**
   * Calculate tension release
   */
  static _calculateTensionRelease(chords) {
    if (!chords || chords.length < 2) return 0.5;

    // Check if progression builds and releases tension
    const startTension = this._chordTension(chords[0]);
    const endTension = this._chordTension(chords[chords.length - 1]);

    return startTension > endTension ? 0.8 : 0.4;
  }

  /**
   * Calculate rhythmic consistency
   */
  static _calculateRhythmicConsistency(chords) {
    if (!chords || chords.length < 2) return 0.5;

    // Check for consistent change patterns
    let consistency = 0;
    for (let i = 2; i < chords.length; i++) {
      const prevChange = chords[i-1] !== chords[i-2];
      const currChange = chords[i] !== chords[i-1];
      if (prevChange === currChange) consistency += 0.5;
    }

    return consistency / (chords.length - 2);
  }

  /**
   * Calculate harmonic consistency
   */
  static _calculateHarmonicConsistency(chords) {
    if (!chords || chords.length < 2) return 0.5;

    // Check if chords are harmonically related
    let consistency = 0;
    for (let i = 1; i < chords.length; i++) {
      if (this._isRelatedChord(chords[i-1], chords[i])) consistency += 0.8;
      else consistency += 0.3;
    }

    return consistency / (chords.length - 1);
  }

  /**
   * Calculate transition quality between two chords
   */
  static _transitionQuality(chord1, chord2) {
    if (this._smoothVoiceLeading(chord1, chord2)) return 0.9;
    if (this._isRelatedChord(chord1, chord2)) return 0.7;
    return 0.4;
  }

  /**
   * Generate bridge chords
   */
  static _generateBridgeChords(chords) {
    // Suggest a simple bridge using first and last chords
    return [chords[0], chords[chords.length - 1]];
  }

  /**
   * Get compatibility reasons
   */
  static _getCompatibilityReasons(genre, metadata) {
    const reasons = [];

    switch (genre) {
      case 'pop':
        if (metadata.chord_qualities.major > 0.6) reasons.push('High major chord ratio suits pop');
        if (metadata.chord_qualities.extended < 0.3) reasons.push('Simple chord structures work for pop');
        break;
      case 'jazz':
        if (metadata.chord_qualities.seventh > 0.4) reasons.push('Seventh chords fit jazz style');
        if (metadata.chord_qualities.extended > 0.3) reasons.push('Extended harmonies suit jazz');
        break;
      // Add more genre-specific reasons
    }

    return reasons;
  }

  /**
   * Suggest resolution chord
   */
  static _suggestResolutionChord(chords) {
    const firstChord = chords[0];
    // Suggest tonic or related chord
    return firstChord;
  }

  /**
   * Find redundant chords
   */
  static _findRedundantChords(chords) {
    const redundant = [];
    for (let i = 1; i < chords.length - 1; i++) {
      if (chords[i] === chords[i-1] && chords[i] === chords[i+1]) {
        redundant.push(i);
      }
    }
    return redundant;
  }

  /**
   * Calculate chord tension
   */
  static _chordTension(chord) {
    let tension = 0;
    if (chord.includes('dim')) tension += 0.8;
    if (chord.includes('aug')) tension += 0.7;
    if (chord.includes('7')) tension += 0.4;
    if (chord.includes('9') || chord.includes('11') || chord.includes('13')) tension += 0.3;
    return Math.min(1, tension);
  }

  /**
   * Process batch of progressions
   */
  static processBatch(progressions, options = {}) {
    return progressions.map((prog, index) => {
      return this.processProgression(prog, {
        ...options,
        id: prog.id || `progression_${index}`
      });
    });
  }
}

export default ChordonomiconProcessor;
