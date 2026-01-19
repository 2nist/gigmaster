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
    <h3 className="text-xl font-bold text-foreground mb-4">Equipment Upgrades</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-card border border-primary/30 p-6 rounded-lg">
        <div className="text-muted-foreground text-xs uppercase mb-2">Studio Tier</div>
        <div className="text-2xl font-bold text-primary">{gameData?.equipment?.studioTier || 'Basic'}</div>
      </div>
      <div className="bg-card border border-secondary/30 p-6 rounded-lg">
        <div className="text-muted-foreground text-xs uppercase mb-2">Transport Tier</div>
        <div className="text-2xl font-bold text-secondary">{gameData?.equipment?.transportTier || 'Basic'}</div>
      </div>
      <div className="bg-card border border-accent/30 p-6 rounded-lg">
        <div className="text-muted-foreground text-xs uppercase mb-2">Gear Tier</div>
        <div className="text-2xl font-bold text-accent">{gameData?.equipment?.gearTier || 'Basic'}</div>
      </div>
    </div>

    <h3 className="text-xl font-bold text-foreground mb-4">Upgrade History</h3>
    {gameData?.upgrades?.length > 0 ? (
      <div className="flex flex-col gap-2">
        {gameData.upgrades.map((upgrade, idx) => (
          <div key={idx} className="bg-card border border-border/20 p-4 rounded-lg flex justify-between items-start hover:border-primary/30 transition-all">
            <div>
              <p className="text-foreground font-semibold m-0">{upgrade.name || upgrade}</p>
              {upgrade.type && <p className="text-sm text-muted-foreground mt-1">Type: {upgrade.type}</p>}
            </div>
            {upgrade.cost && <div className="text-secondary font-bold ml-4">-${upgrade.cost.toLocaleString()}</div>}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-muted-foreground">No upgrades purchased yet. Save up and improve your gear!</p>
    )}
  </div>
);
