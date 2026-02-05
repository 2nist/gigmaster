import fs from 'fs';
import path from 'path';

/**
 * Processor for "When in Rome" Classical dataset
 * Provides analysis and metadata extraction for classical music pieces
 */
export default class WhenInRomeProcessor {
  /**
   * Process a When in Rome classical music file
   * @param {Object} fileData - Raw file data
   * @param {Object} options - Processing options
   * @returns {Object} Processed classical data with analysis
   */
  static processFile(fileData, options = {}) {
    const {
      id = this._generateFileId(fileData),
      name = 'Unnamed Classical Piece'
    } = options;

    // Extract basic file information
    const basicInfo = this._extractBasicInfo(fileData);

    // Analyze composer and work context
    const composerContext = this._analyzeComposerContext(fileData);
    const workContext = this._analyzeWorkContext(fileData);

    // Analyze musical characteristics
    const musicalCharacteristics = this._analyzeMusicalCharacteristics(fileData);

    // Determine period and style
    const periodAnalysis = this._determinePeriodAndStyle(composerContext, workContext);

    // ENHANCEMENT 1: Extract enhanced metadata for better classical analysis
    const enhancedMetadata = this._extractEnhancedMetadata(basicInfo, composerContext, workContext, musicalCharacteristics);

    // ENHANCEMENT 2: Quality testing for better classical piece selection
    const qualityAnalysis = this._analyzeQuality(basicInfo, musicalCharacteristics, periodAnalysis);

    // ENHANCEMENT 3: Extend data based on metadata and quality analysis
    const extendedData = this._extendData(basicInfo, enhancedMetadata, qualityAnalysis);

    return {
      // Basic fields
      id,
      name,
      file_path: fileData.filePath,
      composer: composerContext.composer,
      work_title: workContext.title,
      opus_number: workContext.opus,

      // Enhanced analysis
      basic_info: basicInfo,
      composer_context: composerContext,
      work_context: workContext,
      musical_characteristics: musicalCharacteristics,
      period_analysis: periodAnalysis,

      // ENHANCEMENT 1: Enhanced metadata for classical analysis
      enhanced_metadata: enhancedMetadata,

      // ENHANCEMENT 2: Quality analysis
      quality_analysis: qualityAnalysis,

      // ENHANCEMENT 3: Extended data
      extended_data: extendedData,

      // Metadata
      source: 'when_in_rome_classical',
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
    return `wir_${Math.abs(hash)}`;
  }

  /**
   * Extract basic file information
   */
  static _extractBasicInfo(fileData) {
    const filePath = fileData.filePath || '';
    const fileName = path.basename(filePath);

    // Parse filename pattern for classical works
    const patterns = [
      /(.+)_(.+)_(.+)\.jcrd\.json/, // composer_work_description.jcrd.json
      /(.+)_(.+)\.jcrd\.json/, // composer_work.jcrd.json
      /(.+)\.jcrd\.json/ // fallback
    ];

    let parsed = { composer: 'Unknown', work: fileName, description: '' };

    for (const pattern of patterns) {
      const match = fileName.match(pattern);
      if (match) {
        if (match.length === 4) {
          parsed = {
            composer: match[1].replace(/_/g, ' '),
            work: match[2].replace(/_/g, ' '),
            description: match[3].replace(/_/g, ' ')
          };
        } else if (match.length === 3) {
          parsed = {
            composer: match[1].replace(/_/g, ' '),
            work: match[2].replace(/_/g, ' '),
            description: ''
          };
        }
        break;
      }
    }

    return {
      file_name: fileName,
      file_size: fileData.size || 0,
      format: 'jcrd_json',
      parsed_composer: parsed.composer,
      parsed_work: parsed.work,
      parsed_description: parsed.description,
      is_variation: parsed.work.toLowerCase().includes('variation'),
      is_sonata: parsed.work.toLowerCase().includes('sonata') || parsed.work.toLowerCase().includes('sonate'),
      is_quartet: parsed.work.toLowerCase().includes('quartet'),
      is_concerto: parsed.work.toLowerCase().includes('concerto') || parsed.work.toLowerCase().includes('concerto'),
      has_opus: parsed.work.toLowerCase().includes('op') || parsed.work.toLowerCase().includes('opus')
    };
  }

  /**
   * Analyze composer context
   */
  static _analyzeComposerContext(fileData) {
    const basicInfo = this._extractBasicInfo(fileData);
    const composerName = basicInfo.parsed_composer;

    // Composer database with periods and styles
    const composerData = {
      'Wolfgang Amadeus Mozart': {
        period: 'Classical',
        lifespan: '1756-1791',
        nationality: 'Austrian',
        style: 'Classical',
        key_works: ['Symphonies', 'Operas', 'Concertos', 'Chamber Music'],
        innovations: ['Opera reform', 'Piano concertos']
      },
      'Ludwig van Beethoven': {
        period: 'Classical/Romantic',
        lifespan: '1770-1827',
        nationality: 'German',
        style: 'Transitional',
        key_works: ['Symphonies', 'Piano Sonatas', 'String Quartets'],
        innovations: ['Program music', 'Large orchestra']
      },
      'Johann Sebastian Bach': {
        period: 'Baroque',
        lifespan: '1685-1750',
        nationality: 'German',
        style: 'Baroque',
        key_works: ['Brandenburg Concertos', 'Well-Tempered Clavier', 'Cantatas'],
        innovations: ['Counterpoint', 'Tempered tuning']
      },
      'Franz Schubert': {
        period: 'Romantic',
        lifespan: '1797-1828',
        nationality: 'Austrian',
        style: 'Early Romantic',
        key_works: ['Lieder', 'Symphonies', 'Chamber Music'],
        innovations: ['Art song', 'Piano duets']
      },
      'Johannes Brahms': {
        period: 'Romantic',
        lifespan: '1833-1897',
        nationality: 'German',
        style: 'Late Romantic',
        key_works: ['Symphonies', 'Concertos', 'Chamber Music'],
        innovations: ['Symphonic tradition', 'Academic style']
      }
      // Add more composers as needed
    };

    const composer = composerData[composerName] || {
      period: 'Unknown',
      lifespan: 'Unknown',
      nationality: 'Unknown',
      style: 'Unknown',
      key_works: [],
      innovations: []
    };

    return {
      composer: composerName,
      full_name: composerName,
      period: composer.period,
      lifespan: composer.lifespan,
      nationality: composer.nationality,
      style: composer.style,
      key_works: composer.key_works,
      innovations: composer.innovations,
      historical_significance: this._assessComposerSignificance(composerName),
      contemporary_influence: this._assessContemporaryInfluence(composerName)
    };
  }

  /**
   * Analyze work context
   */
  static _analyzeWorkContext(fileData) {
    const basicInfo = this._extractBasicInfo(fileData);
    const workTitle = basicInfo.parsed_work;

    // Extract opus number
    const opusMatch = workTitle.match(/(?:Op\.?|Opus)\s*(\d+)(?:\s*No\.?\s*(\d+))?/i);
    const opus = opusMatch ? {
      number: parseInt(opusMatch[1]),
      subnumber: opusMatch[2] ? parseInt(opusMatch[2]) : null
    } : null;

    // Determine work type
    const workType = this._determineWorkType(workTitle);

    // Extract movement information
    const movement = this._extractMovementInfo(workTitle);

    return {
      title: workTitle,
      opus: opus,
      work_type: workType,
      movement: movement,
      genre: this._determineGenre(workType),
      instrumentation: this._determineInstrumentation(workType),
      difficulty_level: this._assessDifficulty(workType, workTitle),
      performance_duration: this._estimateDuration(workType, movement)
    };
  }

  /**
   * Analyze musical characteristics
   */
  static _analyzeMusicalCharacteristics(fileData) {
    const workContext = this._analyzeWorkContext(fileData);

    return {
      key_signature: this._extractKeySignature(fileData),
      time_signature: this._extractTimeSignature(fileData),
      tempo_indications: this._extractTempoIndications(workContext),
      harmonic_complexity: this._assessHarmonicComplexity(workContext),
      contrapuntal_density: this._assessContrapuntalDensity(workContext),
      emotional_character: this._determineEmotionalCharacter(workContext),
      structural_complexity: this._assessStructuralComplexity(workContext)
    };
  }

  /**
   * Determine period and style
   */
  static _determinePeriodAndStyle(composerContext, workContext) {
    const composerPeriod = composerContext.period;
    const workType = workContext.work_type;

    // Period determination logic
    const periodMap = {
      'Baroque': {
        years: '1600-1750',
        characteristics: ['Counterpoint', 'Terraced dynamics', 'Basso continuo'],
        key_composers: ['Bach', 'Handel', 'Vivaldi']
      },
      'Classical': {
        years: '1750-1820',
        characteristics: ['Clear structure', 'Balanced phrases', 'Homophonic texture'],
        key_composers: ['Haydn', 'Mozart', 'Beethoven']
      },
      'Romantic': {
        years: '1820-1900',
        characteristics: ['Emotional expression', 'Large orchestra', 'Program music'],
        key_composers: ['Schubert', 'Brahms', 'Wagner']
      }
    };

    const period = periodMap[composerPeriod] || periodMap['Classical'];

    return {
      musical_period: composerPeriod,
      style_characteristics: period.characteristics,
      period_years: period.years,
      key_composers: period.key_composers,
      work_style_fit: this._assessStyleFit(composerPeriod, workType),
      evolution_stage: this._determineEvolutionStage(composerContext, workContext)
    };
  }

  // ===== ENHANCEMENT 1: Enhanced Metadata Extraction Methods =====

  /**
   * Extract enhanced metadata for better classical analysis
   */
  static _extractEnhancedMetadata(basicInfo, composerContext, workContext, musicalCharacteristics) {
    const performanceContext = this._analyzePerformanceContext(composerContext, workContext);
    const educationalValue = this._analyzeEducationalValue(composerContext, workContext, musicalCharacteristics);
    const historicalContext = this._analyzeHistoricalContext(composerContext, workContext);

    return {
      performance_context: performanceContext,
      educational_value: educationalValue,
      historical_context: historicalContext,
      analytical_depth: this._analyzeAnalyticalDepth(workContext, musicalCharacteristics),
      cultural_significance: this._assessCulturalSignificance(composerContext, workContext),
      interpretive_traditions: this._analyzeInterpretiveTraditions(composerContext, workContext)
    };
  }

  // ===== ENHANCEMENT 2: Quality Analysis Methods =====

  /**
   * Analyze quality for better classical piece selection
   */
  static _analyzeQuality(basicInfo, musicalCharacteristics, periodAnalysis) {
    const musicalQuality = this._assessMusicalQuality(musicalCharacteristics);
    const historicalQuality = this._assessHistoricalQuality(periodAnalysis);
    const performanceQuality = this._assessPerformanceQuality(basicInfo, musicalCharacteristics);

    return {
      musical_quality: musicalQuality,
      historical_quality: historicalQuality,
      performance_quality: performanceQuality,
      overall_quality: (musicalQuality + historicalQuality + performanceQuality) / 3,
      quality_indicators: this._generateQualityIndicators(basicInfo, musicalCharacteristics, periodAnalysis)
    };
  }

  // ===== ENHANCEMENT 3: Data Extension Methods =====

  /**
   * Extend data based on metadata and quality analysis
   */
  static _extendData(basicInfo, enhancedMetadata, qualityAnalysis) {
    const pedagogicalExtensions = this._generatePedagogicalExtensions(enhancedMetadata);
    const performanceExtensions = this._generatePerformanceExtensions(enhancedMetadata, qualityAnalysis);
    const researchExtensions = this._generateResearchExtensions(enhancedMetadata);

    return {
      pedagogical_extensions: pedagogicalExtensions,
      performance_extensions: performanceExtensions,
      research_extensions: researchExtensions,
      commercial_applications: this._assessCommercialApplications(enhancedMetadata, qualityAnalysis),
      digital_preservation: this._assessDigitalPreservation(basicInfo, enhancedMetadata)
    };
  }

  // ===== Helper Methods =====

  static _assessComposerSignificance(composerName) {
    const significanceLevels = {
      'Wolfgang Amadeus Mozart': 'supreme',
      'Ludwig van Beethoven': 'supreme',
      'Johann Sebastian Bach': 'supreme',
      'Franz Schubert': 'major',
      'Johannes Brahms': 'major'
    };

    return significanceLevels[composerName] || 'minor';
  }

  static _assessContemporaryInfluence(composerName) {
    const influenceLevels = {
      'Wolfgang Amadeus Mozart': 'profound',
      'Ludwig van Beethoven': 'revolutionary',
      'Johann Sebastian Bach': 'foundational',
      'Franz Schubert': 'significant',
      'Johannes Brahms': 'substantial'
    };

    return influenceLevels[composerName] || 'limited';
  }

  static _determineWorkType(workTitle) {
    const title = workTitle.toLowerCase();

    if (title.includes('sonata') || title.includes('sonate')) return 'Sonata';
    if (title.includes('symphony') || title.includes('sinfonia')) return 'Symphony';
    if (title.includes('concerto') || title.includes('concerto')) return 'Concerto';
    if (title.includes('quartet')) return 'String Quartet';
    if (title.includes('trio')) return 'Trio';
    if (title.includes('prelude') || title.includes('präludium')) return 'Prelude';
    if (title.includes('fugue') || title.includes('fuge')) return 'Fugue';
    if (title.includes('variation')) return 'Variations';
    if (title.includes('lied') || title.includes('song')) return 'Lied';

    return 'Other';
  }

  static _extractMovementInfo(workTitle) {
    const title = workTitle.toLowerCase();

    if (title.includes('movement') || title.includes('satz')) {
      const movementMatch = title.match(/(?:movement|satz)\s*(\d+|[ivxlcdm]+)/i);
      if (movementMatch) {
        return {
          number: movementMatch[1],
          type: this._determineMovementType(movementMatch[1])
        };
      }
    }

    return null;
  }

  static _determineMovementType(movementNumber) {
    const num = typeof movementNumber === 'string' ? movementNumber.toLowerCase() : movementNumber;

    if (num === '1' || num === 'i') return 'opening';
    if (num === '2' || num === 'ii') return 'slow';
    if (num === '3' || num === 'iii') return 'minuet_scherzo';
    if (num === '4' || num === 'iv') return 'finale';

    return 'other';
  }

  static _determineGenre(workType) {
    const genreMap = {
      'Sonata': 'Chamber Music',
      'Symphony': 'Orchestral',
      'Concerto': 'Concerto',
      'String Quartet': 'Chamber Music',
      'Trio': 'Chamber Music',
      'Prelude': 'Keyboard',
      'Fugue': 'Keyboard',
      'Variations': 'Variations',
      'Lied': 'Vocal'
    };

    return genreMap[workType] || 'Classical';
  }

  static _determineInstrumentation(workType) {
    const instrumentMap = {
      'Sonata': ['Piano', 'Violin'],
      'Symphony': ['Full Orchestra'],
      'Concerto': ['Soloist', 'Orchestra'],
      'String Quartet': ['2 Violins', 'Viola', 'Cello'],
      'Trio': ['Piano', 'Violin', 'Cello'],
      'Prelude': ['Piano/Organ'],
      'Fugue': ['Piano/Organ'],
      'Variations': ['Piano', 'Orchestra'],
      'Lied': ['Voice', 'Piano']
    };

    return instrumentMap[workType] || ['Unknown'];
  }

  static _assessDifficulty(workType, workTitle) {
    let difficulty = 'intermediate';

    if (workType === 'Symphony') difficulty = 'advanced';
    if (workType === 'Concerto') difficulty = 'advanced';
    if (workTitle.toLowerCase().includes('beethoven')) difficulty = 'advanced';
    if (workTitle.toLowerCase().includes('bach')) difficulty = 'advanced';

    return difficulty;
  }

  static _estimateDuration(workType, movement) {
    const baseDurations = {
      'Sonata': 20,
      'Symphony': 30,
      'Concerto': 25,
      'String Quartet': 25,
      'Trio': 20,
      'Prelude': 5,
      'Fugue': 8,
      'Variations': 15,
      'Lied': 3
    };

    let duration = baseDurations[workType] || 15;

    // Adjust for movement
    if (movement) {
      if (movement.type === 'slow') duration *= 0.8;
      if (movement.type === 'finale') duration *= 1.2;
    }

    return duration;
  }

  static _extractKeySignature(fileData) {
    // Would need actual music analysis - placeholder
    return { key: 'C Major', confidence: 0.5 };
  }

  static _extractTimeSignature(fileData) {
    // Would need actual music analysis - placeholder
    return { time: '4/4', confidence: 0.5 };
  }

  static _extractTempoIndications(workContext) {
    const indications = [];

    if (workContext.movement) {
      if (workContext.movement.type === 'slow') indications.push('Adagio', 'Largo');
      if (workContext.movement.type === 'opening') indications.push('Allegro', 'Moderato');
      if (workContext.movement.type === 'finale') indications.push('Presto', 'Allegro');
    }

    return indications.length > 0 ? indications : ['Moderato'];
  }

  static _assessHarmonicComplexity(workContext) {
    let complexity = 0.5;

    if (workContext.work_type === 'Fugue') complexity += 0.3;
    if (workContext.composer === 'Johann Sebastian Bach') complexity += 0.3;
    if (workContext.opus && workContext.opus.number > 100) complexity += 0.2;

    return Math.min(1, complexity);
  }

  static _assessContrapuntalDensity(workContext) {
    let density = 0.3;

    if (workContext.work_type === 'Fugue') density += 0.7;
    if (workContext.work_type === 'String Quartet') density += 0.3;
    if (workContext.composer === 'Johann Sebastian Bach') density += 0.4;

    return Math.min(1, density);
  }

  static _determineEmotionalCharacter(workContext) {
    const characters = {
      'slow_movement': 'contemplative',
      'finale': 'triumphant',
      'prelude': 'introductory',
      'fugue': 'intellectual',
      'variations': 'developmental'
    };

    if (workContext.movement) {
      return characters[workContext.movement.type] || 'balanced';
    }

    return 'balanced';
  }

  static _assessStructuralComplexity(workContext) {
    let complexity = 0.4;

    if (workContext.work_type === 'Symphony') complexity += 0.4;
    if (workContext.work_type === 'Concerto') complexity += 0.3;
    if (workContext.work_type === 'Fugue') complexity += 0.3;

    return Math.min(1, complexity);
  }

  static _assessStyleFit(period, workType) {
    // Assess how well the work fits its period's style
    let fit = 0.8; // Base fit

    if (period === 'Baroque' && workType === 'Fugue') fit += 0.1;
    if (period === 'Classical' && workType === 'Sonata') fit += 0.1;
    if (period === 'Romantic' && workType === 'Lied') fit += 0.1;

    return Math.min(1, fit);
  }

  static _determineEvolutionStage(composerContext, workContext) {
    if (!workContext.opus) return 'unknown';

    const opus = workContext.opus.number;
    const composer = composerContext.composer;

    if (composer === 'Wolfgang Amadeus Mozart') {
      if (opus < 10) return 'early';
      if (opus < 20) return 'middle';
      return 'late';
    }

    if (composer === 'Ludwig van Beethoven') {
      if (opus < 30) return 'early';
      if (opus < 70) return 'middle';
      return 'late';
    }

    return 'mature';
  }

  static _analyzePerformanceContext(composerContext, workContext) {
    return {
      venue_type: this._determineVenueType(workContext.work_type),
      ensemble_size: this._determineEnsembleSize(workContext.work_type),
      performance_duration: workContext.performance_duration,
      technical_demands: this._assessTechnicalDemands(workContext),
      interpretive_challenges: this._assessInterpretiveChallenges(composerContext, workContext)
    };
  }

  static _analyzeEducationalValue(composerContext, workContext, musicalCharacteristics) {
    return {
      teaching_levels: this._determineTeachingLevels(workContext.difficulty_level),
      pedagogical_applications: this._determinePedagogicalApplications(workContext.work_type),
      skill_development: this._assessSkillDevelopment(musicalCharacteristics),
      music_theory_value: this._assessMusicTheoryValue(workContext, musicalCharacteristics)
    };
  }

  static _analyzeHistoricalContext(composerContext, workContext) {
    return {
      composition_date: this._estimateCompositionDate(composerContext, workContext),
      historical_events: this._identifyHistoricalEvents(composerContext.lifespan),
      cultural_context: composerContext.nationality + ' ' + composerContext.period.toLowerCase(),
      influence_on_later_composers: this._assessInfluence(composerContext.composer),
      performance_traditions: this._analyzePerformanceTraditions(workContext.work_type)
    };
  }

  static _analyzeAnalyticalDepth(workContext, musicalCharacteristics) {
    return {
      harmonic_analysis: musicalCharacteristics.harmonic_complexity,
      formal_analysis: workContext.work_type === 'Sonata' ? 0.9 : 0.6,
      motivic_analysis: workContext.work_type === 'Variations' ? 0.8 : 0.5,
      stylistic_analysis: 0.7
    };
  }

  static _assessCulturalSignificance(composerContext, workContext) {
    let significance = 0.5;

    if (composerContext.historical_significance === 'supreme') significance += 0.4;
    if (workContext.work_type === 'Symphony' && composerContext.composer === 'Ludwig van Beethoven') significance += 0.3;
    if (workContext.work_type === 'String Quartet' && composerContext.composer === 'Ludwig van Beethoven') significance += 0.3;

    return Math.min(1, significance);
  }

  static _analyzeInterpretiveTraditions(composerContext, workContext) {
    return {
      established_interpretations: workContext.work_type === 'Symphony' ? 'multiple' : 'few',
      performance_practice: composerContext.period.toLowerCase() + '_practice',
      recording_traditions: composerContext.composer === 'Wolfgang Amadeus Mozart' ? 'extensive' : 'moderate',
      scholarly_consensus: 0.7
    };
  }

  static _assessMusicalQuality(musicalCharacteristics) {
    let quality = 0.7;

    if (musicalCharacteristics.harmonic_complexity > 0.6) quality += 0.2;
    if (musicalCharacteristics.contrapuntal_density > 0.5) quality += 0.2;

    return Math.min(1, quality);
  }

  static _assessHistoricalQuality(periodAnalysis) {
    let quality = 0.8;

    if (periodAnalysis.musical_period !== 'Unknown') quality += 0.1;
    if (periodAnalysis.work_style_fit > 0.8) quality += 0.1;

    return Math.min(1, quality);
  }

  static _assessPerformanceQuality(basicInfo, musicalCharacteristics) {
    let quality = 0.7;

    if (basicInfo.format === 'jcrd_json') quality += 0.2; // Structured format
    if (musicalCharacteristics.structural_complexity > 0.5) quality += 0.1;

    return Math.min(1, quality);
  }

  static _generateQualityIndicators(basicInfo, musicalCharacteristics, periodAnalysis) {
    return {
      scholarly_value: periodAnalysis.musical_period !== 'Unknown' ? 'high' : 'medium',
      performance_value: musicalCharacteristics.emotional_character !== 'balanced' ? 'high' : 'medium',
      educational_value: basicInfo.is_sonata ? 'high' : 'medium',
      preservation_status: 'digitized'
    };
  }

  static _generatePedagogicalExtensions(enhancedMetadata) {
    const extensions = [];

    if (enhancedMetadata.educational_value.skill_development > 0.7) {
      extensions.push({
        type: 'technique_study',
        applications: ['finger_independence', 'interpretation', 'analysis']
      });
    }

    if (enhancedMetadata.educational_value.music_theory_value > 0.6) {
      extensions.push({
        type: 'theory_instruction',
        applications: ['harmony', 'form', 'counterpoint']
      });
    }

    return extensions;
  }

  static _generatePerformanceExtensions(enhancedMetadata, qualityAnalysis) {
    const extensions = [];

    if (qualityAnalysis.performance_quality > 0.8) {
      extensions.push({
        type: 'concert_programming',
        venues: ['concert_halls', 'chamber_music_series', 'educational_recitals']
      });
    }

    if (enhancedMetadata.performance_context.technical_demands === 'advanced') {
      extensions.push({
        type: 'competition_material',
        level: 'professional'
      });
    }

    return extensions;
  }

  static _generateResearchExtensions(enhancedMetadata) {
    const extensions = [];

    if (enhancedMetadata.cultural_significance > 0.8) {
      extensions.push({
        type: 'musicological_research',
        areas: ['composer_studies', 'period_analysis', 'cultural_history']
      });
    }

    if (enhancedMetadata.historical_context.influence_on_later_composers === 'profound') {
      extensions.push({
        type: 'influence_studies',
        scope: 'comprehensive'
      });
    }

    return extensions;
  }

  static _assessCommercialApplications(enhancedMetadata, qualityAnalysis) {
    let commercial = 0.4;

    if (qualityAnalysis.overall_quality > 0.8) commercial += 0.3;
    if (enhancedMetadata.cultural_significance > 0.7) commercial += 0.3;

    return {
      score: Math.min(1, commercial),
      applications: ['recordings', 'sheet_music', 'educational_materials', 'media_licensing']
    };
  }

  static _assessDigitalPreservation(basicInfo, enhancedMetadata) {
    return {
      format_stability: basicInfo.format === 'jcrd_json' ? 'high' : 'medium',
      metadata_completeness: enhancedMetadata.historical_context.composition_date ? 'good' : 'partial',
      accessibility: 'high',
      long_term_viability: 'excellent'
    };
  }

  // Additional helper methods would be implemented...

  static _determineVenueType(workType) {
    const venues = {
      'Sonata': 'chamber_music_hall',
      'Symphony': 'concert_hall',
      'Concerto': 'concert_hall',
      'String Quartet': 'chamber_music_hall',
      'Trio': 'chamber_music_hall',
      'Prelude': 'recital_hall',
      'Fugue': 'recital_hall',
      'Variations': 'recital_hall',
      'Lied': 'song_recital'
    };
    return venues[workType] || 'concert_hall';
  }

  static _determineEnsembleSize(workType) {
    const sizes = {
      'Sonata': 'solo_duo',
      'Symphony': 'large_orchestra',
      'Concerto': 'orchestra_plus_soloist',
      'String Quartet': 'quartet',
      'Trio': 'trio',
      'Prelude': 'solo',
      'Fugue': 'solo',
      'Variations': 'solo_orchestra',
      'Lied': 'voice_piano'
    };
    return sizes[workType] || 'variable';
  }

  static _assessTechnicalDemands(workContext) {
    const difficulty = workContext.difficulty_level;
    return difficulty === 'advanced' ? 'high' : difficulty === 'intermediate' ? 'medium' : 'low';
  }

  static _assessInterpretiveChallenges(composerContext, workContext) {
    let challenges = 0.5;

    if (composerContext.style === 'Transitional') challenges += 0.3;
    if (workContext.work_type === 'Fugue') challenges += 0.3;

    return Math.min(1, challenges);
  }

  static _determineTeachingLevels(difficulty) {
    const levels = {
      'beginner': ['elementary'],
      'intermediate': ['high_school', 'undergraduate'],
      'advanced': ['graduate', 'professional']
    };
    return levels[difficulty] || ['general'];
  }

  static _determinePedagogicalApplications(workType) {
    const applications = {
      'Sonata': ['form_analysis', 'technique'],
      'Fugue': ['counterpoint', 'analysis'],
      'Variations': ['thematic_development', 'technique'],
      'String Quartet': ['ensemble_playing', 'intonation']
    };
    return applications[workType] || ['general_music_study'];
  }

  static _assessSkillDevelopment(musicalCharacteristics) {
    let development = 0.6;

    if (musicalCharacteristics.harmonic_complexity > 0.6) development += 0.2;
    if (musicalCharacteristics.contrapuntal_density > 0.5) development += 0.2;

    return Math.min(1, development);
  }

  static _assessMusicTheoryValue(workContext, musicalCharacteristics) {
    let value = 0.5;

    if (workContext.work_type === 'Fugue') value += 0.4;
    if (workContext.work_type === 'Sonata') value += 0.3;
    if (musicalCharacteristics.harmonic_complexity > 0.6) value += 0.2;

    return Math.min(1, value);
  }

  static _estimateCompositionDate(composerContext, workContext) {
    // Simplified estimation based on composer lifespan and opus number
    if (!composerContext.lifespan || !workContext.opus) return 'unknown';

    const lifespan = composerContext.lifespan;
    const [birth, death] = lifespan.split('-').map(y => parseInt(y));

    if (composerContext.composer === 'Wolfgang Amadeus Mozart') {
      // Mozart's works are roughly chronological by Köchel number
      // This is a very simplified estimation
      const estimatedYear = Math.min(death, birth + (workContext.opus.number / 10));
      return estimatedYear.toString();
    }

    return `${birth}-${death}`;
  }

  static _identifyHistoricalEvents(lifespan) {
    if (!lifespan || lifespan === 'Unknown') return [];

    const [birth, death] = lifespan.split('-').map(y => parseInt(y));
    const events = [];

    if (birth < 1800 && death > 1750) events.push('classical_period');
    if (birth < 1850 && death > 1800) events.push('romantic_period');
    if (birth < 1780 && death > 1720) events.push('enlightenment');

    return events;
  }

  static _assessInfluence(composer) {
    const influenceLevels = {
      'Wolfgang Amadeus Mozart': 'profound',
      'Ludwig van Beethoven': 'revolutionary',
      'Johann Sebastian Bach': 'foundational',
      'Franz Schubert': 'significant',
      'Johannes Brahms': 'substantial'
    };
    return influenceLevels[composer] || 'limited';
  }

  static _analyzePerformanceTraditions(workType) {
    const traditions = {
      'Sonata': 'established_interpretive_traditions',
      'Symphony': 'orchestral_performance_practice',
      'Concerto': 'soloist_orchestra_tradition',
      'String Quartet': 'chamber_music_tradition',
      'Fugue': 'scholarly_performance_practice'
    };
    return traditions[workType] || 'general_classical_tradition';
  }

  /**
   * Process batch of When in Rome files
   */
  static processBatch(files, options = {}) {
    return files.map((file, index) => {
      return this.processFile(file, {
        ...options,
        id: file.id || `wir_file_${index}`
      });
    });
  }
}