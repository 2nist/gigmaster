# Song Writing System Architecture & Integration Gap

## Visual Overview

### Current Game State Flow (What Exists)
```
┌─────────────────────────────────────────────────────────┐
│                     GAME ENTRY POINT                     │
│                      (App.jsx)                           │
│  - useGameState() → gameState.state                      │
│  - useGameLogic() → game actions                         │
│  - useRecordingSystem() → recordSong()                   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓
        ┌──────────────────────────────┐
        │      GamePage.jsx            │
        │  Main game interface         │
        │  - 7 tabs available          │
        └──────────┬───────────────────┘
                   │
          ┌────────┼────────┬─────────┬──────────┐
          ↓        ↓        ↓         ↓          ↓
      Dashboard Inventory   Band     Gigs    Rivals
         Tab      Tab        Tab      Tab     (other)
          │        │
          │        └─────────────────────────┐
          │                                  │
     (Quick      InventoryTab.jsx           │
      Action)    ┌──────────────────────┐   │
       │         │ Write Song Form      │   │
       │         │ - Name input         │   │
       │         │ - Genre select       │   │
       ├────────→│ - Submit button      │   │
       │         └──────┬───────────────┘   │
       │                │                   │
       │                ↓                   │
       │        recordingSystem             │
       │        .recordSong()               │
       │        (useRecordingSystem)        │
       │                │                   │
       │                ↓                   │
       │      ┌──────────────────────┐     │
       └─────→│  Song Created        │←────┘
              │ - Basic object       │
              │ - No audio           │
              │ - No constraints     │
              │ - Added to gameState │
              └──────────────────────┘
```

---

### Procedural Music System (Built but Orphaned)
```
┌──────────────────────────────────────────────────────────────┐
│           PROCEDURAL MUSIC GENERATION SYSTEM                  │
│                 (src/music/ directory)                        │
│                    ❌ NEVER CALLED                            │
└──────────────────────────────────────────────────────────────┘

PHASE 1: Generation Engines
┌──────────────────────────────────────────────────────────┐
│                   MusicGenerator.js                      │
│              (Orchestrator - NOT CALLED)                 │
└────┬──────────┬──────────────┬──────────────┬───────────┘
     │          │              │              │
     ↓          ↓              ↓              ↓
┌─────────┐ ┌────────┐ ┌───────────┐ ┌───────────┐
│Constraint│ │  Drum  │ │ Harmony  │ │  Melody  │
│ Engine  │ │ Engine │ │ Engine   │ │ Engine   │
│         │ │        │ │          │ │          │
│Maps:    │ │E-GMD   │ │Chord     │ │Lakh Motif│
│-Skill  │ │Patterns│ │Filtering │ │Assembly  │
│-Stress │ │Psych   │ │Mode/     │ │Skill:    │
│-Label  │ │Mods    │ │Valence   │ │Originality
│-Events │ │        │ │Complexity│ │Burnout   │
└────┬────┘ └───┬────┘ └────┬─────┘ └────┬─────┘
     │          │           │            │
     └──────────┴───────────┴────────────┘
              │
              ↓
    ┌─────────────────────┐
    │  SeededRandom       │
    │  (Deterministic RNG)│
    │  Reproducible Music │
    └─────────────────────┘


PHASE 2: Audio Rendering  
┌──────────────────────────────────────────────────────────┐
│                     Song Object                          │
│         (drums, harmony, melody, metadata)               │
└────┬─────────────────────────────────────┬───────────────┘
     │                                     │
     ↓                                     ↓
┌──────────────┐              ┌────────────────────┐
│ ToneRenderer │              │   MIDIExporter     │
│              │              │                    │
│ Synthesis:   │              │ Export Formats:    │
│-Melody:      │              │ - MIDI .mid        │
│ Triangle     │              │ - TrackDraft JSON  │
│-Harmony:     │              │                    │
│ 4-voice sine │              │ Download to PC/DAW │
│-Drums: kick/ │              │                    │
│ snare/hihat  │              │                    │
│              │              │                    │
│Playback:     │              │                    │
│play/pause/   │              │                    │
│resume/stop   │              │                    │
└──────┬───────┘              └────────┬───────────┘
       │                               │
       ↓                               ↓
    Tone.js Audio              TrackDraft Project
  (Browser playback)           (External production)


PHASE 3: Game Integration
┌─────────────────────────────────────────────────────────┐
│          useMusicGeneration() Hook                       │
│         (NOT IMPORTED ANYWHERE IN GAME)                 │
└────┬────────────────┬─────────────┬────────────┬────────┘
     │                │             │            │
     ↓                ↓             ↓            ↓
 generateSong()   play()        pause()    exportMIDI()
 (async)          (Tone)        (Tone)     (download)


UI Components (Built but Not Used)
┌────────────────────────────┐  ┌─────────────────────┐
│  SongGenerationPanel       │  │ SongPlaybackPanel   │
│  ❌ NOT IMPORTED           │  │ ❌ NOT IMPORTED     │
│                            │  │                     │
│ Genre selection buttons    │  │ TrackPlayer embed   │
│ Cost validation            │  │ Score visualization │
│ Generate button (loading)  │  │ Fan reactions       │
│ Status messages            │  │ Game impact display │
│                            │  │ Accept results btn  │
└────────────────────────────┘  └─────────────────────┘


Fan Reactions (Built but Disconnected)
┌────────────────────────────────────┐
│     FanReactionSystem              │
│   ❌ NOT CALLED FROM GAME          │
│                                    │
│ Converts song scores to:           │
│ - Narrative feedback               │
│ - Game impact:                     │
│   * Fame gain                      │
│   * Money gain/loss                │
│   * Morale shift                   │
│   * Loyalty change                 │
└────────────────────────────────────┘
```

---

## Integration Gap Diagram

```
    CURRENT STATE (DISCONNECTED)              REQUIRED INTEGRATION

    InventoryTab                              InventoryTab
         │                                         │
         ├─→ recordingSystem                       ├─→ useMusicGeneration
         │   .recordSong()                        │   .generateSong()
         │        │                               │        │
         │        ↓                               │        ↓
         └──→ Basic Song Object          ┌──────→ MusicGenerator
              (no audio, no              │          (procedural)
               constraints)              │              │
                                         │        ┌─────┴─────┬──────┬────────┐
                                         │        ↓     ↓      ↓      ↓
                                         │    Constraint Drum Harmony Melody
                                         │    Engine  Engine Engine  Engine
                                         │        │
                                         └────────┴─→ Rich Song Object
                                                       (audio+midi+scores)
                                                          │
                                                          ↓
                                                 SongPlaybackPanel
                                                 (TrackPlayer + 
                                                  FanReactionSystem)
                                                          │
                                                          ↓
                                                  User clicks "Accept"
                                                          │
                                                          ↓
                                                    Game state updated
```

---

## What Currently Works vs What's Orphaned

### ✅ ACTIVE - Recording System Path
```
User Action                  Code Path                  Result
─────────────────────────────────────────────────────────────────
Click "Write Song"   →   recordingSystem              Basic song object
                         .recordSong()                added to gameState
                         (useRecordingSystem)         ✅ Works
```

### ❌ ORPHANED - Music Generation Path  
```
User Action                  Code Path                  Result
─────────────────────────────────────────────────────────────────
(No UI exists)       →   useMusicGeneration           ❌ Never called
                         .generateSong()              ❌ Never connected
                         (useMusicGeneration)         ❌ Not in game UI
                            ↓
                         MusicGenerator
                         ConstraintEngine
                         DrumEngine
                         HarmonyEngine
                         MelodyEngine
                            ↓
                         ToneRenderer / MIDIExporter
                            ↓
                         FanReactionSystem
```

---

## System Comparison

| Aspect | Legacy System | Procedural System |
|--------|---------------|-------------------|
| **File** | `useRecordingSystem.js` | `useMusicGeneration.js` + engines |
| **Location** | `src/hooks/` | `src/music/` + `src/hooks/` |
| **Status** | Integrated ✅ | Orphaned ❌ |
| **Song Creation** | Formula-based | Constraint-based |
| **Used By** | InventoryTab, Dashboard | Nobody |
| **Audio Playback** | No | Yes (Tone.js) |
| **MIDI Export** | No | Yes |
| **Fan Reactions** | In system | In FanReactionSystem (unused) |
| **Game Impact** | Simple (just stats) | Full (psych, label, events) |
| **Reproducibility** | Random each time | Seeded (deterministic) |
| **Customization** | Form inputs (name, genre) | Constraint parameters |

---

## Integration Checkpoints

### Level 1: Basic Integration (Quick Win)
```
✓ Import useMusicGeneration in InventoryTab
✓ Call generateSong() when user clicks "Write Song"
✓ Display generated song details
✓ Add to gameState.songs[]
→ Result: New system partially connected
```

### Level 2: Full UI Integration
```
✓ Import SongGenerationPanel component
✓ Import SongPlaybackPanel component
✓ Create modal workflow for song creation
✓ Show generation progress
✓ Play audio preview
→ Result: Full UI interaction with generation
```

### Level 3: Complete Game Integration
```
✓ Wire FanReactionSystem output
✓ Apply game impact to gameState
✓ Update fame/money/morale/loyalty
✓ Add to game logs
✓ Integrate with event system
→ Result: Music system fully alive in game
```

### Level 4: Advanced Features (Future)
```
✓ MIDI export working in UI
✓ TrackDraft integration tested
✓ Seed-based reproducibility UI
✓ Constraint parameter UI
→ Result: Professional music production workflow
```

---

## Current Dependency Chain

```
❌ BROKEN CHAIN (Music System)
GamePage
  ↓ should use
useMusicGeneration
  ↓ should call
MusicGenerator
  ↓ should use
ConstraintEngine, DrumEngine, HarmonyEngine, MelodyEngine
  ↓ should output
Rich Song Object
  ↓ should display in
SongGenerationPanel + SongPlaybackPanel
  ↓ should process with
FanReactionSystem
  ↓ should update
gameState

Current: None of these connections exist


✅ WORKING CHAIN (Legacy System)
GamePage
  ✓ has
useRecordingSystem
  ✓ calls
recordSong()
  ✓ creates
Basic Song Object
  ✓ adds to
gameState.songs[]
  ✓ displays in
InventoryTab

Current: Full chain complete
```

---

## Decision Tree

```
                    Start Here: "Why can't I write songs?"
                              │
                    ┌─────────┴──────────┐
                    │                    │
            "I can write songs"      "I can't write songs"
                    │                    │
                    ↓                    ↓
            Using legacy system    Looking for procedural
            (basic song object)    system (procedural generation)
                    │                    │
                    │            ┌───────┴────────────────┐
                    │            │                        │
                    │     "I want audio"        "I want fan reactions"
                    │            │                        │
                    │            ↓                        ↓
                    │     Need Tone.js            Need FanReactionSystem
                    │     ToneRenderer            + SongPlaybackPanel
                    │     TrackPlayer            + game impact updates
                    │            │                        │
                    │            ↓                        ↓
                    │     Integrate via              Integrate via
                    │     useMusicGeneration         useMusicGeneration
                    │     generateSong()            generateSong()
                    │            │                        │
                    └────────────┴────────────────────────┘
                                 │
                                 ↓
                    Implement Integration Plan
                    (see SONG_WRITING_SYSTEM_REVIEW.md)
```

---

## Summary

**Status**: Two separate song writing systems exist in parallel
- **Legacy**: Integrated and working (basic songs, no audio)
- **Procedural**: Complete and tested (constraint-based, audio+MIDI), but never wired into the game

**Problem**: The new system's UI components and hooks were created but never imported or called anywhere in the game loop.

**Solution**: Connect the orphaned procedural system to the game UI through InventoryTab or GamePage.

**Complexity**: Low - mostly importing and calling existing functions
