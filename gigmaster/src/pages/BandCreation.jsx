import React, { useState, useCallback } from 'react';

const ROLES = [
  { id: 'vocalist', name: '🎤 Vocals', color: '#ff6b6b' },
  { id: 'guitarist', name: '🎸 Guitar', color: '#4ecdc4' },
  { id: 'bassist', name: '🎸 Bass', color: '#45b7d1' },
  { id: 'drummer', name: '🥁 Drums', color: '#f9ca24' },
  { id: 'keyboardist', name: '🎹 Keys', color: '#6c5ce7' },
];

const BandCreation = ({ onComplete, bandName, logo }) => {
  const [members, setMembers] = useState([
    { id: 1, name: '', role: 'vocalist' },
    { id: 2, name: '', role: 'guitarist' },
    { id: 3, name: '', role: 'bassist' },
    { id: 4, name: '', role: 'drummer' },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMember = members[currentIndex];
  const currentRole = ROLES.find(r => r.id === currentMember.role);

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
    if (members.length > 1) {
      const newMembers = members.filter((_, i) => i !== currentIndex);
      setMembers(newMembers);
      setCurrentIndex(Math.min(currentIndex, newMembers.length - 1));
    }
  }, [members, currentIndex]);

  const handleComplete = useCallback(() => {
    const validMembers = members.filter(m => m.name.trim());
    if (validMembers.length < 2) {
      alert('Please add at least 2 band members with names');
      return;
    }
    onComplete(validMembers);
  }, [members, onComplete]);

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < members.length - 1) setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
            Assemble Your Band
          </h1>
          <p className="text-gray-300 text-lg">
            Create your musical crew for <span className="font-bold text-purple-300">{bandName}</span>
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

            {/* Role Selector */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-300 mb-3 block">
                Role
              </label>
              <div className="grid grid-cols-5 gap-2">
                {ROLES.map(role => (
                  <button
                    key={role.id}
                    onClick={() => updateMember('role', role.id)}
                    className={`py-3 px-2 rounded-lg text-sm font-bold transition-all ${
                      currentMember.role === role.id
                        ? 'bg-purple-600 text-white ring-2 ring-purple-400 scale-105'
                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                    }`}
                    title={role.name}
                  >
                    {role.name.split(' ')[0]}
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
            <div className="p-4 bg-slate-900/50 rounded-lg border border-purple-400/20">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Position</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: currentRole.color }}
                />
                <p className="text-lg font-bold text-white">{currentRole.name}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex-1 py-2 px-4 bg-slate-700/50 text-gray-300 rounded-lg hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === members.length - 1}
              className="flex-1 py-2 px-4 bg-slate-700/50 text-gray-300 rounded-lg hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>

          {/* Member List */}
          <div className="mb-8">
            <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Band Members</p>
            <div className="space-y-2">
              {members.map((member, idx) => {
                const role = ROLES.find(r => r.id === member.role);
                const isActive = idx === currentIndex;
                return (
                  <div
                    key={member.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      isActive
                        ? 'bg-purple-600/30 border border-purple-500 ring-1 ring-purple-400'
                        : 'bg-slate-700/30 border border-slate-600/50 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: role.color }}
                        />
                        <div>
                          <p className="text-sm font-bold text-white">
                            {member.name || '(Empty)'}
                          </p>
                          <p className="text-xs text-gray-400">{role.name}</p>
                        </div>
                      </div>
                      {members.length > 2 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newMembers = members.filter((_, i) => i !== idx);
                            setMembers(newMembers);
                            setCurrentIndex(Math.min(currentIndex, newMembers.length - 1));
                          }}
                          className="text-xs px-2 py-1 bg-red-600/30 text-red-300 rounded hover:bg-red-600/50 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
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
            + Add Band Member
          </button>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleComplete}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Start Your Career
            </button>
          </div>

          {/* Info */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Minimum 2 members required • You can edit roles before starting
          </p>
        </div>
      </div>
    </div>
  );
};

export default BandCreation;
