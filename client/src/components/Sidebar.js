import React from 'react';
import logo from '../assets/logo.png'; // Adjust path if necessary

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
      {/* LOGO and BRAND NAME */}
      <div style={{
        padding: '0 20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <img
          src={logo}
          alt="Propscholar Logo"
          style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'contain', background: '#fff' }}
        />
        <h2 style={{
          fontSize: 20,
          fontWeight: 700,
          margin: 0,
          letterSpacing: 1,
          color: '#fff'
        }}>
          Propscholar
        </h2>
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
