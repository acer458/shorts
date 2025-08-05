// import { useState } from 'react';
// import VideoUpload from './VideoUpload';
// import UserAnalytics from './UserAnalytics';
// import SystemMetrics from './SystemMetrics';

// const DashboardTabs = () => {
//   const [activeTab, setActiveTab] = useState('upload');

//   return (
//     <div className="dashboard-container">
//       <div className="sidebar">
//         <button 
//           className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
//           onClick={() => setActiveTab('upload')}
//         >
//           Video Upload
//         </button>
//         <button 
//           className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
//           onClick={() => setActiveTab('users')}
//         >
//           User Analytics
//         </button>
//         <button 
//           className={`tab-button ${activeTab === 'metrics' ? 'active' : ''}`}
//           onClick={() => setActiveTab('metrics')}
//         >
//           System Metrics
//         </button>
//       </div>

//       <div className="content-area">
//         {activeTab === 'upload' && <VideoUpload />}
//         {activeTab === 'users' && <UserAnalytics />}
//         {activeTab === 'metrics' && <SystemMetrics />}
//       </div>
//     </div>
//   );
// };

// export default DashboardTabs;
