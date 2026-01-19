/**
 * TabNavigation.jsx - Tab switching UI
 * 
 * Provides consistent tab navigation with icons
 * and active state styling
 */
export const TabNavigation = ({ tabs, activeTab, onTabChange }) => (
  <div style={{
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem 2rem',
    backgroundColor: '#0f3460',
    borderBottom: '2px solid rgba(131, 56, 236, 0.2)',
    overflowX: 'auto'
  }}>
    {tabs.map(tab => {
      const IconComponent = tab.icon;
      const isActive = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          title={tab.label}
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: isActive ? 'rgba(131, 56, 236, 0.4)' : 'rgba(255, 255, 255, 0.05)',
            color: isActive ? '#fff' : '#aaa',
            border: `2px solid ${isActive ? 'rgba(131, 56, 236, 0.8)' : 'rgba(131, 56, 236, 0.2)'}`,
            borderRadius: '0.375rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s ease',
            fontSize: '0.9rem'
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.2)';
              e.target.style.borderColor = 'rgba(131, 56, 236, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.target.style.borderColor = 'rgba(131, 56, 236, 0.2)';
            }
          }}
        >
          {IconComponent && <IconComponent size={16} />}
          {tab.label}
        </button>
      );
    })}
  </div>
);
