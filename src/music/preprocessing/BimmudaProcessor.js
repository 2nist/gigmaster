import fs from 'fs';
import path from 'path';

/**
 * Processor for bimmuda_dataset (historical MIDI files with lyrics)
 * Provides analysis and metadata extraction for historical music data
 */
export default class BimmudaProcessor {
  /**
   * Process a bimmuda dataset file
   * @param {Object} fileData - Raw file data
   * @param {Object} options - Processing options
   * @returns {Object} Processed bimmuda data with analysis
   */
  static processFile(fileData, options = {}) {
    const {
      id = this._generateFileId(fileData),
      name = 'Unnamed Bimmuda File'
    } = options;

    // Extract basic file information
    const basicInfo = this._extractBasicInfo(fileData);

    // Analyze temporal context (year/month)
    const temporalContext = this._analyzeTemporalContext(fileData);

    // Extract lyrics analysis if available
    const lyricsAnalysis = this._analyzeLyrics(fileData);

    // Analyze musical characteristics
    const musicalCharacteristics = this._analyzeMusicalCharacteristics(fileData);

    // Determine era and cultural context
    const eraContext = this._determineEraContext(temporalContext);

    // ENHANCEMENT 1: Extract enhanced metadata for better historical analysis
    const enhancedMetadata = this._extractEnhancedMetadata(basicInfo, temporalContext, lyricsAnalysis);

    // ENHANCEMENT 2: Quality testing for better historical representation
    const qualityAnalysis = this._analyzeQuality(basicInfo, musicalCharacteristics);

    // ENHANCEMENT 3: Extend data based on metadata and quality analysis
    const extendedData = this._extendData(basicInfo, enhancedMetadata, qualityAnalysis);

    return {
      // Basic fields
      id,
      name,
      file_path: fileData.filePath,
      year: temporalContext.year,
      month: temporalContext.month,

      // Enhanced analysis
      basic_info: basicInfo,
      temporal_context: temporalContext,
      lyrics_analysis: lyricsAnalysis,
      musical_characteristics: musicalCharacteristics,
      era_context: eraContext,

      // ENHANCEMENT 1: Enhanced metadata for historical analysis
      enhanced_metadata: enhancedMetadata,

      // ENHANCEMENT 2: Quality analysis
      quality_analysis: qualityAnalysis,

      // ENHANCEMENT 3: Extended data
      extended_data: extendedData,

      // Metadata
      source: 'bimmuda_dataset',
      processed_at: Date.now()
    };
  }

  /**
   * Generate unique file ID
   */
  static _generateFileId(fileData) {
    const str = `${fileData.filePath || 'unknown'}_${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `bimmuda_${Math.abs(hash)}`;
  }

  /**
   * Extract basic file information
   */
  static _extractBasicInfo(fileData) {
    const filePath = fileData.filePath || '';
    const fileName = path.basename(filePath);

    return {
      file_name: fileName,
      file_extension: path.extname(fileName),
      file_size: fileData.size || 0,
      is_midi: fileName.endsWith('.mid') || fileName.endsWith('.midi'),
      is_lyrics: fileName.endsWith('.txt'),
      is_compilation: fileName.includes('_full'),
      track_number: this._extractTrackNumber(fileName)
    };
  }

  /**
   * Analyze temporal context
   */
  static _analyzeTemporalContext(fileData) {
    const filePath = fileData.filePath || '';
    const pathParts = filePath.split(path.sep);

    // Extract year from path
    const yearMatch = filePath.match(/\/(\d{4})\//);
    const year = yearMatch ? parseInt(yearMatch[1]) : null;

    // Extract month from path or filename
    const monthMatch = filePath.match(/\/(\d{1,2})\//) || filePath.match(/_(\d{1,2})\./);
    const month = monthMatch ? parseInt(monthMatch[1]) : null;

    // Determine decade and era
    const decade = year ? Math.floor(year / 10) * 10 : null;
    const era = this._determineEra(year);

    return {
      year,
      month,
      decade,
      era,
      season: month ? this._determineSeason(month) : null,
      is_leap_year: year ? this._isLeapYear(year) : false
    };
  }

  /**
   * Analyze lyrics if available
   */
  static _analyzeLyrics(fileData) {
    if (!fileData.lyrics && !fileData.filePath?.endsWith('.txt')) {
      return { has_lyrics: false };
    }

    const lyrics = fileData.lyrics || '';
    const lines = lyrics.split('\n').filter(line => line.trim());

    return {
      has_lyrics: true,
      line_count: lines.length,
      word_count: lyrics.split(/\s+/).length,
      character_count: lyrics.length,
      avg_line_length: lines.length > 0 ? lyrics.length / lines.length : 0,
      language_indicators: this._detectLanguage(lyrics),
      themes: this._extractThemes(lyrics),
      sentiment: this._analyzeSentiment(lyrics)
    };
  }

  /**
   * Analyze musical characteristics
   */
  static _analyzeMusicalCharacteristics(fileData) {
    // Basic analysis - would be enhanced with actual MIDI parsing
    const fileName = path.basename(fileData.filePath || '');

    return {
      estimated_duration: this._estimateDuration(fileName),
      tempo_indicators: this._extractTempoIndicators(fileName),
      key_indicators: this._extractKeyIndicators(fileName),
      genre_hints: this._extractGenreHints(fileName),
      instrumentation_hints: this._extractInstrumentationHints(fileName)
    };
  }

  /**
   * Determine era context
   */
  static _determineEraContext(temporalContext) {
    const { year, era } = temporalContext;

    const eraCharacteristics = {
      '1950s': {
        cultural_context: 'post_war_recovery',
        musical_influences: ['rock_n_roll', 'doo_wop', 'traditional_pop'],
        technological_context: 'vinyl_records',
        social_context: 'baby_boom'
      },
      '1960s': {
        cultural_context: 'cultural_revolution',
        musical_influences: ['british_invasion', 'psychedelic_rock', 'motown'],
        technological_context: 'transistor_radios',
        social_context: 'civil_rights_movement'
      },
      '1970s': {
        cultural_context: 'disco_era',
        musical_influences: ['disco', 'glam_rock', 'prog_rock', 'punk_emergence'],
        technological_context: 'cassette_tapes',
        social_context: 'oil_crisis'
      },
      '1980s': {
        cultural_context: 'mtv_generation',
        musical_influences: ['new_wave', 'hip_hop', 'hair_metal', 'synth_pop'],
        technological_context: 'cd_players',
        social_context: 'cold_war'
      },
      '1990s': {
        cultural_context: 'grunge_generation',
        musical_influences: ['grunge', 'alternative_rock', 'hip_hop', 'boy_bands'],
        technological_context: 'mp3_emergence',
        social_context: 'internet_revolution'
      },
      '2000s': {
        cultural_context: 'digital_age',
        musical_influences: ['pop_punk', 'hip_hop', 'electronic_dance'],
        technological_context: 'digital_downloads',
        social_context: 'social_media'
      },
      '2010s': {
        cultural_context: 'streaming_era',
        musical_influences: ['indie_pop', 'trap', 'k_pop', 'edm'],
        technological_context: 'streaming_services',
        social_context: 'smartphone_culture'
      },
      '2020s': {
        cultural_context: 'pandemic_recovery',
        musical_influences: ['social_media_music', 'hybrid_genres', 'ai_music'],
        technological_context: 'ai_tools',
        social_context: 'remote_collaboration'
      }
    };

    return eraCharacteristics[era] || {
      cultural_context: 'unknown',
      musical_influences: [],
      technological_context: 'unknown',
      social_context: 'unknown'
    };
  }

  // ===== ENHANCEMENT 1: Enhanced Metadata Extraction Methods =====

  /**
   * Extract enhanced metadata for better historical analysis
   */
  static _extractEnhancedMetadata(basicInfo, temporalContext, lyricsAnalysis) {
    const historicalSignificance = this._analyzeHistoricalSignificance(temporalContext);
    const culturalRelevance = this._analyzeCulturalRelevance(temporalContext, lyricsAnalysis);
    const musicalEvolution = this._analyzeMusicalEvolution(temporalContext);

    return {
      historical_significance: historicalSignificance,
      cultural_relevance: culturalRelevance,
      musical_evolution: musicalEvolution,
      preservation_status: this._assessPreservationStatus(basicInfo),
      research_value: this._calculateResearchValue(basicInfo, temporalContext, lyricsAnalysis),
      digitization_quality: this._assessDigitizationQuality(basicInfo)
    };
  }

  // ===== ENHANCEMENT 2: Quality Analysis Methods =====

  /**
   * Analyze quality for better historical representation
   */
  static _analyzeQuality(basicInfo, musicalCharacteristics) {
    const completeness = this._assessCompleteness(basicInfo);
    const authenticity = this._assessAuthenticity(basicInfo, musicalCharacteristics);
    const usability = this._assessUsability(basicInfo);

    return {
      completeness_score: completeness,
      authenticity_score: authenticity,
      usability_score: usability,
      overall_quality: (completeness + authenticity + usability) / 3,
      quality_indicators: this._generateQualityIndicators(basicInfo, musicalCharacteristics)
    };
  }

  // ===== ENHANCEMENT 3: Data Extension Methods =====

  /**
   * Extend data based on metadata and quality analysis
   */
  static _extendData(basicInfo, enhancedMetadata, qualityAnalysis) {
    const contextualExtensions = this._generateContextualExtensions(enhancedMetadata);
    const qualityBasedSuggestions = this._generateQualityBasedSuggestions(qualityAnalysis);
    const researchApplications = this._suggestResearchApplications(enhancedMetadata);

    return {
      contextual_extensions: contextualExtensions,
      quality_improvements: qualityBasedSuggestions,
      research_applications: researchApplications,
      educational_value: this._assessEducationalValue(enhancedMetadata),
      commercial_potential: this._assessCommercialPotential(enhancedMetadata, qualityAnalysis)
    };
  }

  // ===== Helper Methods =====

  static _extractTrackNumber(fileName) {
    const match = fileName.match(/_(\d+)\./);
    return match ? parseInt(match[1]) : null;
  }

  static _determineEra(year) {
    if (!year) return 'unknown';
    if (year >= 2020) return '2020s';
    if (year >= 2010) return '2010s';
    if (year >= 2000) return '2000s';
    if (year >= 1990) return '1990s';
    if (year >= 1980) return '1980s';
    if (year >= 1970) return '1970s';
    if (year >= 1960) return '1960s';
    if (year >= 1950) return '1950s';
    return 'pre_1950';
  }

  static _determineSeason(month) {
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'fall';
    return 'winter';
  }

  static _isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  static _detectLanguage(text) {
    // Simple language detection based on common words
    const germanWords = ['der', 'die', 'das', 'und', 'ist', 'mit'];
    const englishWords = ['the', 'and', 'is', 'in', 'to', 'of'];

    const germanCount = germanWords.filter(word => text.toLowerCase().includes(word)).length;
    const englishCount = englishWords.filter(word => text.toLowerCase().includes(word)).length;

    if (germanCount > englishCount) return ['german'];
    if (englishCount > germanCount) return ['english'];
    return ['unknown'];
  }

  static _extractThemes(lyrics) {
    // Simple theme extraction
    const themes = [];
    const text = lyrics.toLowerCase();

    if (text.includes('love') || text.includes('liebe')) themes.push('love');
    if (text.includes('heart') || text.includes('herz')) themes.push('heartbreak');
    if (text.includes('dance') || text.includes('tanz')) themes.push('dance');
    if (text.includes('dream') || text.includes('traum')) themes.push('dreams');

    return themes;
  }

  static _analyzeSentiment(lyrics) {
    const positiveWords = ['love', 'happy', 'joy', 'beautiful', 'wonderful'];
    const negativeWords = ['sad', 'pain', 'cry', 'broken', 'lost'];

    const text = lyrics.toLowerCase();
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  static _estimateDuration(fileName) {
    // Rough estimation based on file naming patterns
    if (fileName.includes('_full')) return 180; // 3 minutes
    return 30; // 30 seconds
  }

  static _extractTempoIndicators(fileName) {
    // Would need MIDI parsing for accurate tempo
    return { estimated_bpm: 120, confidence: 0.5 };
  }

  static _extractKeyIndicators(fileName) {
    // Would need MIDI parsing for accurate key detection
    return { estimated_key: 'C', confidence: 0.3 };
  }

  static _extractGenreHints(fileName) {
    // Basic genre hints from filename patterns
    const hints = [];
    if (fileName.toLowerCase().includes('rock')) hints.push('rock');
    if (fileName.toLowerCase().includes('pop')) hints.push('pop');
    if (fileName.toLowerCase().includes('jazz')) hints.push('jazz');
    return hints;
  }

  static _extractInstrumentationHints(fileName) {
    // Basic instrumentation hints
    const hints = [];
    if (fileName.toLowerCase().includes('piano')) hints.push('piano');
    if (fileName.toLowerCase().includes('guitar')) hints.push('guitar');
    if (fileName.toLowerCase().includes('bass')) hints.push('bass');
    return hints;
  }

  static _analyzeHistoricalSignificance(temporalContext) {
    const { year, era } = temporalContext;

    // Calculate significance based on era and year
    let significance = 0.5; // Base significance

    // More recent years have higher significance for modern research
    if (year && year >= 2000) significance += 0.3;
    if (year && year >= 2010) significance += 0.2;

    // Certain eras have higher historical significance
    const significantEras = ['1960s', '1980s', '1990s'];
    if (significantEras.includes(era)) significance += 0.2;

    return {
      score: Math.min(1, significance),
      factors: ['era_importance', 'temporal_distance', 'cultural_impact']
    };
  }

  static _analyzeCulturalRelevance(temporalContext, lyricsAnalysis) {
    const relevance = {
      score: 0.5,
      cultural_markers: [],
      social_context: temporalContext.era
    };

    if (lyricsAnalysis.has_lyrics) {
      relevance.score += 0.2;
      relevance.cultural_markers.push('lyrical_content');
    }

    if (temporalContext.year) {
      relevance.score += 0.1;
      relevance.cultural_markers.push('temporal_specificity');
    }

    return relevance;
  }

  static _analyzeMusicalEvolution(temporalContext) {
    const { year } = temporalContext;

    if (!year) return { evolution_stage: 'unknown' };

    // Determine musical evolution stage
    let stage = 'early';
    if (year >= 1970) stage = 'modern';
    if (year >= 2000) stage = 'contemporary';
    if (year >= 2010) stage = 'digital';

    return {
      evolution_stage: stage,
      technological_context: this._getTechContext(year),
      stylistic_influences: this._getStylisticInfluences(year)
    };
  }

  static _assessPreservationStatus(basicInfo) {
    let status = 'good';

    if (basicInfo.file_size < 1000) status = 'poor'; // Very small files might be corrupted
    if (!basicInfo.is_midi && !basicInfo.is_lyrics) status = 'unknown_format';

    return {
      status,
      digitization_quality: status === 'good' ? 0.8 : 0.5,
      recommendations: status === 'poor' ? ['verify_file_integrity', 'consider_redigitization'] : []
    };
  }

  static _calculateResearchValue(basicInfo, temporalContext, lyricsAnalysis) {
    let value = 0.5;

    if (lyricsAnalysis.has_lyrics) value += 0.3;
    if (temporalContext.year) value += 0.2;
    if (basicInfo.is_compilation) value += 0.1;

    return {
      score: Math.min(1, value),
      research_areas: ['music_history', 'cultural_studies', 'musicology']
    };
  }

  static _assessDigitizationQuality(basicInfo) {
    // Assess based on file characteristics
    let quality = 0.7;

    if (basicInfo.file_extension === '.mid') quality += 0.2;
    if (basicInfo.file_size > 5000) quality += 0.1; // Larger files likely more complete

    return {
      score: Math.min(1, quality),
      format_quality: basicInfo.file_extension === '.mid' ? 'standard' : 'legacy',
      recommendations: quality < 0.6 ? ['format_conversion', 'quality_check'] : []
    };
  }

  static _assessCompleteness(basicInfo) {
    let completeness = 0.8;

    if (basicInfo.is_midi) completeness += 0.1;
    if (basicInfo.is_lyrics) completeness += 0.1;

    return Math.min(1, completeness);
  }

  static _assessAuthenticity(basicInfo, musicalCharacteristics) {
    // Authenticity assessment based on file characteristics
    let authenticity = 0.7;

    if (basicInfo.is_midi) authenticity += 0.2;
    if (musicalCharacteristics.genre_hints.length > 0) authenticity += 0.1;

    return Math.min(1, authenticity);
  }

  static _assessUsability(basicInfo) {
    let usability = 0.8;

    if (basicInfo.is_midi) usability += 0.2; // MIDI files are highly usable

    return Math.min(1, usability);
  }

  static _generateQualityIndicators(basicInfo, musicalCharacteristics) {
    return {
      format_support: basicInfo.is_midi ? 'high' : 'medium',
      playback_compatibility: 'good',
      analysis_readiness: musicalCharacteristics.tempo_indicators ? 'ready' : 'needs_processing'
    };
  }

  static _generateContextualExtensions(enhancedMetadata) {
    const extensions = [];

    if (enhancedMetadata.historical_significance.score > 0.7) {
      extensions.push({
        type: 'historical_context',
        content: 'Add era-specific performance notes and cultural background'
      });
    }

    if (enhancedMetadata.cultural_relevance.score > 0.6) {
      extensions.push({
        type: 'cultural_analysis',
        content: 'Include cultural impact assessment and social context'
      });
    }

    return extensions;
  }

  static _generateQualityBasedSuggestions(qualityAnalysis) {
    const suggestions = [];

    if (qualityAnalysis.completeness_score < 0.7) {
      suggestions.push('Consider supplementing with additional metadata');
    }

    if (qualityAnalysis.authenticity_score < 0.8) {
      suggestions.push('Verify source authenticity and provenance');
    }

    return suggestions;
  }

  static _suggestResearchApplications(enhancedMetadata) {
    const applications = ['music_history', 'cultural_studies'];

    if (enhancedMetadata.research_value.score > 0.8) {
      applications.push('ethnomusicology', 'sociology');
    }

    return applications;
  }

  static _assessEducationalValue(enhancedMetadata) {
    let value = 0.6;

    if (enhancedMetadata.historical_significance.score > 0.7) value += 0.2;
    if (enhancedMetadata.cultural_relevance.score > 0.6) value += 0.2;

    return {
      score: Math.min(1, value),
      educational_levels: ['undergraduate', 'graduate', 'research'],
      teaching_applications: ['music_history', 'cultural_studies', 'music_theory']
    };
  }

  static _assessCommercialPotential(enhancedMetadata, qualityAnalysis) {
    let potential = 0.4;

    if (qualityAnalysis.overall_quality > 0.8) potential += 0.3;
    if (enhancedMetadata.cultural_relevance.score > 0.7) potential += 0.3;

    return {
      score: Math.min(1, potential),
      commercial_applications: ['media_licensing', 'educational_content', 'research_publications']
    };
  }

  static _getTechContext(year) {
    if (!year) return 'unknown';

    if (year < 1960) return 'analog_recording';
    if (year < 1980) return 'magnetic_tape';
    if (year < 2000) return 'digital_early';
    if (year < 2010) return 'digital_mature';
    return 'digital_modern';
  }

  static _getStylisticInfluences(year) {
    if (!year) return [];

    const influences = [];

    if (year >= 1950 && year < 1960) influences.push('rock_n_roll', 'doo_wop');
    if (year >= 1960 && year < 1970) influences.push('british_invasion', 'psychedelia');
    if (year >= 1970 && year < 1980) influences.push('disco', 'prog_rock');
    if (year >= 1980 && year < 1990) influences.push('new_wave', 'hip_hop');
    if (year >= 1990 && year < 2000) influences.push('grunge', 'boy_bands');
    if (year >= 2000 && year < 2010) influences.push('pop_punk', 'electronic');
    if (year >= 2010) influences.push('social_media', 'streaming');

    return influences;
  }

  /**
   * Process batch of bimmuda files
   */
  static processBatch(files, options = {}) {
    return files.map((file, index) => {
      return this.processFile(file, {
        ...options,
        id: file.id || `bimmuda_file_${index}`
      });
    });
  }
}