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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-1000" onClick={handleClose}>
      <div className="bg-card rounded-lg p-8 max-w-md w-11/12 border-2 border-primary/30" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-3 text-foreground text-xl font-bold">Write & Record Song</h2>
        <p className="mb-6 text-muted-foreground">
          Record a new single at {STUDIO_TIERS[studioTier].name}. You can edit the song title below.
        </p>
        
        <div className="mb-6">
          <label className="block mb-2 font-bold text-foreground">
            Song Title
          </label>
          <input
            type="text"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            placeholder="Enter song title..."
            className="w-full px-3 py-3 bg-input border border-border/50 rounded text-foreground placeholder-muted-foreground text-base"
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to record, or click the button below.
          </p>
        </div>

        <div className="p-3 bg-muted/30 rounded border border-border/20 mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-muted-foreground">Studio:</span>
            <strong className="text-foreground">{STUDIO_TIERS[studioTier].name}</strong>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-muted-foreground">Cost:</span>
            <strong className="text-accent">${cost}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Quality Bonus:</span>
            <strong className="text-secondary">+{STUDIO_TIERS[studioTier].qualityBonus}</strong>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded font-medium transition-colors disabled:opacity-50" 
            onClick={handleRecord}
            disabled={!songTitle || !songTitle.trim()}
          >
            Record Song
          </button>
          <button 
            className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded font-medium transition-colors" 
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
