import { useState, useCallback, useEffect } from 'react';
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
  const [currentMember, setCurrentMember] = useState(null);
  const [tuningSystem, setTuningSystem] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized && gameState?.bandMembers?.length > 0) {
      const system = new MemberTuningSystem();
      setTuningSystem(system);
      setIsInitialized(true);

      if (gameState.tuningData) {
        system.loadFromData(gameState.tuningData);
      }
    }
  }, [gameState?.bandMembers, isInitialized]);

  const selectMember = useCallback((memberId) => {
    if (!tuningSystem || !gameState?.bandMembers) return null;

    const member = gameState.bandMembers.find(m => m.id === memberId || m.name === memberId);
    if (!member) return null;

    setCurrentMember(member);
    return member;
  }, [tuningSystem, gameState?.bandMembers]);

  const getMemberTuning = useCallback((memberId) => {
    if (!tuningSystem) return null;
    return tuningSystem.getMemberTuning(memberId);
  }, [tuningSystem]);

  const updateKnob = useCallback((knobName, value) => {
    if (!tuningSystem || !currentMember) return false;

    const success = tuningSystem.updateKnob(currentMember.id, knobName, value);
    if (success) {
      const tuningData = tuningSystem.exportData();
      updateGameState({ tuningData });
    }
    return success;
  }, [tuningSystem, currentMember, updateGameState]);

  const applyPreset = useCallback((presetName) => {
    if (!tuningSystem || !currentMember) return false;

    const success = tuningSystem.applyPreset(currentMember.id, presetName);
    if (success) {
      const tuningData = tuningSystem.exportData();
      updateGameState({ tuningData });
    }
    return success;
  }, [tuningSystem, currentMember, updateGameState]);

  const saveAsPreset = useCallback((presetName, category = 'Custom') => {
    if (!tuningSystem || !currentMember) return false;

    const success = tuningSystem.saveAsPreset(currentMember.id, presetName, category);
    if (success) {
      const tuningData = tuningSystem.exportData();
      updateGameState({ tuningData });
    }
    return success;
  }, [tuningSystem, currentMember, updateGameState]);

  const getAvailablePresets = useCallback(() => {
    return getAllPresets();
  }, []);

  const getPresetsByCategory = useCallback((category) => {
    return TUNING_PRESETS.getPresetsByCategory(category);
  }, []);

  const getPresetCategories = useCallback(() => {
    return TUNING_PRESETS.getPresetCategories();
  }, []);

  const findSimilarPresets = useCallback((limit = 3) => {
    if (!tuningSystem || !currentMember) return [];
    return tuningSystem.findSimilarPresets(currentMember.id, limit);
  }, [tuningSystem, currentMember]);

  const getTuningStatistics = useCallback(() => {
    if (!tuningSystem) return null;
    return tuningSystem.getStatistics();
  }, [tuningSystem]);

  const resetMemberTuning = useCallback(() => {
    if (!tuningSystem || !currentMember) return false;

    const success = tuningSystem.resetMemberTuning(currentMember.id);
    if (success) {
      const tuningData = tuningSystem.exportData();
      updateGameState({ tuningData });
    }
    return success;
  }, [tuningSystem, currentMember, updateGameState]);

  const getParameterValues = useCallback(() => {
    if (!tuningSystem || !currentMember) return null;
    return tuningSystem.getParameterValues(currentMember.id);
  }, [tuningSystem, currentMember]);

  const applyTuningToRenderer = useCallback((renderer, memberId = null) => {
    if (!tuningSystem || !renderer) return false;

    const targetMemberId = memberId || currentMember?.id;
    if (!targetMemberId) return false;

    return tuningSystem.applyTuningToRenderer(renderer, targetMemberId);
  }, [tuningSystem, currentMember]);

  return {
    currentMember,
    isInitialized,
    selectMember,
    getMemberTuning,
    updateKnob,
    applyPreset,
    saveAsPreset,
    resetMemberTuning,
    getAvailablePresets,
    getPresetsByCategory,
    getPresetCategories,
    findSimilarPresets,
    getTuningStatistics,
    getParameterValues,
    applyTuningToRenderer,
    tuningSystem
  };
};

export default useTuningSystem;