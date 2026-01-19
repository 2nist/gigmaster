/**
 * GigsModal.jsx - Gig booking modal
 */
export const GigsModal = ({ isOpen, onClose, gameData, onBookGig }) => {
  if (!isOpen) return null;

  const venues = [
    { id: 'local-bar', name: 'Local Bar', type: 'Local', earnings: 100, success: 0.7 },
    { id: 'small-venue', name: 'Small Venue', type: 'Local', earnings: 500, success: 0.65 },
    { id: 'city-arena', name: 'City Arena', type: 'Regional', earnings: 2000, success: 0.5 },
    { id: 'festival', name: 'Music Festival', type: 'Regional', earnings: 3000, success: 0.4 }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-1000">
      <div className="bg-card rounded-xl p-8 max-w-2xl w-11/12 max-h-[80vh] overflow-y-auto border-2 border-primary/30">
        <h3 className="m-0 mb-6 text-foreground text-xl font-bold">Book a Gig</h3>

        <div className="flex flex-col gap-4 mb-8">
          {venues.map(venue => (
            <div
              key={venue.id}
              className="bg-muted/50 p-4 rounded border border-border/20 flex justify-between items-center hover:border-primary/30 transition-all"
            >
              <div>
                <h4 className="m-0 mb-1 text-foreground font-semibold">{venue.name}</h4>
                <p className="m-0 text-sm text-muted-foreground">
                  {venue.type} • Success: {Math.round(venue.success * 100)}% • Earnings: ${venue.earnings}
                </p>
              </div>
              <button
                onClick={() => onBookGig?.(venue)}
                className="px-6 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded font-medium transition-colors flex-shrink-0"
              >
                Book
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-destructive/30 hover:bg-destructive/40 text-foreground rounded font-medium transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
