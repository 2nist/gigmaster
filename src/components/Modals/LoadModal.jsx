import React from 'react';

export default function LoadModal({ 
  isOpen, 
  onClose, 
  onLoad, 
  saveSlots 
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Load Game</h2>
          <button className="btn-secondary" onClick={onClose}>✕</button>
        </div>
        {Object.keys(saveSlots).length === 0 ? (
          <div>
            <p style={{ color: '#94a3b8', marginBottom: '16px' }}>No saved games found</p>
            <button className="btn-secondary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {Object.entries(saveSlots).map(([name, data]) => (
              <div key={name} style={{ padding: '12px', background: '#000000', borderRadius: '6px', border: '1px solid #334155', marginBottom: '8px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{name}</div>
                <div style={{ fontSize: '0.9em', color: '#94a3b8', marginBottom: '8px' }}>
                  <div>Band: {data.bandName}</div>
                  <div>Week: {data.state.week} • Fame: {data.state.fame} • Money: ${data.state.money.toLocaleString()}</div>
                  <div style={{ fontSize: '0.85em', color: '#64748b', marginTop: '4px' }}>
                    Saved: {new Date(data.timestamp).toLocaleString()}
                  </div>
                </div>
                <button className="btn" onClick={() => onLoad(name)} style={{ width: '100%' }}>
                  Load This Game
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
