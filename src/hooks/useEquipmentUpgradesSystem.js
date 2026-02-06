import { useState, useCallback } from 'react';

/**
 * useEquipmentUpgradesSystem - Equipment, instrument, and studio upgrades
 * Handles:
 * - Studio tier progression (home → professional → state-of-the-art)
 * - Instrument quality improvements
 * - Stage equipment (amps, lights, sound systems)
 * - Cost/benefit calculations
 * - Passive bonuses to recording/performance quality
 */
export const useEquipmentUpgradesSystem = (gameState, updateGameState, addLog) => {
  const STUDIO_TIERS = [
    {
      id: 'home-studio',
      name: 'Home Studio',
      tier: 1,
      cost: 0,
      qualityBonus: 0,
      recordingSpeedMultiplier: 1,
      releaseSpeed: 'slow',
      description: 'Your bedroom setup',
      unlocked: true
    },
    {
      id: 'rehearsal-space',
      name: 'Rehearsal Space',
      tier: 2,
      cost: 2000,
      qualityBonus: 5,
      recordingSpeedMultiplier: 1.2,
      releaseSpeed: 'normal',
      description: 'Dedicated band rehearsal room',
      unlocked: false
    },
    {
      id: 'local-studio',
      name: 'Local Recording Studio',
      tier: 3,
      cost: 5000,
      qualityBonus: 15,
      recordingSpeedMultiplier: 1.5,
      releaseSpeed: 'fast',
      description: 'Professional local studio with experienced engineer',
      unlocked: false
    },
    {
      id: 'professional-studio',
      name: 'Professional Studio',
      tier: 4,
      cost: 15000,
      qualityBonus: 25,
      recordingSpeedMultiplier: 1.8,
      releaseSpeed: 'very-fast',
      description: 'State-of-the-art recording facility',
      unlocked: false
    },
    {
      id: 'premium-studio',
      name: 'Premium Studio Complex',
      tier: 5,
      cost: 40000,
      qualityBonus: 35,
      recordingSpeedMultiplier: 2,
      releaseSpeed: 'lightning-fast',
      description: 'Elite studio with multiple rooms and top engineers',
      unlocked: false
    }
  ];

  const INSTRUMENT_TIERS = [
    {
      id: 'budget-instruments',
      name: 'Budget Instruments',
      tier: 1,
      cost: 0,
      qualityBonus: 0,
      performanceBonus: 0,
      description: 'Basic starter instruments',
      unlocked: true
    },
    {
      id: 'quality-instruments',
      name: 'Quality Instruments',
      tier: 2,
      cost: 3000,
      qualityBonus: 8,
      performanceBonus: 5,
      description: 'Mid-range professional instruments',
      unlocked: false
    },
    {
      id: 'premium-instruments',
      name: 'Premium Instruments',
      tier: 3,
      cost: 8000,
      qualityBonus: 15,
      performanceBonus: 12,
      description: 'High-end handcrafted instruments',
      unlocked: false
    },
    {
      id: 'signature-instruments',
      name: 'Signature Instruments',
      tier: 4,
      cost: 20000,
      qualityBonus: 25,
      performanceBonus: 20,
      description: 'Custom-made signature instruments',
      unlocked: false
    }
  ];

  const STAGE_EQUIPMENT = [
    {
      id: 'basic-amp',
      name: 'Basic Amplifier',
      type: 'amplification',
      cost: 500,
      performanceBonus: 3,
      carryWeight: 'heavy',
      description: 'Entry-level amp for small venues',
      unlocked: true
    },
    {
      id: 'quality-amp',
      name: 'Quality Amplifier',
      type: 'amplification',
      cost: 2000,
      performanceBonus: 8,
      carryWeight: 'heavy',
      description: 'Mid-range amp for larger venues',
      unlocked: false
    },
    {
      id: 'professional-amp',
      name: 'Professional Amplifier',
      type: 'amplification',
      cost: 5000,
      performanceBonus: 15,
      carryWeight: 'very-heavy',
      description: 'High-power amp for major venues',
      unlocked: false
    },
    {
      id: 'basic-lighting',
      name: 'Basic Stage Lights',
      type: 'lighting',
      cost: 1000,
      performanceBonus: 5,
      carryWeight: 'moderate',
      description: 'Simple colored lighting rig',
      unlocked: true
    },
    {
      id: 'pro-lighting',
      name: 'Professional Lighting Rig',
      type: 'lighting',
      cost: 3500,
      performanceBonus: 12,
      carryWeight: 'heavy',
      description: 'Advanced lighting with effects and programming',
      unlocked: false
    },
    {
      id: 'laser-lights',
      name: 'Laser Lighting System',
      type: 'lighting',
      cost: 8000,
      performanceBonus: 20,
      carryWeight: 'very-heavy',
      description: 'High-end laser light show system',
      unlocked: false
    },
    {
      id: 'basic-sound',
      name: 'Basic Sound System',
      type: 'sound',
      cost: 1500,
      performanceBonus: 4,
      carryWeight: 'moderate',
      description: 'Portable PA system',
      unlocked: true
    },
    {
      id: 'quality-sound',
      name: 'Quality Sound System',
      type: 'sound',
      cost: 4000,
      performanceBonus: 10,
      carryWeight: 'heavy',
      description: 'Professional sound reinforcement',
      unlocked: false
    },
    {
      id: 'premium-sound',
      name: 'Premium Sound System',
      type: 'sound',
      cost: 10000,
      performanceBonus: 18,
      carryWeight: 'very-heavy',
      description: 'State-of-the-art acoustics and clarity',
      unlocked: false
    },
    {
      id: 'merch-booth',
      name: 'Merchandise Booth',
      type: 'merchandise',
      cost: 500,
      performanceBonus: 0,
      merchandiseBonus: 1.3,
      carryWeight: 'light',
      description: 'Setup for selling band merchandise at gigs',
      unlocked: true
    },
    {
      id: 'professional-merch',
      name: 'Professional Merchandise Setup',
      type: 'merchandise',
      cost: 2000,
      performanceBonus: 0,
      merchandiseBonus: 1.6,
      carryWeight: 'moderate',
      description: 'High-end merch display and sales system',
      unlocked: false
    }
  ];

  /**
   * Get available studio upgrades based on progress
   */
  const getAvailableStudioUpgrades = useCallback(() => {
    const currentStudio = gameState.currentStudio || STUDIO_TIERS[0];
    return STUDIO_TIERS.filter(studio => {
      if (studio.tier <= currentStudio.tier) return false;
      // Unlock based on money threshold or fame
      const moneyUnlocked = gameState.money >= studio.cost * 0.5;
      const fameUnlocked = gameState.fame >= studio.tier * 500;
      return moneyUnlocked || fameUnlocked;
    });
  }, [gameState.money, gameState.fame, gameState.currentStudio]);

  /**
   * Get available instrument upgrades
   */
  const getAvailableInstrumentUpgrades = useCallback(() => {
    const currentInstruments = gameState.currentInstruments || INSTRUMENT_TIERS[0];
    return INSTRUMENT_TIERS.filter(instruments => {
      if (instruments.tier <= currentInstruments.tier) return false;
      const moneyUnlocked = gameState.money >= instruments.cost * 0.5;
      const fameUnlocked = gameState.fame >= instruments.tier * 800;
      return moneyUnlocked || fameUnlocked;
    });
  }, [gameState.money, gameState.fame, gameState.currentInstruments]);

  /**
   * Get available stage equipment
   */
  const getAvailableStageEquipment = useCallback(() => {
    const ownedEquipment = gameState.stageEquipment || [];
    return STAGE_EQUIPMENT.filter(equipment => {
      // Already owned
      if (ownedEquipment.some(e => e.id === equipment.id)) return false;
      const moneyUnlocked = gameState.money >= equipment.cost * 0.4;
      const fameUnlocked = gameState.fame >= 500;
      return moneyUnlocked || fameUnlocked;
    });
  }, [gameState.money, gameState.fame, gameState.stageEquipment]);

  /**
   * Upgrade studio tier
   */
  const upgradeStudio = useCallback((studioId) => {
    const newStudio = STUDIO_TIERS.find(s => s.id === studioId);
    if (!newStudio) {
      addLog('error', 'Studio not found');
      return { success: false };
    }

    const currentMoney = gameState.money || 0;
    if (currentMoney < newStudio.cost) {
      addLog('error', `Need $${newStudio.cost} for ${newStudio.name} (have $${currentMoney})`);
      return { success: false, reason: 'insufficient-funds' };
    }

    const oldStudio = gameState.currentStudio || STUDIO_TIERS[0];

    updateGameState({
      currentStudio: newStudio,
      money: currentMoney - newStudio.cost,
      recordingQualityBonus: (gameState.recordingQualityBonus || 0) - oldStudio.qualityBonus + newStudio.qualityBonus
    });

    addLog('success', `Upgraded to ${newStudio.name}! Quality +${newStudio.qualityBonus - oldStudio.qualityBonus}`);

    return { success: true, studio: newStudio };
  }, [gameState, updateGameState, addLog]);

  /**
   * Upgrade instruments
   */
  const upgradeInstruments = useCallback((instrumentsId) => {
    const newInstruments = INSTRUMENT_TIERS.find(i => i.id === instrumentsId);
    if (!newInstruments) {
      addLog('error', 'Instruments not found');
      return { success: false };
    }

    const currentMoney = gameState.money || 0;
    if (currentMoney < newInstruments.cost) {
      addLog('error', `Need $${newInstruments.cost} for ${newInstruments.name} (have $${currentMoney})`);
      return { success: false };
    }

    const oldInstruments = gameState.currentInstruments || INSTRUMENT_TIERS[0];

    updateGameState({
      currentInstruments: newInstruments,
      money: currentMoney - newInstruments.cost,
      recordingQualityBonus: (gameState.recordingQualityBonus || 0) - oldInstruments.qualityBonus + newInstruments.qualityBonus,
      performanceBonus: (gameState.performanceBonus || 0) - oldInstruments.performanceBonus + newInstruments.performanceBonus
    });

    addLog('success', `Upgraded to ${newInstruments.name}! Quality +${newInstruments.qualityBonus - oldInstruments.qualityBonus}`);

    return { success: true, instruments: newInstruments };
  }, [gameState, updateGameState, addLog]);

  /**
   * Buy stage equipment
   */
  const buyStageEquipment = useCallback((equipmentId) => {
    const equipment = STAGE_EQUIPMENT.find(e => e.id === equipmentId);
    if (!equipment) {
      addLog('error', 'Equipment not found');
      return { success: false };
    }

    const ownedEquipment = gameState.stageEquipment || [];
    if (ownedEquipment.some(e => e.id === equipmentId)) {
      addLog('warning', `Already own ${equipment.name}`);
      return { success: false, reason: 'already-owned' };
    }

    const currentMoney = gameState.money || 0;
    if (currentMoney < equipment.cost) {
      addLog('error', `Need $${equipment.cost} for ${equipment.name} (have $${currentMoney})`);
      return { success: false };
    }

    const updatedEquipment = [...ownedEquipment, equipment];
    const totalPerformanceBonus = updatedEquipment.reduce((sum, e) => sum + (e.performanceBonus || 0), 0);

    updateGameState({
      stageEquipment: updatedEquipment,
      money: currentMoney - equipment.cost,
      performanceBonus: totalPerformanceBonus
    });

    addLog('success', `Purchased ${equipment.name}! Performance +${equipment.performanceBonus || 0}`);

    return { success: true, equipment };
  }, [gameState, updateGameState, addLog]);

  /**
   * Sell stage equipment
   */
  const sellStageEquipment = useCallback((equipmentId) => {
    const ownedEquipment = gameState.stageEquipment || [];
    const equipment = ownedEquipment.find(e => e.id === equipmentId);

    if (!equipment) {
      addLog('error', 'Equipment not found');
      return { success: false };
    }

    const sellPrice = Math.floor(equipment.cost * 0.6); // Sell for 60% of original price
    const updatedEquipment = ownedEquipment.filter(e => e.id !== equipmentId);
    const totalPerformanceBonus = updatedEquipment.reduce((sum, e) => sum + (e.performanceBonus || 0), 0);

    updateGameState({
      stageEquipment: updatedEquipment,
      money: (gameState.money || 0) + sellPrice,
      performanceBonus: totalPerformanceBonus
    });

    addLog('info', `Sold ${equipment.name} for $${sellPrice}`);

    return { success: true, sellPrice };
  }, [gameState, updateGameState, addLog]);

  /**
   * Get equipment by type
   */
  const getEquipmentByType = useCallback((type) => {
    const ownedEquipment = gameState.stageEquipment || [];
    return ownedEquipment.filter(e => e.type === type);
  }, [gameState.stageEquipment]);

  /**
   * Get total performance bonus from all equipment
   */
  const getTotalPerformanceBonus = useCallback(() => {
    const stageBonus = (gameState.stageEquipment || []).reduce((sum, e) => sum + (e.performanceBonus || 0), 0);
    const instrumentBonus = gameState.currentInstruments?.performanceBonus || 0;
    return stageBonus + instrumentBonus;
  }, [gameState.stageEquipment, gameState.currentInstruments]);

  /**
   * Get equipment stats overview
   */
  const getEquipmentStats = useCallback(() => {
    const currentStudio = gameState.currentStudio || STUDIO_TIERS[0];
    const currentInstruments = gameState.currentInstruments || INSTRUMENT_TIERS[0];
    const stageEquipment = gameState.stageEquipment || [];

    const stageBonus = stageEquipment.reduce((sum, e) => sum + (e.performanceBonus || 0), 0);
    const recordingBonus = currentStudio.qualityBonus + currentInstruments.qualityBonus;
    const performanceBonus = getTotalPerformanceBonus();

    return {
      currentStudio,
      currentInstruments,
      stageEquipment,
      stageEquipmentCount: stageEquipment.length,
      recordingQualityBonus: recordingBonus,
      performanceBonus,
      totalInvestment: currentStudio.cost + currentInstruments.cost + stageEquipment.reduce((sum, e) => sum + e.cost, 0)
    };
  }, [gameState.currentStudio, gameState.currentInstruments, gameState.stageEquipment, getTotalPerformanceBonus]);

  return {
    // Studio
    getAvailableStudioUpgrades,
    upgradeStudio,

    // Instruments
    getAvailableInstrumentUpgrades,
    upgradeInstruments,

    // Stage Equipment
    getAvailableStageEquipment,
    buyStageEquipment,
    sellStageEquipment,
    getEquipmentByType,

    // Stats
    getTotalPerformanceBonus,
    getEquipmentStats,

    // Data (for modals/UI)
    STUDIO_TIERS,
    INSTRUMENT_TIERS,
    STAGE_EQUIPMENT
  };
};
