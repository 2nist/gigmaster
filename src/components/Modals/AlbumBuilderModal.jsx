import React, { useState, useEffect } from 'react';
import { STUDIO_TIERS } from '../../utils/constants';

export default function AlbumBuilderModal({ 
  isOpen, 
  onClose, 
  onRecordAlbum, 
  songs, 
  studioTier,
  difficulty 
}) {
  const [selectedSongs, setSelectedSongs] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedSongs([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const availableSongs = songs.filter(s => !s.inAlbum);
  const costMultiplier = difficulty === 'easy' ? 0.8 : difficulty === 'hard' ? 1.2 : 1;
  const albumCost = Math.floor(
    STUDIO_TIERS[studioTier].recordCost * selectedSongs.length * 0.8 * 1.5 * costMultiplier
  );

  const toggleSong = (songTitle) => {
    if (selectedSongs.includes(songTitle)) {
      setSelectedSongs(prev => prev.filter(t => t !== songTitle));
    } else {
      if (selectedSongs.length >= 12) {
        alert('Albums can have at most 12 songs.');
        return;
      }
      setSelectedSongs(prev => [...prev, songTitle]);
    }
  };

  const handleRecord = () => {
    if (selectedSongs.length < 8) {
      alert('Need at least 8 songs to release an album (maximum 12).');
      return;
    }
    onRecordAlbum(selectedSongs);
    setSelectedSongs([]);
    onClose();
  };

  const selectedSongObjects = songs.filter(s => selectedSongs.includes(s.title));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <h2 style={{ marginBottom: '12px' }}>Build Album</h2>
        <p style={{ marginBottom: '20px', color: '#94a3b8' }}>
          Select 8-12 songs to compile into an album. Albums provide sustained streaming revenue and boost your overall reputation.
        </p>
        
        {availableSongs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            <p>You don't have any songs available for an album.</p>
            <p style={{ fontSize: '0.9em', marginTop: '8px' }}>All your songs are already part of albums, or you need to record more singles.</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <strong>Available Songs ({availableSongs.length})</strong>
                <span style={{ color: selectedSongs.length >= 8 ? '#10b981' : '#f59e0b', fontSize: '0.9em' }}>
                  Selected: {selectedSongs.length} / 12
                </span>
              </div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                gap: '8px',
                maxHeight: '400px',
                overflowY: 'auto',
                padding: '8px',
                background: '#000000',
                borderRadius: '8px',
                border: '1px solid #334155'
              }}>
                {availableSongs.map((song) => {
                  const isSelected = selectedSongs.includes(song.title);
                  return (
                    <div
                      key={song.title}
                      onClick={() => toggleSong(song.title)}
                      style={{
                        padding: '10px',
                        background: isSelected ? '#1e3a8a' : '#0f172a',
                        border: `2px solid ${isSelected ? '#3b82f6' : '#334155'}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        opacity: isSelected ? 1 : 0.8
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = '#475569';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = '#334155';
                      }}
                    >
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{song.title}</div>
                      <div style={{ fontSize: '0.8em', color: '#94a3b8' }}>
                        Q{song.quality} • Pop {song.popularity || 0}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedSongs.length > 0 && (
              <div style={{ 
                marginBottom: '20px', 
                padding: '12px', 
                background: '#064e3b', 
                borderRadius: '8px',
                border: '1px solid #10b981'
              }}>
                <strong style={{ color: '#10b981' }}>Album Preview</strong>
                <div style={{ marginTop: '8px', fontSize: '0.9em', color: '#94a3b8' }}>
                  <div>Songs: {selectedSongs.length}</div>
                  <div>
                    Avg Quality: {selectedSongObjects.length > 0 
                      ? Math.round(selectedSongObjects.reduce((sum, s) => sum + (s.quality || 0), 0) / selectedSongObjects.length)
                      : 0}%
                  </div>
                  <div>
                    Estimated Album Quality: ~{selectedSongObjects.length > 0
                      ? Math.min(100, Math.round(
                          (selectedSongObjects.reduce((sum, s) => sum + (s.quality || 0), 0) / selectedSongObjects.length) +
                          STUDIO_TIERS[studioTier].qualityBonus * 1.5
                        ))
                      : 0}%
                  </div>
                  <div style={{ marginTop: '4px', color: '#f59e0b' }}>
                    Estimated Cost: ${albumCost}
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                className="btn-secondary" 
                onClick={() => {
                  setSelectedSongs([]);
                  onClose();
                }}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                className="btn"
                onClick={handleRecord}
                disabled={selectedSongs.length < 8 || selectedSongs.length > 12}
                style={{ 
                  flex: 1,
                  opacity: (selectedSongs.length >= 8 && selectedSongs.length <= 12) ? 1 : 0.5,
                  cursor: (selectedSongs.length >= 8 && selectedSongs.length <= 12) ? 'pointer' : 'not-allowed'
                }}
              >
                Release Album ({selectedSongs.length} songs)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
