# Song Writing Integration - Implementation Guide

## Overview
The procedural music generation system exists but isn't connected to the game. This guide shows exactly what code needs to change to make it work.

---

## Current Problem Code

### InventoryTab.jsx (Lines 25-30)
```javascript
const handleWriteSong = () => {
  if (!songName.trim()) {
    alert('Enter a song name');
    return;
  }

  const result = recordingSystem?.recordSong?.(songName, songGenre);  // ← Uses old system
  if (result?.success) {
    setSongName('');
    setShowSongForm(false);
  }
};
```

### Result
- Creates basic song with no audio
- No constraint-based generation
- No fan reactions
- No psychological modulation

---

## Solution: Integrate Procedural System

### Step 1: Update InventoryTab.jsx Imports

**Current imports:**
```javascript
import React, { useState } from 'react';
import { Music, Plus } from 'lucide-react';
```

**Add:**
```javascript
import React, { useState, useRef } from 'react';
import { Music, Plus } from 'lucide-react';
import { useMusicGeneration } from '../../hooks/useMusicGeneration';
import { SongGenerationPanel } from '../SongGenerationPanel';
import { SongPlaybackPanel } from '../SongPlaybackPanel';
```

---

### Step 2: Initialize Hook in InventoryTab

**Add inside component (after line 16):**
```javascript
export const InventoryTab = ({ gameData, recordingSystem, gameState }) => {
  const [showSongForm, setShowSongForm] = useState(false);
  const [songName, setSongName] = useState('');
  const [songGenre, setSongGenre] = useState('Rock');
  const [albumName, setAlbumName] = useState('');
  const [selectedSongs, setSelectedSongs] = useState([]);

  // NEW: Music generation
  const musicGeneration = useMusicGeneration();
  const [generatingMode, setGeneratingMode] = useState('legacy'); // 'legacy' or 'procedural'
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSong, setGeneratedSong] = useState(null);
  const [showPlaybackPanel, setShowPlaybackPanel] = useState(false);
```

---

### Step 3: Replace handleWriteSong Function

**Old function (REMOVE):**
```javascript
const handleWriteSong = () => {
  if (!songName.trim()) {
    alert('Enter a song name');
    return;
  }

  const result = recordingSystem?.recordSong?.(songName, songGenre);
  if (result?.success) {
    setSongName('');
    setShowSongForm(false);
  }
};
```

**New function (REPLACE WITH):**
```javascript
const handleWriteSong = async () => {
  if (!songName.trim()) {
    alert('Enter a song name');
    return;
  }

  setIsGenerating(true);

  try {
    // Use procedural generation if available
    if (generatingMode === 'procedural' && musicGeneration?.generateSong) {
      const song = await musicGeneration.generateSong({
        title: songName,
        genre: songGenre,
        gameState: gameState?.state || {}
      });

      if (song) {
        setGeneratedSong(song);
        setShowPlaybackPanel(true);
        setSongName('');
        setShowSongForm(false);
      } else {
        alert('Failed to generate song');
      }
    } else {
      // Fallback to legacy system
      const result = recordingSystem?.recordSong?.(songName, songGenre);
      if (result?.success) {
        setSongName('');
        setShowSongForm(false);
      }
    }
  } catch (error) {
    console.error('Song generation failed:', error);
    alert('Error generating song: ' + error.message);
  } finally {
    setIsGenerating(false);
  }
};
```

---

### Step 4: Add Mode Toggle in Form

**Find the form section (around line 70), add before genre select:**
```javascript
{showSongForm && (
  <div className="bg-card border border-primary/30 p-6 rounded-lg mb-6">
    <div className="space-y-4">
      {/* NEW: Generation mode toggle */}
      <div>
        <label className="block text-sm font-semibold mb-2">Generation Mode</label>
        <div className="flex gap-2">
          <button
            onClick={() => setGeneratingMode('legacy')}
            className={`flex-1 px-3 py-2 rounded-lg transition-all ${
              generatingMode === 'legacy'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Basic
          </button>
          <button
            onClick={() => setGeneratingMode('procedural')}
            className={`flex-1 px-3 py-2 rounded-lg transition-all ${
              generatingMode === 'procedural'
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Procedural
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {generatingMode === 'legacy'
            ? 'Quick basic song generation'
            : 'Advanced constraint-based generation'}
        </p>
      </div>

      {/* Existing song name input */}
      <div>
        <label className="block text-sm font-semibold mb-2">Song Name</label>
        <input
          type="text"
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
          placeholder="Enter song name"
          className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Existing genre select */}
      <div>
        <label className="block text-sm font-semibold mb-2">Genre</label>
        <select
          value={songGenre}
          onChange={(e) => setSongGenre(e.target.value)}
          className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option>Rock</option>
          <option>Pop</option>
          <option>Hip-Hop</option>
          <option>Electronic</option>
          <option>Jazz</option>
          <option>Metal</option>
        </select>
      </div>

      {/* Existing buttons with loading state */}
      <div className="flex gap-4">
        <button
          onClick={handleWriteSong}
          disabled={isGenerating}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
            isGenerating
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-secondary text-secondary-foreground hover:opacity-90'
          }`}
        >
          {isGenerating ? 'Generating...' : `${generatingMode === 'legacy' ? 'Record' : 'Generate'} Song ($2,500)`}
        </button>
        <button
          onClick={() => setShowSongForm(false)}
          disabled={isGenerating}
          className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-all disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
      <p className="text-xs text-muted-foreground">Current: ${(gameState?.state?.money || 0).toLocaleString()}</p>
    </div>
  </div>
)}
```

---

### Step 5: Add Playback Panel Display

**Find the "Songs" section header (around line 150), add after the songs grid:**

```javascript
        {/* Playback panel for generated song */}
        {generatedSong && showPlaybackPanel && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-primary max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-foreground">
                    🎵 {generatedSong.title || 'Generated Song'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowPlaybackPanel(false);
                      setGeneratedSong(null);
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <SongPlaybackPanel
                  song={generatedSong}
                  gameState={gameState?.state || {}}
                  dispatch={gameState?.updateGameState}
                  onAccept={() => {
                    // Add song to gameState
                    if (gameState?.updateGameState) {
                      const currentSongs = gameState.state?.songs || [];
                      gameState.updateGameState({
                        songs: [
                          ...currentSongs,
                          {
                            ...generatedSong,
                            id: `song-${Date.now()}`,
                            recordedWeek: gameState.state?.week || 0,
                            totalEarnings: 0,
                            totalStreams: 0
                          }
                        ]
                      });
                    }

                    // Close panel
                    setShowPlaybackPanel(false);
                    setGeneratedSong(null);

                    // Show success message
                    alert(`✓ "${generatedSong.title}" added to your songs!`);
                  }}
                />
              </div>
            </div>
          </div>
        )}
```

---

## Step 6: Update GamePage Props (Optional)

**If not already passing musicGeneration, add to GamePage.jsx around line 118:**

```javascript
// Near other hooks
const musicGeneration = useMusicGeneration();

// Pass to InventoryTab
<InventoryTab 
  gameData={gameData} 
  recordingSystem={recordingSystem} 
  gameState={gameState}
  musicGeneration={musicGeneration}  // NEW
/>
```

---

## Complete Modified InventoryTab.jsx Structure

```javascript
import React, { useState } from 'react';
import { Music, Plus } from 'lucide-react';
import { useMusicGeneration } from '../../hooks/useMusicGeneration';
import { SongPlaybackPanel } from '../SongPlaybackPanel';

export const InventoryTab = ({ gameData, recordingSystem, gameState }) => {
  const [showSongForm, setShowSongForm] = useState(false);
  const [songName, setSongName] = useState('');
  const [songGenre, setSongGenre] = useState('Rock');
  const [albumName, setAlbumName] = useState('');
  const [selectedSongs, setSelectedSongs] = useState([]);
  
  // Music generation
  const musicGeneration = useMusicGeneration();
  const [generatingMode, setGeneratingMode] = useState('legacy');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSong, setGeneratedSong] = useState(null);
  const [showPlaybackPanel, setShowPlaybackPanel] = useState(false);

  const handleWriteSong = async () => {
    if (!songName.trim()) {
      alert('Enter a song name');
      return;
    }

    setIsGenerating(true);

    try {
      if (generatingMode === 'procedural' && musicGeneration?.generateSong) {
        const song = await musicGeneration.generateSong({
          title: songName,
          genre: songGenre,
          gameState: gameState?.state || {}
        });

        if (song) {
          setGeneratedSong(song);
          setShowPlaybackPanel(true);
          setSongName('');
          setShowSongForm(false);
        } else {
          alert('Failed to generate song');
        }
      } else {
        const result = recordingSystem?.recordSong?.(songName, songGenre);
        if (result?.success) {
          setSongName('');
          setShowSongForm(false);
        }
      }
    } catch (error) {
      console.error('Song generation failed:', error);
      alert('Error: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateAlbum = () => {
    // ... existing code ...
  };

  const songs = gameState?.state?.songs || [];
  const albums = gameState?.state?.albums || [];
  const money = gameState?.state?.money || 0;

  return (
    <div>
      {/* Write Song Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-foreground">Songs</h3>
          <button
            onClick={() => setShowSongForm(!showSongForm)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
          >
            <Plus size={18} />
            Write Song
          </button>
        </div>

        {showSongForm && (
          <div className="bg-card border border-primary/30 p-6 rounded-lg mb-6">
            <div className="space-y-4">
              {/* Mode toggle - NEW */}
              <div>
                <label className="block text-sm font-semibold mb-2">Generation Mode</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setGeneratingMode('legacy')}
                    className={`flex-1 px-3 py-2 rounded-lg transition-all ${
                      generatingMode === 'legacy'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    Basic
                  </button>
                  <button
                    onClick={() => setGeneratingMode('procedural')}
                    className={`flex-1 px-3 py-2 rounded-lg transition-all ${
                      generatingMode === 'procedural'
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    Procedural
                  </button>
                </div>
              </div>

              {/* Song name */}
              <div>
                <label className="block text-sm font-semibold mb-2">Song Name</label>
                <input
                  type="text"
                  value={songName}
                  onChange={(e) => setSongName(e.target.value)}
                  placeholder="Enter song name"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg"
                />
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-semibold mb-2">Genre</label>
                <select
                  value={songGenre}
                  onChange={(e) => setSongGenre(e.target.value)}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg"
                >
                  <option>Rock</option>
                  <option>Pop</option>
                  <option>Hip-Hop</option>
                  <option>Electronic</option>
                  <option>Jazz</option>
                  <option>Metal</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleWriteSong}
                  disabled={isGenerating}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                    isGenerating
                      ? 'bg-muted cursor-not-allowed'
                      : 'bg-secondary text-secondary-foreground hover:opacity-90'
                  }`}
                >
                  {isGenerating ? 'Generating...' : `${generatingMode === 'legacy' ? 'Record' : 'Generate'} Song`}
                </button>
                <button
                  onClick={() => setShowSongForm(false)}
                  disabled={isGenerating}
                  className="flex-1 px-4 py-2 bg-muted rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Songs display */}
        {songs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {songs.map(song => (
              <div key={song.id} className="bg-card border border-primary/30 p-4 rounded-lg">
                <h4 className="text-foreground font-semibold mb-2">{song.name || song.title}</h4>
                <p className="text-sm text-muted-foreground mb-1">Quality: {song.quality}/10</p>
                <p className="text-sm text-muted-foreground mb-3">Genre: {song.genre}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground mb-8">No songs yet. Start writing!</p>
        )}

        {/* Playback panel - NEW */}
        {generatedSong && showPlaybackPanel && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-primary max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">🎵 {generatedSong.title}</h3>
                  <button
                    onClick={() => setShowPlaybackPanel(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>

                <SongPlaybackPanel
                  song={generatedSong}
                  gameState={gameState?.state || {}}
                  dispatch={gameState?.updateGameState}
                  onAccept={() => {
                    if (gameState?.updateGameState) {
                      const currentSongs = gameState.state?.songs || [];
                      gameState.updateGameState({
                        songs: [
                          ...currentSongs,
                          {
                            ...generatedSong,
                            id: `song-${Date.now()}`
                          }
                        ]
                      });
                    }
                    setShowPlaybackPanel(false);
                    setGeneratedSong(null);
                    alert(`✓ "${generatedSong.title}" added!`);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Albums section - existing code unchanged */}
      {/* ... */}
    </div>
  );
};
```

---

## Testing Checklist

After making changes:

- [ ] Build succeeds: `npm run build`
- [ ] No console errors when navigating to InventoryTab
- [ ] "Write Song" button appears
- [ ] Form shows both "Basic" and "Procedural" mode buttons
- [ ] "Basic" mode creates basic song (legacy system)
- [ ] "Procedural" mode shows loading, then playback panel
- [ ] Playback panel shows song scores and fan reactions
- [ ] "Accept Results" button adds song to gameState.songs[]
- [ ] Song appears in songs list
- [ ] Multiple songs can be created

---

## Troubleshooting

### Issue: Import errors for SongPlaybackPanel
**Solution**: Check that file exists at `src/components/SongPlaybackPanel.jsx`

### Issue: useMusicGeneration returns undefined
**Solution**: Verify Tone.js is installed: `npm list tone`

### Issue: generateSong() never resolves
**Solution**: Check browser console for errors in music generation engines

### Issue: Playback panel doesn't show
**Solution**: Check that `generatedSong` is not null and `showPlaybackPanel` is true

---

## Next Steps After Integration

1. Test procedural song generation
2. Verify audio playback works in TrackPlayer
3. Test MIDI export functionality
4. Integrate fan reactions with game state
5. Add music system to other game features (gigs, events, etc.)
6. Create pull request with integration changes
