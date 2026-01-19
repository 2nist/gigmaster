/**
 * InventoryTab.jsx - Songs and albums management
 * 
 * Displays:
 * - List of recorded songs with quality metrics
 * - Released albums
 * - Music library statistics
 */
export const InventoryTab = ({ gameData }) => (
  <div>
    <h3 className="text-xl font-bold text-foreground mb-4">Songs</h3>
    {gameData?.songs?.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {gameData.songs.map(song => (
          <div key={song.id} className="bg-card border border-primary/30 p-4 rounded-lg hover:border-primary/60 transition-all">
            <h4 className="text-foreground font-semibold mb-2">{song.name}</h4>
            <p className="text-sm text-muted-foreground mb-1">Quality: <span className="text-accent font-medium">{song.quality}/10</span></p>
            <p className="text-sm text-muted-foreground">Genre: {song.genre}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-muted-foreground mb-8">No songs recorded yet. Start writing!</p>
    )}

    <h3 className="text-xl font-bold text-foreground mb-4 mt-8">Albums</h3>
    {gameData?.albums?.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gameData.albums.map(album => (
          <div key={album.id} className="bg-card border border-secondary/30 p-4 rounded-lg hover:border-secondary/60 transition-all">
            <h4 className="text-foreground font-semibold mb-2">{album.name}</h4>
            <p className="text-sm text-muted-foreground mb-1">Songs: <span className="text-secondary font-medium">{album.songs?.length || 0}</span></p>
            <p className="text-sm text-muted-foreground">Label: {album.label || 'Independent'}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-muted-foreground">No albums released yet.</p>
    )}
  </div>
);
