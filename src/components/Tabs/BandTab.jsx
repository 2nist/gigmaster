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
    <h3 className="text-xl font-bold text-foreground mb-4">Band Members</h3>
    {gameData?.bandMembers?.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gameData.bandMembers.map(member => (
          <div key={member.id} className="bg-card border border-primary/30 p-4 rounded-lg hover:border-primary/60 transition-all">
            <h4 className="text-foreground font-semibold mb-2">{member.name}</h4>
            <p className="text-sm text-muted-foreground mb-1">Role: <span className="text-primary font-medium">{member.type}</span></p>
            <p className="text-sm text-muted-foreground mb-1">Skill: <span className="text-secondary font-medium">{member.skill}/10</span></p>
            <p className="text-sm text-muted-foreground mb-2">Morale: <span className="text-accent font-medium">{member.morale}%</span></p>
            {member.traits && member.traits.length > 0 && (
              <div className="text-xs text-muted-foreground/70 pt-2 border-t border-border/20">
                Traits: {member.traits.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-muted-foreground">No band members yet. Recruit some musicians!</p>
    )}
  </div>
);
