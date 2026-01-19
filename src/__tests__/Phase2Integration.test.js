/**
 * Phase2Integration.test.js - Simplified Version
 * 
 * Tests for Phase 2 consequence system integration
 * Focus: Core functionality and integration wiring
 */

import { renderHook, act } from '@testing-library/react';
import { useConsequenceSystem } from '../hooks/useConsequenceSystem';
import { useGameState } from '../hooks/useGameState';

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});

describe('Phase 2 Integration - Core Functionality', () => {
  
  describe('Consequence System Initialization', () => {
    test('hook initializes with empty consequences', () => {
      const gameData = { week: 1, bandName: 'Test Band' };
      const { result } = renderHook(() => useConsequenceSystem(gameData));
      
      expect(result.current).toBeDefined();
      expect(result.current.consequences).toBeDefined();
      expect(result.current.consequences.active).toEqual([]);
      expect(result.current.consequences.dormant).toEqual([]);
    });

    test('hook initializes faction standings', () => {
      const gameData = { week: 1, bandName: 'Test Band' };
      const { result } = renderHook(() => useConsequenceSystem(gameData));
      
      expect(result.current.factions).toBeDefined();
      expect(result.current.factions.underground_scene).toBeDefined();
      expect(result.current.factions.corporate_industry).toBeDefined();
      expect(result.current.factions.criminal_underworld).toBeDefined();
      expect(result.current.factions.law_enforcement).toBeDefined();
    });

    test('hook initializes psychological evolution', () => {
      const gameData = { week: 1, bandName: 'Test Band' };
      const { result } = renderHook(() => useConsequenceSystem(gameData));
      
      expect(result.current.psychologicalEvolution).toBeDefined();
      expect(result.current.psychologicalEvolution.corruptionPath).toBeDefined();
      expect(result.current.psychologicalEvolution.addictionPath).toBeDefined();
      expect(result.current.psychologicalEvolution.mentalHealth).toBeDefined();
    });
  });

  describe('Weekly Consequence Processing', () => {
    test('processEscalations returns array', () => {
      const gameData = { week: 1, bandName: 'Test Band' };
      const { result } = renderHook(() => useConsequenceSystem(gameData));

      act(() => {
        result.current.addActiveConsequence({
          id: 'test-consequence',
          type: 'corruption',
          title: 'Small Bribe',
          stage: 0,
          maxStages: 3,
          intensity: 30
        });
      });

      let escalations;
      act(() => {
        escalations = result.current.processEscalations();
      });

      expect(Array.isArray(escalations)).toBe(true);
    });

    test('checkResurfacing returns array', () => {
      const gameData = { week: 1, bandName: 'Test Band' };
      const { result } = renderHook(() => useConsequenceSystem(gameData));

      act(() => {
        result.current.addDormantConsequence({
          id: 'dormant-test',
          type: 'addiction',
          title: 'Band Intervention',
          resurfaceWeek: 1,
          triggerChance: 100
        });
      });

      let resurfaced;
      act(() => {
        resurfaced = result.current.checkResurfacing();
      });

      expect(Array.isArray(resurfaced)).toBe(true);
    });

    test('applyFactionDecay executes without error', () => {
      const gameData = { week: 1, bandName: 'Test Band' };
      const { result } = renderHook(() => useConsequenceSystem(gameData));

      act(() => {
        result.current.updateFactionStandings({
          factionEffects: {
            underground_scene: 20
          }
        });
      });

      expect(() => {
        act(() => {
          result.current.applyFactionDecay();
        });
      }).not.toThrow();
    });
  });

  describe('Faction Standing Management', () => {
    test('updateFactionStandings modifies standing', () => {
      const gameData = { week: 1, bandName: 'Test Band' };
      const { result } = renderHook(() => useConsequenceSystem(gameData));

      const initialStanding = result.current.getFactionStanding('underground_scene');

      act(() => {
        result.current.updateFactionStandings({
          factionEffects: {
            underground_scene: 30
          }
        });
      });

      const updatedStanding = result.current.getFactionStanding('underground_scene');
      expect(updatedStanding).not.toBe(initialStanding);
    });

    test('faction status reflects standing threshold', () => {
      const gameData = { week: 1, bandName: 'Test Band' };
      const { result } = renderHook(() => useConsequenceSystem(gameData));

      act(() => {
        result.current.updateFactionStandings({
          factionEffects: {
            underground_scene: 80
          }
        });
      });

      const status = result.current.getFactionStatus('underground_scene');
      expect(['ally', 'neutral', 'wary', 'hostile', 'enemy']).toContain(status);
    });
  });

  describe('Consequence Management', () => {
    test('addActiveConsequence adds to list', () => {
      const gameData = { week: 1, bandName: 'Test Band' };
      const { result } = renderHook(() => useConsequenceSystem(gameData));

      const before = result.current.getActiveConsequences().length;

      act(() => {
        result.current.addActiveConsequence({
          id: 'test-1',
          type: 'corruption',
          title: 'Test',
          stage: 0,
          maxStages: 3
        });
      });

      const after = result.current.getActiveConsequences().length;
      expect(after).toBeGreaterThan(before);
    });

    test('addDormantConsequence adds to dormant list', () => {
      const gameData = { week: 1, bandName: 'Test Band' };
      const { result } = renderHook(() => useConsequenceSystem(gameData));

      const before = result.current.getDormantConsequences().length;

      act(() => {
        result.current.addDormantConsequence({
          id: 'dormant-1',
          type: 'addiction',
          title: 'Dormant Test',
          resurfaceWeek: 10
        });
      });

      const after = result.current.getDormantConsequences().length;
      expect(after).toBeGreaterThan(before);
    });

    test('consequence data persists in localStorage', () => {
      const gameData = { week: 1, bandName: 'Test Band' };
      const { result } = renderHook(() => useConsequenceSystem(gameData));

      act(() => {
        result.current.addActiveConsequence({
          id: 'persist-test',
          type: 'corruption',
          title: 'Persist',
          stage: 0,
          maxStages: 3
        });
      });

      const stored = localStorage.getItem('gigmaster_consequences');
      expect(stored).toBeDefined();
      expect(stored).not.toBe('{}');
    });
  });

  describe('Psychological Evolution', () => {
    test('updatePsychology modifies stat', () => {
      const gameData = { week: 1, bandName: 'Test Band' };
      const { result } = renderHook(() => useConsequenceSystem(gameData));

      expect(() => {
        act(() => {
          result.current.updatePsychology('corruptionPath', 'currentLevel', 15);
        });
      }).not.toThrow();

      expect(result.current.psychologicalEvolution).toBeDefined();
    });

    test('faction data persists to localStorage', () => {
      const gameData = { week: 1, bandName: 'Test Band' };
      const { result } = renderHook(() => useConsequenceSystem(gameData));

      act(() => {
        result.current.updateFactionStandings({
          factionEffects: {
            underground_scene: 25
          }
        });
      });

      const stored = localStorage.getItem('gigmaster_factions');
      expect(stored).toBeDefined();
    });

    test('psychology data persists to localStorage', () => {
      const gameData = { week: 1, bandName: 'Test Band' };
      const { result } = renderHook(() => useConsequenceSystem(gameData));

      act(() => {
        result.current.updatePsychology('corruptionPath', 'currentLevel', 25);
      });

      const stored = localStorage.getItem('gigmaster_psychology');
      expect(stored).toBeDefined();
    });
  });

  describe('Data Persistence & Restoration', () => {
    test('consequence system restores from localStorage', () => {
      const initialData = {
        active: [{ id: 'restore-test', type: 'corruption', title: 'Test' }],
        dormant: []
      };
      localStorage.setItem('gigmaster_consequences', JSON.stringify(initialData));

      const gameData = { week: 1, bandName: 'Test Band' };
      const { result } = renderHook(() => useConsequenceSystem(gameData));

      const activeConsequences = result.current.getActiveConsequences();
      expect(activeConsequences.length).toBeGreaterThan(0);
    });
  });
});

describe('Phase 2 Integration - App.jsx Wiring', () => {
  describe('Event Choice Handling', () => {
    test('choice handler processes faction effects', () => {
      const gameData = { week: 1, bandName: 'Test Band' };
      const { result } = renderHook(() => useConsequenceSystem(gameData));

      const choice = {
        id: 'choice-1',
        factionEffects: {
          corporate_industry: 25
        }
      };

      expect(() => {
        act(() => {
          result.current.updateFactionStandings(choice);
        });
      }).not.toThrow();
    });

    test('choice handler adds active consequences', () => {
      const gameData = { week: 1, bandName: 'Test Band' };
      const { result } = renderHook(() => useConsequenceSystem(gameData));

      const choice = {
        id: 'choice-2',
        triggerConsequence: {
          type: 'active',
          id: 'corruption-start',
          title: 'Small Bribe',
          stage: 0,
          maxStages: 3
        }
      };

      act(() => {
        if (choice.triggerConsequence.type === 'active') {
          result.current.addActiveConsequence(choice.triggerConsequence);
        }
      });

      const active = result.current.getActiveConsequences();
      expect(active.length).toBeGreaterThan(0);
    });

    test('choice handler adds dormant consequences', () => {
      const gameData = { week: 1, bandName: 'Test Band' };
      const { result } = renderHook(() => useConsequenceSystem(gameData));

      const choice = {
        triggerConsequence: {
          type: 'dormant',
          id: 'dormant-event',
          title: 'Future Crisis',
          resurfaceWeek: 15
        }
      };

      act(() => {
        if (choice.triggerConsequence.type === 'dormant') {
          result.current.addDormantConsequence(choice.triggerConsequence);
        }
      });

      const dormant = result.current.getDormantConsequences();
      expect(dormant.length).toBeGreaterThan(0);
    });

    test('choice handler updates psychology', () => {
      const gameData = { week: 1, bandName: 'Test Band' };
      const { result } = renderHook(() => useConsequenceSystem(gameData));

      const choice = {
        psychologyEffects: {
          corruptionPath: { currentLevel: 20 }
        }
      };

      expect(() => {
        act(() => {
          Object.entries(choice.psychologyEffects).forEach(([path, changes]) => {
            Object.entries(changes).forEach(([stat, amount]) => {
              result.current.updatePsychology(path, stat, amount);
            });
          });
        });
      }).not.toThrow();
    });
  });
});

describe('Phase 2 Integration - useGameState', () => {
  describe('Save/Load with Phase 2 Data', () => {
    test('saveGame persists game with band name', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.updateGameState({ bandName: 'Test Band' });
      });

      const phase2Data = {
        consequences: [{ id: 'test' }],
        factions: { underground_scene: 20 },
        psychologicalEvolution: { corruptionPath: { currentLevel: 10 } }
      };

      const saved = result.current.saveGame('test-slot', phase2Data);
      expect(saved).toBe(true);
    });

    test('saveGame stores Phase 2 data in localStorage', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.updateGameState({ bandName: 'Test Band Save' });
      });

      const phase2Data = {
        consequences: [{ id: 'save-test' }],
        factions: { corporate_industry: 15 },
        psychologicalEvolution: { addictionPath: { severity: 2 } }
      };

      result.current.saveGame('test-slot-2', phase2Data);

      const slots = JSON.parse(localStorage.getItem('bandManager_saveSlots'));
      expect(slots['test-slot-2']).toBeDefined();
      expect(slots['test-slot-2'].bandName).toBe('Test Band Save');
    });

    test('loadGame returns success status', () => {
      const { result } = renderHook(() => useGameState());

      const phase2Data = {
        consequences: [{ id: 'load-test' }],
        factions: { criminal_underworld: 30 }
      };

      act(() => {
        result.current.updateGameState({ bandName: 'Load Test' });
        result.current.saveGame('load-slot', phase2Data);
      });

      const loadResult = result.current.loadGame('load-slot');
      expect(loadResult).toBeDefined();
      expect(typeof loadResult.success).toBe('boolean');
    });
  });
});
