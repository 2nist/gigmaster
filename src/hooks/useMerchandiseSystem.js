import { useState, useCallback } from 'react';

/**
 * useMerchandiseSystem - Band merchandise sales and passive income
 * Handles:
 * - Merchandise types and design
 * - Merchandise sales based on popularity
 * - Passive income from merchandise
 * - Inventory management
 * - Brand building and prestige
 */
export const useMerchandiseSystem = (gameState, updateGameState, addLog) => {
  const MERCHANDISE_TYPES = [
    {
      id: 't-shirt',
      name: 'T-Shirt',
      basePrice: 25,
      costToMake: 5,
      popularity: 1.0,
      prestige: 1,
      description: 'Classic band t-shirt',
      minFameToUnlock: 0
    },
    {
      id: 'album-vinyl',
      name: 'Vinyl Album',
      basePrice: 35,
      costToMake: 8,
      popularity: 1.2,
      prestige: 2,
      description: 'Premium vinyl record release',
      minFameToUnlock: 1000
    },
    {
      id: 'poster',
      name: 'Band Poster',
      basePrice: 15,
      costToMake: 2,
      popularity: 0.8,
      prestige: 1,
      description: 'High-quality band poster',
      minFameToUnlock: 500
    },
    {
      id: 'hoodie',
      name: 'Hoodie',
      basePrice: 45,
      costToMake: 12,
      popularity: 1.1,
      prestige: 1,
      description: 'Comfortable band hoodie',
      minFameToUnlock: 800
    },
    {
      id: 'hat',
      name: 'Baseball Cap',
      basePrice: 20,
      costToMake: 4,
      popularity: 0.9,
      prestige: 1,
      description: 'Branded baseball cap',
      minFameToUnlock: 400
    },
    {
      id: 'cd',
      name: 'CD Album',
      basePrice: 15,
      costToMake: 2,
      popularity: 0.9,
      prestige: 1,
      description: 'Compact disc release',
      minFameToUnlock: 600
    },
    {
      id: 'limited-edition',
      name: 'Limited Edition Box Set',
      basePrice: 99,
      costToMake: 25,
      popularity: 1.5,
      prestige: 3,
      description: 'Exclusive collector\'s edition',
      minFameToUnlock: 5000
    },
    {
      id: 'signed-merch',
      name: 'Signed Memorabilia',
      basePrice: 150,
      costToMake: 40,
      popularity: 1.3,
      prestige: 4,
      description: 'Hand-signed band merchandise',
      minFameToUnlock: 8000
    },
    {
      id: 'band-patches',
      name: 'Band Patch Set',
      basePrice: 10,
      costToMake: 1,
      popularity: 0.7,
      prestige: 1,
      description: 'Collectible band patches',
      minFameToUnlock: 300
    },
    {
      id: 'digital-album',
      name: 'Digital Album',
      basePrice: 10,
      costToMake: 0.5,
      popularity: 0.8,
      prestige: 1,
      description: 'Digital music download',
      minFameToUnlock: 200
    }
  ];

  /**
   * Get available merchandise to produce
   */
  const getAvailableMerchandise = useCallback(() => {
    const bandFame = gameState.fame || 0;
    const currentMerch = gameState.merchandise || [];
    const currentIds = new Set(currentMerch.map(m => m.typeId));

    return MERCHANDISE_TYPES.filter(type => {
      // Already producing
      if (currentIds.has(type.id)) return false;

      // Must meet fame requirement
      if (bandFame < type.minFameToUnlock) return false;

      return true;
    });
  }, [gameState.fame, gameState.merchandise]);

  /**
   * Design and produce merchandise
   */
  const designMerchandise = useCallback((typeId, designName, initialProduction = 100) => {
    const type = MERCHANDISE_TYPES.find(t => t.id === typeId);
    if (!type) {
      addLog('error', 'Merchandise type not found');
      return { success: false };
    }

    const available = getAvailableMerchandise();
    if (!available.find(m => m.id === typeId)) {
      addLog('error', `Cannot produce ${type.name}`);
      return { success: false };
    }

    // Production cost
    const productionCost = type.costToMake * initialProduction;
    const currentMoney = gameState.money || 0;

    if (currentMoney < productionCost) {
      addLog('error', `Need $${productionCost} for ${initialProduction}x ${type.name} (have $${currentMoney})`);
      return { success: false };
    }

    const merchandise = {
      id: `merch-${Date.now()}`,
      typeId: type.id,
      typeName: type.name,
      designName: designName,
      basePrice: type.basePrice,
      costToMake: type.costToMake,
      popularity: type.popularity,
      prestige: type.prestige,
      inventory: initialProduction,
      totalSold: 0,
      totalRevenue: 0,
      weeksSelling: 0,
      designWeek: gameState.week || 0,
      quality: 50 + Math.floor(Math.random() * 30)
    };

    const updatedMerch = [...(gameState.merchandise || []), merchandise];

    updateGameState({
      merchandise: updatedMerch,
      money: currentMoney - productionCost
    });

    addLog('success', `Designed ${designName}! Produced ${initialProduction} units of ${type.name}`);

    return { success: true, merchandise };
  }, [gameState, updateGameState, addLog, getAvailableMerchandise]);

  /**
   * Restock merchandise inventory
   */
  const restockMerchandise = useCallback((merchId, quantity) => {
    const merch = gameState.merchandise?.find(m => m.id === merchId);
    if (!merch) {
      addLog('error', 'Merchandise not found');
      return { success: false };
    }

    const restockCost = merch.costToMake * quantity;
    const currentMoney = gameState.money || 0;

    if (currentMoney < restockCost) {
      addLog('error', `Need $${restockCost} to restock (have $${currentMoney})`);
      return { success: false };
    }

    const updatedMerch = (gameState.merchandise || []).map(m =>
      m.id === merchId ? { ...m, inventory: m.inventory + quantity } : m
    );

    updateGameState({
      merchandise: updatedMerch,
      money: currentMoney - restockCost
    });

    addLog('info', `Restocked ${merch.designName}: +${quantity} units`);

    return { success: true };
  }, [gameState, updateGameState, addLog]);

  /**
   * Process weekly merchandise sales
   */
  const processWeeklySales = useCallback(() => {
    const merch = gameState.merchandise || [];
    if (merch.length === 0) return { totalRevenue: 0, itemsSold: 0 };

    let totalRevenue = 0;
    let totalItemsSold = 0;

    const updatedMerch = merch.map(m => {
      // Calculate weekly sales based on:
      // - Band fame (draw factor)
      // - Merchandise popularity
      // - Inventory availability
      // - Design quality

      const fameDraw = Math.min(1, (gameState.fame || 0) / 5000);
      const qualityFactor = (m.quality || 50) / 100;
      const weeksSelling = (m.weeksSelling || 0) + 1;
      const decayFactor = 1 / (1 + weeksSelling * 0.1); // Sales decay over time

      const baseWeeklySales = Math.floor(50 * m.popularity * fameDraw * qualityFactor * decayFactor);
      const unitsSold = Math.min(baseWeeklySales, m.inventory);

      if (unitsSold > 0) {
        const revenuePerUnit = m.basePrice * (0.7 + qualityFactor * 0.3); // Quality affects profit margin
        const weeklyRevenue = Math.floor(unitsSold * revenuePerUnit);

        totalRevenue += weeklyRevenue;
        totalItemsSold += unitsSold;

        return {
          ...m,
          inventory: m.inventory - unitsSold,
          totalSold: m.totalSold + unitsSold,
          totalRevenue: m.totalRevenue + weeklyRevenue,
          weeksSelling: weeksSelling
        };
      }

      return { ...m, weeksSelling: weeksSelling };
    });

    updateGameState({
      merchandise: updatedMerch,
      money: (gameState.money || 0) + totalRevenue
    });

    if (totalRevenue > 0) {
      addLog('info', `Merchandise sales: $${totalRevenue} (${totalItemsSold} items)`);
    }

    return { totalRevenue, itemsSold: totalItemsSold };
  }, [gameState, updateGameState, addLog]);

  /**
   * Retire old merchandise design
   */
  const retireMerchandiseDesign = useCallback((merchId) => {
    const merch = gameState.merchandise?.find(m => m.id === merchId);
    if (!merch) {
      addLog('error', 'Merchandise not found');
      return { success: false };
    }

    const remainingValue = merch.inventory * merch.costToMake * 0.5; // Recover 50% of material cost
    const updatedMerch = (gameState.merchandise || []).filter(m => m.id !== merchId);

    updateGameState({
      merchandise: updatedMerch,
      money: (gameState.money || 0) + remainingValue
    });

    addLog('info', `Retired ${merch.designName}. Recovered $${remainingValue}`);

    return { success: true, recoveredValue: remainingValue };
  }, [gameState, updateGameState, addLog]);

  /**
   * Get merchandise statistics
   */
  const getMerchandiseStats = useCallback(() => {
    const merch = gameState.merchandise || [];

    const totalInventory = merch.reduce((sum, m) => sum + m.inventory, 0);
    const totalItemsSold = merch.reduce((sum, m) => sum + m.totalSold, 0);
    const totalMerchandiseRevenue = merch.reduce((sum, m) => sum + m.totalRevenue, 0);
    const totalPrestigeFromMerch = merch.reduce((sum, m) => sum + m.prestige, 0);

    const topMerchandise = merch.reduce((max, m) => {
      if (!max || m.totalRevenue > max.totalRevenue) return m;
      return max;
    }, null);

    const activeMerch = merch.filter(m => m.inventory > 0);

    return {
      activeMerchandise: activeMerch.length,
      totalDesigns: merch.length,
      totalInventory,
      totalItemsSold,
      totalMerchandiseRevenue,
      totalPrestigeFromMerch,
      topMerchandise,
      merchandiseList: merch
    };
  }, [gameState.merchandise]);

  /**
   * Calculate merchandise brand prestige bonus
   */
  const getMerchandiseBrandBonus = useCallback(() => {
    const stats = getMerchandiseStats();

    // Brand prestige scales with merchandise success
    const prestigeBonus = Math.floor(stats.totalItemsSold / 100) + (stats.activeMerch * 5);
    const fameBonus = Math.floor(stats.totalMerchandiseRevenue / 100);

    return {
      prestigeBonus,
      fameBonus,
      brandLevel: Math.floor(stats.totalMerchandiseRevenue / 5000) + 1
    };
  }, [getMerchandiseStats]);

  /**
   * Launch merchandise event (limited edition drop)
   */
  const launchMerchandiseEvent = useCallback((eventName, discount = 0.1) => {
    const merch = gameState.merchandise || [];
    if (merch.length === 0) {
      addLog('error', 'No merchandise to promote');
      return { success: false };
    }

    const eventCost = 1000;
    const currentMoney = gameState.money || 0;

    if (currentMoney < eventCost) {
      addLog('error', `Need $${eventCost} for merchandise event (have $${currentMoney})`);
      return { success: false };
    }

    // Boost all merchandise sales temporarily
    const updatedMerch = merch.map(m => ({
      ...m,
      quality: Math.min(100, m.quality + 10)
    }));

    updateGameState({
      merchandise: updatedMerch,
      money: currentMoney - eventCost
    });

    addLog('success', `Launched merchandise event: ${eventName}! Quality boost applied`);

    return { success: true, eventName };
  }, [gameState, updateGameState, addLog]);

  return {
    // Merchandise management
    getAvailableMerchandise,
    designMerchandise,
    restockMerchandise,
    retireMerchandiseDesign,
    launchMerchandiseEvent,

    // Sales processing
    processWeeklySales,

    // Stats
    getMerchandiseStats,
    getMerchandiseBrandBonus,

    // Data (for modals/UI)
    MERCHANDISE_TYPES
  };
};
