import React from 'react';

const tabs = [
  { id: 'videos', label: 'Uploaded Videos', icon: '📁' },
  { id: 'comments', label: 'Comments', icon: '💬' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside style={{
      width: 250,
      backgroundColor: '#2c3e50',
      color: '#ecf0f1',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 20,
      boxSizing: 'border-box',
      height: '100vh'
    }}>
      <div style={{ padding: '0 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Admin Dashboard</h2>
      </div>
      <nav style={{ flexGrow: 1, marginTop: 20 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              backgroundColor: activeTab === tab.id ? '#4a6bff' : 'transparent',
              border: 'none',
              color: 'inherit',
              fontSize: 16,
              padding: '12px 24px',
              textAlign: 'left',
              cursor: 'pointer',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              outline: 'none'
            }}
          >
            <span style={{ marginRight: 12, fontSize: 18 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
