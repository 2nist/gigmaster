/**
 * LogTab.jsx - Game event history and log
 * 
 * Displays:
 * - Chronological game events
 * - Important milestones
 * - Decision consequences
 */
export const LogTab = ({ gameData }) => (
  <div className="max-h-[600px] overflow-y-auto">
    <h3 className="text-xl font-bold text-foreground mb-4">Game Log</h3>
    <div className="flex flex-col gap-1">
      {gameData?.log?.length > 0 ? (
        gameData.log.slice().reverse().map((entry, idx) => {
          // Determine styling based on entry type
          let borderColor = 'border-primary/50';
          let bgColor = 'bg-primary/5';
          if (entry.includes('Error') || entry.includes('Failed')) {
            borderColor = 'border-destructive/50';
            bgColor = 'bg-destructive/5';
          } else if (entry.includes('Success') || entry.includes('Earned')) {
            borderColor = 'border-secondary/50';
            bgColor = 'bg-secondary/5';
          } else if (entry.includes('Event') || entry.includes('Random')) {
            borderColor = 'border-accent/50';
            bgColor = 'bg-accent/5';
          }

          return (
            <div key={idx} className={`px-4 py-3 ${bgColor} border-l-4 ${borderColor} rounded text-sm text-foreground/80 leading-relaxed`}>
              <p className="m-0">{entry}</p>
            </div>
          );
        })
      ) : (
        <p className="text-muted-foreground">No events logged yet. Start playing and generate some history!</p>
      )}
    </div>
  </div>
);
