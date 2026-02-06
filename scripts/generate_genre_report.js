import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import the processor
import { ChordonomiconProcessor } from '../src/music/preprocessing/harmony/ChordonomiconProcessor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = './src/music/datasets/Chordonomicon-partial';
const files = fs.readdirSync(datasetPath).filter(f => f.endsWith('.json')).slice(0, 200); // Sample first 200 files

console.log('Processing', files.length, 'chordonomicon files for genre analysis...');

const genreStats = {
  total_songs: 0,
  genres: {
    pop: { count: 0, avg_confidence: 0, songs: [] },
    rock: { count: 0, avg_confidence: 0, songs: [] },
    jazz: { count: 0, avg_confidence: 0, songs: [] },
    classical: { count: 0, avg_confidence: 0, songs: [] },
    folk: { count: 0, avg_confidence: 0, songs: [] },
    electronic: { count: 0, avg_confidence: 0, songs: [] }
  },
  chord_qualities: {
    major: 0,
    minor: 0,
    diminished: 0,
    augmented: 0,
    seventh: 0,
    extended: 0
  },
  tempo_ranges: {
    slow: 0, // < 100 BPM
    moderate: 0, // 100-130 BPM
    fast: 0 // > 130 BPM
  }
};

files.forEach((file, index) => {
  try {
    const filePath = path.join(datasetPath, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Extract chords from all sections
    const allChords = [];
    data.sections.forEach(section => {
      allChords.push(...section.chords);
    });

    if (allChords.length === 0) return;

    // Process with the enhanced processor
    const processed = ChordonomiconProcessor.processProgression({
      chords: allChords,
      name: data.title || 'Unknown',
      artist: data.artist || 'Unknown'
    });

    genreStats.total_songs++;

    // Aggregate genre indicators
    const genreIndicators = processed.enhanced_metadata.genre_indicators;
    Object.entries(genreIndicators).forEach(([genre, confidence]) => {
      if (confidence > 0.3) { // Only count significant genre matches
        genreStats.genres[genre].count++;
        genreStats.genres[genre].avg_confidence += confidence;
        genreStats.genres[genre].songs.push({
          title: data.title,
          artist: data.artist,
          confidence: confidence
        });
      }
    });

    // Aggregate chord qualities
    const qualities = processed.enhanced_metadata.chord_qualities;
    Object.entries(qualities).forEach(([quality, ratio]) => {
      genreStats.chord_qualities[quality] += ratio;
    });

    // Aggregate tempo suggestions
    const tempoSuggestions = processed.enhanced_metadata.tempo_suggestions;
    tempoSuggestions.forEach(suggestion => {
      if (suggestion.tempo < 100) genreStats.tempo_ranges.slow++;
      else if (suggestion.tempo <= 130) genreStats.tempo_ranges.moderate++;
      else genreStats.tempo_ranges.fast++;
    });

    if (index % 50 === 0) {
      console.log('Processed', index + 1, 'files...');
    }

  } catch (error) {
    console.log('Error processing', file, ':', error.message);
  }
});

// Calculate averages
Object.keys(genreStats.genres).forEach(genre => {
  const g = genreStats.genres[genre];
  if (g.count > 0) {
    g.avg_confidence = g.avg_confidence / g.count;
    g.songs = g.songs.sort((a, b) => b.confidence - a.confidence).slice(0, 5); // Top 5 songs
  }
});

// Normalize chord qualities
Object.keys(genreStats.chord_qualities).forEach(quality => {
  genreStats.chord_qualities[quality] = genreStats.chord_qualities[quality] / genreStats.total_songs;
});

// Output the report
console.log('\n=== CHORDONOMICON GENRE REPORT ===');
console.log('Total songs analyzed:', genreStats.total_songs);
console.log('\nGENRE DISTRIBUTION:');
Object.entries(genreStats.genres)
  .sort(([,a], [,b]) => b.count - a.count)
  .forEach(([genre, stats]) => {
    console.log(genre.toUpperCase() + ': ' + stats.count + ' songs (avg confidence: ' + (stats.avg_confidence * 100).toFixed(1) + '%)');
    if (stats.songs.length > 0) {
      console.log('  Top songs:');
      stats.songs.forEach(song => {
        console.log('    - ' + song.title + ' by ' + song.artist + ' (' + (song.confidence * 100).toFixed(1) + '%)');
      });
    }
    console.log('');
  });

console.log('CHORD QUALITY DISTRIBUTION:');
Object.entries(genreStats.chord_qualities)
  .sort(([,a], [,b]) => b - a)
  .forEach(([quality, ratio]) => {
    console.log(quality + ': ' + (ratio * 100).toFixed(1) + '%');
  });

console.log('\nTEMPO DISTRIBUTION:');
Object.entries(genreStats.tempo_ranges)
  .forEach(([range, count]) => {
    console.log(range + ': ' + count + ' suggestions');
  });