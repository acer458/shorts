import React from 'react';

const tabs = [
  { id: 'upload', label: 'Video Upload' },
  { id: 'users', label: 'User Analytics' },
  { id: 'storage', label: 'Storage Stats' },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <nav style={{
      backgroundColor: '#2563eb',
      width: 210,
      height: '100vh',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 35,
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            background: activeTab === tab.id ? '#1e40af' : 'transparent',
            border: 'none',
            color: 'white',
            fontSize: 18,
            padding: '18px 28px',
            textAlign: 'left',
            cursor: 'pointer',
            fontWeight: activeTab === tab.id ? 700 : 400,
            outline: 'none',
            borderRadius: 0
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
