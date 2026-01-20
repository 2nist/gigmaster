import { useState, useCallback } from 'react';

/**
 * useSponsorshipSystem - Brand partnerships and endorsement deals
 * Handles:
 * - Sponsor partnerships and contracts
 * - Monthly sponsorship revenue
 * - Sponsor satisfaction and contract renewal
 * - Brand prestige benefits
 * - Sponsor perks and bonuses
 */
export const useSponsorshipSystem = (gameState, updateGameState, addLog) => {
  const SPONSORS = [
    {
      id: 'energy-drink',
      name: 'Energy Drink Co',
      monthlyAmount: 5000,
      prestige: 1,
      minFameToUnlock: 500,
      contractLength: 6,
      perks: ['+10% Energy recovery', 'Tour cost reduction 5%'],
      description: 'Popular energy drink brand partnership'
    },
    {
      id: 'instrument-brand',
      name: 'Premium Instruments Inc',
      monthlyAmount: 7500,
      prestige: 2,
      minFameToUnlock: 2000,
      contractLength: 12,
      perks: ['Free instrument upgrades', 'Studio discount 10%'],
      description: 'High-end musical instrument manufacturer'
    },
    {
      id: 'clothing-line',
      name: 'Fashion Forward Apparel',
      monthlyAmount: 6000,
      prestige: 1,
      minFameToUnlock: 1500,
      contractLength: 6,
      perks: ['Merchandise quality +15%', 'Tour merchandise sales +20%'],
      description: 'Trendy clothing and apparel brand'
    },
    {
      id: 'tech-company',
      name: 'Tech Giants Corp',
      monthlyAmount: 10000,
      prestige: 3,
      minFameToUnlock: 5000,
      contractLength: 12,
      perks: ['Recording studio upgrade', 'Fame generation +10%'],
      description: 'Major technology company partnership'
    },
    {
      id: 'beverage-premium',
      name: 'Luxury Beverages Ltd',
      monthlyAmount: 8000,
      prestige: 2,
      minFameToUnlock: 3500,
      contractLength: 9,
      perks: ['VIP tour events', 'Event prestige +1.2x'],
      description: 'Premium beverage and spirits brand'
    },
    {
      id: 'streaming-service',
      name: 'Streaming Entertainment Co',
      monthlyAmount: 12000,
      prestige: 3,
      minFameToUnlock: 8000,
      contractLength: 12,
      perks: ['Exclusive content platform', 'Streaming royalties +25%'],
      description: 'Major music streaming platform'
    },
    {
      id: 'gaming-company',
      name: 'Interactive Games Inc',
      monthlyAmount: 9000,
      prestige: 2,
      minFameToUnlock: 4000,
      contractLength: 12,
      perks: ['Game soundtrack revenue', 'Fan engagement +15%'],
      description: 'Video game developer partnership'
    },
    {
      id: 'fashion-luxury',
      name: 'Haute Couture Exclusive',
      monthlyAmount: 15000,
      prestige: 4,
      minFameToUnlock: 10000,
      contractLength: 12,
      perks: ['Prestige +2 per month', 'VIP event access'],
      description: 'Luxury fashion house collaboration'
    },
    {
      id: 'automotive',
      name: 'Luxury Motors Group',
      monthlyAmount: 11000,
      prestige: 3,
      minFameToUnlock: 6000,
      contractLength: 12,
      perks: ['Tour transportation', 'Image +5% per month'],
      description: 'Premium automotive brand partnership'
    },
    {
      id: 'hotel-chain',
      name: 'Global Hospitality Resorts',
      monthlyAmount: 7000,
      prestige: 2,
      minFameToUnlock: 3000,
      contractLength: 6,
      perks: ['Free accommodation on tour', 'Tour luxury tier unlocked'],
      description: 'International luxury hotel chain'
    }
  ];

  /**
   * Get available sponsors to negotiate with
   */
  const getAvailableSponsors = useCallback(() => {
    const bandFame = gameState.fame || 0;
    const currentSponsors = gameState.sponsorships || [];
    const currentIds = new Set(currentSponsors.map(s => s.sponsorId));

    return SPONSORS.filter(sponsor => {
      // Already sponsored
      if (currentIds.has(sponsor.id)) return false;

      // Must meet fame requirement
      if (bandFame < sponsor.minFameToUnlock) return false;

      return true;
    });
  }, [gameState.fame, gameState.sponsorships]);

  /**
   * Negotiate and sign sponsorship contract
   */
  const negotiateSponsorshipDeal = useCallback((sponsorId, negotiationBonus = 0) => {
    const sponsor = SPONSORS.find(s => s.id === sponsorId);
    if (!sponsor) {
      addLog('error', 'Sponsor not found');
      return { success: false };
    }

    const available = getAvailableSponsors();
    if (!available.find(s => s.id === sponsorId)) {
      addLog('error', `Cannot negotiate with ${sponsor.name}`);
      return { success: false };
    }

    // Negotiation can increase monthly amount
    const monthlyIncrease = Math.floor(sponsor.monthlyAmount * (negotiationBonus / 100));
    const negotiatedAmount = sponsor.monthlyAmount + monthlyIncrease;

    const sponsorship = {
      id: `sponsor-${Date.now()}`,
      sponsorId: sponsor.id,
      sponsorName: sponsor.name,
      monthlyRevenue: negotiatedAmount,
      baseMonthlyRevenue: sponsor.monthlyAmount,
      prestige: sponsor.prestige,
      perks: sponsor.perks,
      signedWeek: gameState.week || 0,
      contractLength: sponsor.contractLength,
      monthsRemaining: sponsor.contractLength,
      contractStatus: 'active',
      satisfaction: 80 + Math.floor(Math.random() * 20),
      totalReceived: 0,
      renewalOpportunity: false
    };

    const updatedSponsors = [...(gameState.sponsorships || []), sponsorship];

    updateGameState({
      sponsorships: updatedSponsors
    });

    addLog('success', `Signed with ${sponsor.name}! $${negotiatedAmount}/month for ${sponsor.contractLength} months`);

    return { success: true, sponsorship };
  }, [gameState, updateGameState, addLog, getAvailableSponsors]);

  /**
   * Process monthly sponsorship payments
   */
  const processMonthlySponsorshipPayments = useCallback(() => {
    const sponsorships = gameState.sponsorships || [];
    if (sponsorships.length === 0) return { totalRevenue: 0, count: 0 };

    let totalRevenue = 0;
    let activeSponsors = 0;

    const updatedSponsors = sponsorships.map(s => {
      if (s.contractStatus === 'active') {
        activeSponsors++;
        totalRevenue += s.monthlyRevenue;

        return {
          ...s,
          monthsRemaining: s.monthsRemaining - 1,
          totalReceived: s.totalReceived + s.monthlyRevenue,
          satisfaction: Math.max(60, s.satisfaction - (Math.random() > 0.7 ? 5 : 0)),
          renewalOpportunity: s.monthsRemaining <= 1
        };
      }
      return s;
    });

    // Remove expired sponsorships that weren't renewed
    const filteredSponsors = updatedSponsors.filter(s => {
      if (s.contractStatus === 'active' && s.monthsRemaining <= 0) {
        // Auto-renew if satisfaction is high
        if (s.satisfaction >= 75) {
          addLog('info', `${s.sponsorName} automatically renewed! (Satisfaction: ${s.satisfaction})`);
          return {
            ...s,
            monthsRemaining: 6,
            contractStatus: 'active',
            renewalOpportunity: false
          };
        }
        addLog('warning', `${s.sponsorName} contract expired`);
        return false;
      }
      return true;
    }).map(s => {
      // Handle renewals if needed
      if (s.renewalOpportunity && s.monthsRemaining <= 0) {
        return {
          ...s,
          monthsRemaining: 6,
          contractStatus: 'active',
          renewalOpportunity: false,
          satisfaction: 85
        };
      }
      return s;
    });

    updateGameState({
      sponsorships: filteredSponsors,
      money: (gameState.money || 0) + totalRevenue
    });

    if (totalRevenue > 0) {
      addLog('info', `Sponsorship payments: $${totalRevenue} (${activeSponsors} sponsors)`);
    }

    return { totalRevenue, count: activeSponsors };
  }, [gameState, updateGameState, addLog]);

  /**
   * Renew expiring sponsorship contract
   */
  const renewSponsorshipContract = useCallback((sponsorshipId, renegotiateBonus = 0) => {
    const sponsorship = gameState.sponsorships?.find(s => s.id === sponsorshipId);
    if (!sponsorship) {
      addLog('error', 'Sponsorship not found');
      return { success: false };
    }

    if (!sponsorship.renewalOpportunity) {
      addLog('error', 'Contract renewal not available');
      return { success: false };
    }

    const increasePercentage = 5 + renegotiateBonus; // Base 5% increase
    const newMonthlyRevenue = Math.floor(sponsorship.monthlyRevenue * (1 + increasePercentage / 100));

    const updatedSponsors = (gameState.sponsorships || []).map(s =>
      s.id === sponsorshipId
        ? {
            ...s,
            monthsRemaining: 6,
            monthlyRevenue: newMonthlyRevenue,
            contractStatus: 'active',
            renewalOpportunity: false,
            satisfaction: Math.min(100, s.satisfaction + 10)
          }
        : s
    );

    updateGameState({
      sponsorships: updatedSponsors
    });

    addLog('success', `Renewed ${sponsorship.sponsorName}! New rate: $${newMonthlyRevenue}/month`);

    return { success: true };
  }, [gameState, updateGameState, addLog]);

  /**
   * Break sponsorship contract (with penalty)
   */
  const breakSponsorshipContract = useCallback((sponsorshipId) => {
    const sponsorship = gameState.sponsorships?.find(s => s.id === sponsorshipId);
    if (!sponsorship) {
      addLog('error', 'Sponsorship not found');
      return { success: false };
    }

    // Penalty: 3 months of sponsorship value
    const penalty = sponsorship.monthlyRevenue * 3;
    const currentMoney = gameState.money || 0;

    if (currentMoney < penalty) {
      addLog('error', `Cannot break contract. Penalty: $${penalty} (have $${currentMoney})`);
      return { success: false };
    }

    const updatedSponsors = (gameState.sponsorships || []).filter(s => s.id !== sponsorshipId);

    updateGameState({
      sponsorships: updatedSponsors,
      money: currentMoney - penalty
    });

    addLog('warning', `Broke contract with ${sponsorship.sponsorName}. Penalty: -$${penalty}`);

    return { success: true, penalty };
  }, [gameState, updateGameState, addLog]);

  /**
   * Boost sponsor satisfaction (costs money)
   */
  const boostSponsorSatisfaction = useCallback((sponsorshipId, investmentAmount) => {
    const sponsorship = gameState.sponsorships?.find(s => s.id === sponsorshipId);
    if (!sponsorship) {
      addLog('error', 'Sponsorship not found');
      return { success: false };
    }

    const currentMoney = gameState.money || 0;
    if (currentMoney < investmentAmount) {
      addLog('error', `Need $${investmentAmount} to boost satisfaction (have $${currentMoney})`);
      return { success: false };
    }

    const satisfactionIncrease = Math.floor(investmentAmount / 100); // $100 per satisfaction point

    const updatedSponsors = (gameState.sponsorships || []).map(s =>
      s.id === sponsorshipId
        ? {
            ...s,
            satisfaction: Math.min(100, s.satisfaction + satisfactionIncrease)
          }
        : s
    );

    updateGameState({
      sponsorships: updatedSponsors,
      money: currentMoney - investmentAmount
    });

    addLog('info', `Boosted ${sponsorship.sponsorName} satisfaction (+${satisfactionIncrease})`);

    return { success: true, increase: satisfactionIncrease };
  }, [gameState, updateGameState, addLog]);

  /**
   * Get sponsorship statistics
   */
  const getSponsorshipStats = useCallback(() => {
    const sponsorships = gameState.sponsorships || [];

    const activeSponsorships = sponsorships.filter(s => s.contractStatus === 'active');
    const totalMonthlyRevenue = activeSponsorships.reduce((sum, s) => sum + s.monthlyRevenue, 0);
    const totalSponsorshipRevenue = sponsorships.reduce((sum, s) => sum + s.totalReceived, 0);
    const totalPrestigeFromSponsors = sponsorships.reduce((sum, s) => sum + s.prestige, 0);

    const averageSatisfaction = activeSponsorships.length > 0
      ? Math.floor(activeSponsorships.reduce((sum, s) => sum + s.satisfaction, 0) / activeSponsorships.length)
      : 0;

    const renewalOpportunities = sponsorships.filter(s => s.renewalOpportunity).length;

    const bestSponsor = activeSponsorships.reduce((max, s) => {
      if (!max || s.monthlyRevenue > max.monthlyRevenue) return s;
      return max;
    }, null);

    return {
      activeSponsorships: activeSponsorships.length,
      totalSponsors: sponsorships.length,
      totalMonthlyRevenue,
      totalSponsorshipRevenue,
      totalPrestigeFromSponsors,
      averageSatisfaction,
      renewalOpportunities,
      bestSponsor,
      sponsorshipList: sponsorships
    };
  }, [gameState.sponsorships]);

  /**
   * Calculate sponsorship bonuses
   */
  const getSponsorshipBonuses = useCallback(() => {
    const stats = getSponsorshipStats();

    // Prestige bonus: 1 per active sponsor + base prestige from sponsors
    const prestigeBonus = stats.activeSponsorships + stats.totalPrestigeFromSponsors;

    // Fame bonus: $10 sponsorship revenue = 1 fame
    const fameBonus = Math.floor(stats.totalMonthlyRevenue / 10);

    // Image bonus: Increases with sponsorship prestige
    const imageBonus = Math.floor(stats.totalPrestigeFromSponsors * 2);

    return {
      prestigeBonus,
      fameBonus,
      imageBonus,
      sponsorshipTier: Math.min(5, Math.floor(stats.totalMonthlyRevenue / 5000) + 1)
    };
  }, [getSponsorshipStats]);

  /**
   * Generate sponsorship opportunity (special limited-time deal)
   */
  const generateSponsorshipOpportunity = useCallback((sponsorId = null) => {
    const available = getAvailableSponsors();
    if (available.length === 0) {
      addLog('warning', 'No new sponsorship opportunities available');
      return { success: false };
    }

    const sponsor = sponsorId
      ? available.find(s => s.id === sponsorId)
      : available[Math.floor(Math.random() * available.length)];

    if (!sponsor) {
      addLog('error', 'Sponsor not available');
      return { success: false };
    }

    // Limited-time bonus: 10-25% increase
    const bonus = 10 + Math.floor(Math.random() * 15);

    addLog('success', `Limited opportunity: ${sponsor.name} offering +${bonus}% bonus! Expires in 3 weeks`);

    return { success: true, sponsor, bonus };
  }, [getAvailableSponsors, addLog]);

  return {
    // Sponsorship management
    getAvailableSponsors,
    negotiateSponsorshipDeal,
    renewSponsorshipContract,
    breakSponsorshipContract,
    boostSponsorSatisfaction,
    generateSponsorshipOpportunity,

    // Revenue processing
    processMonthlySponsorshipPayments,

    // Stats
    getSponsorshipStats,
    getSponsorshipBonuses,

    // Data (for modals/UI)
    SPONSORS
  };
};
