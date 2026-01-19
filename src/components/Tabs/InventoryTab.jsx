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
    <h3>Songs</h3>
    {gameData?.songs?.length > 0 ? (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {gameData.songs.map(song => (
          <div key={song.id} style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(131, 56, 236, 0.3)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>{song.name}</h4>
            <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#aaa' }}>Quality: {song.quality}/10</p>
            <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#aaa' }}>Genre: {song.genre}</p>
          </div>
        ))}
      </div>
    ) : (
      <p style={{ color: '#aaa' }}>No songs recorded yet. Start writing!</p>
    )}

    <h3 style={{ marginTop: '2rem' }}>Albums</h3>
    {gameData?.albums?.length > 0 ? (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {gameData.albums.map(album => (
          <div key={album.id} style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(131, 56, 236, 0.3)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>{album.name}</h4>
            <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#aaa' }}>Songs: {album.songs?.length || 0}</p>
            <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#aaa' }}>Label: {album.label || 'Independent'}</p>
          </div>
        ))}
      </div>
    ) : (
      <p style={{ color: '#aaa' }}>No albums released yet.</p>
    )}
  </div>
);
