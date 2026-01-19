/**
 * RivalsTab.jsx - Rival bands and competition
 * 
 * Displays:
 * - Rival band listings
 * - Competition metrics
 * - Relationship status and hostility levels
 */
export const RivalsTab = ({ gameData }) => (
  <div>
    <h3>Rival Bands</h3>
    {gameData?.rivals?.length > 0 ? (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {gameData.rivals.map(rival => (
          <div key={rival.id} style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(131, 56, 236, 0.3)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: rival.hostility > 70 ? '#ff6b6b' : '#fff' }}>{rival.name}</h4>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ marginBottom: '0.25rem', color: '#aaa', fontSize: '0.85rem' }}>Skill</div>
              <div style={{ height: '0.35rem', backgroundColor: '#333', borderRadius: '0.25rem', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#8338ec', width: `${(rival.skill / 10) * 100}%` }} />
              </div>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#aaa' }}>{rival.skill}/10</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ marginBottom: '0.25rem', color: '#aaa', fontSize: '0.85rem' }}>Fame</div>
              <div style={{ height: '0.35rem', backgroundColor: '#333', borderRadius: '0.25rem', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#ff006e', width: `${Math.min(rival.fame / 100, 100)}%` }} />
              </div>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#aaa' }}>{rival.fame}</p>
            </div>

            <div>
              <div style={{ marginBottom: '0.25rem', color: '#aaa', fontSize: '0.85rem' }}>Hostility</div>
              <div style={{ height: '0.35rem', backgroundColor: '#333', borderRadius: '0.25rem', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: rival.hostility > 70 ? '#ff6b6b' : '#ffa94d', width: `${rival.hostility}%` }} />
              </div>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#aaa' }}>{rival.hostility}%</p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p style={{ color: '#aaa' }}>No rivals yet. Make a name for yourself and you'll attract competition!</p>
    )}
  </div>
);
