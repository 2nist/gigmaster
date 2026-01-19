import React, { useState, useEffect } from 'react';
import { STUDIO_TIERS } from '../../utils/constants';

export default function WriteSongModal({ 
  isOpen, 
  onClose, 
  onRecord, 
  studioTier, 
  difficulty,
  defaultTitle,
  addLog 
}) {
  const [songTitle, setSongTitle] = useState(defaultTitle || '');
  
  useEffect(() => {
    if (isOpen && defaultTitle) {
      setSongTitle(defaultTitle);
    }
  }, [isOpen, defaultTitle]);

  if (!isOpen) return null;

  const costMultiplier = difficulty === 'easy' ? 0.8 : difficulty === 'hard' ? 1.2 : 1;
  const cost = Math.floor(STUDIO_TIERS[studioTier].recordCost * costMultiplier);

  const handleRecord = () => {
    if (!songTitle || !songTitle.trim()) {
      return;
    }
    onRecord(songTitle.trim());
    setSongTitle('');
  };

  const handleClose = () => {
    setSongTitle('');
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRecord();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <h2 style={{ marginBottom: '12px' }}>Write & Record Song</h2>
        <p style={{ marginBottom: '20px', color: '#94a3b8' }}>
          Record a new single at {STUDIO_TIERS[studioTier].name}. You can edit the song title below.
        </p>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Song Title
          </label>
          <input
            type="text"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            placeholder="Enter song title..."
            style={{
              width: '100%',
              padding: '12px',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '1em'
            }}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <p style={{ fontSize: '0.85em', color: '#94a3b8', marginTop: '8px' }}>
            Press Enter to record, or click the button below.
          </p>
        </div>

        <div style={{ 
          padding: '12px', 
          background: '#1e293b', 
          borderRadius: '6px',
          border: '1px solid #334155',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ color: '#94a3b8' }}>Studio:</span>
            <strong>{STUDIO_TIERS[studioTier].name}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ color: '#94a3b8' }}>Cost:</span>
            <strong>${cost}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>Quality Bonus:</span>
            <strong>+{STUDIO_TIERS[studioTier].qualityBonus}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn" 
            onClick={handleRecord}
            style={{ flex: 1 }}
            disabled={!songTitle || !songTitle.trim()}
          >
            Record Song
          </button>
          <button 
            className="btn-secondary" 
            onClick={handleClose}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
