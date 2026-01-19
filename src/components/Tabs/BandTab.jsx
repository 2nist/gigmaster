/**
 * BandTab.jsx - Band roster and member management
 * 
 * Displays:
 * - Band member list with roles
 * - Member skill levels and morale
 * - Team composition
 */
export const BandTab = ({ gameData }) => (
  <div>
    <h3>Band Members</h3>
    {gameData?.bandMembers?.length > 0 ? (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {gameData.bandMembers.map(member => (
          <div key={member.id} style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(131, 56, 236, 0.3)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>{member.name}</h4>
            <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#aaa' }}>Role: {member.type}</p>
            <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#aaa' }}>Skill: {member.skill}/10</p>
            <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#aaa' }}>Morale: {member.morale}%</p>
            {member.traits && member.traits.length > 0 && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#888' }}>
                <p style={{ margin: '0.25rem 0' }}>Traits: {member.traits.join(', ')}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p style={{ color: '#aaa' }}>No band members yet. Recruit some musicians!</p>
    )}
  </div>
);
