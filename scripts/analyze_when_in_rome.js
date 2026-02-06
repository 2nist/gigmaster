import fs from 'fs';
import path from 'path';
import WhenInRomeProcessor from '../src/music/preprocessing/WhenInRomeProcessor.js';

/**
 * Analysis script for When in Rome Classical dataset
 * Generates comprehensive reports on classical music pieces
 */
class WhenInRomeAnalyzer {
  constructor(datasetPath = './src/music/datasets/When in Rome Classical-curated') {
    this.datasetPath = datasetPath;
    this.results = {
      totalFiles: 0,
      processedFiles: 0,
      errors: [],
      composerStats: {},
      periodStats: {},
      workTypeStats: {},
      difficultyStats: {},
      qualityMetrics: {
        high: 0,
        medium: 0,
        low: 0
      },
      culturalSignificance: {
        supreme: 0,
        major: 0,
        minor: 0
      },
      fileDetails: []
    };
  }

  /**
   * Run complete analysis
   */
  async analyze() {
    console.log('Starting When in Rome Classical dataset analysis...');

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
   * Discover all JSON files in the dataset
   */
  async discoverFiles() {
    const files = [];

    if (!fs.existsSync(this.datasetPath)) {
      throw new Error(`Dataset path does not exist: ${this.datasetPath}`);
    }

    const datasetFiles = fs.readdirSync(this.datasetPath);

    for (const fileName of datasetFiles) {
      if (fileName.endsWith('.jcrd.json')) {
        const filePath = path.join(this.datasetPath, fileName);
        files.push({
          path: filePath,
          fileName
        });
      }
    }

    return files;
  }

  /**
   * Process individual file
   */
  async processFile(fileInfo) {
    // Read JSON file
    const fileContent = fs.readFileSync(fileInfo.path, 'utf8');
    const jsonData = JSON.parse(fileContent);

    const fileData = {
      filePath: fileInfo.path,
      fileName: fileInfo.fileName,
      ...jsonData
    };

    // Get file size
    try {
      const stats = fs.statSync(fileInfo.path);
      fileData.size = stats.size;
    } catch (error) {
      fileData.size = 0;
    }

    return WhenInRomeProcessor.processFile(fileData);
  }

  /**
   * Analyze processed data
   */
  analyzeProcessedData(processed) {
    // Composer statistics
    const composer = processed.composer_context?.composer || 'Unknown';
    this.results.composerStats[composer] = (this.results.composerStats[composer] || 0) + 1;

    // Period statistics
    const period = processed.composer_context?.period || 'Unknown';
    this.results.periodStats[period] = (this.results.periodStats[period] || 0) + 1;

    // Work type statistics
    const workType = processed.work_context?.work_type || 'Unknown';
    this.results.workTypeStats[workType] = (this.results.workTypeStats[workType] || 0) + 1;

    // Difficulty statistics
    const difficulty = processed.work_context?.difficulty_level || 'unknown';
    this.results.difficultyStats[difficulty] = (this.results.difficultyStats[difficulty] || 0) + 1;

    // Quality metrics
    const quality = processed.quality_analysis?.overall_quality || 0;
    if (quality >= 0.8) this.results.qualityMetrics.high++;
    else if (quality >= 0.6) this.results.qualityMetrics.medium++;
    else this.results.qualityMetrics.low++;

    // Cultural significance
    const significance = processed.enhanced_metadata?.cultural_significance || 'minor';
    if (significance >= 0.9) this.results.culturalSignificance.supreme++;
    else if (significance >= 0.7) this.results.culturalSignificance.major++;
    else this.results.culturalSignificance.minor++;

    // Store file details
    this.results.fileDetails.push({
      id: processed.id,
      composer,
      period,
      workType,
      difficulty,
      quality,
      culturalSignificance: significance,
      educationalValue: processed.enhanced_metadata?.educational_value?.skill_development || 0,
      performanceDuration: processed.work_context?.performance_duration || 0
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
      composer_distribution: this.sortObject(this.results.composerStats),
      period_distribution: this.sortObject(this.results.periodStats),
      work_type_distribution: this.sortObject(this.results.workTypeStats),
      difficulty_distribution: this.sortObject(this.results.difficultyStats),
      quality_distribution: this.results.qualityMetrics,
      cultural_significance: this.results.culturalSignificance,
      composer_period_matrix: this.analyzeComposerPeriodMatrix(),
      educational_insights: this.analyzeEducationalInsights(),
      performance_insights: this.analyzePerformanceInsights(),
      quality_insights: this.analyzeQualityInsights(),
      historical_analysis: this.analyzeHistoricalContext(),
      recommendations: this.generateRecommendations(),
      errors: this.results.errors.slice(0, 10) // First 10 errors
    };

    // Write report to file
    const reportPath = path.join(process.cwd(), 'when_in_rome_analysis_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`Report generated: ${reportPath}`);

    // Generate summary text
    this.generateSummaryText(report);
  }

  /**
   * Analyze composer-period matrix
   */
  analyzeComposerPeriodMatrix() {
    const matrix = {};

    this.results.fileDetails.forEach(file => {
      if (!matrix[file.composer]) {
        matrix[file.composer] = {};
      }
      matrix[file.composer][file.period] = (matrix[file.composer][file.period] || 0) + 1;
    });

    return matrix;
  }

  /**
   * Analyze educational insights
   */
  analyzeEducationalInsights() {
    const avgEducationalValue = this.results.fileDetails.reduce((sum, f) => sum + f.educationalValue, 0) / this.results.fileDetails.length;

    const educationalByWorkType = {};
    const educationalByDifficulty = {};

    this.results.fileDetails.forEach(file => {
      if (!educationalByWorkType[file.workType]) educationalByWorkType[file.workType] = [];
      if (!educationalByDifficulty[file.difficulty]) educationalByDifficulty[file.difficulty] = [];

      educationalByWorkType[file.workType].push(file.educationalValue);
      educationalByDifficulty[file.difficulty].push(file.educationalValue);
    });

    const avgEducationalByWorkType = {};
    const avgEducationalByDifficulty = {};

    Object.entries(educationalByWorkType).forEach(([workType, values]) => {
      avgEducationalByWorkType[workType] = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(3);
    });

    Object.entries(educationalByDifficulty).forEach(([difficulty, values]) => {
      avgEducationalByDifficulty[difficulty] = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(3);
    });

    return {
      average_educational_value: avgEducationalValue.toFixed(3),
      educational_by_work_type: this.sortObject(avgEducationalByWorkType),
      educational_by_difficulty: this.sortObject(avgEducationalByDifficulty),
      most_educational_work_type: Object.entries(avgEducationalByWorkType).reduce((a, b) =>
        parseFloat(avgEducationalByWorkType[a[0]]) > parseFloat(avgEducationalByWorkType[b[0]]) ? a : b
      )[0]
    };
  }

  /**
   * Analyze performance insights
   */
  analyzePerformanceInsights() {
    const avgDuration = this.results.fileDetails.reduce((sum, f) => sum + f.performanceDuration, 0) / this.results.fileDetails.length;

    const durationByWorkType = {};
    const durationByPeriod = {};

    this.results.fileDetails.forEach(file => {
      if (!durationByWorkType[file.workType]) durationByWorkType[file.workType] = [];
      if (!durationByPeriod[file.period]) durationByPeriod[file.period] = [];

      durationByWorkType[file.workType].push(file.performanceDuration);
      durationByPeriod[file.period].push(file.performanceDuration);
    });

    const avgDurationByWorkType = {};
    const avgDurationByPeriod = {};

    Object.entries(durationByWorkType).forEach(([workType, durations]) => {
      avgDurationByWorkType[workType] = (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1);
    });

    Object.entries(durationByPeriod).forEach(([period, durations]) => {
      avgDurationByPeriod[period] = (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1);
    });

    return {
      average_duration: avgDuration.toFixed(1) + ' minutes',
      duration_by_work_type: this.sortObject(avgDurationByWorkType),
      duration_by_period: this.sortObject(avgDurationByPeriod),
      longest_work_type: Object.entries(avgDurationByWorkType).reduce((a, b) =>
        parseFloat(avgDurationByWorkType[a[0]]) > parseFloat(avgDurationByWorkType[b[0]]) ? a : b
      )[0]
    };
  }

  /**
   * Analyze quality insights
   */
  analyzeQualityInsights() {
    const avgQuality = this.results.fileDetails.reduce((sum, f) => sum + f.quality, 0) / this.results.fileDetails.length;

    const qualityByComposer = {};
    const qualityByPeriod = {};

    this.results.fileDetails.forEach(file => {
      if (!qualityByComposer[file.composer]) qualityByComposer[file.composer] = [];
      if (!qualityByPeriod[file.period]) qualityByPeriod[file.period] = [];

      qualityByComposer[file.composer].push(file.quality);
      qualityByPeriod[file.period].push(file.quality);
    });

    const avgQualityByComposer = {};
    const avgQualityByPeriod = {};

    Object.entries(qualityByComposer).forEach(([composer, qualities]) => {
      if (qualities.length >= 3) { // Only include composers with multiple works
        avgQualityByComposer[composer] = (qualities.reduce((a, b) => a + b, 0) / qualities.length).toFixed(3);
      }
    });

    Object.entries(qualityByPeriod).forEach(([period, qualities]) => {
      avgQualityByPeriod[period] = (qualities.reduce((a, b) => a + b, 0) / qualities.length).toFixed(3);
    });

    return {
      average_quality: avgQuality.toFixed(3),
      quality_distribution: this.results.qualityMetrics,
      quality_by_composer: this.sortObject(avgQualityByComposer),
      quality_by_period: this.sortObject(avgQualityByPeriod),
      high_quality_percentage: (this.results.qualityMetrics.high / this.results.processedFiles * 100).toFixed(2) + '%'
    };
  }

  /**
   * Analyze historical context
   */
  analyzeHistoricalContext() {
    const periods = Object.keys(this.results.periodStats);
    const composers = Object.keys(this.results.composerStats);

    const periodSpan = periods.length;
    const composerDiversity = composers.length;

    const workTypeDiversity = Object.keys(this.results.workTypeStats).length;

    return {
      period_coverage: periodSpan,
      composer_diversity: composerDiversity,
      work_type_diversity: workTypeDiversity,
      periods_represented: periods,
      most_represented_period: Object.entries(this.results.periodStats).reduce((a, b) =>
        this.results.periodStats[a[0]] > this.results.periodStats[b[0]] ? a : b
      )[0],
      coverage_assessment: this.assessHistoricalCoverage(periodSpan, composerDiversity, workTypeDiversity)
    };
  }

  /**
   * Assess historical coverage
   */
  assessHistoricalCoverage(periodSpan, composerDiversity, workTypeDiversity) {
    let assessment = 'limited';

    if (periodSpan >= 3 && composerDiversity >= 5 && workTypeDiversity >= 4) {
      assessment = 'comprehensive';
    } else if (periodSpan >= 2 && composerDiversity >= 3 && workTypeDiversity >= 3) {
      assessment = 'good';
    } else if (periodSpan >= 1 && composerDiversity >= 2) {
      assessment = 'moderate';
    }

    return assessment;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    // Period balance recommendations
    const periodCounts = Object.values(this.results.periodStats);
    const avgPeriodCount = periodCounts.reduce((a, b) => a + b, 0) / periodCounts.length;
    const underrepresentedPeriods = Object.entries(this.results.periodStats)
      .filter(([period, count]) => count < avgPeriodCount * 0.5)
      .filter(([period]) => period !== 'Unknown');

    if (underrepresentedPeriods.length > 0) {
      recommendations.push({
        type: 'period_expansion',
        message: `Expand underrepresented periods: ${underrepresentedPeriods.map(([p, c]) => `${p} (${c})`).join(', ')}`
      });
    }

    // Composer diversity recommendations
    const composerCounts = Object.values(this.results.composerStats);
    const maxComposerCount = Math.max(...composerCounts);
    const composerImbalance = maxComposerCount / this.results.processedFiles;

    if (composerImbalance > 0.4) {
      const topComposer = Object.entries(this.results.composerStats).find(([c, count]) => count === maxComposerCount);
      recommendations.push({
        type: 'composer_diversification',
        message: `${topComposer[0]} dominates with ${(composerImbalance*100).toFixed(1)}% of works. Consider adding more composers.`
      });
    }

    // Work type balance recommendations
    const workTypeCounts = Object.values(this.results.workTypeStats);
    const maxWorkTypeCount = Math.max(...workTypeCounts);
    const workTypeImbalance = maxWorkTypeCount / this.results.processedFiles;

    if (workTypeImbalance > 0.5) {
      const topWorkType = Object.entries(this.results.workTypeStats).find(([wt, count]) => count === maxWorkTypeCount);
      recommendations.push({
        type: 'work_type_diversification',
        message: `${topWorkType[0]} works dominate with ${(workTypeImbalance*100).toFixed(1)}%. Consider adding more work types.`
      });
    }

    // Quality improvement recommendations
    const lowQualityPct = this.results.qualityMetrics.low / this.results.processedFiles;
    if (lowQualityPct > 0.2) {
      recommendations.push({
        type: 'quality_enhancement',
        message: `${(lowQualityPct*100).toFixed(1)}% low quality pieces. Consider quality assessment and curation.`
      });
    }

    // Educational balance recommendations
    const advancedPct = this.results.difficultyStats.advanced / this.results.processedFiles;
    if (advancedPct > 0.7) {
      recommendations.push({
        type: 'difficulty_balance',
        message: `${(advancedPct*100).toFixed(1)}% advanced pieces. Consider adding intermediate and beginner level works.`
      });
    }

    return recommendations;
  }

  /**
   * Generate summary text report
   */
  generateSummaryText(report) {
    const summary = `
WHEN IN ROME CLASSICAL DATASET ANALYSIS REPORT
==============================================

OVERVIEW
--------
Total Files: ${report.analysis_summary.total_files}
Processed: ${report.analysis_summary.processed_files}
Success Rate: ${report.analysis_summary.success_rate}
Errors: ${report.analysis_summary.error_count}

COMPOSER DISTRIBUTION
---------------------
${Object.entries(report.composer_distribution).slice(0, 10).map(([composer, count]) =>
  `${composer}: ${count} (${(count/report.analysis_summary.processed_files*100).toFixed(1)}%)`
).join('\n')}

PERIOD DISTRIBUTION
-------------------
${Object.entries(report.period_distribution).map(([period, count]) =>
  `${period}: ${count} (${(count/report.analysis_summary.processed_files*100).toFixed(1)}%)`
).join('\n')}

WORK TYPE DISTRIBUTION
----------------------
${Object.entries(report.work_type_distribution).map(([type, count]) =>
  `${type}: ${count} (${(count/report.analysis_summary.processed_files*100).toFixed(1)}%)`
).join('\n')}

DIFFICULTY DISTRIBUTION
-----------------------
${Object.entries(report.difficulty_distribution).map(([level, count]) =>
  `${level}: ${count} (${(count/report.analysis_summary.processed_files*100).toFixed(1)}%)`
).join('\n')}

QUALITY METRICS
---------------
High Quality: ${report.quality_distribution.high} (${(report.quality_distribution.high/report.analysis_summary.processed_files*100).toFixed(1)}%)
Medium Quality: ${report.quality_distribution.medium} (${(report.quality_distribution.medium/report.analysis_summary.processed_files*100).toFixed(1)}%)
Low Quality: ${report.quality_distribution.low} (${(report.quality_distribution.low/report.analysis_summary.processed_files*100).toFixed(1)}%)

CULTURAL SIGNIFICANCE
---------------------
Supreme: ${report.cultural_significance.supreme} (${(report.cultural_significance.supreme/report.analysis_summary.processed_files*100).toFixed(1)}%)
Major: ${report.cultural_significance.major} (${(report.cultural_significance.major/report.analysis_summary.processed_files*100).toFixed(1)}%)
Minor: ${report.cultural_significance.minor} (${(report.cultural_significance.minor/report.analysis_summary.processed_files*100).toFixed(1)}%)

PERFORMANCE INSIGHTS
--------------------
Average Duration: ${report.performance_insights.average_duration}
Longest Work Type: ${report.performance_insights.longest_work_type}

EDUCATIONAL INSIGHTS
--------------------
Average Educational Value: ${report.educational_insights.average_educational_value}
Most Educational Work Type: ${report.educational_insights.most_educational_work_type}

HISTORICAL ANALYSIS
-------------------
Period Coverage: ${report.historical_analysis.period_coverage} periods
Composer Diversity: ${report.historical_analysis.composer_diversity} composers
Work Type Diversity: ${report.historical_analysis.work_type_diversity} types
Coverage Assessment: ${report.historical_analysis.coverage_assessment}

RECOMMENDATIONS
---------------
${report.recommendations.map(rec => `- ${rec.message}`).join('\n')}

Generated: ${new Date().toISOString()}
`;

    const summaryPath = path.join(process.cwd(), 'when_in_rome_analysis_summary.txt');
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
console.log('Starting When in Rome analyzer...');
const analyzer = new WhenInRomeAnalyzer();
analyzer.analyze().catch(console.error);

export default WhenInRomeAnalyzer;