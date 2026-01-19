import React, { useState } from 'react';

export default function SaveModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  saveSlots,
  autoSaveEnabled,
  onToggleAutoSave 
}) {
  const [saveName, setSaveName] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    const name = saveName.trim() || `Save ${new Date().toLocaleDateString()}`;
    onSave(name);
    setSaveName('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Save Game</h2>
          <button className="btn-secondary" onClick={onClose}>✕</button>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label>Save Slot Name</label>
          <input
            type="text"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="Enter save name..."
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div style={{ marginBottom: '16px', maxHeight: '300px', overflowY: 'auto' }}>
          <h3>Existing Saves</h3>
          {Object.keys(saveSlots).length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No saved games</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(saveSlots).map(([name, data]) => (
                <div key={name} style={{ padding: '10px', background: '#0a1120', borderRadius: '6px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{name}</div>
                      <div style={{ fontSize: '0.85em', color: '#94a3b8' }}>
                        {data.bandName} • Week {data.state.week} • ${data.state.money.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.75em', color: '#64748b' }}>
                        {new Date(data.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="btn" onClick={() => onSave(name)} style={{ fontSize: '12px', padding: '4px 8px' }}>
                        Overwrite
                      </button>
                      <button className="btn danger" onClick={() => onDelete(name)} style={{ fontSize: '12px', padding: '4px 8px' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn" onClick={handleSave}>
            Save
          </button>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
        </div>
        <div style={{ marginTop: '12px', padding: '8px', background: '#064e3b', borderRadius: '4px', fontSize: '0.85em' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoSaveEnabled}
              onChange={(e) => onToggleAutoSave(e.target.checked)}
            />
            Enable Auto-Save (saves automatically each week)
          </label>
        </div>
      </div>
    </div>
  );
}
