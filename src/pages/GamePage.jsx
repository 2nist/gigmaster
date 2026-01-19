import React, { useState, useEffect, useCallback } from 'react';
import { Music, Users, Zap, TrendingUp, Settings, Save, LogOut, ChevronRight } from 'lucide-react';
import { EnhancedEventModal } from '../components/EnhancedEventModal';
import { 
  DashboardTab, 
  InventoryTab, 
  BandTab, 
  GigsTab, 
  UpgradesTab, 
  RivalsTab, 
  LogTab, 
  TabNavigation 
} from '../components/Tabs';

/**
 * GamePage - Main game interface with tabs
 * 
 * Tabs:
 * 1. Dashboard - Overview and quick stats
 * 2. Inventory - Songs, albums, equipment
 * 3. Band - Member management
 * 4. Gigs - Performance booking
 * 5. Upgrades - Purchase improvements
 * 6. Rivals - Competition and battles
 * 7. Log - Game history
 * 
 * Phase 2: Integrated consequence tracking system
 * Phase 2 Enhancement: Full event generation and choice handling
 */
export const GamePage = ({
  gameData,
  dialogueState,
  modalState,
  uiState,
  onNavigate,
  onSave,
  onQuit,
  onEventChoice,
  consequenceSystem,
  onHandleEventChoice,
  onAdvanceWeek,
  gameState,
  gameLogic,
  eventGen
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [autoSaving, setAutoSaving] = useState(false);
  const [pendingEvent, setPendingEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventQueue, setEventQueue] = useState([]);

  // Trigger a random event from event generation
  const triggerEvent = useCallback(() => {
    if (eventGen?.generateEvent) {
      const newEvent = eventGen.generateEvent();
      if (newEvent) {
        setPendingEvent(newEvent);
        setShowEventModal(true);
        return newEvent;
      }
    }
  }, [eventGen]);

  // Handle week advancement with consequence processing and event generation
  const handleAdvanceWeek = useCallback(() => {
    // Process consequences from Phase 2 system
    if (onAdvanceWeek) {
      const { escalations, resurfaced } = onAdvanceWeek();
      
      // Queue escalations as events
      if (escalations && escalations.length > 0) {
        escalations.forEach(esc => {
          setEventQueue(prev => [...prev, {
            type: 'consequence',
            data: esc,
            title: `Consequence Escalated: ${esc.consequenceId}`,
            description: esc.description || 'A past decision has caught up with you...'
          }]);
        });
      }
      
      // Queue resurfaced consequences as events
      if (resurfaced && resurfaced.length > 0) {
        resurfaced.forEach(res => {
          setEventQueue(prev => [...prev, {
            type: 'consequence',
            data: res,
            title: `Consequence Resurfaced: ${res.consequenceId}`,
            description: res.description || 'The past returns to haunt you...'
          }]);
        });
      }
    }

    // Generate a random event from Enhanced Dialogue system (50% chance)
    if (Math.random() > 0.5 && eventGen?.generateEvent) {
      const newEvent = eventGen.generateEvent();
      if (newEvent) {
        setEventQueue(prev => [...prev, newEvent]);
      }
    }

    // Update game state (week advancement is handled by gameLogic)
    if (gameState?.updateGameState) {
      gameState.updateGameState({
        week: (gameState.state?.week || 0) + 1
      });
    }

    // Show first queued event if exists
    if (eventQueue.length > 0) {
      setPendingEvent(eventQueue[0]);
      setShowEventModal(true);
    }
  }, [onAdvanceWeek, eventGen, gameState, eventQueue]);

  // Auto-save every 5 minutes
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      setAutoSaving(true);
      onSave?.();
      setTimeout(() => setAutoSaving(false), 1000);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(autoSaveInterval);
  }, [onSave]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory', icon: Music },
    { id: 'band', label: 'Band', icon: Users },
    { id: 'gigs', label: 'Gigs', icon: Zap },
    { id: 'upgrades', label: 'Upgrades', icon: TrendingUp },
    { id: 'rivals', label: 'Rivals', icon: Users },
    { id: 'log', label: 'Log', icon: Music }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border/20 px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground m-0">
            {gameData?.bandName || 'Your Band'}
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Week {gameData?.week || 0}
          </p>
        </div>

        <div className="flex gap-8 text-sm">
          <div>
            <div className="text-muted-foreground">Money</div>
            <div className="text-xl font-bold text-accent">
              ${gameData?.money?.toLocaleString() || 0}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Fame</div>
            <div className="text-xl font-bold text-primary">
              {gameData?.fame || 0}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Members</div>
            <div className="text-xl font-bold text-secondary">
              {gameData?.bandMembers?.length || 0}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setAutoSaving(true);
              onSave?.();
              setTimeout(() => setAutoSaving(false), 1000);
            }}
            className={`px-4 py-2 rounded-md cursor-pointer flex items-center gap-2 transition-all ${
              autoSaving
                ? 'bg-accent text-accent-foreground'
                : 'bg-accent/20 text-accent hover:bg-accent/40'
            }`}
          >
            <Save size={16} />
            {autoSaving ? 'Saving...' : 'Save'}
          </button>

          <button
            onClick={onQuit}
            className="px-4 py-2 bg-destructive/20 text-destructive hover:bg-destructive/40 rounded-md cursor-pointer flex items-center gap-2 transition-all"
          >
            <LogOut size={16} />
            Quit
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <TabNavigation 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Content Area */}
      <div className="flex-1 p-8 overflow-auto flex flex-col">
        <TabContent
          tabId={activeTab}
          gameData={gameData}
          dialogueState={dialogueState}
          modalState={modalState}
          uiState={uiState}
          gameState={gameState}
          gameLogic={gameLogic}
          onAdvanceWeek={handleAdvanceWeek}
          onTriggerEvent={triggerEvent}
        />
      </div>

      {/* Week Advancement Button */}
      {activeTab === 'dashboard' && (
        <div className="px-8 py-4 bg-card border-t border-border/20 flex justify-end gap-4">
          <button
            onClick={triggerEvent}
            className="px-6 py-3 bg-primary/20 text-primary border-2 border-primary/50 rounded-lg cursor-pointer text-lg font-bold hover:bg-primary/40 transition-all"
          >
            Trigger Event
          </button>

          <button
            onClick={handleAdvanceWeek}
            className="px-6 py-3 bg-accent text-accent-foreground rounded-lg cursor-pointer text-lg font-bold hover:opacity-90 transition-all flex items-center gap-2"
          >
            <ChevronRight size={18} />
            Advance Week
          </button>
        </div>
      )}

      {/* Enhanced Event Modal */}
      {showEventModal && pendingEvent && (
        <EnhancedEventModal
          isOpen={true}
          event={pendingEvent}
          psychologicalState={dialogueState?.psychologicalState}
          onChoice={(eventId, choiceId, choiceText, consequences) => {
            // Handle choice through consequence system
            if (onHandleEventChoice) {
              onHandleEventChoice({
                eventId,
                choiceId,
                choiceText,
                ...consequences
              });
            }

            // Apply psychological effects if present
            if (dialogueState?.updatePsychologicalState && consequences?.psychologyEffects) {
              dialogueState.updatePsychologicalState(consequences.psychologyEffects);
            }

            // Apply faction effects if present
            if (consequenceSystem && consequences?.factionEffects) {
              Object.entries(consequences.factionEffects).forEach(([faction, delta]) => {
                consequenceSystem.updateFactionReputation(faction, delta);
              });
            }

            // Remove from queue and show next event if exists
            setEventQueue(prev => prev.slice(1));
            if (eventQueue.length > 1) {
              setPendingEvent(eventQueue[1]);
            } else {
              setShowEventModal(false);
              setPendingEvent(null);
            }

            // Original choice handler
            onEventChoice?.(eventId, choiceId, choiceText, consequences);
          }}
          onClose={() => {
            setShowEventModal(false);
            setPendingEvent(null);
          }}
        />
      )}
    </div>
  );
};

/**
 * TabContent - Renders content for active tab
 * 
 * Uses imported tab components from src/components/Tabs/
 */
const TabContent = ({ 
  tabId, 
  gameData, 
  dialogueState, 
  modalState, 
  uiState,
  gameState,
  gameLogic,
  onAdvanceWeek,
  onTriggerEvent
}) => {
  switch (tabId) {
    case 'dashboard':
      return <DashboardTab 
        gameData={gameData} 
        dialogueState={dialogueState}
        gameState={gameState}
        onAdvanceWeek={onAdvanceWeek}
        onTriggerEvent={onTriggerEvent}
      />;
    case 'inventory':
      return <InventoryTab gameData={gameData} gameLogic={gameLogic} />;
    case 'band':
      return <BandTab gameData={gameData} gameLogic={gameLogic} />;
    case 'gigs':
      return <GigsTab gameData={gameData} gameLogic={gameLogic} />;
    case 'upgrades':
      return <UpgradesTab gameData={gameData} gameLogic={gameLogic} />;
    case 'rivals':
      return <RivalsTab gameData={gameData} />;
    case 'log':
      return <LogTab gameData={gameData} />;
    default:
      return null;
  }
};

export default GamePage;
