/**
 * DashboardTab.jsx - Game overview and quick stats with gameplay controls
 * 
 * Displays:
 * - Psychological state metrics
 * - Quick game statistics
 * - Key performance indicators
 * - Gameplay action buttons
 */
export const DashboardTab = ({ 
  gameData, 
  dialogueState,
  gameState,
  onAdvanceWeek,
  onTriggerEvent
}) => (
  <div className="flex flex-col gap-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Psychological State Card */}
      <div className="bg-card border-2 border-primary/30 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-foreground mb-4">Psychological State</h3>
        <div className="flex flex-col gap-3 text-sm">
          <div>
            <div className="text-muted-foreground mb-1">Stress Level ({Math.round(dialogueState?.psychologicalState?.stress_level || 0)}%)</div>
            <div className="h-2 bg-input rounded overflow-hidden">
              <div className="h-full bg-destructive" style={{ width: `${dialogueState?.psychologicalState?.stress_level || 0}%` }} />
            </div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Moral Integrity ({Math.round(dialogueState?.psychologicalState?.moral_integrity || 100)}%)</div>
            <div className="h-2 bg-input rounded overflow-hidden">
              <div className="h-full bg-secondary" style={{ width: `${dialogueState?.psychologicalState?.moral_integrity || 100}%` }} />
            </div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Addiction Risk ({Math.round(dialogueState?.psychologicalState?.addiction_risk || 0)}%)</div>
            <div className="h-2 bg-input rounded overflow-hidden">
              <div className="h-full bg-accent" style={{ width: `${dialogueState?.psychologicalState?.addiction_risk || 0}%` }} />
            </div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Paranoia ({Math.round(dialogueState?.psychologicalState?.paranoia || 0)}%)</div>
            <div className="h-2 bg-input rounded overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${dialogueState?.psychologicalState?.paranoia || 0}%` }} />
            </div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Depression ({Math.round(dialogueState?.psychologicalState?.depression || 0)}%)</div>
            <div className="h-2 bg-input rounded overflow-hidden">
              <div className="h-full bg-primary/70" style={{ width: `${dialogueState?.psychologicalState?.depression || 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Card */}
      <div className="bg-card border-2 border-primary/30 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-foreground mb-4">Quick Stats</h3>
        <div className="flex flex-col gap-3 text-sm">
          <div className="text-muted-foreground">Songs: <strong className="text-foreground">{gameData?.songs?.length || 0}</strong></div>
          <div className="text-muted-foreground">Albums: <strong className="text-foreground">{gameData?.albums?.length || 0}</strong></div>
          <div className="text-muted-foreground">Gigs Completed: <strong className="text-foreground">{gameData?.gigHistory?.length || 0}</strong></div>
          <div className="text-muted-foreground">Total Earnings: <strong className="text-accent">${gameData?.totalEarnings?.toLocaleString() || 0}</strong></div>
          <div className="text-muted-foreground">Morale: <strong className="text-foreground">{gameData?.morale || 70}/100</strong></div>
          <div className="text-muted-foreground">Band Members: <strong className="text-foreground">{gameData?.bandMembers?.length || 0}</strong></div>
        </div>
      </div>

      {/* Faction Standing Card */}
      <div className="bg-card border-2 border-primary/30 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-foreground mb-4">Faction Standing</h3>
        <div className="flex flex-col gap-3 text-sm">
          {dialogueState?.narrativeState?.factionReputation ? (
            Object.entries(dialogueState.narrativeState.factionReputation).map(([faction, standing]) => (
              <div key={faction}>
                <div className="text-muted-foreground mb-1 capitalize">{faction}</div>
                <div className="h-2 bg-input rounded overflow-hidden">
                  <div 
                    className={`h-full ${
                      standing > 0 ? 'bg-secondary' : standing < 0 ? 'bg-destructive' : 'bg-primary'
                    }`}
                    style={{ width: `${Math.abs(standing) > 100 ? 100 : Math.abs(standing)}%` }} 
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {standing > 0 ? '+' : ''}{Math.round(standing)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">No faction data yet</div>
          )}
        </div>
      </div>
    </div>

    {/* Gameplay Controls */}
    <div className="bg-card border-2 border-accent/30 p-8 rounded-lg flex flex-col gap-4">
      <h3 className="text-lg font-bold text-foreground">Gameplay</h3>
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={onTriggerEvent}
          className="px-6 py-3 bg-primary/20 hover:bg-primary/30 text-foreground border-2 border-primary/40 rounded-lg transition-all text-sm font-medium"
        >
          🎭 Trigger Random Event
        </button>

        <button
          onClick={onAdvanceWeek}
          className="flex-1 min-w-[200px] px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground border-none rounded-lg transition-all text-base font-bold"
        >
          ⏭️ Advance Week
        </button>
      </div>
      <p className="text-xs text-muted-foreground m-0">
        Advance the week to trigger consequences, events, and progress your career. Events may appear automatically or on demand.
      </p>
    </div>
  </div>
);
