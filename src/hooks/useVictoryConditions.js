import { useCallback, useState, useEffect } from 'react';

/**
 * useVictoryConditions - Track scenario goals and determine win/loss conditions
 * 
 * Monitors:
 * - Scenario-specific goals
 * - Victory/defeat conditions
 * - Goal progress
 * - Time limits
 * 
 * @param {Object} gameState - Current game state
 * @param {Object} scenario - Selected scenario with goals
 * @returns {Object} Victory state and progress tracking
 */
export const useVictoryConditions = (gameState, scenario) => {
  const [victoryState, setVictoryState] = useState(null);
  const [goalProgress, setGoalProgress] = useState({});
  const [completedGoals, setCompletedGoals] = useState([]);

  // Initialize goal progress when scenario changes
  useEffect(() => {
    if (!scenario || !scenario.goals) return;

    const progress = {};
    scenario.goals.forEach(goal => {
      progress[goal.id] = {
        goal,
        progress: 0,
        completed: false,
        target: goal.target
      };
    });
    setGoalProgress(progress);
    setCompletedGoals([]);
  }, [scenario]);

  /**
   * Check if a specific goal is met
   */
  const checkGoal = useCallback((goal, gameState) => {
    if (!goal || !gameState) return false;

    switch (goal.type) {
      case 'totalStreams':
        return (gameState.totalStreams || 0) >= goal.target;
      
      case 'stayIndependent':
        return !gameState.hasSignedLabel;
      
      case 'signMajorLabel':
        return gameState.hasSignedLabel && gameState.labelTier === 'major';
      
      case 'numberOneAlbum':
        return gameState.albums?.some(a => a.chartPosition === 1) || false;
      
      case 'tourRegions':
        return gameState.tourRegions?.length >= goal.target;
      
      case 'goViral':
        return gameState.isViral || false;
      
      case 'surviveWeeks':
        return (gameState.week || 0) >= goal.target;
      
      case 'maintainFame':
        return (gameState.fame || 0) >= goal.target;
      
      case 'totalHits':
        const hitCount = (gameState.songs || []).filter(s => s.popularity > 50).length;
        return hitCount >= goal.target;
      
      case 'socialFollowers':
        return (gameState.socialMediaFollowers || 0) >= goal.target;
      
      case 'playlistPlacements':
        return (gameState.playlistPlacements?.length || 0) >= goal.target;
      
      case 'topTenHits':
        const topTenCount = (gameState.songs || []).filter(s => s.chartPosition <= 10).length;
        return topTenCount >= goal.target;
      
      case 'withinWeeks':
        return (gameState.week || 0) <= goal.target;
      
      case 'earnMoney':
        return (gameState.money || 0) >= goal.target;
      
      case 'maxBandSize':
        return (gameState.bandMembers?.length || 0) >= goal.target;
      
      case 'grammarWins':
        return (gameState.grammyWins || 0) >= goal.target;
      
      default:
        return false;
    }
  }, []);

  /**
   * Check all goals and update progress
   */
  const updateGoalProgress = useCallback((gameState) => {
    if (!scenario || !scenario.goals) return;

    const updatedProgress = { ...goalProgress };
    const newCompleted = [];

    scenario.goals.forEach(goal => {
      const isCompleted = checkGoal(goal, gameState);
      updatedProgress[goal.id] = {
        ...updatedProgress[goal.id],
        completed: isCompleted,
        progress: getGoalProgress(goal, gameState)
      };

      if (isCompleted) {
        newCompleted.push(goal.id);
      }
    });

    setGoalProgress(updatedProgress);
    setCompletedGoals(newCompleted);

    // Check victory/defeat conditions
    checkVictoryConditions(gameState, newCompleted);
  }, [scenario, goalProgress, checkGoal]);

  /**
   * Get numeric progress for a goal
   */
  const getGoalProgress = useCallback((goal, gameState) => {
    if (!gameState) return 0;

    switch (goal.type) {
      case 'totalStreams':
        return Math.min(gameState.totalStreams || 0, goal.target);
      case 'tourRegions':
        return gameState.tourRegions?.length || 0;
      case 'surviveWeeks':
        return gameState.week || 0;
      case 'maintainFame':
        return gameState.fame || 0;
      case 'socialFollowers':
        return gameState.socialMediaFollowers || 0;
      case 'playlistPlacements':
        return gameState.playlistPlacements?.length || 0;
      case 'earnMoney':
        return gameState.money || 0;
      case 'maxBandSize':
        return gameState.bandMembers?.length || 0;
      default:
        return 0;
    }
  }, []);

  /**
   * Check if victory, defeat, or ongoing
   */
  const checkVictoryConditions = useCallback((gameState, completedGoalsIds) => {
    if (!scenario) return;

    // Time limit defeat
    if (scenario.specialRules?.timeLimit) {
      if ((gameState.week || 0) > scenario.specialRules.timeLimit) {
        if (completedGoalsIds.length < scenario.goals?.length) {
          setVictoryState({
            status: 'defeat',
            reason: 'Time limit expired',
            message: `You ran out of time! ${completedGoalsIds.length}/${scenario.goals?.length} goals completed.`,
            goalsCompleted: completedGoalsIds.length,
            totalGoals: scenario.goals?.length
          });
          return;
        }
      }
    }

    // Bankruptcy defeat
    if ((gameState.money || 0) < 0) {
      setVictoryState({
        status: 'defeat',
        reason: 'Bankruptcy',
        message: 'Your band went bankrupt. Game over.',
        goalsCompleted: completedGoalsIds.length,
        totalGoals: scenario.goals?.length
      });
      return;
    }

    // Band dissolved defeat
    if ((gameState.bandMembers?.length || 0) === 0 && gameState.week > 5) {
      setVictoryState({
        status: 'defeat',
        reason: 'Band Dissolved',
        message: 'Your band fell apart. Everyone quit.',
        goalsCompleted: completedGoalsIds.length,
        totalGoals: scenario.goals?.length
      });
      return;
    }

    // All goals completed - Victory!
    if (completedGoalsIds.length === scenario.goals?.length && scenario.goals?.length > 0) {
      setVictoryState({
        status: 'victory',
        reason: 'All goals achieved!',
        message: 'You\'ve successfully completed all scenario objectives!',
        goalsCompleted: completedGoalsIds.length,
        totalGoals: scenario.goals?.length,
        finalStats: {
          week: gameState.week,
          fame: gameState.fame,
          money: gameState.money,
          albumCount: gameState.albums?.length || 0,
          bandSize: gameState.bandMembers?.length || 0
        }
      });
      return;
    }

    // Sandbox victory (no goals to complete)
    if ((!scenario.goals || scenario.goals.length === 0) && (gameState.week || 0) >= 100) {
      setVictoryState({
        status: 'victory',
        reason: 'Milestone reached!',
        message: 'You\'ve reached week 100 in sandbox mode!',
        finalStats: {
          week: gameState.week,
          fame: gameState.fame,
          money: gameState.money,
          albumCount: gameState.albums?.length || 0,
          bandSize: gameState.bandMembers?.length || 0
        }
      });
      return;
    }

    // Still playing
    setVictoryState(null);
  }, [scenario]);

  /**
   * Get percentage complete for a goal
   */
  const getGoalPercentage = useCallback((goalId) => {
    const goalData = goalProgress[goalId];
    if (!goalData) return 0;

    if (goalData.completed) return 100;

    const { progress, target } = goalData;
    if (!target || target === true) return 0;

    return Math.min(Math.round((progress / target) * 100), 99);
  }, [goalProgress]);

  /**
   * Reset victory state
   */
  const resetVictoryState = useCallback(() => {
    setVictoryState(null);
  }, []);

  return {
    victoryState,
    goalProgress,
    completedGoals,
    updateGoalProgress,
    getGoalPercentage,
    checkVictoryConditions,
    resetVictoryState,
    isVictory: victoryState?.status === 'victory',
    isDefeated: victoryState?.status === 'defeat'
  };
};

export default useVictoryConditions;
