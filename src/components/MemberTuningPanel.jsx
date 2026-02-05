import React, { useState, useEffect } from 'react';

const MemberTuningPanel = ({
  tuningSystem,
  bandMembers = [],
  onClose,
  className = ''
}) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentTuning, setCurrentTuning] = useState(null);
  const [availablePresets, setAvailablePresets] = useState([]);
  const [similarPresets, setSimilarPresets] = useState([]);

  // Knob definitions with descriptions
  const knobDefinitions = [
    {
      name: 'attitude',
      label: 'Attitude',
      description: 'Aggressive vs Laid-back sound',
      min: 0,
      max: 100,
      default: 50
    },
    {
      name: 'presence',
      label: 'Presence',
      description: 'In-your-face vs Subtle mix',
      min: 0,
      max: 100,
      default: 50
    },
    {
      name: 'ambience',
      label: 'Ambience',
      description: 'Roomy vs Intimate space',
      min: 0,
      max: 100,
      default: 50
    },
    {
      name: 'warmth',
      label: 'Warmth',
      description: 'Bright vs Warm tone',
      min: 0,
      max: 100,
      default: 50
    },
    {
      name: 'energy',
      label: 'Energy',
      description: 'High-energy vs Relaxed feel',
      min: 0,
      max: 100,
      default: 50
    }
  ];

  // Initialize component
  useEffect(() => {
    if (tuningSystem?.isInitialized && bandMembers.length > 0) {
      // Select first member by default
      setSelectedMember(bandMembers[0]);
      setAvailablePresets(tuningSystem.getAvailablePresets());
    }
  }, [tuningSystem, bandMembers]);

  // Update current tuning when member changes
  useEffect(() => {
    if (selectedMember && tuningSystem?.isInitialized) {
      const tuning = tuningSystem.getMemberTuning(selectedMember.id);
      setCurrentTuning(tuning);

      // Find similar presets
      const similar = tuningSystem.findSimilarPresets(selectedMember.id, 3);
      setSimilarPresets(similar);
    }
  }, [selectedMember, tuningSystem]);

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
  };

  const handleKnobChange = (knobName, value) => {
    if (!selectedMember || !tuningSystem) return;

    tuningSystem.updateKnob(selectedMember.id, knobName, value);

    // Update local state
    const updatedTuning = tuningSystem.getMemberTuning(selectedMember.id);
    setCurrentTuning(updatedTuning);

    // Update similar presets
    const similar = tuningSystem.findSimilarPresets(selectedMember.id, 3);
    setSimilarPresets(similar);
  };

  const handleApplyPreset = (presetName) => {
    if (!selectedMember || !tuningSystem) return;

    tuningSystem.applyPreset(selectedMember.id, presetName);

    // Update local state
    const updatedTuning = tuningSystem.getMemberTuning(selectedMember.id);
    setCurrentTuning(updatedTuning);

    // Update similar presets
    const similar = tuningSystem.findSimilarPresets(selectedMember.id, 3);
    setSimilarPresets(similar);
  };

  const handleSaveAsPreset = () => {
    if (!selectedMember || !tuningSystem) return;

    const presetName = prompt('Enter preset name:');
    if (presetName && presetName.trim()) {
      tuningSystem.saveAsPreset(selectedMember.id, presetName.trim(), 'Custom');
      // Refresh available presets
      setAvailablePresets(tuningSystem.getAvailablePresets());
    }
  };

  const handleReset = () => {
    if (!selectedMember || !tuningSystem) return;

    tuningSystem.resetMemberTuning(selectedMember.id);

    // Update local state
    const updatedTuning = tuningSystem.getMemberTuning(selectedMember.id);
    setCurrentTuning(updatedTuning);

    // Update similar presets
    const similar = tuningSystem.findSimilarPresets(selectedMember.id, 3);
    setSimilarPresets(similar);
  };

  if (!tuningSystem?.isInitialized || !selectedMember) {
    return (
      <div className={`member-tuning-panel ${className}`}>
        <div className="text-center p-8">
          <div className="text-xl mb-4">Loading Tuning System...</div>
          <div className="animate-spin text-2xl">⏳</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`member-tuning-panel bg-gray-900 text-white p-6 rounded-lg max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Member Tuning System</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>
      </div>

      {/* Member Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Select Member</h3>
        <div className="flex flex-wrap gap-2">
          {bandMembers.map(member => (
            <button
              key={member.id}
              onClick={() => handleMemberSelect(member)}
              className={`px-4 py-2 rounded ${
                selectedMember.id === member.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {member.name} ({member.role})
            </button>
          ))}
        </div>
      </div>

      {/* Tuning Knobs */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Tuning Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {knobDefinitions.map(knob => (
            <div key={knob.name} className="text-center">
              <label className="block text-sm font-medium mb-2">
                {knob.label}
              </label>
              <div className="relative">
                <input
                  type="range"
                  min={knob.min}
                  max={knob.max}
                  value={currentTuning?.[knob.name] ?? knob.default}
                  onChange={(e) => handleKnobChange(knob.name, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="text-xs text-gray-400 mt-1">
                  {currentTuning?.[knob.name] ?? knob.default}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1 max-w-24 mx-auto">
                {knob.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preset Controls */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Presets</h3>
          <div className="flex gap-2">
            <button
              onClick={handleSaveAsPreset}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Save as Preset
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Preset Categories */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {tuningSystem.getPresetCategories().map(category => (
              <div key={category} className="mb-2">
                <h4 className="text-sm font-medium text-gray-300 mb-1">{category}</h4>
                <div className="flex flex-wrap gap-1">
                  {tuningSystem.getPresetsByCategory(category).map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => handleApplyPreset(preset.name)}
                      className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs hover:bg-gray-600"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Presets */}
        {similarPresets.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Similar Presets</h4>
            <div className="flex flex-wrap gap-1">
              {similarPresets.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => handleApplyPreset(preset.name)}
                  className="px-2 py-1 bg-blue-700 text-white rounded text-xs hover:bg-blue-600"
                >
                  {preset.name} ({Math.round(preset.similarity * 100)}%)
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Parameter Preview */}
      {currentTuning && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Parameter Effects</h3>
          <div className="bg-gray-800 p-4 rounded text-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(tuningSystem.getParameterValues(selectedMember.id) || {}).map(([param, value]) => (
                <div key={param} className="text-gray-300">
                  <span className="font-medium">{param}:</span> {typeof value === 'number' ? value.toFixed(2) : value}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-400 bg-gray-800 p-4 rounded">
        <h4 className="font-medium mb-2">How it works:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Adjust the 5 knobs to shape your member's sound characteristics</li>
          <li>Each knob affects multiple Tone.js parameters for dramatic changes</li>
          <li>Try presets for different musical personalities and genres</li>
          <li>Save your favorite combinations as custom presets</li>
          <li>Tuning affects all music generated with this member</li>
        </ul>
      </div>
    </div>
  );
};

export default MemberTuningPanel;