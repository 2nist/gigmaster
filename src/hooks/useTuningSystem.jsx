/**
 * useTuningSystem - Hook for band member tuning system integration
 *
 * Provides intuitive 5-knob tuning controls that map to multiple Tone.js parameters
 * for dramatic audio changes without technical complexity
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  MemberTuningSystem,
  TUNING_PRESETS,
  getAllPresets,
  getPreset,
  createCustomPreset,
  findSimilarPresets,
  getPresetStatistics
} from '../music';

export const useTuningSystem = (gameState, updateGameState) => {
  // Tuning state
  const [currentMember, setCurrentMember] = useState(null);
  const [tuningSystem, setTuningSystem] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize tuning system
  useEffect(() => {
    if (!isInitialized && gameState?.bandMembers?.length > 0) {
      const system = new MemberTuningSystem();
      setTuningSystem(system);
      setIsInitialized(true);

      // Load existing tuning data from game state if available
      if (gameState.tuningData) {
        system.loadFromData(gameState.tuningData);
      }
    }
  }, [gameState?.bandMembers, isInitialized]);

  /**
   * Select a band member for tuning
   */
  const selectMember = useCallback((memberId) => {
    if (!tuningSystem) return null;

    const member = gameState.bandMembers?.find(m => m.id === memberId || m.name === memberId);
    if (!member) return null;

    setCurrentMember(member);
    return member;
  }, [tuningSystem, gameState.bandMembers]);

  /**
   * Get current tuning values for a member
   */
  const getMemberTuning = useCallback((memberId) => {
    if (!tuningSystem) return null;

    return tuningSystem.getMemberTuning(memberId);
  }, [tuningSystem]);

  /**
   * Update a tuning knob value for current member
   */
  const updateKnob = useCallback((knobName, value) => {
    if (!tuningSystem || !currentMember) return false;

    const success = tuningSystem.updateKnob(currentMember.id, knobName, value);
    if (success) {
      // Save to game state
      const tuningData = tuningSystem.exportData();
      updateGameState({ tuningData });
    }
    return success;
  }, [tuningSystem, currentMember, updateGameState]);

  /**
   * Apply a preset to current member
   */
  const applyPreset = useCallback((presetName) => {
    if (!tuningSystem || !currentMember) return false;

    const success = tuningSystem.applyPreset(currentMember.id, presetName);
    if (success) {
      // Save to game state
      const tuningData = tuningSystem.exportData();
      updateGameState({ tuningData });
    }
    return success;
  }, [tuningSystem, currentMember, updateGameState]);

  /**
   * Save current tuning as custom preset
   */
  const saveAsPreset = useCallback((presetName, category = 'Custom') => {
    if (!tuningSystem || !currentMember) return false;

    const success = tuningSystem.saveAsPreset(currentMember.id, presetName, category);
    if (success) {
      // Save to game state
      const tuningData = tuningSystem.exportData();
      updateGameState({ tuningData });
    }
    return success;
  }, [tuningSystem, currentMember, updateGameState]);

  /**
   * Get all available presets
   */
  const getAvailablePresets = useCallback(() => {
    return getAllPresets();
  }, []);

  /**
   * Get presets by category
   */
  const getPresetsByCategory = useCallback((category) => {
    return TUNING_PRESETS.getPresetsByCategory(category);
  }, []);

  /**
   * Get preset categories
   */
  const getPresetCategories = useCallback(() => {
    return TUNING_PRESETS.getPresetCategories();
  }, []);

  /**
   * Find similar presets to current tuning
   */
  const findSimilarPresets = useCallback((limit = 3) => {
    if (!tuningSystem || !currentMember) return [];

    return tuningSystem.findSimilarPresets(currentMember.id, limit);
  }, [tuningSystem, currentMember]);

  /**
   * Get tuning statistics
   */
  const getTuningStatistics = useCallback(() => {
    if (!tuningSystem) return null;

    return tuningSystem.getStatistics();
  }, [tuningSystem]);

  /**
   * Reset member tuning to defaults
   */
  const resetMemberTuning = useCallback(() => {
    if (!tuningSystem || !currentMember) return false;

    const success = tuningSystem.resetMemberTuning(currentMember.id);
    if (success) {
      // Save to game state
      const tuningData = tuningSystem.exportData();
      updateGameState({ tuningData });
    }
    return success;
  }, [tuningSystem, currentMember, updateGameState]);

  /**
   * Get parameter values for current member tuning
   */
  const getParameterValues = useCallback(() => {
    if (!tuningSystem || !currentMember) return null;

    return tuningSystem.getParameterValues(currentMember.id);
  }, [tuningSystem, currentMember]);

  /**
   * Apply tuning to a ToneRenderer instance
   */
  const applyTuningToRenderer = useCallback((renderer, memberId = null) => {
    if (!tuningSystem || !renderer) return false;

    const targetMemberId = memberId || currentMember?.id;
    if (!targetMemberId) return false;

    return tuningSystem.applyTuningToRenderer(renderer, targetMemberId);
  }, [tuningSystem, currentMember]);

  return {
    // State
    currentMember,
    isInitialized,

    // Member selection
    selectMember,
    getMemberTuning,

    // Tuning controls
    updateKnob,
    applyPreset,
    saveAsPreset,
    resetMemberTuning,

    // Presets
    getAvailablePresets,
    getPresetsByCategory,
    getPresetCategories,
    findSimilarPresets,

    // Analysis
    getTuningStatistics,
    getParameterValues,

    // Integration
    applyTuningToRenderer
  };
};

export default useTuningSystem;</content>
<parameter name="filePath">c:\Dev\gigmaster\src\hooks\useTuningSystem.js