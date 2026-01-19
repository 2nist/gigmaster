import React, { useState, useEffect } from 'react';
import { Music, Users, Zap, TrendingUp, Settings, Save, LogOut } from 'lucide-react';
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
 */
export const GamePage = ({
  gameData,
  dialogueState,
  modalState,
  uiState,
  onNavigate,
  onSave,
  onQuit,
  onEventChoice
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [autoSaving, setAutoSaving] = useState(false);

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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a2e',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#16213e',
        borderBottom: '2px solid rgba(131, 56, 236, 0.3)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
            {gameData?.bandName || 'Your Band'}
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: '#aaa', fontSize: '0.9rem' }}>
            Week {gameData?.week || 0}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
          <div>
            <div style={{ color: '#aaa' }}>Money</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#22c55e' }}>
              ${gameData?.money?.toLocaleString() || 0}
            </div>
          </div>
          <div>
            <div style={{ color: '#aaa' }}>Fame</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ff006e' }}>
              {gameData?.fame || 0}
            </div>
          </div>
          <div>
            <div style={{ color: '#aaa' }}>Members</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#8338ec' }}>
              {gameData?.bandMembers?.length || 0}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => {
              setAutoSaving(true);
              onSave?.();
              setTimeout(() => setAutoSaving(false), 1000);
            }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: autoSaving ? '#22c55e' : 'rgba(34, 197, 94, 0.3)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!autoSaving) e.target.style.backgroundColor = 'rgba(34, 197, 94, 0.6)';
            }}
            onMouseLeave={(e) => {
              if (!autoSaving) e.target.style.backgroundColor = 'rgba(34, 197, 94, 0.3)';
            }}
          >
            <Save size={16} />
            {autoSaving ? 'Saving...' : 'Save'}
          </button>

          <button
            onClick={onQuit}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(239, 68, 68, 0.3)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.6)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.3)'}
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
      <div style={{
        flex: 1,
        padding: '2rem',
        overflow: 'auto'
      }}>
        <TabContent
          tabId={activeTab}
          gameData={gameData}
          dialogueState={dialogueState}
          modalState={modalState}
          uiState={uiState}
        />
      </div>

      {/* Enhanced Event Modal */}
      <EnhancedEventModal
        isOpen={modalState?.modals?.enhancedEvent}
        event={modalState?.modalData?.enhancedEvent?.event}
        psychologicalState={dialogueState?.psychologicalState}
        onChoice={onEventChoice}
        onClose={() => modalState?.closeAllModals?.()}
      />
    </div>
  );
};

/**
 * TabContent - Renders content for active tab
 * 
 * Uses imported tab components from src/components/Tabs/
 */
const TabContent = ({ tabId, gameData, dialogueState, modalState, uiState }) => {
  switch (tabId) {
    case 'dashboard':
      return <DashboardTab gameData={gameData} dialogueState={dialogueState} />;
    case 'inventory':
      return <InventoryTab gameData={gameData} />;
    case 'band':
      return <BandTab gameData={gameData} />;
    case 'gigs':
      return <GigsTab gameData={gameData} />;
    case 'upgrades':
      return <UpgradesTab gameData={gameData} />;
    case 'rivals':
      return <RivalsTab gameData={gameData} />;
    case 'log':
      return <LogTab gameData={gameData} />;
    default:
      return null;
  }
};

export default GamePage;
