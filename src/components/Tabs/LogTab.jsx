/**
 * LogTab.jsx - Game event history and log
 * 
 * Displays:
 * - Chronological game events
 * - Important milestones
 * - Decision consequences
 */
export const LogTab = ({ gameData }) => (
  <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
    <h3>Game Log</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {gameData?.log?.length > 0 ? (
        gameData.log.slice().reverse().map((entry, idx) => {
          // Determine color based on entry type
          let borderColor = 'rgba(131, 56, 236, 0.5)';
          if (entry.includes('Error') || entry.includes('Failed')) borderColor = 'rgba(255, 107, 107, 0.5)';
          else if (entry.includes('Success') || entry.includes('Earned')) borderColor = 'rgba(34, 197, 94, 0.5)';
          else if (entry.includes('Event') || entry.includes('Random')) borderColor = 'rgba(255, 165, 0, 0.5)';

          return (
            <div key={idx} style={{ 
              padding: '0.75rem 1rem', 
              backgroundColor: 'rgba(255, 255, 255, 0.03)', 
              borderLeft: `3px solid ${borderColor}`, 
              borderRadius: '0.25rem',
              fontSize: '0.9rem',
              color: '#ccc',
              lineHeight: '1.4'
            }}>
              <p style={{ margin: 0 }}>{entry}</p>
            </div>
          );
        })
      ) : (
        <p style={{ color: '#aaa' }}>No events logged yet. Start playing and generate some history!</p>
      )}
    </div>
  </div>
);
