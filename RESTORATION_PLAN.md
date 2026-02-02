# Gameplay Restoration Plan

## Critical Missing Feature: processWeekEffects

**The original advanceWeek** (line 1295) calls `processWeekEffects(updated)` which returns `{ next, summary }`.

**Current useGameLogic.advanceWeek** (line 358) does NOT call processWeekEffects - it just increments the week!

This means:
- ❌ No weekly expenses are deducted
- ❌ No streaming revenue is calculated
- ❌ Songs don't age or decay
- ❌ Albums don't generate revenue
- ❌ Genre trends don't work
- ❌ Chart progression doesn't happen
- ❌ Fan growth doesn't happen
- ❌ Equipment costs aren't charged

## What processWeekEffects Does (636 lines!)

1. **Weekly Expenses**
   - Base expenses ($100 * difficulty multiplier)
   - Member salaries (per member * difficulty)
   - Equipment costs (studio, transport, gear)
   - Staff costs (manager, lawyer)
   - Label fees

2. **Revenue Streams**
   - Song streaming revenue (with decay over time)
   - Album streaming revenue (sustained streams)
   - Merchandise revenue
   - Tour revenue
   - Label royalties (if signed)

3. **Song Processing**
   - Song aging (freshness decay)
   - Stream count updates
   - Chart position updates
   - Video boost effects

4. **Album Processing**
   - Album chart positions
   - Album streaming revenue

5. **Genre Trends**
   - Dynamic trend generation
   - Seasonal boosts (summer, holidays)
   - Trend strength (major, moderate, minor)
   - Genre popularity tracking

6. **Career Progression**
   - Legacy tier tracking
   - Hall of Fame status
   - Career statistics
   - Achievement unlocks

7. **Other Systems**
   - Geographic reputation
   - Regional boosts
   - Morale changes
   - Fan growth
   - Cooldown timers

## Next Steps

### Step 1: Extract processWeekEffects
Copy the function from App.jsx.bak (lines 636-1172) to useGameLogic.js

### Step 2: Update advanceWeek
Make it call processWeekEffects like the original:
```javascript
const { next, summary } = processWeekEffects(updated);
return { next, summary };
```

### Step 3: Handle Summary
Show weekly summary popups (original had weeklyPopupData)

### Step 4: Test
Verify that:
- Money decreases each week (expenses)
- Songs age and decay
- Streaming revenue appears
- Albums generate income

## Other Missing Features to Restore

1. **Weekly Summary Popups** - Show what happened each week
2. **Detailed Song/Album Management** - Better UI for managing music
3. **Chart Displays** - Visual charts for top songs/albums
4. **Equipment Upgrade System** - Wire up studio/transport/gear upgrades
5. **Member Management** - Full recruitment/firing system
6. **Label Deal Negotiation** - Interactive label contract system
