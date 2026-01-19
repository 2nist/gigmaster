/**
 * DashboardTab.jsx - Game overview and quick stats
 * 
 * Displays:
 * - Psychological state metrics
 * - Quick game statistics
 * - Key performance indicators
 */
export const DashboardTab = ({ gameData, dialogueState }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
    <div style={{ backgroundColor: 'rgba(131, 56, 236, 0.1)', padding: '1.5rem', borderRadius: '0.5rem', border: '2px solid rgba(131, 56, 236, 0.3)' }}>
      <h3 style={{ margin: '0 0 1rem 0' }}>Psychological State</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
        <div>
          <div style={{ marginBottom: '0.25rem', color: '#aaa' }}>Stress Level</div>
          <div style={{ height: '0.5rem', backgroundColor: '#333', borderRadius: '0.25rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', backgroundColor: '#ff6b6b', width: `${dialogueState?.psychologicalState?.stress_level || 0}%` }} />
          </div>
        </div>
        <div>
          <div style={{ marginBottom: '0.25rem', color: '#aaa' }}>Moral Integrity</div>
          <div style={{ height: '0.5rem', backgroundColor: '#333', borderRadius: '0.25rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', backgroundColor: '#51cf66', width: `${dialogueState?.psychologicalState?.moral_integrity || 100}%` }} />
          </div>
        </div>
        <div>
          <div style={{ marginBottom: '0.25rem', color: '#aaa' }}>Addiction Risk</div>
          <div style={{ height: '0.5rem', backgroundColor: '#333', borderRadius: '0.25rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', backgroundColor: '#ffa94d', width: `${dialogueState?.psychologicalState?.addiction_risk || 0}%` }} />
          </div>
        </div>
      </div>
    </div>

    <div style={{ backgroundColor: 'rgba(131, 56, 236, 0.1)', padding: '1.5rem', borderRadius: '0.5rem', border: '2px solid rgba(131, 56, 236, 0.3)' }}>
      <h3 style={{ margin: '0 0 1rem 0' }}>Quick Stats</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
        <div>Songs: <strong>{gameData?.songs?.length || 0}</strong></div>
        <div>Albums: <strong>{gameData?.albums?.length || 0}</strong></div>
        <div>Gigs Completed: <strong>{gameData?.gigHistory?.length || 0}</strong></div>
        <div>Total Earnings: <strong>${gameData?.totalEarnings?.toLocaleString() || 0}</strong></div>
      </div>
    </div>
  </div>
);
