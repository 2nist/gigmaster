import React from 'react';
import { X } from 'lucide-react';
import { getBandLogoStyle } from '../../utils/helpers';

export default function BandStatsModal({ 
  isOpen, 
  onClose, 
  bandStats, 
  fontOptions 
}) {
  if (!isOpen || !bandStats) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            {bandStats.isPlayer ? (
              <span 
                style={{
                  ...getBandLogoStyle(bandStats.name, fontOptions),
                  border: '2px solid #3b82f6',
                  padding: '4px 8px',
                  borderRadius: '4px' 
                }}
              >
                Your Band
              </span>
            ) : (
              <span style={getBandLogoStyle(bandStats.name, fontOptions)}>
                {bandStats.name}
              </span>
            )}
          </h2>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div style={{ 
            padding: '16px', 
            background: '#000000', 
            borderRadius: '8px',
            border: '1px solid #334155'
          }}>
            <div style={{ color: '#94a3b8', fontSize: '0.85em', marginBottom: '4px' }}>Chart Position</div>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#3b82f6' }}>#{bandStats.position}</div>
          </div>

          <div style={{ 
            padding: '16px', 
            background: '#000000', 
            borderRadius: '8px',
            border: '1px solid #334155'
          }}>
            <div style={{ color: '#94a3b8', fontSize: '0.85em', marginBottom: '4px' }}>Fame</div>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#f59e0b' }}>{bandStats.fame}</div>
          </div>

          <div style={{ 
            padding: '16px', 
            background: '#000000', 
            borderRadius: '8px',
            border: '1px solid #334155'
          }}>
            <div style={{ color: '#94a3b8', fontSize: '0.85em', marginBottom: '4px' }}>Songs</div>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#10b981' }}>{bandStats.songs?.length || 0}</div>
          </div>

          <div style={{ 
            padding: '16px', 
            background: '#000000', 
            borderRadius: '8px',
            border: '1px solid #334155'
          }}>
            <div style={{ color: '#94a3b8', fontSize: '0.85em', marginBottom: '4px' }}>Albums</div>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#8b5cf6' }}>{bandStats.albums?.length || 0}</div>
          </div>
        </div>

        <div style={{ 
          padding: '16px', 
          background: '#0f172a', 
          borderRadius: '8px',
          border: '1px solid #334155',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '1.1em' }}>Streaming Stats</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#94a3b8' }}>Weekly Streams</span>
            <strong style={{ color: '#3b82f6', fontSize: '1.2em' }}>
              {bandStats.totalStreams ? `${(bandStats.totalStreams / 1000).toFixed(1)}k` : '0'}
            </strong>
          </div>
          {bandStats.songs && bandStats.songs.length > 0 && (() => {
            const topSong = [...(bandStats.songs || [])].sort((a, b) => (b.weeklyStreams || 0) - (a.weeklyStreams || 0))[0];
            const topSongStreams = topSong?.weeklyStreams || 0;
            return (
              <div style={{ fontSize: '0.85em', color: '#64748b', marginTop: '8px' }}>
                Top Song: {topSong?.title || 'N/A'} ({((topSongStreams) / 1000).toFixed(1)}k streams/wk)
              </div>
            );
          })()}
        </div>

        {bandStats.songs && bandStats.songs.length > 0 && (
          <div style={{ 
            padding: '16px', 
            background: '#000000', 
            borderRadius: '8px',
            border: '1px solid #334155',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '1.1em' }}>Top Songs</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[...(bandStats.songs || [])]
                .sort((a, b) => (b.weeklyStreams || 0) - (a.weeklyStreams || 0))
                .slice(0, 5)
                .map((song, idx) => (
                  <div key={song.title || idx} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px',
                    background: '#000000',
                    borderRadius: '4px'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{song.title || 'Untitled'}</div>
                      <div style={{ fontSize: '0.85em', color: '#94a3b8' }}>
                        Q{song.quality || 0} • Pop {song.popularity || 0}
                      </div>
                    </div>
                    <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>
                      {song.weeklyStreams ? `${(song.weeklyStreams / 1000).toFixed(1)}k` : '0'} streams/wk
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {bandStats.albums && bandStats.albums.length > 0 && (
          <div style={{ 
            padding: '16px', 
            background: '#000000', 
            borderRadius: '8px',
            border: '1px solid #334155'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '1.1em' }}>Albums</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {bandStats.albums.map((album, idx) => {
                const albumStreams = Math.floor((album.quality || 0) * 150 + (album.popularity || 0) * 80) * Math.max(0.3, 1 - (album.age || 0) * 0.02);
                return (
                  <div key={album.name || idx} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px',
                    background: '#000000',
                    borderRadius: '4px'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{album.name || 'Untitled Album'}</div>
                      <div style={{ fontSize: '0.85em', color: '#94a3b8' }}>
                        Q{album.quality || 0} • Pop {album.popularity || 0} • {album.songs || 0} songs • Age {album.age || 0}w
                      </div>
                    </div>
                    <div style={{ color: '#8b5cf6', fontWeight: 'bold' }}>
                      {albumStreams > 0 ? `${(albumStreams / 1000).toFixed(1)}k` : '0'} streams/wk
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
