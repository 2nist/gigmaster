/**
 * GigsTab.jsx - Performance history and booking
 * 
 * Displays:
 * - Performance history
 * - Gig earnings and statistics
 * - Upcoming bookings
 */
export const GigsTab = ({ gameData }) => (
  <div>
    <h3>Performance History</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid rgba(131, 56, 236, 0.3)' }}>
        <div style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Gigs</div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8338ec' }}>{gameData?.gigHistory?.length || 0}</div>
      </div>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid rgba(131, 56, 236, 0.3)' }}>
        <div style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Earnings</div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>${gameData?.gigEarnings?.toLocaleString() || 0}</div>
      </div>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid rgba(131, 56, 236, 0.3)' }}>
        <div style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Avg. Earnings</div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff006e' }}>
          ${gameData?.gigHistory?.length > 0 
            ? Math.round((gameData.gigEarnings || 0) / gameData.gigHistory.length).toLocaleString() 
            : 0
          }
        </div>
      </div>
    </div>

    <h3>Recent Performances</h3>
    {gameData?.gigHistory?.length > 0 ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {gameData.gigHistory.slice(-10).reverse().map((gig, idx) => (
          <div key={idx} style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(131, 56, 236, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>{gig.venue || 'Unknown Venue'}</p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#aaa' }}>Week {gig.week}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 0.25rem 0', color: '#22c55e', fontWeight: 'bold' }}>${gig.earnings?.toLocaleString()}</p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#aaa' }}>Success: {gig.success ? 'Yes' : 'No'}</p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p style={{ color: '#aaa' }}>No gigs yet. Start booking shows!</p>
    )}
  </div>
);
