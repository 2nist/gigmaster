/**
 * ToneRenderer - Enhanced audio renderer with advanced Tone.js integration
 * 
 * Features:
 * - Multi-layer instrument synthesis
 * - Dynamic reverb and spatial effects
 * - Real-time effects processing
 * - Genre-specific audio profiles
 * - Member skill-responsive audio
 * - Advanced mixing and mastering
 */

import * as Tone from 'tone';
import { getGenreEffects, adjustEffectsForGameState, DEFAULT_EFFECTS } from './EffectsConfig.js';
import { getKeyboardTypeForGenre } from './KeyboardConfig.js';
import { SeededRandom } from '../utils/SeededRandom.js';
import { GENRE_AUDIO_PROFILES } from '../profiles/GENRE_AUDIO_PROFILES.js';

export class ToneRenderer {
  constructor() {
    this.isInitialized = false;
    this.isPlaying = false;
    this.currentTime = 0;
    
    // Enhanced synth instances with multiple layers
    this.melodySynth = null;
    this.melodyLayer2 = null; // Second layer for richer sound
    this.harmonyVoices = [];
    this.keyboardSynth = null;
    this.keyboardLayer2 = null; // Second keyboard layer
    this.bassSynth = null; // Dedicated bass synth
    this.keyboardType = null;
    
    // Enhanced drum synthesis
    this.drums = {
      kick: null,
      snare: null,
      hihat: null,
      tom: null, // Additional percussion
      cymbal: null
    };
    
    // Advanced effect chains with multiple stages
    this.masterEffects = {
      compressor: null,
      limiter: null,
      reverb: null,
      delay: null
    };
    
    this.melodyEffects = {
      distortion: null,
      delay: null,
      chorus: null,
      phaser: null,
      filter: null,
      reverb: null
    };
    
    this.harmonyEffects = {
      reverb: null,
      chorus: null,
      distortion: null,
      filter: null,
      delay: null
    };
    
    this.drumEffects = {
      compression: null,
      reverb: null,
      distortion: null,
      filter: null,
      eq: null
    };
    
    this.bassEffects = {
      compression: null,
      distortion: null,
      filter: null,
      chorus: null
    };
    
    // Spatial effects for 3D audio
    this.spatialEffects = {
      reverb: null,
      panner: null
    };
    
    // Member skill traits for playback
    this.memberTraits = {
      drummer: null,
      guitarist: null,
      'lead-guitar': null,
      'rhythm-guitar': null,
      bassist: null,
      vocalist: null,
      keyboardist: null
    };
    
    // Member tone settings (volume, effects)
    this.memberToneSettings = {
      drummer: null,
      guitarist: null,
      'lead-guitar': null,
      'rhythm-guitar': null,
      bassist: null,
      vocalist: null,
      keyboardist: null
    };
    
    this.scheduledNotes = [];
    this.currentSong = null;
    this.traitRNG = null;
    
    // Audio analysis for dynamic processing
    this.audioAnalyzer = null;
    this.frequencyData = null;
  }

  /**
   * Initialize Tone.js context with enhanced synths and effects
   */
  async initialize(song = null) {
    if (this.isInitialized) {
      if (song) {
        await this._setupEffects(song);
      }
      return;
    }
    
    // Start Tone.js audio context
    await Tone.start();
    
    // Initialize audio analyzer for dynamic processing
    this.audioAnalyzer = new Tone.Analyser('fft', 256);
    this.frequencyData = new Float32Array(256);
    
    // Create advanced master effects chain
    this.masterEffects.compressor = new Tone.Compressor({
      threshold: -24,
      ratio: 4,
      attack: 0.003,
      release: 0.1
    });
    
    this.masterEffects.limiter = new Tone.Limiter(-6);
    
    this.masterEffects.reverb = new Tone.Reverb({
      roomSize: 0.3,
      dampening: 2000,
      wet: 0.1
    });
    
    this.masterEffects.delay = new Tone.FeedbackDelay('8n', 0.1);
    
    // Connect master chain: compressor -> limiter -> delay -> reverb -> destination
    this.masterEffects.compressor.connect(this.masterEffects.limiter);
    this.masterEffects.limiter.connect(this.masterEffects.delay);
    this.masterEffects.delay.connect(this.masterEffects.reverb);
    this.masterEffects.reverb.toDestination();
    
    // Connect analyzer to master chain
    this.masterEffects.reverb.connect(this.audioAnalyzer);
    
    // Create enhanced melody synth with dual layers
    this.melodySynth = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 2,
      modulationIndex: 3,
      detune: 0,
      oscillator: { type: 'sawtooth' },
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.3,
        release: 0.8
      },
      modulation: { type: 'square' },
      modulationEnvelope: {
        attack: 0.5,
        decay: 0.01,
        sustain: 1,
        release: 0.5
      }
    });
    
    // Second melody layer for richness
    this.melodyLayer2 = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 0.5
      }
    });
    
    // Enhanced melody effects chain
    this.melodyEffects.distortion = new Tone.Distortion(0);
    this.melodyEffects.delay = new Tone.FeedbackDelay('8n', 0);
    this.melodyEffects.chorus = new Tone.Chorus(1.5, 3.5, 0.7);
    this.melodyEffects.phaser = new Tone.Phaser({
      frequency: 0.5,
      octaves: 2,
      baseFrequency: 1000
    });
    this.melodyEffects.filter = new Tone.Filter(8000, 'lowpass');
    this.melodyEffects.reverb = new Tone.Reverb({ roomSize: 0.2, wet: 0 });
    
    // Connect melody chain: synths -> filter -> distortion -> phaser -> chorus -> delay -> reverb -> master
    this.melodySynth.connect(this.melodyEffects.filter);
    this.melodyLayer2.connect(this.melodyEffects.filter);
    this.melodyEffects.filter
      .connect(this.melodyEffects.distortion)
      .connect(this.melodyEffects.phaser)
      .connect(this.melodyEffects.chorus)
      .connect(this.melodyEffects.delay)
      .connect(this.melodyEffects.reverb)
      .connect(this.masterEffects.compressor);
    
    this.melodySynth.volume.value = -6;
    this.melodyLayer2.volume.value = -10;
    
    // Connect keyboard effects (already created above)
    this.keyboardEffects.filter
      .connect(this.keyboardEffects.chorus)
      .connect(this.keyboardEffects.delay)
      .connect(this.keyboardEffects.reverb)
      .connect(this.masterEffects.compressor);
    
    // Create enhanced harmony voices with richer synthesis
    this.harmonyEffects.reverb = new Tone.Reverb({ roomSize: 0.3, wet: 0 });
    this.harmonyEffects.chorus = new Tone.Chorus(1.2, 2.5, 0.5);
    this.harmonyEffects.distortion = new Tone.Distortion(0);
    this.harmonyEffects.filter = new Tone.Filter(5000, 'lowpass');
    this.harmonyEffects.delay = new Tone.FeedbackDelay('16n', 0);
    
    // Connect harmony effects
    this.harmonyEffects.filter
      .connect(this.harmonyEffects.distortion)
      .connect(this.harmonyEffects.chorus)
      .connect(this.harmonyEffects.delay)
      .connect(this.harmonyEffects.reverb)
      .connect(this.masterEffects.compressor);
    
    // Create 6 harmony voices for richer chord textures
    for (let i = 0; i < 6; i++) {
      const voice = new Tone.Synth({
        oscillator: { 
          type: i % 2 === 0 ? 'sine' : 'triangle' // Alternate waveforms
        },
        envelope: {
          attack: 0.01 + (i * 0.005), // Staggered attack times
          decay: 0.15,
          sustain: 0.2,
          release: 0.6
        }
      });
      voice.connect(this.harmonyEffects.filter);
      voice.volume.value = -14 + (i * -0.5); // Slightly different volumes
      this.harmonyVoices.push(voice);
    }
    
    // Create dedicated bass synth
    this.bassSynth = new Tone.Synth({
      oscillator: { type: 'sawtooth' },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.8,
        release: 0.3
      },
      filter: {
        Q: 2,
        frequency: 300
      }
    });
    
    // Bass effects
    this.bassEffects.compression = new Tone.Compressor({
      threshold: -18,
      ratio: 3,
      attack: 0.01,
      release: 0.1
    });
    this.bassEffects.distortion = new Tone.Distortion(0);
    this.bassEffects.filter = new Tone.Filter(2000, 'lowpass');
    this.bassEffects.chorus = new Tone.Chorus(0.5, 2, 0.3);
    
    // Connect bass chain
    this.bassSynth
      .connect(this.bassEffects.filter)
      .connect(this.bassEffects.distortion)
      .connect(this.bassEffects.chorus)
      .connect(this.bassEffects.compression)
      .connect(this.masterEffects.compressor);
    
    this.bassSynth.volume.value = -8;

    // Create enhanced drum synths with more realistic sounds
    this.drumEffects.compression = new Tone.Compressor({
      threshold: -20,
      ratio: 5,
      attack: 0.002,
      release: 0.1
    });
    this.drumEffects.reverb = new Tone.Reverb({ roomSize: 0.2, wet: 0 });
    this.drumEffects.distortion = new Tone.Distortion(0);
    this.drumEffects.filter = new Tone.Filter(8000, 'lowpass');
    this.drumEffects.eq = new Tone.EQ3({
      low: 0,
      mid: 0,
      high: 0,
      lowFrequency: 250,
      highFrequency: 4000
    });
    
    // Connect drum effects
    this.drumEffects.filter
      .connect(this.drumEffects.distortion)
      .connect(this.drumEffects.compression)
      .connect(this.drumEffects.eq)
      .connect(this.drumEffects.reverb)
      .connect(this.masterEffects.compressor);
    
    // Enhanced kick drum with multiple oscillators for realism
    this.drums.kick = new Tone.Synth({
      oscillator: {
        type: 'sine',
        modulationType: 'sine',
        modulationIndex: 10,
        harmonicity: 0.5
      },
      envelope: {
        attack: 0.001,
        decay: 0.4,
        sustain: 0,
        release: 0.1
      },
      filter: {
        Q: 1,
        frequency: 200
      },
      filterEnvelope: {
        attack: 0.001,
        decay: 0.3,
        sustain: 0,
        release: 0.1,
        baseFrequency: 50,
        octaves: 3
      }
    });
    this.drums.kick.connect(this.drumEffects.filter);
    this.drums.kick.volume.value = -2;
    
    // Enhanced snare with noise and tone components
    this.drums.snare = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0,
        release: 0.1
      }
    });
    
    // Add tonal component to snare
    this.drums.snareTone = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.05
      }
    });
    
    this.drums.snare.connect(this.drumEffects.filter);
    this.drums.snareTone.connect(this.drumEffects.filter);
    this.drums.snare.volume.value = -4;
    this.drums.snareTone.volume.value = -8;
    
    // Enhanced hi-hat with metal synthesis
    this.drums.hihat = new Tone.MetalSynth({
      frequency: 200,
      envelope: {
        attack: 0.001,
        decay: 0.1,
        release: 0
      },
      harmonics: [12, 8, 4, 2],
      modulationIndex: 32,
      resonance: 3000,
      octaves: 1.5
    });
    this.drums.hihat.connect(this.drumEffects.filter);
    this.drums.hihat.volume.value = -6;
    
    // Additional percussion: tom and cymbal
    this.drums.tom = new Tone.MembraneSynth({
      pitchDecay: 0.1,
      octaves: 2,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.001,
        decay: 0.3,
        sustain: 0,
        release: 0.2
      }
    });
    this.drums.tom.connect(this.drumEffects.filter);
    this.drums.tom.volume.value = -8;
    
    this.drums.cymbal = new Tone.MetalSynth({
      frequency: 300,
      envelope: {
        attack: 0.001,
        decay: 0.8,
        release: 0.5
      },
      harmonics: [8, 6, 4, 2],
      modulationIndex: 16,
      resonance: 2000,
      octaves: 2
    });
    this.drums.cymbal.connect(this.drumEffects.filter);
    this.drums.cymbal.volume.value = -10;

    // Spatial effects for 3D audio
    this.spatialEffects = {
      reverb: new Tone.Reverb({ roomSize: 0.5, wet: 0.2 }),
      panner: new Tone.Panner(0) // Center position initially
    };
    
    // Connect spatial effects to master chain
    this.spatialEffects.panner.connect(this.spatialEffects.reverb);
    this.spatialEffects.reverb.connect(this.masterEffects.compressor);
  }
  
  /**
   * Initialize keyboard synth based on genre
   */
  async _initializeKeyboard(genre) {
    // Ensure keyboardEffects exists with enhanced effects including phaser
    if (!this.keyboardEffects || !this.keyboardEffects.reverb) {
      console.warn('_initializeKeyboard: keyboardEffects not initialized, creating defaults');
      this.keyboardEffects = {
        reverb: new Tone.Reverb({ roomSize: 0.4, wet: 0 }),
        chorus: new Tone.Chorus(1.2, 2.5, 0.5),
        filter: new Tone.Filter(8000, 'lowpass'),
        delay: new Tone.FeedbackDelay('8n', 0),
        phaser: new Tone.Phaser({
          frequency: 0.5,
          octaves: 5,
          baseFrequency: 1000
        })
      };
    }
    if (this.keyboardSynth && this.keyboardType === getKeyboardTypeForGenre(genre)) {
      return; // Already initialized with correct type
    }

    // Dispose old keyboard if exists
    if (this.keyboardSynth) {
      this.keyboardSynth.dispose();
    }

    const keyboardType = getKeyboardTypeForGenre(genre);
    this.keyboardType = keyboardType;

    switch (keyboardType) {
      case 'piano':
        // Enhanced acoustic piano - dual-layer synthesis for richer sound
        this.keyboardSynth = new Tone.PolySynth(Tone.FMSynth, {
          harmonicity: 3,
          modulationIndex: 10,
          detune: 0,
          oscillator: {
            type: 'sine'
          },
          envelope: {
            attack: 0.01,
            decay: 0.3,
            sustain: 0.1,
            release: 0.5
          },
          modulation: {
            type: 'square'
          },
          modulationEnvelope: {
            attack: 0.5,
            decay: 0.01,
            sustain: 1,
            release: 0.5
          }
        });

        // Add a second layer for piano body resonance
        this.keyboardSynth2 = new Tone.PolySynth(Tone.Synth, {
          oscillator: {
            type: 'triangle',
            partials: [1, 0.3, 0.1]
          },
          envelope: {
            attack: 0.02,
            decay: 0.8,
            sustain: 0.05,
            release: 1.2
          }
        });

        // Piano effects - more reverb, less distortion, subtle phaser
        await this.keyboardEffects.reverb.set({ roomSize: 0.6 });
        this.keyboardEffects.reverb.wet.value = 0.3;
        this.keyboardEffects.chorus.set({ frequency: 0.8, delayTime: 2, depth: 0.4 });
        this.keyboardEffects.chorus.wet.value = 0.15;
        this.keyboardEffects.phaser.frequency.value = 0.3;
        this.keyboardEffects.phaser.wet.value = 0.1;

        // Connect both layers to effects chain
        this.keyboardSynth.connect(this.keyboardEffects.filter);
        this.keyboardSynth2.connect(this.keyboardEffects.filter);
        break;

      case 'electric-piano':
        // Enhanced electric piano - Rhodes/Wurlitzer style with dual oscillators
        this.keyboardSynth = new Tone.PolySynth(Tone.Synth, {
          oscillator: {
            type: 'triangle'
          },
          envelope: {
            attack: 0.005,
            decay: 0.1,
            sustain: 0.3,
            release: 0.4
          }
        });

        // Add a second layer for tine simulation
        this.keyboardSynth2 = new Tone.PolySynth(Tone.Synth, {
          oscillator: {
            type: 'sawtooth',
            partials: [1, 0.5, 0.2]
          },
          envelope: {
            attack: 0.01,
            decay: 0.2,
            sustain: 0.2,
            release: 0.6
          }
        });

        // Electric piano effects - chorus, light reverb, phaser for movement
        await this.keyboardEffects.reverb.set({ roomSize: 0.4 });
        this.keyboardEffects.reverb.wet.value = 0.2;
        this.keyboardEffects.chorus.set({ frequency: 1.5, delayTime: 3, depth: 0.6 });
        this.keyboardEffects.chorus.wet.value = 0.3;
        this.keyboardEffects.phaser.frequency.value = 0.8;
        this.keyboardEffects.phaser.wet.value = 0.15;

        // Connect both layers
        this.keyboardSynth.connect(this.keyboardEffects.filter);
        this.keyboardSynth2.connect(this.keyboardEffects.filter);
        break;

      case 'synth':
        // Enhanced synthesizer - electronic sound with dual oscillators
        this.keyboardSynth = new Tone.PolySynth(Tone.Synth, {
          oscillator: {
            type: 'sawtooth'
          },
          envelope: {
            attack: 0.01,
            decay: 0.2,
            sustain: 0.3,
            release: 0.3
          }
        });

        // Add a second layer for richer harmonics
        this.keyboardSynth2 = new Tone.PolySynth(Tone.Synth, {
          oscillator: {
            type: 'square',
            partials: [1, 0.3, 0.1, 0.05]
          },
          envelope: {
            attack: 0.02,
            decay: 0.3,
            sustain: 0.4,
            release: 0.4
          }
        });

        // Synth effects - filter sweeps, delay, phaser for movement
        this.keyboardEffects.filter.set({ frequency: 4000, type: 'lowpass', Q: 2 });
        this.keyboardEffects.delay.set({ delayTime: '8n', feedback: 0.3 });
        this.keyboardEffects.delay.wet.value = 0.2;
        this.keyboardEffects.chorus.set({ frequency: 2, delayTime: 4, depth: 0.7 });
        this.keyboardEffects.chorus.wet.value = 0.25;
        this.keyboardEffects.phaser.frequency.value = 1.2;
        this.keyboardEffects.phaser.wet.value = 0.2;

        // Connect both layers
        this.keyboardSynth.connect(this.keyboardEffects.filter);
        this.keyboardSynth2.connect(this.keyboardEffects.filter);
        break;

      default:
        // Enhanced fallback to electric piano
        this.keyboardSynth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'triangle' },
          envelope: {
            attack: 0.005,
            decay: 0.1,
            sustain: 0.3,
            release: 0.4
          }
        });

        // Add basic second layer
        this.keyboardSynth2 = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sine' },
          envelope: {
            attack: 0.01,
            decay: 0.2,
            sustain: 0.2,
            release: 0.5
          }
        });

        // Connect both layers
        this.keyboardSynth.connect(this.keyboardEffects.filter);
        this.keyboardSynth2.connect(this.keyboardEffects.filter);
    }

    // Connect effects chain: filter -> phaser -> chorus -> delay -> reverb -> master
    this.keyboardEffects.filter.connect(this.keyboardEffects.phaser);
    this.keyboardEffects.phaser.connect(this.keyboardEffects.chorus);
    this.keyboardEffects.chorus.connect(this.keyboardEffects.delay);
    this.keyboardEffects.delay.connect(this.keyboardEffects.reverb);
    this.keyboardEffects.reverb.connect(this.masterEffects.input || Tone.Destination);

    // Set volume for both layers
    this.keyboardSynth.volume.value = -10;
    if (this.keyboardSynth2) {
      this.keyboardSynth2.volume.value = -12; // Slightly quieter second layer
    }
  }
  
  /**
   * Setup effects based on song genre and game state
   */
  async _setupEffects(song) {
    const genre = song?.composition?.genre || song?.metadata?.genre || 'rock';
    const gameState = song?.gameContext || {};
    
    // Initialize keyboard based on genre
    await this._initializeKeyboard(genre);
    
    // Get genre-specific effects
    let baseEffects = getGenreEffects(genre);
    
    // Ensure baseEffects is valid
    if (!baseEffects || typeof baseEffects !== 'object') {
      console.error('_setupEffects: Invalid baseEffects, using DEFAULT_EFFECTS', { genre, baseEffects });
      baseEffects = DEFAULT_EFFECTS;
    }
    
    // Adjust for game state - pass the full gameContext for proper extraction
    const effects = adjustEffectsForGameState(baseEffects, {
      ...gameState,
      equipmentQuality: gameState.equipmentQuality || gameState.contextConstraints?.equipmentQuality,
      studioQuality: gameState.studioQuality || gameState.contextConstraints?.studioQuality,
      gearTier: gameState.gearTier,
      studioTier: gameState.studioTier,
      psychState: gameState.psychState || gameState.psychologicalState || gameState.psychConstraints,
      constraints: gameState.constraints
    });
    
    // Ensure effects object is valid
    if (!effects || typeof effects !== 'object') {
      console.error('_setupEffects: Invalid effects after adjustment', { effects });
      throw new Error('Failed to generate effects configuration');
    }
    
    // Apply master effects
    if (effects.master) {
      if (effects.master.reverb && this.masterEffects.reverb) {
        const reverb = effects.master.reverb;
        await this.masterEffects.reverb.set({
          roomSize: reverb.roomSize || 0.3,
          dampening: reverb.dampening || 2000
        });
        this.masterEffects.reverb.wet.value = reverb.wet || 0.1;
      }
      if (effects.master.compression && this.masterEffects.compressor) {
        const comp = effects.master.compression;
        this.masterEffects.compressor.set({
          threshold: comp.threshold || -22,
          ratio: comp.ratio || 4,
          attack: comp.attack || 0.005,
          release: comp.release || 0.1
        });
      }
    }
    
    // Apply melody effects
    if (effects.melody) {
      if (effects.melody.distortion && this.melodyEffects.distortion) {
        this.melodyEffects.distortion.distortion = effects.melody.distortion.distortion || 0;
        this.melodyEffects.distortion.wet.value = effects.melody.distortion.wet || 0;
      }
      if (effects.melody.delay && this.melodyEffects.delay) {
        this.melodyEffects.delay.set({
          delayTime: effects.melody.delay.delayTime || '8n',
          feedback: effects.melody.delay.feedback || 0
        });
        this.melodyEffects.delay.wet.value = effects.melody.delay.wet || 0;
      }
      if (effects.melody.chorus && this.melodyEffects.chorus) {
        this.melodyEffects.chorus.set({
          frequency: effects.melody.chorus.frequency || 1.5,
          delayTime: effects.melody.chorus.delayTime || 3.5,
          depth: effects.melody.chorus.depth || 0.7
        });
        this.melodyEffects.chorus.wet.value = effects.melody.chorus.wet || 0;
      }
      if (effects.melody.filter && this.melodyEffects.filter) {
        this.melodyEffects.filter.set({
          frequency: effects.melody.filter.frequency || 8000,
          type: effects.melody.filter.type || 'lowpass',
          Q: effects.melody.filter.Q || 1
        });
      }
    }
    
    // Apply harmony effects
    if (effects.harmony) {
      if (effects.harmony.reverb && this.harmonyEffects.reverb) {
        const reverb = effects.harmony.reverb;
        await this.harmonyEffects.reverb.set({
          roomSize: reverb.roomSize || 0.3
        });
        this.harmonyEffects.reverb.wet.value = reverb.wet || 0;
      }
      if (effects.harmony.chorus && this.harmonyEffects.chorus) {
        this.harmonyEffects.chorus.set({
          frequency: effects.harmony.chorus.frequency || 1.2,
          delayTime: effects.harmony.chorus.delayTime || 2.5,
          depth: effects.harmony.chorus.depth || 0.5
        });
        this.harmonyEffects.chorus.wet.value = effects.harmony.chorus.wet || 0;
      }
      if (effects.harmony.distortion && this.harmonyEffects.distortion) {
        this.harmonyEffects.distortion.distortion = effects.harmony.distortion.distortion || 0;
        this.harmonyEffects.distortion.wet.value = effects.harmony.distortion.wet || 0;
      }
      if (effects.harmony.filter && this.harmonyEffects.filter) {
        this.harmonyEffects.filter.set({
          frequency: effects.harmony.filter.frequency || 5000,
          type: effects.harmony.filter.type || 'lowpass',
          Q: effects.harmony.filter.Q || 1
        });
      }
    }
    
    // Apply drum effects
    if (effects.drums) {
      if (effects.drums.compression && this.drumEffects.compression) {
        const comp = effects.drums.compression;
        this.drumEffects.compression.set({
          threshold: comp.threshold || -20,
          ratio: comp.ratio || 5,
          attack: comp.attack || 0.002,
          release: comp.release || 0.1
        });
      }
      if (effects.drums.reverb && this.drumEffects.reverb) {
        const reverb = effects.drums.reverb;
        await this.drumEffects.reverb.set({
          roomSize: reverb.roomSize || 0.2
        });
        this.drumEffects.reverb.wet.value = reverb.wet || 0;
      }
      if (effects.drums.distortion && this.drumEffects.distortion) {
        this.drumEffects.distortion.distortion = effects.drums.distortion.distortion || 0;
        this.drumEffects.distortion.wet.value = effects.drums.distortion.wet || 0;
      }
      if (effects.drums.filter && this.drumEffects.filter) {
        this.drumEffects.filter.set({
          frequency: effects.drums.filter.frequency || 10000,
          type: effects.drums.filter.type || 'highpass',
          Q: effects.drums.filter.Q || 1
        });
      }
    }
    
    // Apply member tone settings (overrides genre effects)
    await this._applyMemberToneSettings();
  }
  
  /**
   * Apply member tuning parameters from MemberTuningSystem
   * @param {string} memberId - Member identifier (e.g., 'drummer', 'guitarist')
   * @param {Object} tuningParameters - Tuning parameters from MemberTuningSystem
   */
  applyMemberTuning(memberId, tuningParameters) {
    if (!tuningParameters) {
      console.warn(`applyMemberTuning: No tuning parameters provided for ${memberId}`);
      return;
    }

    console.log(`Applying tuning for ${memberId}:`, tuningParameters);

    // Map member roles to instrument groups
    const instrumentMap = {
      drummer: 'drums',
      guitarist: 'melody',
      'lead-guitar': 'melody',
      'rhythm-guitar': 'harmony',
      bassist: 'bass',
      keyboardist: 'keyboard',
      vocalist: 'melody' // Map vocalist to melody for now
    };

    const instrumentGroup = instrumentMap[memberId];
    if (!instrumentGroup) {
      console.warn(`applyMemberTuning: Unknown member role ${memberId}`);
      return;
    }

    // Apply tuning based on instrument group
    switch (instrumentGroup) {
      case 'drums':
        this._applyDrumTuning(tuningParameters);
        break;
      case 'melody':
        this._applyMelodyTuning(tuningParameters);
        break;
      case 'harmony':
        this._applyHarmonyTuning(tuningParameters);
        break;
      case 'bass':
        this._applyBassTuning(tuningParameters);
        break;
      case 'keyboard':
        this._applyKeyboardTuning(tuningParameters);
        break;
    }

    // Store tuning parameters for persistence
    if (!this.memberToneSettings[memberId]) {
      this.memberToneSettings[memberId] = {};
    }
    this.memberToneSettings[memberId].tuningParameters = tuningParameters;
  }

  /**
   * Apply drum tuning parameters
   */
  _applyDrumTuning(parameters) {
    // Volume & Dynamics
    if (parameters.volume !== undefined && this.drums.kick) {
      const volumeDB = parameters.volume;
      this.drums.kick.volume.value = volumeDB - 6;
      if (this.drums.snare) this.drums.snare.volume.value = volumeDB - 8;
      if (this.drums.hihat) this.drums.hihat.volume.value = volumeDB - 14;
    }

    // Reverb
    if (parameters.reverb && this.drumEffects.reverb) {
      this.drumEffects.reverb.wet.value = parameters.reverb.wet;
      this.drumEffects.reverb.set({ roomSize: parameters.reverb.roomSize || 0.2 });
    }

    // Distortion
    if (parameters.distortion && this.drumEffects.distortion) {
      this.drumEffects.distortion.distortion = parameters.distortion.distortion;
      this.drumEffects.distortion.wet.value = parameters.distortion.wet;
    }

    // Compression
    if (parameters.compressor && this.drumEffects.compression) {
      this.drumEffects.compression.set({
        threshold: parameters.compressor.threshold,
        ratio: parameters.compressor.ratio,
        attack: parameters.compressor.attack,
        release: parameters.compressor.release
      });
    }

    // EQ
    if (parameters.eq && this.drumEffects.eq) {
      this.drumEffects.eq.set({
        low: parameters.eq.low,
        mid: parameters.eq.mid,
        high: parameters.eq.high
      });
    }
  }

  /**
   * Apply melody tuning parameters (guitar/lead guitar)
   */
  _applyMelodyTuning(parameters) {
    // Volume & Dynamics
    if (parameters.volume !== undefined && this.melodySynth) {
      const volumeDB = parameters.volume;
      this.melodySynth.volume.value = volumeDB - 8;
      if (this.melodyLayer2) this.melodyLayer2.volume.value = volumeDB - 10;
    }

    // Tone Shaping
    if (parameters.brightness !== undefined && this.melodyEffects.filter) {
      // Brightness affects filter cutoff
      const cutoff = 4000 + (parameters.brightness * 6000); // 4k-10k Hz
      this.melodyEffects.filter.set({ frequency: cutoff });
    }

    // Effects
    if (parameters.reverb && this.melodyEffects.reverb) {
      this.melodyEffects.reverb.wet.value = parameters.reverb.wet;
      this.melodyEffects.reverb.set({ roomSize: parameters.reverb.roomSize });
    }

    if (parameters.delay && this.melodyEffects.delay) {
      this.melodyEffects.delay.set({
        delayTime: parameters.delay.delayTime,
        feedback: parameters.delay.feedback
      });
      this.melodyEffects.delay.wet.value = parameters.delay.wet;
    }

    if (parameters.distortion && this.melodyEffects.distortion) {
      this.melodyEffects.distortion.distortion = parameters.distortion.distortion;
      this.melodyEffects.distortion.wet.value = parameters.distortion.wet;
    }

    if (parameters.chorus && this.melodyEffects.chorus) {
      this.melodyEffects.chorus.set({
        frequency: parameters.chorus.frequency,
        delayTime: parameters.chorus.delayTime,
        depth: parameters.chorus.depth
      });
      this.melodyEffects.chorus.wet.value = parameters.chorus.wet;
    }

    if (parameters.phaser && this.melodyEffects.phaser) {
      this.melodyEffects.phaser.set({
        frequency: parameters.phaser.frequency,
        octaves: parameters.phaser.octaves,
        baseFrequency: parameters.phaser.baseFrequency
      });
      this.melodyEffects.phaser.wet.value = parameters.phaser.wet;
    }

    // Compressor
    if (parameters.compressor && this.masterEffects.compressor) {
      this.masterEffects.compressor.set({
        threshold: parameters.compressor.threshold,
        ratio: parameters.compressor.ratio,
        attack: parameters.compressor.attack,
        release: parameters.compressor.release
      });
    }

    // EQ
    if (parameters.eq && this.melodyEffects.filter) {
      // Adjust filter based on EQ settings
      const freq = 8000 + (parameters.eq.high * 4000); // 8k-12k for highs
      this.melodyEffects.filter.set({ frequency: freq });
    }
  }

  /**
   * Apply harmony tuning parameters (rhythm guitar)
   */
  _applyHarmonyTuning(parameters) {
    // Volume & Dynamics
    if (parameters.volume !== undefined && this.harmonyVoices.length > 0) {
      const volumeDB = parameters.volume;
      this.harmonyVoices.forEach(voice => {
        voice.volume.value = volumeDB - 12;
      });
    }

    // Tone Shaping
    if (parameters.brightness !== undefined && this.harmonyEffects.filter) {
      const cutoff = 3000 + (parameters.brightness * 3000); // 3k-6k Hz
      this.harmonyEffects.filter.set({ frequency: cutoff });
    }

    // Effects
    if (parameters.reverb && this.harmonyEffects.reverb) {
      this.harmonyEffects.reverb.wet.value = parameters.reverb.wet;
      this.harmonyEffects.reverb.set({ roomSize: parameters.reverb.roomSize });
    }

    if (parameters.chorus && this.harmonyEffects.chorus) {
      this.harmonyEffects.chorus.set({
        frequency: parameters.chorus.frequency,
        delayTime: parameters.chorus.delayTime,
        depth: parameters.chorus.depth
      });
      this.harmonyEffects.chorus.wet.value = parameters.chorus.wet;
    }

    if (parameters.distortion && this.harmonyEffects.distortion) {
      this.harmonyEffects.distortion.distortion = parameters.distortion.distortion;
      this.harmonyEffects.distortion.wet.value = parameters.distortion.wet;
    }

    // EQ
    if (parameters.eq && this.harmonyEffects.filter) {
      const freq = 5000 + (parameters.eq.high * 3000); // 5k-8k for highs
      this.harmonyEffects.filter.set({ frequency: freq });
    }
  }

  /**
   * Apply bass tuning parameters
   */
  _applyBassTuning(parameters) {
    // Volume & Dynamics
    if (parameters.volume !== undefined && this.bassSynth) {
      const volumeDB = parameters.volume;
      this.bassSynth.volume.value = volumeDB - 8;
    }

    // Tone Shaping
    if (parameters.brightness !== undefined && this.bassEffects.filter) {
      const cutoff = 1000 + (parameters.brightness * 1000); // 1k-2k Hz
      this.bassEffects.filter.set({ frequency: cutoff });
    }

    // Effects
    if (parameters.reverb && this.spatialEffects?.reverb) {
      this.spatialEffects.reverb.wet.value = parameters.reverb.wet;
      this.spatialEffects.reverb.set({ roomSize: parameters.reverb.roomSize });
    }

    if (parameters.distortion && this.bassEffects.distortion) {
      this.bassEffects.distortion.distortion = parameters.distortion.distortion;
      this.bassEffects.distortion.wet.value = parameters.distortion.wet;
    }

    if (parameters.chorus && this.bassEffects.chorus) {
      this.bassEffects.chorus.set({
        frequency: parameters.chorus.frequency,
        delayTime: parameters.chorus.delayTime,
        depth: parameters.chorus.depth
      });
      this.bassEffects.chorus.wet.value = parameters.chorus.wet;
    }

    // Compressor
    if (parameters.compressor && this.bassEffects.compression) {
      this.bassEffects.compression.set({
        threshold: parameters.compressor.threshold,
        ratio: parameters.compressor.ratio,
        attack: parameters.compressor.attack,
        release: parameters.compressor.release
      });
    }
  }

  /**
   * Apply keyboard tuning parameters
   */
  _applyKeyboardTuning(parameters) {
    // Volume & Dynamics
    if (parameters.volume !== undefined && this.keyboardSynth) {
      const volumeDB = parameters.volume;
      this.keyboardSynth.volume.value = volumeDB - 10;
      if (this.keyboardSynth2) this.keyboardSynth2.volume.value = volumeDB - 12;
    }

    // Tone Shaping
    if (parameters.brightness !== undefined && this.keyboardEffects?.filter) {
      const cutoff = 6000 + (parameters.brightness * 4000); // 6k-10k Hz
      this.keyboardEffects.filter.set({ frequency: cutoff });
    }

    // Effects
    if (parameters.reverb && this.keyboardEffects?.reverb) {
      this.keyboardEffects.reverb.wet.value = parameters.reverb.wet;
      this.keyboardEffects.reverb.set({ roomSize: parameters.reverb.roomSize });
    }

    if (parameters.chorus && this.keyboardEffects?.chorus) {
      this.keyboardEffects.chorus.set({
        frequency: parameters.chorus.frequency,
        delayTime: parameters.chorus.delayTime,
        depth: parameters.chorus.depth
      });
      this.keyboardEffects.chorus.wet.value = parameters.chorus.wet;
    }

    if (parameters.phaser && this.keyboardEffects?.phaser) {
      this.keyboardEffects.phaser.set({
        frequency: parameters.phaser.frequency,
        octaves: parameters.phaser.octaves,
        baseFrequency: parameters.phaser.baseFrequency
      });
      this.keyboardEffects.phaser.wet.value = parameters.phaser.wet;
    }

    // EQ via filter
    if (parameters.eq && this.keyboardEffects?.filter) {
      const freq = 8000 + (parameters.eq.high * 2000); // 8k-10k for highs
      this.keyboardEffects.filter.set({ frequency: freq });
    }
  }
  _extractMemberTraits(song) {
    const gameContext = song?.gameContext || {};
    const bandMembers = gameContext.bandMembers || 
                       gameContext.members ||
                       song?.metadata?.bandMembers ||
                       [];
    
    // Reset traits
    this.memberTraits = {
      drummer: null,
      guitarist: null,
      'lead-guitar': null,
      'rhythm-guitar': null,
      bassist: null,
      vocalist: null,
      keyboardist: null
    };
    
    // Reset tone settings
    this.memberToneSettings = {
      drummer: null,
      guitarist: null,
      'lead-guitar': null,
      'rhythm-guitar': null,
      bassist: null,
      vocalist: null,
      keyboardist: null
    };
    
    // Extract enhanced skill modifiers if available
    const enhancedData = song?.enhanced;
    const skillModifiers = enhancedData?.memberSkillModifiers || {};
    
    // Extract traits and tone settings from band members
    bandMembers.forEach(member => {
      const role = member.role || member.type || member.instrument;
      
      // Use enhanced skill modifiers if available, otherwise use member stats
      if (skillModifiers[role]) {
        const mods = skillModifiers[role];
        this.memberTraits[role] = {
          timing: Math.round(mods.timing_accuracy * 100),
          precision: Math.round(mods.note_accuracy * 100),
          dynamics: Math.round(mods.expression_range * 100),
          consistency: Math.round(mods.consistency * 100),
          creativity: Math.round(mods.improvisation_factor * 100),
          performance_quality: Math.round(mods.performance_quality * 100)
        };
      } else if (member.traits && this.memberTraits.hasOwnProperty(role)) {
        // Fallback to existing traits
        this.memberTraits[role] = member.traits;
      } else {
        // Generate traits from member stats
        this.memberTraits[role] = {
          timing: member.skill || 70,
          precision: member.skill || 70,
          dynamics: member.creativity || 60,
          consistency: member.reliability || 70,
          creativity: member.creativity || 60,
          performance_quality: member.morale || 50
        };
      }
      
      if (member.toneSettings && this.memberToneSettings.hasOwnProperty(role)) {
        this.memberToneSettings[role] = member.toneSettings;
      }
    });
    
    // Create seeded RNG for deterministic trait effects
    const seed = song?.metadata?.seed || Date.now().toString();
    this.traitRNG = new SeededRandom(seed);
  }

  /**
   * Render complete song to audio
   */
  async render(song) {
    if (!this.isInitialized) {
      await this.initialize(song);
    } else {
      // Update effects if song changed
      await this._setupEffects(song);
    }

    this.currentSong = song;
    const { composition, musicalContent } = song;
    
    // Extract member traits and tone settings for playback
    this._extractMemberTraits(song);
    
    // Apply tone settings after extraction
    await this._applyMemberToneSettings();
    
    // Convert BPM to seconds per beat
    const bpm = composition.tempo;
    const secondsPerBeat = 60 / bpm;
    
    // Clear previous notes
    this.scheduledNotes = [];
    
    // Schedule harmony and melody first to determine song duration
    this._scheduleHarmonyProgression(musicalContent.harmony, secondsPerBeat);
    this._scheduleMelody(musicalContent.melody, secondsPerBeat);
    
    // Calculate song duration from scheduled notes
    const songDuration = this._calculateDuration(secondsPerBeat);
    
    // Now schedule drums with looping to match song duration
    this._scheduleDrumPattern(musicalContent.drums, secondsPerBeat, songDuration);
    
    // Recalculate duration after adding drums (should be same or slightly longer)
    const finalDuration = this._calculateDuration(secondsPerBeat);
    
    return {
      tempo: bpm,
      duration: finalDuration,
      scheduledNotes: this.scheduledNotes.length
    };
  }

  /**
   * Play rendered song
   */
  async play() {
    if (!this.isInitialized) {
      await this.initialize(this.currentSong);
    }

    if (this.isPlaying) return;

    // Ensure drums are initialized
    if (!this.drums.kick || !this.drums.snare || !this.drums.hihat) {
      console.warn('Drums not initialized, re-initializing...');
      await this.initialize(this.currentSong);
    }

    // Ensure audio context is running
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
    
    // Ensure we have scheduled notes before starting
    if (this.scheduledNotes.length === 0) {
      console.warn('No notes scheduled, cannot start playback');
      this.isPlaying = false;
      return;
    }
    
    // Reset transport to beginning - must stop before canceling
    if (Tone.Transport.state !== 'stopped') {
      Tone.Transport.stop();
    }
    
    // Clear any existing scheduled events
    Tone.Transport.cancel();
    
    // Reset transport time BEFORE scheduling new events
    Tone.Transport.seconds = 0;
    
    // Re-schedule all notes (they may have been cleared by cancel)
    // Filter out notes with negative times and clamp to 0
    const validNotes = this.scheduledNotes.map(note => ({
      ...note,
      time: Math.max(0, note.time) // Clamp negative times to 0
    })).filter(note => note.time >= 0 && isFinite(note.time)); // Remove any invalid notes
    
    console.log(`Scheduling ${validNotes.length} notes for playback (filtered from ${this.scheduledNotes.length})`);
    let scheduledCount = 0;
    validNotes.forEach((note, index) => {
      // Clamp time before logging
      const clampedTime = Math.max(0, note.time);
      if (index < 10) {
        console.log(`Scheduling note ${index}: ${note.type} at ${clampedTime.toFixed(3)}s, note:`, note.note || 'N/A');
      }
      try {
        // Use clamped time for scheduling
        const scheduleTime = clampedTime;
        Tone.Transport.schedule((time) => {
          scheduledCount++;
          if (scheduledCount <= 10) {
            console.log(`Transport callback triggered for note ${index}: ${note.type} at scheduled time ${time.toFixed(3)}s`);
          }
          this._playNote(note, time);
        }, scheduleTime);
      } catch (error) {
        console.error(`Error scheduling note ${index}:`, error, note);
      }
    });
    console.log(`Successfully scheduled ${validNotes.length} notes`);
    
    this.isPlaying = true;
    
    // Ensure audio context is running before starting Transport
    if (Tone.context.state !== 'running') {
      console.warn('Audio context not running, attempting to start...');
      try {
        await Tone.start();
        console.log('Audio context started, state:', Tone.context.state);
      } catch (error) {
        console.error('Failed to start audio context:', error);
      }
    }
    
    // Reset Transport to beginning
    Tone.Transport.seconds = 0;
    
    // Start transport - use start() without arguments to start from current position (0)
    try {
      // Ensure Transport is stopped before starting
      if (Tone.Transport.state === 'started') {
        Tone.Transport.stop();
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      // Test: Schedule a simple callback to verify Transport is working
      Tone.Transport.schedule((time) => {
        console.log('TEST: Transport callback fired at time:', time);
      }, 0.1);
      
      Tone.Transport.start();
      console.log('Tone.Transport.start() called, state:', Tone.Transport.state, 'seconds:', Tone.Transport.seconds, 'context state:', Tone.context.state);
      
      // Small delay to let Transport initialize
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Check if Transport actually started
      console.log('After start delay, Transport state:', Tone.Transport.state, 'seconds:', Tone.Transport.seconds);
      
    } catch (error) {
      console.error('Error starting Transport:', error);
    }
    
    // Verify transport started (give it a moment)
    await new Promise(resolve => setTimeout(resolve, 100));
    if (Tone.Transport.state !== 'started') {
      console.warn('Tone.Transport did not start, current state:', Tone.Transport.state, 'context state:', Tone.context.state);
      // Try starting again with full reset
      try {
        Tone.Transport.stop();
        Tone.Transport.cancel();
        Tone.Transport.seconds = 0;
        
        // Re-schedule notes (they may have been cleared)
        validNotes.forEach((note) => {
          Tone.Transport.schedule((time) => {
            this._playNote(note, time);
          }, note.time);
        });
        
        Tone.Transport.start();
        await new Promise(resolve => setTimeout(resolve, 50));
        console.log('Retry start, Transport state:', Tone.Transport.state, 'seconds:', Tone.Transport.seconds);
      } catch (error) {
        console.error('Error retrying Transport start:', error);
      }
    } else {
      console.log('Tone.Transport started successfully, state:', Tone.Transport.state, 'seconds:', Tone.Transport.seconds);
    }
    
    console.log(`Playing ${this.scheduledNotes.length} scheduled notes (${this.scheduledNotes.filter(n => n.type === 'kick').length} kicks, ${this.scheduledNotes.filter(n => n.type === 'snare').length} snares, ${this.scheduledNotes.filter(n => n.type === 'hihat').length} hihats), Transport state: ${Tone.Transport.state}`);
  }

  /**
   * Stop playback
   */
  stop() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    this.isPlaying = false;
    // Don't clear scheduledNotes - allow replay without re-rendering
    // this.scheduledNotes = [];
  }

  /**
   * Pause playback
   */
  pause() {
    Tone.Transport.pause();
    this.isPlaying = false;
  }

  /**
   * Resume playback
   */
  resume() {
    if (!this.isPlaying) {
      Tone.Transport.start();
      this.isPlaying = true;
    }
  }

  /**
   * Schedule drum pattern playback with member skill traits
   * Loops the pattern to match the full song duration
   * @param {Object} drumData - Drum pattern data
   * @param {number} secondsPerBeat - Seconds per beat
   * @param {number} songDuration - Total song duration in seconds (optional, will estimate if not provided)
   */
  _scheduleDrumPattern(drumData, secondsPerBeat, songDuration = null) {
    if (!drumData) {
      console.warn('_scheduleDrumPattern: No drumData provided');
      return;
    }
    
    const { pattern, tempo, beats } = drumData;
    
    // Handle different pattern structures
    // DrumEngine returns: { pattern: { beats: { kick, snare, hihat } }, tempo }
    let drumBeats = null;
    if (pattern?.beats) {
      drumBeats = pattern.beats;
    } else if (beats) {
      drumBeats = beats;
    } else if (pattern && (pattern.kick || pattern.snare || pattern.hihat)) {
      // Pattern is the beats object directly
      drumBeats = pattern;
    } else {
      console.warn('_scheduleDrumPattern: No pattern or beats found in drumData', { 
        hasPattern: !!pattern, 
        hasBeats: !!beats,
        patternKeys: pattern ? Object.keys(pattern) : [],
        drumDataKeys: Object.keys(drumData)
      });
      return;
    }

    const { kick = [], snare = [], hihat = [], ghostSnare = [] } = drumBeats;
    
    // Log if no drum beats found
    if (kick.length === 0 && snare.length === 0 && hihat.length === 0) {
      console.warn('_scheduleDrumPattern: No drum beats found in pattern', { 
        kick: kick.length, 
        snare: snare.length, 
        hihat: hihat.length, 
        pattern: drumBeats,
        drumData: drumData 
      });
    }
    
    // Calculate pattern length in beats (find the maximum beatTime)
    const allBeatTimes = [
      ...kick,
      ...snare,
      ...hihat,
      ...(ghostSnare || [])
    ];
    const patternLengthBeats = allBeatTimes.length > 0 
      ? Math.max(...allBeatTimes) + 1 // Add 1 to include the last beat
      : 4; // Default to 4 beats if no beats found
    
    // Calculate pattern length in seconds
    const patternLengthSeconds = patternLengthBeats * secondsPerBeat;
    
    // Determine song duration - use provided duration or estimate from existing notes
    let targetDuration = songDuration;
    if (!targetDuration || targetDuration <= 0) {
      // Estimate from already scheduled notes (melody/harmony)
      if (this.scheduledNotes.length > 0) {
        const maxNoteTime = Math.max(...this.scheduledNotes.map(n => (n.time || 0) + (n.duration || 0)));
        targetDuration = Math.max(maxNoteTime, 60); // At least 1 minute
      } else {
        targetDuration = 120; // Default 2 minutes if no other notes
      }
    }
    
    // Calculate number of loops needed to cover full song
    const numLoops = Math.ceil(targetDuration / patternLengthSeconds) + 1; // Add 1 extra loop for safety
    
    const drummerTraits = this.memberTraits.drummer;
    
    // Calculate timing variance (bad timing = more variance)
    const timingSkill = drummerTraits?.timing || 70;
    const timingVariance = (100 - timingSkill) / 100 * 0.05; // Max 50ms variance
    
    // Calculate dynamics variance (no dynamics = all same velocity)
    const dynamicsSkill = drummerTraits?.dynamics || 60;
    const dynamicsRange = dynamicsSkill / 100; // 0-1 range
    
    // Calculate precision (affects hit consistency)
    const precisionSkill = drummerTraits?.precision || 75;
    const missChance = (100 - precisionSkill) / 100 * 0.1; // Up to 10% miss chance

    // Helper function to schedule a single drum hit
    const scheduleDrumHit = (type, beatTime, loopOffset, baseVelocity) => {
      // Calculate time within the loop
      const loopTime = beatTime * secondsPerBeat;
      const totalTime = loopOffset + loopTime;
      
      // Apply timing variance
      const timingOffset = (this.traitRNG.next() - 0.5) * timingVariance;
      const actualTime = Math.max(0, totalTime + timingOffset);
      
      // Apply dynamics
      const velocity = dynamicsSkill < 30 
        ? baseVelocity // No dynamics - always same velocity
        : baseVelocity * (0.7 + dynamicsRange * 0.3 * this.traitRNG.next());
      
      // Apply precision (miss chance)
      if (this.traitRNG.next() > missChance) {
        this.scheduledNotes.push({
          type: type,
          time: actualTime,
          velocity: Math.max(0.1, Math.min(1.0, velocity))
        });
      }
    };

    // Loop the pattern multiple times to cover the full song
    for (let loop = 0; loop < numLoops; loop++) {
      const loopOffset = loop * patternLengthSeconds;
      
      // Schedule kick drum
      kick.forEach(beatTime => {
        scheduleDrumHit('kick', beatTime, loopOffset, 1.0);
      });

      // Schedule snare
      snare.forEach(beatTime => {
        scheduleDrumHit('snare', beatTime, loopOffset, 1.0);
      });

      // Schedule hi-hat
      hihat.forEach(beatTime => {
        scheduleDrumHit('hihat', beatTime, loopOffset, 0.7);
      });

      // Schedule ghost snare (quieter)
      if (ghostSnare && ghostSnare.length > 0) {
        ghostSnare.forEach(beatTime => {
          const loopTime = beatTime * secondsPerBeat;
          const totalTime = loopOffset + loopTime;
          const timingOffset = (this.traitRNG.next() - 0.5) * timingVariance;
          const actualTime = Math.max(0, totalTime + timingOffset);
          const velocity = 0.4 * (0.7 + dynamicsRange * 0.3 * this.traitRNG.next());
          
          if (this.traitRNG.next() > missChance) {
            this.scheduledNotes.push({
              type: 'snare',
              time: actualTime,
              velocity: Math.max(0.05, Math.min(0.6, velocity))
            });
          }
        });
      }
    }
    
    console.log(`Scheduled drum pattern: ${numLoops} loops, ${patternLengthBeats} beats per loop, ${patternLengthSeconds.toFixed(2)}s per loop`);
  }

  /**
   * Schedule harmony chord progressions with member skill traits
   */
  _scheduleHarmonyProgression(harmonyData, secondsPerBeat) {
    const { progression } = harmonyData;
    if (!progression || !progression.chords) return;

    const chords = progression.chords;
    const beatDuration = 4; // Assume 4 beats per chord
    
    // Get bassist or rhythm guitar traits for harmony
    const bassTraits = this.memberTraits.bassist;
    const rhythmGuitarTraits = this.memberTraits['rhythm-guitar'];
    const harmonyTraits = bassTraits || rhythmGuitarTraits || this.memberTraits.guitarist;
    
    const timingSkill = harmonyTraits?.timing || 70;
    const timingVariance = (100 - timingSkill) / 100 * 0.02;
    
    const precisionSkill = harmonyTraits?.precision || 70;
    const chordAccuracy = precisionSkill / 100; // 0-1, affects note accuracy

    chords.forEach((chord, index) => {
      const baseStartTime = index * beatDuration * secondsPerBeat;
      
          // Apply timing variance
          const timingOffset = (this.traitRNG.next() - 0.5) * timingVariance;
          const startTime = Math.max(0, baseStartTime + timingOffset); // Clamp to 0 to prevent negative times
      
      const duration = beatDuration * secondsPerBeat;

      // Get chord notes
      const notes = this._getChordNotes(chord);
      
      notes.forEach((note, voiceIndex) => {
        if (voiceIndex < this.harmonyVoices.length) {
          // Apply precision (slightly off notes for sloppy playing)
          let actualNote = note;
          if (precisionSkill < 50 && this.traitRNG.next() > chordAccuracy) {
            // Occasionally play wrong note
            const semitoneOffset = Math.round((this.traitRNG.next() - 0.5) * 2);
            actualNote = this._adjustNoteBySemitones(note, semitoneOffset);
          }
          
          this.scheduledNotes.push({
            type: 'harmony',
            note: actualNote,
            time: startTime,
            duration,
            voiceIndex
          });
        }
      });
    });
  }
  
  /**
   * Adjust note by semitones (for dissonance)
   */
  _adjustNoteBySemitones(noteName, semitones) {
    if (semitones === 0) return noteName;
    
    const noteMap = {
      'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
      'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
    };
    
    const match = noteName.match(/^([A-G]#?)(\d+)$/);
    if (!match) return noteName;
    
    const [, note, octave] = match;
    const noteValue = noteMap[note] || 0;
    const newNoteValue = (noteValue + semitones + 12) % 12;
    const newOctave = parseInt(octave) + Math.floor((noteValue + semitones) / 12);
    
    const noteNames = Object.keys(noteMap);
    const newNote = noteNames[newNoteValue];
    
    return `${newNote}${newOctave}`;
  }

  /**
   * Schedule melody playback with member skill traits
   */
  _scheduleMelody(melodyData, secondsPerBeat) {
    const { melody, songStructure } = melodyData;
    if (!melody || melody.length === 0) return;

    // Get traits - prioritize keyboardist if present, then guitarist
    const keyboardTraits = this.memberTraits.keyboardist;
    const leadGuitarTraits = this.memberTraits['lead-guitar'];
    const rhythmGuitarTraits = this.memberTraits['rhythm-guitar'];
    const guitarTraits = this.memberTraits.guitarist;
    // Use keyboardist traits if keyboardist exists, otherwise use guitarist
    const melodyTraits = keyboardTraits || leadGuitarTraits || rhythmGuitarTraits || guitarTraits;
    
    const timingSkill = melodyTraits?.timing || 70;
    const timingVariance = (100 - timingSkill) / 100 * 0.03;
    
    const dynamicsSkill = melodyTraits?.dynamics || 65;
    const dynamicsRange = dynamicsSkill / 100;
    
    const precisionSkill = melodyTraits?.precision || 75;
    const dissonanceAmount = (100 - precisionSkill) / 100 * 2; // Up to 2 semitones off

    let currentTime = 0;

    melody.forEach(section => {
      section.phrases.forEach(phrase => {
        if (!phrase.notes) return;

        phrase.notes.forEach((noteValue, noteIndex) => {
          const baseDuration = (phrase.durations?.[noteIndex] || 1) * secondsPerBeat;
          
          // Treat null/undefined/NaN as a rest but still advance time
          if (noteValue == null || Number.isNaN(noteValue)) {
            currentTime += baseDuration;
            return;
          }

          // Apply timing variance
          const timingOffset = (this.traitRNG.next() - 0.5) * timingVariance;
          const actualTime = Math.max(0, currentTime + timingOffset);
          
          // Apply precision (dissonance - wrong notes)
          let actualNoteValue = noteValue;
          if (precisionSkill < 50) {
            const dissonance = Math.round((this.traitRNG.next() - 0.5) * dissonanceAmount);
            actualNoteValue = noteValue + dissonance;
          }
          
          const note = this._scaleDegreeToNote(actualNoteValue, 'C', 'major');
          if (!note || typeof note !== 'string') {
            currentTime += baseDuration;
            return;
          }
          
          // Apply dynamics
          const baseVelocity = 0.8;
          const velocity = dynamicsSkill < 30 
            ? baseVelocity 
            : baseVelocity * (0.6 + dynamicsRange * 0.4 * this.traitRNG.next());

          // Determine if this should be keyboard or guitar based on member
          const useKeyboard = keyboardTraits && this.keyboardSynth;
          const noteType = useKeyboard ? 'keyboard' : 'melody';
          
          this.scheduledNotes.push({
            type: noteType,
            note,
            time: actualTime,
            duration: baseDuration,
            velocity: Math.max(0.2, Math.min(1.0, velocity))
          });

          currentTime += baseDuration;
        });
      });
    });
  }

  /**
   * Play individual note with velocity from member traits
   */
  _playNote(note, time) {
    // Only check drums for drum notes - don't block melody/harmony
    const isDrumNote = ['kick', 'snare', 'hihat'].includes(note.type);
    if (isDrumNote && (!this.drums.kick || !this.drums.snare || !this.drums.hihat)) {
      console.warn('Drums not initialized when trying to play drum note:', note.type);
      return;
    }

    // Debug: Log first few notes to verify they're being triggered
    const noteIndex = this.scheduledNotes.findIndex(n => n === note);
    if (noteIndex < 5) {
      console.log(`Playing note ${noteIndex}: ${note.type} at time ${time.toFixed(3)}s`, note);
    }

    switch (note.type) {
      case 'kick':
        if (!this.drums.kick) {
          console.warn('Kick drum not initialized');
          return;
        }
        // Apply velocity to kick (affects volume)
        // Base volume is 0, adjust down based on velocity
        const kickVolume = 0 - ((1 - (note.velocity || 1.0)) * 8); // 0 to -8 dB
        this.drums.kick.volume.value = kickVolume;
        // Use lower note (C1) for kick drum - MembraneSynth will produce proper kick sound
        try {
          this.drums.kick.triggerAttackRelease('C1', '0.4', time);
        } catch (error) {
          console.error('Error triggering kick:', error);
        }
        break;

      case 'snare':
        if (!this.drums.snare) {
          console.warn('Snare drum not initialized');
          return;
        }
        // Base volume is -2, adjust down based on velocity
        const snareVolume = -2 - ((1 - (note.velocity || 1.0)) * 10); // -2 to -12 dB
        this.drums.snare.volume.value = snareVolume;
        try {
          this.drums.snare.triggerAttackRelease('C2', '0.2', time);
        } catch (error) {
          console.error('Error triggering snare:', error);
        }
        break;

      case 'hihat':
        if (!this.drums.hihat) {
          console.warn('Hihat not initialized');
          return;
        }
        // Base volume is -8, adjust down based on velocity
        const hihatVolume = -8 - ((1 - (note.velocity || 0.7)) * 8); // -8 to -16 dB
        this.drums.hihat.volume.value = hihatVolume;
        try {
          this.drums.hihat.triggerAttackRelease('16n', time);
        } catch (error) {
          console.error('Error triggering hihat:', error);
        }
        break;

      case 'harmony':
        if (!this.harmonyVoices || this.harmonyVoices.length === 0) {
          console.warn('Harmony voices not initialized');
          return;
        }
        if (!note.note) {
          console.warn('Harmony note missing pitch, skipping', note);
          return;
        }
        if (this.harmonyVoices[note.voiceIndex]) {
          // Apply velocity to harmony voices
          const harmonyVolume = -12 + (1 - (note.velocity || 0.8)) * 8;
          this.harmonyVoices[note.voiceIndex].volume.value = harmonyVolume;
          this.harmonyVoices[note.voiceIndex].triggerAttackRelease(
            note.note,
            note.duration,
            time
          );
        } else {
          console.warn(`Harmony voice ${note.voiceIndex} not found, total voices: ${this.harmonyVoices.length}`);
        }
        break;

      case 'melody':
        if (!this.melodySynth) {
          console.warn('Melody synth not initialized');
          return;
        }
        if (!note.note) {
          console.warn('Melody note missing pitch, skipping', note);
          return;
        }
        // Apply velocity to melody (guitar)
        const melodyVolume = -8 + (1 - (note.velocity || 0.8)) * 10;
        this.melodySynth.volume.value = melodyVolume;
        this.melodySynth.triggerAttackRelease(
          note.note,
          note.duration,
          time
        );
        break;

      case 'keyboard':
        if (!this.keyboardSynth) {
          console.warn('Keyboard synth not initialized');
          return;
        }
        if (!note.note) {
          console.warn('Keyboard note missing pitch, skipping', note);
          return;
        }
        // Apply velocity to keyboard layers
        const keyboardVolume = -10 + (1 - (note.velocity || 0.8)) * 10;
        this.keyboardSynth.volume.value = keyboardVolume;

        // Trigger primary layer
        this.keyboardSynth.triggerAttackRelease(
          note.note,
          note.duration,
          time
        );

        // Trigger second layer if available (dual-layer synthesis)
        if (this.keyboardSynth2) {
          const secondaryVolume = keyboardVolume - 2; // Slightly quieter
          this.keyboardSynth2.volume.value = secondaryVolume;
          this.keyboardSynth2.triggerAttackRelease(
            note.note,
            note.duration,
            time
          );
        }
        break;
        
      default:
        console.warn('Unknown note type:', note.type);
        break;
    }
  }

  /**
   * Convert scale degree to note name
   */
  _scaleDegreeToNote(degree, key = 'C', mode = 'major') {
    const majorScale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const noteIndex = degree % 7;
    const octave = Math.floor(degree / 7) + 4;
    
    return majorScale[noteIndex] + octave;
  }

  /**
   * Get notes for chord symbol
   */
  _getChordNotes(chordSymbol) {
    const chordMap = {
      'C': ['C3', 'E3', 'G3', 'C4'],
      'Am': ['A2', 'C3', 'E3', 'A3'],
      'F': ['F2', 'A2', 'C3', 'F3'],
      'G': ['G2', 'B2', 'D3', 'G3'],
      'Em': ['E2', 'G2', 'B2', 'E3'],
      'Dm': ['D2', 'F2', 'A2', 'D3'],
      'D': ['D2', 'F#2', 'A2', 'D3'],
      'E': ['E2', 'G#2', 'B2', 'E3'],
      'A': ['A2', 'C#3', 'E3', 'A3'],
      'B': ['B2', 'D#3', 'F#3', 'B3']
    };

    return chordMap[chordSymbol] || ['C3', 'E3', 'G3', 'C4'];
  }

  /**
   * Calculate total duration
   */
  _calculateDuration(secondsPerBeat) {
    if (this.scheduledNotes.length === 0) return 0;
    
    const lastNote = this.scheduledNotes.reduce((max, note) => {
      const noteEnd = (note.time || 0) + (note.duration || 0);
      return Math.max(max, noteEnd);
    }, 0);

    return lastNote;
  }

  /**
   * Dispose resources
   */
  dispose() {
    this.stop();
    
    // Dispose synths
    if (this.melodySynth) this.melodySynth.dispose();
    if (this.keyboardSynth) this.keyboardSynth.dispose();
    if (this.keyboardSynth2) this.keyboardSynth2.dispose();
    this.harmonyVoices.forEach(voice => voice.dispose());
    
    if (this.drums.kick) this.drums.kick.dispose();
    if (this.drums.snare) this.drums.snare.dispose();
    if (this.drums.hihat) this.drums.hihat.dispose();
    
    // Dispose effects
    Object.values(this.masterEffects).forEach(effect => effect?.dispose());
    Object.values(this.melodyEffects).forEach(effect => effect?.dispose());
    Object.values(this.harmonyEffects).forEach(effect => effect?.dispose());
    Object.values(this.drumEffects).forEach(effect => effect?.dispose());
    if (this.keyboardEffects) {
      Object.values(this.keyboardEffects).forEach(effect => effect?.dispose());
    }
    if (this.spatialEffects) {
      Object.values(this.spatialEffects).forEach(effect => effect?.dispose());
    }
    
    this.isInitialized = false;
  }
}

export default ToneRenderer;
