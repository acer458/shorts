import React from 'react';
import './AdminDashboard.css'; // Share the same CSS

const tabs = [
  { id: 'videos', label: 'Uploaded Videos', icon: '📁' },
  { id: 'comments', label: 'Comments', icon: '💬' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Admin Dashboard</h2>
      </div>
      <div className="sidebar-menu">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`menu-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="menu-icon">{tab.icon}</span>
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  );
}
