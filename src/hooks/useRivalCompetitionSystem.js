import { useState, useCallback } from 'react';

/**
 * useRivalCompetitionSystem - Rival bands, competition, and prestige battles
 * Handles:
 * - Rival band generation and tracking
 * - Performance battles and chart competition
 * - Rivalry escalation and feuds
 * - Victory/defeat outcomes and prestige impacts
 * - Regional and global competition
 */
export const useRivalCompetitionSystem = (gameState, updateGameState, addLog) => {
  const RIVAL_BANDS = [
    { id: 'neon-nights', name: 'Neon Nights', genre: 'Synth-Pop', basePrestige: 800, imageColor: '#ff006e' },
    { id: 'chrome-echo', name: 'Chrome Echo', genre: 'Electro', basePrestige: 750, imageColor: '#8338ec' },
    { id: 'velvet-storm', name: 'Velvet Storm', genre: 'Alternative', basePrestige: 900, imageColor: '#3a0ca3' },
    { id: 'golden-hour', name: 'Golden Hour', genre: 'Indie Pop', basePrestige: 700, imageColor: '#fb5607' },
    { id: 'midnight-crew', name: 'Midnight Crew', genre: 'Rock', basePrestige: 950, imageColor: '#1f77b4' },
    { id: 'sonic-wave', name: 'Sonic Wave', genre: 'Electronic', basePrestige: 850, imageColor: '#17b890' },
    { id: 'phantom-axis', name: 'Phantom Axis', genre: 'Prog Rock', basePrestige: 1000, imageColor: '#d62828' },
    { id: 'lunar-drift', name: 'Lunar Drift', genre: 'Ambient', basePrestige: 600, imageColor: '#f77f00' },
    { id: 'cosmic-static', name: 'Cosmic Static', genre: 'Experimental', basePrestige: 750, imageColor: '#fcbf49' },
    { id: 'titan-force', name: 'Titan Force', genre: 'Hard Rock', basePrestige: 1100, imageColor: '#6a4c93' }
  ];

  const BATTLE_TYPES = [
    { id: 'head-to-head-gig', name: 'Head-to-Head Gig', description: 'Compete at the same venue', factor: 'performance' },
    { id: 'album-battle', name: 'Album Chart Battle', description: 'Compete for chart position', factor: 'recording' },
    { id: 'streaming-war', name: 'Streaming Wars', description: 'Battle for listener numbers', factor: 'popularity' },
    { id: 'prestige-duel', name: 'Prestige Duel', description: 'Direct reputation challenge', factor: 'prestige' }
  ];

  const RIVALRY_LEVELS = ['neutral', 'aware', 'competing', 'fierce', 'bitter'];

  /**
   * Generate rival bands based on band progress
   */
  const generateRivalBands = useCallback(() => {
    const bandFame = gameState.fame || 0;
    const existingRivals = gameState.rivalBands || [];
    const existingIds = new Set(existingRivals.map(r => r.id));

    // Filter bands within prestige range (within 50% of player band prestige)
    const eligibleRivals = RIVAL_BANDS.filter(band => {
      if (existingIds.has(band.id)) return false;
      const prestigeDiff = Math.abs(band.basePrestige - bandFame);
      return prestigeDiff <= bandFame * 0.5;
    });

    if (eligibleRivals.length === 0) return [];

    // Return top 3-5 possible rivals
    return eligibleRivals.slice(0, Math.min(5, Math.ceil(existingRivals.length + 1)));
  }, [gameState.fame, gameState.rivalBands]);

  /**
   * Discover a new rival band
   */
  const discoverRival = useCallback((rivalBandId) => {
    const available = generateRivalBands();
    const rivalBand = available.find(b => b.id === rivalBandId);

    if (!rivalBand) {
      addLog('error', 'Rival band not found');
      return { success: false };
    }

    const existingRivals = gameState.rivalBands || [];
    if (existingRivals.some(r => r.id === rivalBandId)) {
      addLog('warning', `Already aware of ${rivalBand.name}`);
      return { success: false };
    }

    const newRival = {
      id: rivalBand.id,
      name: rivalBand.name,
      genre: rivalBand.genre,
      prestige: rivalBand.basePrestige,
      rivalryLevel: 'aware',
      victories: 0,
      defeats: 0,
      draws: 0,
      prestigeDifference: (gameState.fame || 0) - rivalBand.basePrestige,
      firstMetWeek: gameState.week || 0,
      lastBattleWeek: null,
      feudActive: false,
      imageColor: rivalBand.imageColor
    };

    const updatedRivals = [...existingRivals, newRival];

    updateGameState({ rivalBands: updatedRivals });
    addLog('info', `Discovered rival: ${rivalBand.name} (${rivalBand.genre})`);

    return { success: true, rival: newRival };
  }, [gameState.fame, gameState.week, gameState.rivalBands, updateGameState, addLog, generateRivalBands]);

  /**
   * Escalate rivalry with a band
   */
  const escalateRivalry = useCallback((rivalId) => {
    const rivals = gameState.rivalBands || [];
    const rivalIndex = rivals.findIndex(r => r.id === rivalId);

    if (rivalIndex === -1) {
      addLog('error', 'Rival not found');
      return { success: false };
    }

    const rival = rivals[rivalIndex];
    const currentLevel = RIVALRY_LEVELS.indexOf(rival.rivalryLevel);

    if (currentLevel >= RIVALRY_LEVELS.length - 1) {
      addLog('warning', `Rivalry with ${rival.name} is already at maximum`);
      return { success: false };
    }

    const newLevel = RIVALRY_LEVELS[currentLevel + 1];
    const updatedRival = { ...rival, rivalryLevel: newLevel };
    const updatedRivals = [...rivals];
    updatedRivals[rivalIndex] = updatedRival;

    updateGameState({ rivalBands: updatedRivals });
    addLog('warning', `Rivalry with ${rival.name} escalated to ${newLevel}`);

    return { success: true, newLevel };
  }, [gameState.rivalBands, updateGameState, addLog]);

  /**
   * Initiate a battle with a rival
   */
  const initiateBattle = useCallback((rivalId, battleType) => {
    const rivals = gameState.rivalBands || [];
    const rival = rivals.find(r => r.id === rivalId);

    if (!rival) {
      addLog('error', 'Rival not found');
      return { success: false };
    }

    const battle = BATTLE_TYPES.find(b => b.id === battleType);
    if (!battle) {
      addLog('error', 'Battle type not found');
      return { success: false };
    }

    // Calculate battle outcome based on player stats vs rival stats
    const playerPower = calculateBandPower(gameState, battle.factor);
    const rivalPower = rival.prestige + Math.random() * 200;

    const playerWins = playerPower > rivalPower;
    const isDraw = Math.abs(playerPower - rivalPower) < 50;

    // Update rival record
    const updatedRival = { ...rival };
    if (isDraw) {
      updatedRival.draws += 1;
    } else if (playerWins) {
      updatedRival.victories += 1;
      updatedRival.defeats = Math.max(0, updatedRival.defeats - 1);
    } else {
      updatedRival.defeats += 1;
      updatedRival.victories = Math.max(0, updatedRival.victories - 1);
    }

    updatedRival.lastBattleWeek = gameState.week || 0;

    // Prestige impact
    const prestigeChange = playerWins ? 50 : -30;
    const playerFameGain = playerWins ? 200 : -100;

    // Record battle in history
    const battleResult = {
      id: `battle-${Date.now()}`,
      type: battle.name,
      rivalId: rival.id,
      rivalName: rival.name,
      playerWon: playerWins,
      week: gameState.week || 0,
      playerPower: Math.floor(playerPower),
      rivalPower: Math.floor(rivalPower)
    };

    const updatedRivals = (gameState.rivalBands || []).map(r =>
      r.id === rivalId ? updatedRival : r
    );

    updateGameState({
      rivalBands: updatedRivals,
      prestige: (gameState.prestige || 0) + prestigeChange,
      fame: (gameState.fame || 0) + playerFameGain,
      battleHistory: [...(gameState.battleHistory || []), battleResult]
    });

    if (isDraw) {
      addLog('info', `Battle with ${rival.name}: DRAW! (${Math.floor(playerPower)} vs ${Math.floor(rivalPower)})`);
    } else if (playerWins) {
      addLog('success', `Defeated ${rival.name}! Prestige +${prestigeChange}, Fame +${playerFameGain}`);
    } else {
      addLog('warning', `Lost to ${rival.name}. Prestige ${prestigeChange}, Fame ${playerFameGain}`);
    }

    return { success: true, playerWon: playerWins, isDraw, battleResult };
  }, [gameState, updateGameState, addLog]);

  /**
   * Calculate band power for battles
   */
  const calculateBandPower = useCallback((state, factor) => {
    let power = state.fame || 500;

    if (factor === 'performance') {
      // Gig performance bonus
      const gigStats = state.gigStats || {};
      power += (gigStats.avgQuality || 50) * 5;
    } else if (factor === 'recording') {
      // Recording quality bonus
      const recordingQuality = state.recordingQualityBonus || 0;
      power += recordingQuality * 20;
    } else if (factor === 'popularity') {
      // Stream/popularity bonus
      const totalStreams = state.totalStreams || 0;
      power += (totalStreams / 1000);
    } else if (factor === 'prestige') {
      // Direct prestige
      power += state.prestige || 0;
    }

    // Band member skill impact
    const bandMembers = state.bandMembers || [];
    if (bandMembers.length > 0) {
      const avgSkill = bandMembers.reduce((sum, m) => sum + m.skill, 0) / bandMembers.length;
      power += avgSkill * 10;
    }

    // Morale impact
    const morale = state.morale || 50;
    power *= (morale / 100);

    return power;
  }, []);

  /**
   * Create a feud with rival (escalates drama and prestige stakes)
   */
  const createFeud = useCallback((rivalId) => {
    const rivals = gameState.rivalBands || [];
    const rival = rivals.find(r => r.id === rivalId);

    if (!rival) {
      addLog('error', 'Rival not found');
      return { success: false };
    }

    if (rival.feudActive) {
      addLog('warning', `Already in an active feud with ${rival.name}`);
      return { success: false };
    }

    const updatedRival = {
      ...rival,
      feudActive: true,
      feudStartWeek: gameState.week || 0,
      feudMomentum: 0
    };

    const updatedRivals = (gameState.rivalBands || []).map(r =>
      r.id === rivalId ? updatedRival : r
    );

    updateGameState({ rivalBands: updatedRivals });
    addLog('warning', `FEUD INITIATED: ${rival.name} is now your sworn rival!`);

    return { success: true };
  }, [gameState, updateGameState, addLog]);

  /**
   * Get rival statistics
   */
  const getRivalStats = useCallback(() => {
    const rivals = gameState.rivalBands || [];

    return {
      totalRivals: rivals.length,
      activeFeeds: rivals.filter(r => r.feudActive).length,
      totalVictories: rivals.reduce((sum, r) => sum + r.victories, 0),
      totalDefeats: rivals.reduce((sum, r) => sum + r.defeats, 0),
      totalDraws: rivals.reduce((sum, r) => sum + r.draws, 0),
      winRate: rivals.length > 0
        ? Math.round((rivals.reduce((sum, r) => sum + r.victories, 0) / (rivals.reduce((sum, r) => sum + r.victories + r.defeats, 0) || 1)) * 100)
        : 0,
      rivalList: rivals,
      battleHistory: gameState.battleHistory || []
    };
  }, [gameState.rivalBands, gameState.battleHistory]);

  /**
   * Get chart position vs rivals
   */
  const getChartCompetition = useCallback(() => {
    const rivals = gameState.rivalBands || [];
    const playerFame = gameState.fame || 0;

    const chartPositions = [
      { name: gameState.bandName || 'Your Band', fame: playerFame, rank: 1 }
    ];

    rivals.forEach((rival, index) => {
      chartPositions.push({
        name: rival.name,
        fame: rival.prestige,
        rank: index + 2
      });
    });

    // Sort by fame descending
    chartPositions.sort((a, b) => b.fame - a.fame);

    // Assign ranks
    chartPositions.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return chartPositions;
  }, [gameState.bandName, gameState.fame, gameState.rivalBands]);

  /**
   * Process weekly rival activity (random events, prestige shifts)
   */
  const processWeeklyRivalActivity = useCallback(() => {
    const rivals = gameState.rivalBands || [];
    if (rivals.length === 0) return;

    const updatedRivals = rivals.map(rival => {
      let updated = { ...rival };

      // Rival prestige changes (50% chance of fluctuation)
      if (Math.random() > 0.5) {
        const prestigeChange = Math.floor((Math.random() - 0.5) * 200);
        updated.prestige = Math.max(100, updated.prestige + prestigeChange);
      }

      // Feud momentum
      if (updated.feudActive) {
        updated.feudMomentum = Math.min(10, updated.feudMomentum + 1);
      }

      return updated;
    });

    updateGameState({ rivalBands: updatedRivals });
  }, [gameState.rivalBands, updateGameState]);

  return {
    // Rival management
    generateRivalBands,
    discoverRival,
    escalateRivalry,
    createFeud,

    // Battles
    initiateBattle,

    // Stats
    getRivalStats,
    getChartCompetition,

    // Processing
    processWeeklyRivalActivity,

    // Data
    RIVAL_BANDS,
    BATTLE_TYPES,
    RIVALRY_LEVELS
  };
};
