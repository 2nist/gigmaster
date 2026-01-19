/**
 * UpgradesTab.jsx - Equipment and skill upgrades
 * 
 * Displays:
 * - Purchased upgrades and improvements
 * - Equipment tier levels
 * - Upgrade history
 */
export const UpgradesTab = ({ gameData }) => (
  <div>
    <h3>Equipment Upgrades</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid rgba(131, 56, 236, 0.3)' }}>
        <div style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Studio Tier</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{gameData?.equipment?.studioTier || 'Basic'}</div>
      </div>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid rgba(131, 56, 236, 0.3)' }}>
        <div style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Transport Tier</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{gameData?.equipment?.transportTier || 'Basic'}</div>
      </div>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid rgba(131, 56, 236, 0.3)' }}>
        <div style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Gear Tier</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{gameData?.equipment?.gearTier || 'Basic'}</div>
      </div>
    </div>

    <h3>Upgrade History</h3>
    {gameData?.upgrades?.length > 0 ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {gameData.upgrades.map((upgrade, idx) => (
          <div key={idx} style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(131, 56, 236, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{upgrade.name || upgrade}</p>
              {upgrade.type && <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#aaa' }}>Type: {upgrade.type}</p>}
            </div>
            {upgrade.cost && <div style={{ color: '#22c55e', fontWeight: 'bold' }}>-${upgrade.cost.toLocaleString()}</div>}
          </div>
        ))}
      </div>
    ) : (
      <p style={{ color: '#aaa' }}>No upgrades purchased yet. Save up and improve your gear!</p>
    )}
  </div>
);
