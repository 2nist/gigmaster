import fs from 'fs';
import path from 'path';
import BimmudaProcessor from '../src/music/preprocessing/BimmudaProcessor.js';

console.log('Script loaded, starting analysis...');

/**
 * Analysis script for Bimmuda dataset
 * Generates comprehensive reports on historical MIDI files with lyrics
 */
class BimmudaAnalyzer {
  constructor(datasetPath = './src/music/datasets/bimmuda_dataset') {
    this.datasetPath = datasetPath;
    this.results = {
      totalFiles: 0,
      processedFiles: 0,
      errors: [],
      genreStats: {},
      eraStats: {},
      lyricalThemes: {},
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
    console.log('Starting Bimmuda dataset analysis...');

    try {
      console.log('Discovering files...');
      const files = this.discoverFiles();
      console.log(`Found ${files.length} files to analyze`);

      this.results.totalFiles = files.length;

      console.log('Processing files...');
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Processing file ${i + 1}/${files.length}: ${file.path}`);
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

      console.log('Generating report...');
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
  discoverFiles() {
    console.log('Discovering files in:', this.datasetPath);
    const files = [];

    // Scan year directories (1950-2024)
    for (let year = 1950; year <= 2024; year++) {
      const yearPath = path.join(this.datasetPath, year.toString());
      console.log(`Checking year: ${year} - ${yearPath}`);

      if (!fs.existsSync(yearPath)) {
        console.log(`Year ${year} does not exist, skipping`);
        continue;
      }

      // Scan monthly subdirectories
      for (let month = 1; month <= 12; month++) {
        const monthPath = path.join(yearPath, month.toString());

        if (!fs.existsSync(monthPath)) continue;

        const monthFiles = fs.readdirSync(monthPath);

        for (const fileName of monthFiles) {
          const filePath = path.join(monthPath, fileName);

          if (fileName.endsWith('.mid') || fileName.endsWith('.midi')) {
            files.push({
              path: filePath,
              year,
              month,
              fileName
            });
          }
        }
      }
    }

    console.log(`Total files found: ${files.length}`);
    return files;
  }

  /**
   * Process individual file
   */
  async processFile(fileInfo) {
    const fileData = {
      filePath: fileInfo.path,
      year: fileInfo.year,
      month: fileInfo.month,
      fileName: fileInfo.fileName
    };

    // Read file size
    try {
      const stats = fs.statSync(fileInfo.path);
      fileData.size = stats.size;
    } catch (error) {
      fileData.size = 0;
    }

    // Look for lyrics file
    const lyricsPath = fileInfo.path.replace(/\.mid$|\.midi$/, '.txt');
    if (fs.existsSync(lyricsPath)) {
      try {
        fileData.lyrics = fs.readFileSync(lyricsPath, 'utf8');
      } catch (error) {
        fileData.lyrics = '';
      }
    }

    return BimmudaProcessor.processFile(fileData);
  }

  /**
   * Analyze processed data
   */
  analyzeProcessedData(processed) {
    // Genre statistics
    const genre = processed.enhanced_metadata?.genre_classification?.primary_genre || 'unknown';
    this.results.genreStats[genre] = (this.results.genreStats[genre] || 0) + 1;

    // Era statistics
    const era = processed.enhanced_metadata?.era_analysis?.era || 'unknown';
    this.results.eraStats[era] = (this.results.eraStats[era] || 0) + 1;

    // Lyrical themes
    if (processed.enhanced_metadata?.lyrical_analysis?.themes) {
      processed.enhanced_metadata.lyrical_analysis.themes.forEach(theme => {
        this.results.lyricalThemes[theme] = (this.results.lyricalThemes[theme] || 0) + 1;
      });
    }

    // Quality metrics
    const quality = processed.quality_analysis?.overall_quality || 0;
    if (quality >= 0.8) this.results.qualityMetrics.high++;
    else if (quality >= 0.6) this.results.qualityMetrics.medium++;
    else this.results.qualityMetrics.low++;

    // Store file details
    this.results.fileDetails.push({
      id: processed.id,
      year: processed.year,
      month: processed.month,
      genre,
      era,
      quality,
      hasLyrics: !!processed.lyrics,
      themes: processed.enhanced_metadata?.lyrical_analysis?.themes || []
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
      era_distribution: this.sortObject(this.results.eraStats),
      lyrical_themes: this.sortObject(this.results.lyricalThemes),
      quality_distribution: this.results.qualityMetrics,
      temporal_distribution: this.analyzeTemporalDistribution(),
      top_genres_by_era: this.analyzeGenresByEra(),
      lyrical_insights: this.analyzeLyricalInsights(),
      quality_insights: this.analyzeQualityInsights(),
      recommendations: this.generateRecommendations(),
      errors: this.results.errors.slice(0, 10) // First 10 errors
    };

    // Write report to file
    const reportPath = path.join(process.cwd(), 'bimmuda_analysis_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`Report generated: ${reportPath}`);

    // Generate summary text
    this.generateSummaryText(report);
  }

  /**
   * Analyze temporal distribution
   */
  analyzeTemporalDistribution() {
    const decadeStats = {};
    const yearlyStats = {};

    this.results.fileDetails.forEach(file => {
      const decade = Math.floor(file.year / 10) * 10;
      decadeStats[decade] = (decadeStats[decade] || 0) + 1;
      yearlyStats[file.year] = (yearlyStats[file.year] || 0) + 1;
    });

    return {
      by_decade: this.sortObject(decadeStats),
      by_year: this.sortObject(yearlyStats),
      peak_decade: Object.entries(decadeStats).reduce((a, b) => decadeStats[a[0]] > decadeStats[b[0]] ? a : b)[0],
      coverage_years: Object.keys(yearlyStats).length
    };
  }

  /**
   * Analyze genres by era
   */
  analyzeGenresByEra() {
    const eraGenreMatrix = {};

    this.results.fileDetails.forEach(file => {
      if (!eraGenreMatrix[file.era]) {
        eraGenreMatrix[file.era] = {};
      }
      eraGenreMatrix[file.era][file.genre] = (eraGenreMatrix[file.era][file.genre] || 0) + 1;
    });

    // Find top genres for each era
    const topGenresByEra = {};
    Object.entries(eraGenreMatrix).forEach(([era, genres]) => {
      const sortedGenres = Object.entries(genres).sort((a, b) => b[1] - a[1]);
      topGenresByEra[era] = sortedGenres.slice(0, 3);
    });

    return topGenresByEra;
  }

  /**
   * Analyze lyrical insights
   */
  analyzeLyricalInsights() {
    const filesWithLyrics = this.results.fileDetails.filter(f => f.hasLyrics);
    const totalThemes = Object.values(this.results.lyricalThemes).reduce((a, b) => a + b, 0);

    return {
      lyrics_coverage: (filesWithLyrics.length / this.results.processedFiles * 100).toFixed(2) + '%',
      total_themes_identified: totalThemes,
      average_themes_per_song: (totalThemes / filesWithLyrics.length).toFixed(2),
      most_common_themes: Object.entries(this.results.lyricalThemes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
    };
  }

  /**
   * Analyze quality insights
   */
  analyzeQualityInsights() {
    const avgQuality = this.results.fileDetails.reduce((sum, f) => sum + f.quality, 0) / this.results.fileDetails.length;

    const qualityByEra = {};
    this.results.fileDetails.forEach(file => {
      if (!qualityByEra[file.era]) qualityByEra[file.era] = [];
      qualityByEra[file.era].push(file.quality);
    });

    const eraAvgQuality = {};
    Object.entries(qualityByEra).forEach(([era, qualities]) => {
      eraAvgQuality[era] = qualities.reduce((a, b) => a + b, 0) / qualities.length;
    });

    return {
      average_quality: avgQuality.toFixed(3),
      quality_distribution: this.results.qualityMetrics,
      quality_by_era: this.sortObject(eraAvgQuality),
      high_quality_percentage: (this.results.qualityMetrics.high / this.results.processedFiles * 100).toFixed(2) + '%'
    };
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    // Genre balance recommendations
    const topGenre = Object.entries(this.results.genreStats)
      .sort((a, b) => b[1] - a[1])[0];

    if (topGenre[1] > this.results.processedFiles * 0.3) {
      recommendations.push({
        type: 'diversification',
        message: `Consider balancing ${topGenre[0]} dominance (${(topGenre[1]/this.results.processedFiles*100).toFixed(1)}% of dataset)`
      });
    }

    // Era coverage recommendations
    const eras = Object.keys(this.results.eraStats);
    if (eras.length < 5) {
      recommendations.push({
        type: 'era_expansion',
        message: `Limited era coverage (${eras.length} eras). Consider expanding historical range.`
      });
    }

    // Quality improvement recommendations
    const lowQualityPct = this.results.qualityMetrics.low / this.results.processedFiles;
    if (lowQualityPct > 0.2) {
      recommendations.push({
        type: 'quality_improvement',
        message: `${(lowQualityPct*100).toFixed(1)}% low quality files. Consider quality filtering or enhancement.`
      });
    }

    // Lyrics coverage recommendations
    const lyricsCoverage = this.results.fileDetails.filter(f => f.hasLyrics).length / this.results.processedFiles;
    if (lyricsCoverage < 0.5) {
      recommendations.push({
        type: 'lyrics_enhancement',
        message: `Only ${(lyricsCoverage*100).toFixed(1)}% files have lyrics. Consider lyrics integration.`
      });
    }

    return recommendations;
  }

  /**
   * Generate summary text report
   */
  generateSummaryText(report) {
    const summary = `
BIMMUDA DATASET ANALYSIS REPORT
===============================

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

ERA DISTRIBUTION
----------------
${Object.entries(report.era_distribution).map(([era, count]) =>
  `${era}: ${count} (${(count/report.analysis_summary.processed_files*100).toFixed(1)}%)`
).join('\n')}

QUALITY METRICS
---------------
High Quality: ${report.quality_distribution.high} (${(report.quality_distribution.high/report.analysis_summary.processed_files*100).toFixed(1)}%)
Medium Quality: ${report.quality_distribution.medium} (${(report.quality_distribution.medium/report.analysis_summary.processed_files*100).toFixed(1)}%)
Low Quality: ${report.quality_distribution.low} (${(report.quality_distribution.low/report.analysis_summary.processed_files*100).toFixed(1)}%)

TEMPORAL COVERAGE
-----------------
Peak Decade: ${report.temporal_distribution.peak_decade}s
Years Covered: ${report.temporal_distribution.coverage_years}
Coverage: ${Object.keys(report.temporal_distribution.by_decade).join(', ')}s

LYRICAL ANALYSIS
----------------
Lyrics Coverage: ${report.lyrical_insights.lyrics_coverage}
Themes Identified: ${report.lyrical_insights.total_themes_identified}
Avg Themes/Song: ${report.lyrical_insights.average_themes_per_song}

TOP THEMES:
${report.lyrical_insights.most_common_themes.map(([theme, count]) =>
  `${theme}: ${count}`
).join('\n')}

RECOMMENDATIONS
---------------
${report.recommendations.map(rec => `- ${rec.message}`).join('\n')}

Generated: ${new Date().toISOString()}
`;

    const summaryPath = path.join(process.cwd(), 'bimmuda_analysis_summary.txt');
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
console.log('Running analysis...');
const analyzer = new BimmudaAnalyzer();
analyzer.analyze().catch(console.error);

export default BimmudaAnalyzer;