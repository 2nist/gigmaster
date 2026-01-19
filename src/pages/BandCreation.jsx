import React, { useState, useCallback } from 'react';
import { getAvatarUrl } from '../utils/helpers';

const ROLES = [
  { id: 'vocalist', name: '🎤 Vocals', color: '#ff6b6b' },
  { id: 'lead-guitar', name: '🎸 Lead Guitar', color: '#4ecdc4' },
  { id: 'rhythm-guitar', name: '🎸 Rhythm Guitar', color: '#00d2fc' },
  { id: 'bassist', name: '🎸 Bass', color: '#45b7d1' },
  { id: 'drummer', name: '🥁 Drums', color: '#f9ca24' },
  { id: 'keyboardist', name: '🎹 Keys', color: '#6c5ce7' },
  { id: 'synth', name: '🎹 Synth', color: '#a29bfe' },
  { id: 'percussion', name: '🥁 Percussion', color: '#fdcb6e' },
  { id: 'dj', name: '🎚️ DJ', color: '#ff7675' },
];

// Pre-made band candidates
const BAND_CANDIDATES = [
  { name: 'Alex Storm', specialty: 'lead-guitar', bio: 'Shredding virtuoso with wild energy' },
  { name: 'Jamie Cross', specialty: 'vocalist', bio: 'Powerful voice with stage presence' },
  { name: 'Riley Bass', specialty: 'bassist', bio: 'Groovy bass lines and solid foundation' },
  { name: 'Casey Beat', specialty: 'drummer', bio: 'Tight rhythms and incredible timing' },
  { name: 'Morgan Keys', specialty: 'keyboardist', bio: 'Melodic keyboard master' },
  { name: 'Sam Thunder', specialty: 'rhythm-guitar', bio: 'Groove-oriented rhythm guitarist' },
  { name: 'Dev Synth', specialty: 'synth', bio: 'Synth wizard with electronic beats' },
  { name: 'Nikki Percussion', specialty: 'percussion', bio: 'Percussionist adds texture and color' },
  { name: 'Blake Turntable', specialty: 'dj', bio: 'DJ master of mixing and blending' },
  { name: 'Taylor Harmony', specialty: 'vocalist', bio: 'Harmonies and vocal arrangements' },
  { name: 'Jordan Rock', specialty: 'lead-guitar', bio: 'Rock solid guitar tones and solos' },
  { name: 'Casey Pulse', specialty: 'drummer', bio: 'Precision drummer with modern style' },
];

const BandCreation = ({ onComplete, bandName, logo }) => {
  const [phase, setPhase] = useState('rehearsal'); // 'rehearsal' or 'assembly'
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [members, setMembers] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMember = members[currentIndex];
  const currentRole = ROLES.find(r => r.id === currentMember.role);

  // Rehearsal phase - select pre-made candidates
  const handleSelectCandidate = useCallback((candidate) => {
    const newMember = {
      id: Math.max(0, ...selectedCandidates.map(c => c.id), 0) + 1,
      name: candidate.name,
      role: candidate.specialty,
    };
    setSelectedCandidates(prev => [...prev, newMember]);
  }, [selectedCandidates]);

  const handleRemoveSelected = useCallback((idx) => {
    setSelectedCandidates(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const handleStartAssembly = useCallback(() => {
    if (selectedCandidates.length < 2) {
      alert('Select at least 2 band members to continue');
      return;
    }
    setMembers(selectedCandidates);
    setPhase('assembly');
    setCurrentIndex(0);
  }, [selectedCandidates]);

  // Assembly phase - customize members
  const updateMember = useCallback((field, value) => {
    setMembers(prev => {
      const updated = [...prev];
      updated[currentIndex] = { ...updated[currentIndex], [field]: value };
      return updated;
    });
  }, [currentIndex]);

  const addMember = useCallback(() => {
    const newId = Math.max(...members.map(m => m.id), 0) + 1;
    setMembers(prev => [...prev, { id: newId, name: '', role: 'vocalist' }]);
  }, [members]);

  const removeMember = useCallback(() => {
    if (members.length > 2) {
      const newMembers = members.filter((_, i) => i !== currentIndex);
      setMembers(newMembers);
      setCurrentIndex(Math.min(currentIndex, newMembers.length - 1));
    }
  }, [members, currentIndex]);

  const handleComplete = useCallback(() => {
    if (members.length < 2) {
      alert('Your band needs at least 2 members');
      return;
    }
    onComplete(members);
  }, [members, onComplete]);

  const handlePrevious = () => {
    if (phase === 'assembly' && currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (phase === 'assembly' && currentIndex < members.length - 1) setCurrentIndex(currentIndex + 1);
  };

  // Rehearsal Phase UI
  if (phase === 'rehearsal') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
              Rehearsal
            </h1>
            <p className="text-gray-300 text-lg">
              Scout talented musicians for <span className="font-bold text-purple-300">{bandName}</span>
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-slate-800/50 backdrop-blur border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
            {/* Logo Display */}
            {logo && (
              <div className="mb-8 p-6 bg-slate-900/50 rounded-xl border border-purple-400/20">
                <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Band Logo</p>
                <div
                  style={logo.style}
                  className="text-center py-4 rounded-lg bg-gradient-to-b from-slate-800 to-slate-900"
                >
                  {bandName}
                </div>
              </div>
            )}

            {/* Selected Members */}
            {selectedCandidates.length > 0 && (
              <div className="mb-8">
                <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider">
                  Selected Members ({selectedCandidates.length})
                </p>
                <div className="space-y-2">
                  {selectedCandidates.map((member, idx) => {
                    const role = ROLES.find(r => r.id === member.role);
                    return (
                      <div key={idx} className="p-4 rounded-lg bg-slate-700/30 border border-purple-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img
                            src={getAvatarUrl(member.name, 'open-peeps')}
                            alt={member.name}
                            className="w-10 h-10 rounded-full border-2 border-purple-500"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                          <div>
                            <p className="text-white font-bold">{member.name}</p>
                            <p className="text-xs text-gray-400">{role.name}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveSelected(idx)}
                          className="px-3 py-1 text-xs bg-red-600/30 text-red-300 rounded hover:bg-red-600/50 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Candidates Grid */}
            <div className="mb-8">
              <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider">Available Musicians</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BAND_CANDIDATES.map((candidate, idx) => {
                  const isSelected = selectedCandidates.some(m => m.name === candidate.name);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectCandidate(candidate)}
                      disabled={isSelected}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'bg-purple-600/30 border-purple-500 opacity-60 cursor-not-allowed'
                          : 'bg-slate-700/30 border-slate-600/50 hover:border-purple-500/70 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={getAvatarUrl(candidate.name, 'open-peeps')}
                          alt={candidate.name}
                          className="w-12 h-12 rounded-full border-2 border-slate-600"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                        <div className="flex-1">
                          <p className="font-bold text-white">{candidate.name}</p>
                          <p className="text-xs text-gray-400 mb-1">
                            {ROLES.find(r => r.id === candidate.specialty)?.name}
                          </p>
                          <p className="text-xs text-gray-500">{candidate.bio}</p>
                        </div>
                        {isSelected && <span className="text-lg">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleStartAssembly}
              disabled={selectedCandidates.length < 2}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Assemble Your Band ({selectedCandidates.length}/∞)
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Select at least 2 musicians to proceed • You can customize their roles next
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Assembly Phase UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
            Assemble Your Band
          </h1>
          <p className="text-gray-300 text-lg">
            Finalize your musical crew for <span className="font-bold text-purple-300">{bandName}</span>
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
          {/* Logo Display */}
          {logo && (
            <div className="mb-8 p-6 bg-slate-900/50 rounded-xl border border-purple-400/20">
              <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Band Logo</p>
              <div
                style={logo.style}
                className="text-center py-4 rounded-lg bg-gradient-to-b from-slate-800 to-slate-900"
              >
                {bandName}
              </div>
            </div>
          )}

          {/* Member Editor */}
          <div className="mb-8">
            <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider">
              Member {currentIndex + 1} of {members.length}
            </p>

            {/* Member Avatar */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <img
                  src={getAvatarUrl(currentMember.name || 'member', 'open-peeps')}
                  alt={currentMember.name}
                  className="w-24 h-24 rounded-full border-4 border-purple-500 shadow-lg"
                  onError={(e) => e.target.style.opacity = '0.3'}
                />
                <div className="absolute -bottom-2 -right-2 bg-purple-600 rounded-full px-3 py-1 text-xs font-bold text-white border-2 border-slate-800">
                  {ROLES.find(r => r.id === currentMember.role)?.name.split(' ')[0]}
                </div>
              </div>
            </div>

            {/* Role Selector */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-300 mb-3 block">
                Instrument
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(role => (
                  <button
                    key={role.id}
                    onClick={() => updateMember('role', role.id)}
                    className={`py-3 px-2 rounded-lg text-xs font-bold transition-all ${
                      currentMember.role === role.id
                        ? 'bg-purple-600 text-white ring-2 ring-purple-400 scale-105'
                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                    }`}
                    title={role.name}
                  >
                    {role.name.split(' ').slice(1).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-300 mb-3 block">
                Member Name
              </label>
              <input
                type="text"
                value={currentMember.name}
                onChange={(e) => updateMember('name', e.target.value)}
                placeholder="e.g., Alex Storm"
                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                autoFocus
              />
            </div>

            {/* Current Role Display */}
            <div className="p-4 bg-slate-900/50 rounded-lg border border-purple-400/20 mb-6">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Current Position</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: currentRole.color }}
                />
                <p className="text-lg font-bold text-white">{currentRole.name}</p>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex-1 py-3 px-4 bg-slate-700/50 text-gray-300 rounded-lg hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                ← Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === members.length - 1}
                className="flex-1 py-3 px-4 bg-slate-700/50 text-gray-300 rounded-lg hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                Next →
              </button>
            </div>

            {/* Member Roster */}
            <div className="mb-8">
              <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Band Roster</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {members.map((member, idx) => {
                  const role = ROLES.find(r => r.id === member.role);
                  const isActive = idx === currentIndex;
                  return (
                    <div
                      key={member.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`p-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 ${
                        isActive
                          ? 'bg-purple-600/30 border border-purple-500 ring-1 ring-purple-400'
                          : 'bg-slate-700/30 border border-slate-600/50 hover:bg-slate-700/50'
                      }`}
                    >
                      <img
                        src={getAvatarUrl(member.name || 'member', 'open-peeps')}
                        alt={member.name}
                        className="w-8 h-8 rounded-full border border-slate-600"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">
                          {member.name || '(Empty)'}
                        </p>
                        <p className="text-xs text-gray-400">{role.name}</p>
                      </div>
                      {members.length > 2 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newMembers = members.filter((_, i) => i !== idx);
                            setMembers(newMembers);
                            setCurrentIndex(Math.min(currentIndex, newMembers.length - 1));
                          }}
                          className="text-xs px-2 py-1 bg-red-600/30 text-red-300 rounded hover:bg-red-600/50 transition-colors whitespace-nowrap"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add Member Button */}
            <button
              onClick={addMember}
              className="w-full py-3 px-4 mb-6 bg-slate-700/50 border border-dashed border-purple-500/50 rounded-lg text-gray-300 hover:bg-slate-700/70 hover:border-purple-500 transition-all font-semibold"
            >
              + Add New Member
            </button>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setPhase('rehearsal')}
                className="flex-1 py-3 px-6 bg-slate-700/50 text-gray-300 rounded-lg hover:bg-slate-700/70 font-bold transition-all"
              >
                Back to Rehearsal
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Start Your Career
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Minimum 2 members required • You can customize their roles here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BandCreation;
