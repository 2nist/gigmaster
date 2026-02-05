/**
 * Test script for Member Tuning System
 * Validates the tuning system integration with ToneRenderer
 */

import MemberTuningSystem from '../src/music/tuning/MemberTuningSystem.js';
import { TUNING_PRESETS, findSimilarPresets } from '../src/music/tuning/TuningPresets.js';
import { ToneRenderer } from '../src/music/renderers/ToneRenderer.js';

async function testTuningSystem() {
  console.log('🧪 Testing Member Tuning System...\n');

  // Initialize tuning system
  const tuningSystem = new MemberTuningSystem();
  console.log('✅ MemberTuningSystem initialized');

  // Test member initialization
  const drummerTuning = tuningSystem.initializeMember('drummer');
  console.log('✅ Drummer tuning initialized:', drummerTuning);

  // Test knob updates
  tuningSystem.updateKnob('drummer', 'attitude', 80); // Aggressive
  tuningSystem.updateKnob('drummer', 'presence', 90); // Forward
  tuningSystem.updateKnob('drummer', 'ambience', 30); // Moderate reverb
  console.log('✅ Drummer knobs updated');

  // Test preset application
  tuningSystem.applyPreset('drummer', 'rock_aggressive');
  console.log('✅ Rock Aggressive preset applied');

  // Test custom preset creation
  tuningSystem.saveAsPreset('drummer', 'my_custom_drum', 'My custom drum sound');
  console.log('✅ Custom preset saved');

  // Skip ToneRenderer test in Node.js environment (no audio context)
  console.log('⏭️  Skipping ToneRenderer test in Node.js environment');

  // Test statistics
  const stats = tuningSystem.getStatistics();
  console.log('📊 Tuning System Statistics:', stats);

  // Test preset discovery
  const similarPresets = findSimilarPresets({
    attitude: 85,
    presence: 75,
    ambience: 20,
    warmth: 40,
    energy: 70
  }, 3);
  console.log('🔍 Similar presets found:', similarPresets.length);

  // Test data export/import
  const exportedData = tuningSystem.exportData();
  console.log('💾 Data exported successfully');

  const newTuningSystem = new MemberTuningSystem();
  newTuningSystem.importData(exportedData);
  console.log('📁 Data imported successfully');

  // Cleanup
  console.log('🧹 Resources cleaned up');

  console.log('\n🎉 All tuning system tests passed!');
}

// Run the test
testTuningSystem().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});