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
    <h3 className="text-xl font-bold text-foreground mb-4">Performance History</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-card border border-primary/30 p-6 rounded-lg">
        <div className="text-muted-foreground text-sm mb-2">Total Gigs</div>
        <div className="text-4xl font-bold text-primary">{gameData?.gigHistory?.length || 0}</div>
      </div>
      <div className="bg-card border border-secondary/30 p-6 rounded-lg">
        <div className="text-muted-foreground text-sm mb-2">Total Earnings</div>
        <div className="text-4xl font-bold text-secondary">${gameData?.gigEarnings?.toLocaleString() || 0}</div>
      </div>
      <div className="bg-card border border-accent/30 p-6 rounded-lg">
        <div className="text-muted-foreground text-sm mb-2">Avg. Earnings</div>
        <div className="text-4xl font-bold text-accent">
          ${gameData?.gigHistory?.length > 0 
            ? Math.round((gameData.gigEarnings || 0) / gameData.gigHistory.length).toLocaleString() 
            : 0
          }
        </div>
      </div>
    </div>

    <h3 className="text-xl font-bold text-foreground mb-4">Recent Performances</h3>
    {gameData?.gigHistory?.length > 0 ? (
      <div className="flex flex-col gap-2">
        {gameData.gigHistory.slice(-10).reverse().map((gig, idx) => (
          <div key={idx} className="bg-card border border-border/20 p-4 rounded-lg flex justify-between items-center hover:border-primary/30 transition-all">
            <div>
              <p className="text-foreground font-semibold mb-1">{gig.venue || 'Unknown Venue'}</p>
              <p className="text-sm text-muted-foreground">Week {gig.week}</p>
            </div>
            <div className="text-right">
              <p className="text-secondary font-bold mb-1">${gig.earnings?.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Success: <span className={gig.success ? 'text-secondary' : 'text-destructive'}>{gig.success ? 'Yes' : 'No'}</span></p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-muted-foreground">No gigs yet. Start booking shows!</p>
    )}
  </div>
);
