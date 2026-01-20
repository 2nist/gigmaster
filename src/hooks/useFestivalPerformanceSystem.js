import { useState, useCallback } from 'react';

/**
 * useFestivalPerformanceSystem - Festival performances and special events
 * Handles:
 * - Festival discovery and applications
 * - Festival performance management
 * - Setlist creation and stage presence
 * - Special festival rewards and prestige multipliers
 * - Festival competition and ranking
 */
export const useFestivalPerformanceSystem = (gameState, updateGameState, addLog) => {
  const FESTIVALS = [
    {
      id: 'summer-soundwave',
      name: 'Summer Soundwave',
      season: 'summer',
      prestige: 2,
      minFame: 500,
      capacity: 5000,
      payoutBase: 2000,
      prestigeMultiplier: 2,
      fameMultiplier: 1.5,
      description: 'Regional summer music festival with diverse lineup',
      slots: 3,
      currentAttendees: 0
    },
    {
      id: 'indie-connect',
      name: 'Indie Connect Festival',
      season: 'spring',
      prestige: 2,
      minFame: 300,
      capacity: 3000,
      payoutBase: 1500,
      prestigeMultiplier: 1.8,
      fameMultiplier: 1.3,
      description: 'Indie-focused festival for emerging artists',
      slots: 5,
      currentAttendees: 0
    },
    {
      id: 'urban-beats',
      name: 'Urban Beats Music Fest',
      season: 'fall',
      prestige: 3,
      minFame: 1000,
      capacity: 8000,
      payoutBase: 3000,
      prestigeMultiplier: 2.5,
      fameMultiplier: 1.8,
      description: 'Major urban music festival with prime stage slots',
      slots: 2,
      currentAttendees: 0
    },
    {
      id: 'electric-night',
      name: 'Electric Night Festival',
      season: 'spring',
      prestige: 3,
      minFame: 1500,
      capacity: 10000,
      payoutBase: 4000,
      prestigeMultiplier: 2.7,
      fameMultiplier: 2.0,
      description: 'Premier electronic music festival',
      slots: 3,
      currentAttendees: 0
    },
    {
      id: 'global-harmony',
      name: 'Global Harmony Fest',
      season: 'summer',
      prestige: 4,
      minFame: 5000,
      capacity: 20000,
      payoutBase: 8000,
      prestigeMultiplier: 3.0,
      fameMultiplier: 2.5,
      description: 'International mega-festival with world-class artists',
      slots: 1,
      currentAttendees: 0
    },
    {
      id: 'rock-realm',
      name: 'Rock Realm Festival',
      season: 'fall',
      prestige: 3,
      minFame: 2000,
      capacity: 12000,
      payoutBase: 3500,
      prestigeMultiplier: 2.6,
      fameMultiplier: 1.9,
      description: 'Legendary rock festival with heritage lineup',
      slots: 2,
      currentAttendees: 0
    },
    {
      id: 'synth-surge',
      name: 'Synth Surge Showcase',
      season: 'winter',
      prestige: 2,
      minFame: 800,
      capacity: 6000,
      payoutBase: 2500,
      prestigeMultiplier: 2.2,
      fameMultiplier: 1.6,
      description: 'Synthesizer and electronic music showcase',
      slots: 4,
      currentAttendees: 0
    },
    {
      id: 'revolution-fest',
      name: 'Revolution Fest',
      season: 'summer',
      prestige: 4,
      minFame: 8000,
      capacity: 25000,
      payoutBase: 10000,
      prestigeMultiplier: 3.5,
      fameMultiplier: 3.0,
      description: 'Massive annual festival pushing music boundaries',
      slots: 1,
      currentAttendees: 0
    }
  ];

  const STAGE_TYPES = [
    { id: 'opening-slot', name: 'Opening Slot', duration: 20, prestige: 1, fameBonus: 0.8 },
    { id: 'mid-card', name: 'Mid-Card Performance', duration: 40, prestige: 2, fameBonus: 1.0 },
    { id: 'headliner', name: 'Headline Performance', duration: 60, prestige: 3, fameBonus: 1.5 },
    { id: 'closer', name: 'Festival Closer', duration: 75, prestige: 4, fameBonus: 2.0 }
  ];

  /**
   * Get available festivals based on band progress
   */
  const getAvailableFestivals = useCallback(() => {
    const bandFame = gameState.fame || 0;
    const appliedFestivals = gameState.festivalApplications || [];
    const appliedIds = new Set(appliedFestivals.map(a => a.festivalId));

    return FESTIVALS.filter(festival => {
      // Can't apply twice to same festival
      if (appliedIds.has(festival.id)) return false;

      // Must meet minimum fame requirement
      if (bandFame < festival.minFame) return false;

      // Must have available slots
      if (festival.currentAttendees >= festival.slots) return false;

      return true;
    });
  }, [gameState.fame, gameState.festivalApplications]);

  /**
   * Apply to perform at a festival
   */
  const applyToFestival = useCallback((festivalId) => {
    const festival = FESTIVALS.find(f => f.id === festivalId);
    if (!festival) {
      addLog('error', 'Festival not found');
      return { success: false };
    }

    const availableFestivals = getAvailableFestivals();
    if (!availableFestivals.find(f => f.id === festivalId)) {
      addLog('error', `Cannot apply to ${festival.name}`);
      return { success: false };
    }

    // Application fee
    const applicationFee = 500;
    const currentMoney = gameState.money || 0;

    if (currentMoney < applicationFee) {
      addLog('error', `Need $${applicationFee} for festival application (have $${currentMoney})`);
      return { success: false };
    }

    // Acceptance chance based on band stats
    const bandQuality = (gameState.recordingQualityBonus || 0) / 100;
    const moraleFactor = (gameState.morale || 50) / 100;
    const acceptanceChance = Math.min(0.95, 0.5 + bandQuality * 0.3 + moraleFactor * 0.15);

    const accepted = Math.random() < acceptanceChance;

    const application = {
      id: `app-${Date.now()}`,
      festivalId: festival.id,
      festivalName: festival.name,
      appliedWeek: gameState.week || 0,
      accepted: accepted,
      stage: null,
      performance: null,
      earnings: 0,
      prestige: 0,
      fame: 0
    };

    const applicationFee_cost = currentMoney - applicationFee;
    const updatedApplications = [...(gameState.festivalApplications || []), application];

    updateGameState({
      festivalApplications: updatedApplications,
      money: applicationFee_cost
    });

    if (accepted) {
      addLog('success', `Accepted to perform at ${festival.name}!`);
    } else {
      addLog('warning', `Application to ${festival.name} rejected`);
    }

    return { success: true, application, accepted };
  }, [gameState, updateGameState, addLog, getAvailableFestivals]);

  /**
   * Choose stage type for festival performance
   */
  const chooseStageType = useCallback((applicationId, stageTypeId) => {
    const applications = gameState.festivalApplications || [];
    const appIndex = applications.findIndex(a => a.id === applicationId);

    if (appIndex === -1) {
      addLog('error', 'Application not found');
      return { success: false };
    }

    const application = applications[appIndex];
    if (!application.accepted) {
      addLog('error', 'Not accepted to this festival');
      return { success: false };
    }

    const stage = STAGE_TYPES.find(s => s.id === stageTypeId);
    if (!stage) {
      addLog('error', 'Stage type not found');
      return { success: false };
    }

    const updatedApplication = {
      ...application,
      stage: stage
    };

    const updatedApplications = [...applications];
    updatedApplications[appIndex] = updatedApplication;

    updateGameState({ festivalApplications: updatedApplications });
    addLog('info', `Selected ${stage.name} for ${application.festivalName}`);

    return { success: true };
  }, [gameState.festivalApplications, updateGameState, addLog]);

  /**
   * Perform at a festival
   */
  const performAtFestival = useCallback((applicationId) => {
    const applications = gameState.festivalApplications || [];
    const appIndex = applications.findIndex(a => a.id === applicationId);

    if (appIndex === -1) {
      addLog('error', 'Application not found');
      return { success: false };
    }

    const application = applications[appIndex];
    if (!application.accepted || !application.stage) {
      addLog('error', 'Not ready to perform');
      return { success: false };
    }

    const festival = FESTIVALS.find(f => f.id === application.festivalId);
    const stage = application.stage;

    // Calculate performance quality
    const bandSkill = gameState.bandMembers?.reduce((sum, m) => sum + m.skill, 0) / Math.max(1, gameState.bandMembers?.length || 1) || 5;
    const moraleMult = (gameState.morale || 50) / 100;
    const equipmentBonus = (gameState.gearTier || 0) * 5;
    const quality = Math.min(100, Math.floor(bandSkill * 10 + equipmentBonus + moraleMult * 20));

    // Calculate attendance (festival capacity matters)
    const attendanceFactor = Math.min(1, (gameState.fame || 0) / (festival.capacity / 100));
    const attendance = Math.floor(festival.capacity * (0.3 + attendanceFactor * 0.7));

    // Earnings calculation
    const baseEarnings = festival.payoutBase * (quality / 100);
    const stageMultiplier = stage.prestige / 2; // Headliners earn more
    const earnings = Math.floor(baseEarnings * stageMultiplier);

    // Prestige and fame multipliers from festival
    const prestigeGain = Math.floor(festival.prestigeMultiplier * stage.prestige * (quality / 100));
    const fameGain = Math.floor(attendance * festival.fameMultiplier * stage.fameBonus);

    // Update morale from successful performance
    const moraleGain = Math.floor(quality / 10);

    const updatedApplication = {
      ...application,
      performance: {
        week: gameState.week || 0,
        quality,
        attendance,
        earnings,
        prestigeGain,
        fameGain,
        moraleGain
      },
      earnings,
      prestige: prestigeGain,
      fame: fameGain
    };

    const updatedApplications = [...applications];
    updatedApplications[appIndex] = updatedApplication;

    const members = gameState.bandMembers || [];
    const updatedMembers = members.map(m => ({
      ...m,
      morale: Math.min(100, m.morale + Math.floor(moraleGain / 2))
    }));

    updateGameState({
      festivalApplications: updatedApplications,
      money: (gameState.money || 0) + earnings,
      prestige: (gameState.prestige || 0) + prestigeGain,
      fame: (gameState.fame || 0) + fameGain,
      morale: Math.min(100, (gameState.morale || 50) + moraleGain),
      bandMembers: updatedMembers,
      festivalPerformances: [...(gameState.festivalPerformances || []), updatedApplication]
    });

    addLog('success', `Festival performance! Earnings: $${earnings}, Prestige +${prestigeGain}, Fame +${fameGain}`);

    return { success: true, earnings, prestigeGain, fameGain };
  }, [gameState, updateGameState, addLog]);

  /**
   * Get festival statistics
   */
  const getFestivalStats = useCallback(() => {
    const performances = gameState.festivalPerformances || [];

    return {
      totalFestivalPerformances: performances.length,
      totalFestivalEarnings: performances.reduce((sum, p) => sum + (p.earnings || 0), 0),
      totalPrestigeFromFestivals: performances.reduce((sum, p) => sum + (p.prestige || 0), 0),
      totalFameFromFestivals: performances.reduce((sum, p) => sum + (p.fame || 0), 0),
      avgPerformanceQuality: performances.length > 0
        ? Math.floor(performances.reduce((sum, p) => sum + (p.performance?.quality || 0), 0) / performances.length)
        : 0,
      festivals: performances,
      avgAttendance: performances.length > 0
        ? Math.floor(performances.reduce((sum, p) => sum + (p.performance?.attendance || 0), 0) / performances.length)
        : 0
    };
  }, [gameState.festivalPerformances]);

  /**
   * Get pending festival applications
   */
  const getPendingApplications = useCallback(() => {
    const applications = gameState.festivalApplications || [];
    return applications.filter(a => !a.performance);
  }, [gameState.festivalApplications]);

  /**
   * Get completed festival performances
   */
  const getCompletedPerformances = useCallback(() => {
    const performances = gameState.festivalPerformances || [];
    return performances.filter(p => p.performance);
  }, [gameState.festivalPerformances]);

  return {
    // Festival management
    getAvailableFestivals,
    applyToFestival,
    chooseStageType,
    performAtFestival,

    // Stats and tracking
    getFestivalStats,
    getPendingApplications,
    getCompletedPerformances,

    // Data (for modals/UI)
    FESTIVALS,
    STAGE_TYPES
  };
};
