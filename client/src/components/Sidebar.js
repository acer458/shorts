import React from 'react';

const tabs = [
  { id: 'videos', label: 'Uploaded Videos', icon: '📁' },
  { id: 'comments', label: 'Comments', icon: '💬' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'settings', label: 'Settings', icon: '⚙️' }
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside style={{
      width: 250,
      backgroundColor: 'var(--sidebar-bg)',
      color: 'var(--sidebar-text)',
      paddingTop: 20,
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      boxSizing: 'border-box'
    }}>
      <div style={{
        padding: '0 20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h2 style={{
          fontSize: 20,
          fontWeight: 600,
          margin: 0,
        }}>
          Admin Dashboard
        </h2>
      </div>
      <nav style={{ flexGrow: 1 }}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: activeTab === tab.id ? 'var(--primary-color)' : 'transparent',
              transition: 'background-color 0.3s',
              userSelect: 'none',
            }}
            onMouseEnter={e => {
              if (activeTab !== tab.id) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={e => {
              if (activeTab !== tab.id) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ marginRight: 10, fontSize: 20, width: 20, textAlign: 'center' }}>{tab.icon}</span>
            {tab.label}
          </div>
        ))}
      </nav>
    </aside>
  );
}
