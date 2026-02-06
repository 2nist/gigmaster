import fs from 'fs';
import path from 'path';
import EGMDProcessor from '../src/music/preprocessing/EGMDProcessor.js';

/**
 * Analysis script for E-GMD dataset
 * Generates comprehensive reports on drum pattern collections
 */
class EGMDProcessorAnalyzer {
  constructor(datasetPath = './src/music/datasets/e-gmd') {
    this.datasetPath = datasetPath;
    this.results = {
      totalFiles: 0,
      processedFiles: 0,
      errors: [],
      genreStats: {},
      bpmStats: {},
      complexityStats: {
        low: 0,
        medium: 0,
        high: 0
      },
      patternTypes: {},
      qualityMetrics: {
        high: 0,
        medium: 0,
        low: 0
      },
      fileDetails: []
    };
  }

  /**
   * Run complete analysis
   */
  async analyze() {
    console.log('Starting E-GMD dataset analysis...');

    try {
      const files = await this.discoverFiles();
      console.log(`Found ${files.length} files to analyze`);

      this.results.totalFiles = files.length;

      for (const file of files) {
        try {
          const processed = await this.processFile(file);
          this.analyzeProcessedData(processed);
          this.results.processedFiles++;
        } catch (error) {
          console.error(`Error processing ${file.path}:`, error.message);
          this.results.errors.push({
            file: file.path,
            error: error.message
          });
        }
      }

      this.generateReport();
      console.log('Analysis complete!');

    } catch (error) {
      console.error('Analysis failed:', error);
      throw error;
    }
  }

  /**
   * Discover all MIDI files in the dataset
   */
  async discoverFiles() {
    const files = [];

    // Known genres from e-gmd dataset
    const genres = ['afrobeat', 'funk', 'hiphop', 'jazz', 'latin', 'rock', 'soul'];

    for (const genre of genres) {
      const genrePath = path.join(this.datasetPath, genre);

      if (!fs.existsSync(genrePath)) continue;

      const genreFiles = fs.readdirSync(genrePath);

      for (const bpmFolder of genreFiles) {
        const bpmPath = path.join(genrePath, bpmFolder);

        if (!fs.statSync(bpmPath).isDirectory()) continue;

        // Extract BPM range from folder name
        const bpmMatch = bpmFolder.match(/(\d+)_to_(\d+)/);
        if (!bpmMatch) continue;

        const minBpm = parseInt(bpmMatch[1]);
        const maxBpm = parseInt(bpmMatch[2]);

        const bpmFiles = fs.readdirSync(bpmPath);

        for (const fileName of bpmFiles) {
          if (fileName.endsWith('.mid') || fileName.endsWith('.midi')) {
            files.push({
              path: path.join(bpmPath, fileName),
              genre,
              minBpm,
              maxBpm,
              bpmRange: `${minBpm}-${maxBpm}`,
              fileName
            });
          }
        }
      }
    }

    return files;
  }

  /**
   * Process individual file
   */
  async processFile(fileInfo) {
    const fileData = {
      filePath: fileInfo.path,
      genre: fileInfo.genre,
      bpmRange: fileInfo.bpmRange,
      minBpm: fileInfo.minBpm,
      maxBpm: fileInfo.maxBpm,
      fileName: fileInfo.fileName
    };

    // Read file size
    try {
      const stats = fs.statSync(fileInfo.path);
      fileData.size = stats.size;
    } catch (error) {
      fileData.size = 0;
    }

    return EGMDProcessor.processFile(fileData);
  }

  /**
   * Analyze processed data
   */
  analyzeProcessedData(processed) {
    // Genre statistics
    const genre = processed.enhanced_metadata?.genre_classification?.primary_genre || processed.genre || 'unknown';
    this.results.genreStats[genre] = (this.results.genreStats[genre] || 0) + 1;

    // BPM statistics
    const bpmRange = processed.enhanced_metadata?.bpm_analysis?.bpm_range || processed.bpmRange || 'unknown';
    this.results.bpmStats[bpmRange] = (this.results.bpmStats[bpmRange] || 0) + 1;

    // Complexity statistics
    const complexity = processed.enhanced_metadata?.rhythmic_analysis?.complexity_level || 'medium';
    this.results.complexityStats[complexity]++;

    // Pattern types
    const patternType = processed.enhanced_metadata?.pattern_analysis?.pattern_type || 'standard';
    this.results.patternTypes[patternType] = (this.results.patternTypes[patternType] || 0) + 1;

    // Quality metrics
    const quality = processed.quality_analysis?.overall_quality || 0;
    if (quality >= 0.8) this.results.qualityMetrics.high++;
    else if (quality >= 0.6) this.results.qualityMetrics.medium++;
    else this.results.qualityMetrics.low++;

    // Store file details
    this.results.fileDetails.push({
      id: processed.id,
      genre,
      bpmRange,
      complexity,
      patternType,
      quality,
      rhythmicDensity: processed.enhanced_metadata?.rhythmic_analysis?.density || 0,
      syncopation: processed.enhanced_metadata?.rhythmic_analysis?.syncopation_level || 0
    });
  }

  /**
   * Generate comprehensive report
   */
  generateReport() {
    const report = {
      analysis_summary: {
        total_files: this.results.totalFiles,
        processed_files: this.results.processedFiles,
        error_count: this.results.errors.length,
        success_rate: (this.results.processedFiles / this.results.totalFiles * 100).toFixed(2) + '%'
      },
      genre_distribution: this.sortObject(this.results.genreStats),
      bpm_distribution: this.sortObject(this.results.bpmStats),
      complexity_distribution: this.results.complexityStats,
      pattern_type_distribution: this.sortObject(this.results.patternTypes),
      quality_distribution: this.results.qualityMetrics,
      genre_bpm_matrix: this.analyzeGenreBpmMatrix(),
      rhythmic_insights: this.analyzeRhythmicInsights(),
      quality_insights: this.analyzeQualityInsights(),
      tempo_analysis: this.analyzeTempoPatterns(),
      recommendations: this.generateRecommendations(),
      errors: this.results.errors.slice(0, 10) // First 10 errors
    };

    // Write report to file
    const reportPath = path.join(process.cwd(), 'egmd_analysis_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`Report generated: ${reportPath}`);

    // Generate summary text
    this.generateSummaryText(report);
  }

  /**
   * Analyze genre-BPM matrix
   */
  analyzeGenreBpmMatrix() {
    const matrix = {};

    this.results.fileDetails.forEach(file => {
      if (!matrix[file.genre]) {
        matrix[file.genre] = {};
      }
      matrix[file.genre][file.bpmRange] = (matrix[file.genre][file.bpmRange] || 0) + 1;
    });

    // Calculate percentages for each genre
    Object.keys(matrix).forEach(genre => {
      const genreTotal = Object.values(matrix[genre]).reduce((a, b) => a + b, 0);
      Object.keys(matrix[genre]).forEach(bpmRange => {
        matrix[genre][bpmRange] = {
          count: matrix[genre][bpmRange],
          percentage: (matrix[genre][bpmRange] / genreTotal * 100).toFixed(1) + '%'
        };
      });
    });

    return matrix;
  }

  /**
   * Analyze rhythmic insights
   */
  analyzeRhythmicInsights() {
    const avgDensity = this.results.fileDetails.reduce((sum, f) => sum + f.rhythmicDensity, 0) / this.results.fileDetails.length;
    const avgSyncopation = this.results.fileDetails.reduce((sum, f) => sum + f.syncopation, 0) / this.results.fileDetails.length;

    const densityByGenre = {};
    const syncopationByGenre = {};

    this.results.fileDetails.forEach(file => {
      if (!densityByGenre[file.genre]) densityByGenre[file.genre] = [];
      if (!syncopationByGenre[file.genre]) syncopationByGenre[file.genre] = [];

      densityByGenre[file.genre].push(file.rhythmicDensity);
      syncopationByGenre[file.genre].push(file.syncopation);
    });

    const avgDensityByGenre = {};
    const avgSyncopationByGenre = {};

    Object.entries(densityByGenre).forEach(([genre, densities]) => {
      avgDensityByGenre[genre] = (densities.reduce((a, b) => a + b, 0) / densities.length).toFixed(3);
    });

    Object.entries(syncopationByGenre).forEach(([genre, syncopations]) => {
      avgSyncopationByGenre[genre] = (syncopations.reduce((a, b) => a + b, 0) / syncopations.length).toFixed(3);
    });

    return {
      average_density: avgDensity.toFixed(3),
      average_syncopation: avgSyncopation.toFixed(3),
      density_by_genre: this.sortObject(avgDensityByGenre),
      syncopation_by_genre: this.sortObject(avgSyncopationByGenre),
      most_complex_genre: Object.entries(avgDensityByGenre).reduce((a, b) =>
        parseFloat(avgDensityByGenre[a[0]]) > parseFloat(avgDensityByGenre[b[0]]) ? a : b
      )[0]
    };
  }

  /**
   * Analyze quality insights
   */
  analyzeQualityInsights() {
    const avgQuality = this.results.fileDetails.reduce((sum, f) => sum + f.quality, 0) / this.results.fileDetails.length;

    const qualityByGenre = {};
    const qualityByComplexity = {};

    this.results.fileDetails.forEach(file => {
      if (!qualityByGenre[file.genre]) qualityByGenre[file.genre] = [];
      if (!qualityByComplexity[file.complexity]) qualityByComplexity[file.complexity] = [];

      qualityByGenre[file.genre].push(file.quality);
      qualityByComplexity[file.complexity].push(file.quality);
    });

    const avgQualityByGenre = {};
    const avgQualityByComplexity = {};

    Object.entries(qualityByGenre).forEach(([genre, qualities]) => {
      avgQualityByGenre[genre] = (qualities.reduce((a, b) => a + b, 0) / qualities.length).toFixed(3);
    });

    Object.entries(qualityByComplexity).forEach(([complexity, qualities]) => {
      avgQualityByComplexity[complexity] = (qualities.reduce((a, b) => a + b, 0) / qualities.length).toFixed(3);
    });

    return {
      average_quality: avgQuality.toFixed(3),
      quality_distribution: this.results.qualityMetrics,
      quality_by_genre: this.sortObject(avgQualityByGenre),
      quality_by_complexity: this.sortObject(avgQualityByComplexity),
      high_quality_percentage: (this.results.qualityMetrics.high / this.results.processedFiles * 100).toFixed(2) + '%'
    };
  }

  /**
   * Analyze tempo patterns
   */
  analyzeTempoPatterns() {
    const tempoRanges = {
      'slow': ['60-80', '70-90', '80-100'],
      'medium': ['90-110', '100-120', '110-130'],
      'fast': ['120-140', '130-150', '140-160', '150-170']
    };

    const tempoStats = { slow: 0, medium: 0, fast: 0 };

    Object.entries(this.results.bpmStats).forEach(([range, count]) => {
      if (tempoRanges.slow.includes(range)) tempoStats.slow += count;
      else if (tempoRanges.medium.includes(range)) tempoStats.medium += count;
      else if (tempoRanges.fast.includes(range)) tempoStats.fast += count;
    });

    return {
      tempo_distribution: tempoStats,
      most_common_tempo: Object.entries(tempoStats).reduce((a, b) => tempoStats[a[0]] > tempoStats[b[0]] ? a : b)[0],
      tempo_coverage: Object.values(tempoStats).reduce((a, b) => a + b, 0)
    };
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    // Genre balance recommendations
    const genreCounts = Object.values(this.results.genreStats);
    const avgGenreCount = genreCounts.reduce((a, b) => a + b, 0) / genreCounts.length;
    const imbalancedGenres = Object.entries(this.results.genreStats)
      .filter(([genre, count]) => count < avgGenreCount * 0.5);

    if (imbalancedGenres.length > 0) {
      recommendations.push({
        type: 'genre_expansion',
        message: `Expand underrepresented genres: ${imbalancedGenres.map(([g, c]) => `${g} (${c})`).join(', ')}`
      });
    }

    // BPM coverage recommendations
    const bpmRanges = Object.keys(this.results.bpmStats);
    const missingRanges = ['60-80', '160-180', '180-200'].filter(range => !bpmRanges.includes(range));

    if (missingRanges.length > 0) {
      recommendations.push({
        type: 'tempo_expansion',
        message: `Add patterns for missing BPM ranges: ${missingRanges.join(', ')}`
      });
    }

    // Complexity balance recommendations
    const complexityRatio = this.results.complexityStats.high / this.results.processedFiles;
    if (complexityRatio < 0.1) {
      recommendations.push({
        type: 'complexity_expansion',
        message: `Only ${(complexityRatio*100).toFixed(1)}% high complexity patterns. Consider adding more intricate rhythms.`
      });
    }

    // Quality improvement recommendations
    const lowQualityPct = this.results.qualityMetrics.low / this.results.processedFiles;
    if (lowQualityPct > 0.15) {
      recommendations.push({
        type: 'quality_filtering',
        message: `${(lowQualityPct*100).toFixed(1)}% low quality patterns. Consider quality assessment and filtering.`
      });
    }

    return recommendations;
  }

  /**
   * Generate summary text report
   */
  generateSummaryText(report) {
    const summary = `
E-GMD DATASET ANALYSIS REPORT
=============================

OVERVIEW
--------
Total Files: ${report.analysis_summary.total_files}
Processed: ${report.analysis_summary.processed_files}
Success Rate: ${report.analysis_summary.success_rate}
Errors: ${report.analysis_summary.error_count}

GENRE DISTRIBUTION
------------------
${Object.entries(report.genre_distribution).map(([genre, count]) =>
  `${genre}: ${count} (${(count/report.analysis_summary.processed_files*100).toFixed(1)}%)`
).join('\n')}

BPM DISTRIBUTION
----------------
${Object.entries(report.bpm_distribution).map(([bpm, count]) =>
  `${bpm} BPM: ${count} (${(count/report.analysis_summary.processed_files*100).toFixed(1)}%)`
).join('\n')}

COMPLEXITY DISTRIBUTION
-----------------------
Low: ${report.complexity_distribution.low} (${(report.complexity_distribution.low/report.analysis_summary.processed_files*100).toFixed(1)}%)
Medium: ${report.complexity_distribution.medium} (${(report.complexity_distribution.medium/report.analysis_summary.processed_files*100).toFixed(1)}%)
High: ${report.complexity_distribution.high} (${(report.complexity_distribution.high/report.analysis_summary.processed_files*100).toFixed(1)}%)

PATTERN TYPES
-------------
${Object.entries(report.pattern_type_distribution).map(([type, count]) =>
  `${type}: ${count} (${(count/report.analysis_summary.processed_files*100).toFixed(1)}%)`
).join('\n')}

QUALITY METRICS
---------------
High Quality: ${report.quality_distribution.high} (${(report.quality_distribution.high/report.analysis_summary.processed_files*100).toFixed(1)}%)
Medium Quality: ${report.quality_distribution.medium} (${(report.quality_distribution.medium/report.analysis_summary.processed_files*100).toFixed(1)}%)
Low Quality: ${report.quality_distribution.low} (${(report.quality_distribution.low/report.analysis_summary.processed_files*100).toFixed(1)}%)

RHYTHMIC INSIGHTS
-----------------
Average Density: ${report.rhythmic_insights.average_density}
Average Syncopation: ${report.rhythmic_insights.average_syncopation}
Most Complex Genre: ${report.rhythmic_insights.most_complex_genre}

TEMPO ANALYSIS
--------------
Most Common Tempo: ${report.tempo_analysis.most_common_tempo}
Tempo Coverage: ${report.tempo_analysis.tempo_coverage} patterns

RECOMMENDATIONS
---------------
${report.recommendations.map(rec => `- ${rec.message}`).join('\n')}

Generated: ${new Date().toISOString()}
`;

    const summaryPath = path.join(process.cwd(), 'egmd_analysis_summary.txt');
    fs.writeFileSync(summaryPath, summary);
    console.log(`Summary generated: ${summaryPath}`);
  }

  /**
   * Sort object by values
   */
  sortObject(obj) {
    return Object.fromEntries(
      Object.entries(obj).sort((a, b) => b[1] - a[1])
    );
  }
}

// Run analysis directly
console.log('Running EGMD analysis...');
const analyzer = new EGMDProcessorAnalyzer();
analyzer.analyze().catch(console.error);

export default EGMDProcessorAnalyzer;