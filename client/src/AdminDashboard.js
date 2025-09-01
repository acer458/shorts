// AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import AllComments from './components/AllComments';

const HOST = "https://shorts-t2dk.onrender.com";

// ============= LOGIN FORM COMPONENT =============
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setStatus('');
    setIsLoading(true);
    
    axios.post(HOST + "/admin/login", { email, password })
      .then(res => {
        localStorage.setItem("adminToken", res.data.token);
        onLogin();
      })
      .catch(() => setStatus("Wrong email or password!"))
      .finally(() => setIsLoading(false));
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2Z" stroke="#6366F1" strokeWidth="2"/>
              <path d="M12 21V11L22 16L12 21Z" fill="#6366F1"/>
            </svg>
            <span>Shorts Admin</span>
          </div>
          <h2>Welcome back</h2>
          <p>Sign in to your admin dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              type="email" 
              placeholder="admin@example.com" 
              required 
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              type="password" 
              placeholder="••••••••" 
              required 
            />
          </div>
          
          {status && <div className="login-error">{status}</div>}
          
          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>
      </div>
      
      <div className="login-background">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
    </div>
  )
}

// ============= BYTES UTILITY =============
function bytesToSize(bytes) {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return Math.round((bytes / Math.pow(1024, i)) * 10) / 10 + " " + sizes[i];
}

// ============= MAIN DASHBOARD =============
export default function AdminDashboard() {
  const [shorts, setShorts] = useState([]);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [editState, setEditState] = useState({});
  const [scrollCounts, setScrollCounts] = useState({});
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("adminToken"));
  const [activeTab, setActiveTab] = useState('videos');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Force logout on certain failures
  function handleLogout() {
    localStorage.removeItem("adminToken");
    setLoggedIn(false);
  }

  // Helper to add auth header if logged in
  function authHeaders() {
    const token = localStorage.getItem("adminToken");
    return token ? { "Authorization": `Bearer ${token}` } : {};
  }

  // Fetch all videos (and scroll/view counts)
  const refreshShorts = () => {
    axios
      .get(HOST + "/shorts")
      .then((res) => setShorts(res.data))
      .catch(() => setStatus("Could not fetch shorts."));

    axios.get(HOST + "/views")
      .then(res => setScrollCounts(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    if (loggedIn && activeTab === 'videos') refreshShorts();
    // eslint-disable-next-line
  }, [loggedIn, activeTab]);

  // UPLOAD handler
  const handleUpload = (e) => {
    e.preventDefault();
    if (!video) { setStatus("Please select a file!"); return; }
    setUploading(true); setUploadProgress(0); setStatus("");
    const formData = new FormData();
    formData.append("video", video);

    axios
      .post(HOST + "/upload", formData, {
        headers: { ...authHeaders() },
        onUploadProgress: progressEvent => {
          setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      })
      .then(() => {
        setVideo(null);
        setStatus("Upload Successful!");
        setUploadProgress(0);
        refreshShorts();
      })
      .catch((err) => {
        setUploading(false);
        setUploadProgress(0);
        if (err.response && err.response.status === 401) {
          setStatus("Login expired. Please log in again.");
          handleLogout();
        } else if (err.response && err.response.status === 413) {
          setStatus("Upload Failed: File too large.");
        } else {
          setStatus("Upload Failed: " + (err.message || ""));
        }
        console.error("Upload error:", err);
      })
      .finally(() => setUploading(false));
  };

  // DELETE handler
  const handleDelete = (filename) => {
    if (!window.confirm("Delete this video permanently?")) return;
    axios
      .delete(`${HOST}/delete/${filename}`, {
        headers: { ...authHeaders() }
      })
      .then(() =>
        setShorts((prev) => prev.filter((s) => s.filename !== filename))
      )
      .catch(err => {
        if (err.response && err.response.status === 401) {
          setStatus("Login expired. Please log in again.");
          handleLogout();
        } else {
          alert("Delete failed!");
        }
      });
  };

  // Caption edit handling
  const handleCaptionChange = (filename, value) => {
    setEditState((prev) => ({
      ...prev,
      [filename]: { ...prev[filename], caption: value, saved: false, error: null },
    }));
  };

  const saveCaption = (filename, origCaption) => {
    const caption = (editState[filename]?.caption || "").trim();
    if (caption === (origCaption || "")) return;
    setEditState((prev) => ({
      ...prev,
      [filename]: { ...prev[filename], loading: true, error: null },
    }));

    axios
      .patch(`${HOST}/shorts/${filename}`, { caption }, { headers: { ...authHeaders() } })
      .then(() => {
        setShorts((current) =>
          current.map((video) =>
            video.filename === filename ? { ...video, caption } : video
          )
        );
        setEditState((prev) => ({
          ...prev,
          [filename]: { ...prev[filename], loading: false, saved: true, error: null },
        }));
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          setStatus("Login expired. Please log in again.");
          handleLogout();
        } else {
          setEditState((prev) => ({
            ...prev,
            [filename]: { ...prev[filename], loading: false, error: "Failed to save" },
          }));
        }
      });
  };

  const totalSize = shorts.reduce(
    (sum, v) => sum + (v.size ? Number(v.size) : 0),
    0
  );

  // Require login
  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  // Prepare main content depending on activeTab
  let mainContent;
  if (activeTab === 'comments') {
    mainContent = <AllComments />;
  } else {
    // Videos tab content
    mainContent = (
      <div className="main-content">
        <div className="content-header">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1>Scrollable Videos</h1>
          <div className="header-actions">
            <div className="stats-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor"/>
              </svg>
              {shorts.length} videos
            </div>
          </div>
        </div>

        <div className="video-grid">
          {shorts.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 13H8" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17H8" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 9H9H8" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>No videos uploaded yet</h3>
              <p>Upload your first video to get started</p>
            </div>
          )}
          
          {shorts.map((s, i) => {
            const filename = s.filename;
            const state = editState[filename] || {};
            const origCaption = s.caption ?? "";
            const caption = state.caption !== undefined ? state.caption : origCaption;
            const viewCount = scrollCounts[filename] || 0;

            return (
              <div key={filename} className="video-card">
                <div className="video-card-header">
                  <span className="video-number">VIDEO-{i + 1}</span>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(filename)}
                    title="Delete video"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                
                <div className="video-wrapper">
                  <video
                    src={HOST + s.url}
                    controls
                    loop
                  />
                </div>
                
                <div className="video-meta">
                  <div className="video-filename">{filename}</div>
                  <div className="video-views">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#0fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#0fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {viewCount} views
                  </div>
                </div>
                
                <div className="caption-editor">
                  <label>Caption / Title</label>
                  <textarea
                    rows={2}
                    value={caption}
                    maxLength={250}
                    placeholder="Enter a clean caption for this video (up to 250 chars)..."
                    onChange={(e) => handleCaptionChange(filename, e.target.value)}
                    className={state.error ? 'error' : ''}
                  />
                  <div className="caption-actions">
                    <span className="char-count">{caption.length}/250</span>
                    {state.error && <span className="error-text">{state.error}</span>}
                    <button
                      onClick={() => saveCaption(filename, origCaption)}
                      disabled={state.loading || caption === origCaption}
                      className={`save-btn ${state.loading ? 'loading' : ''} ${state.saved ? 'saved' : ''}`}
                    >
                      {state.loading ? (
                        <>
                          <div className="spinner"></div>
                          Saving...
                        </>
                      ) : state.saved ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Saved
                        </>
                      ) : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-dashboard ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="app-logo">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2Z" stroke="#6366F1" strokeWidth="2"/>
              <path d="M12 21V11L22 16L12 21Z" fill="#6366F1"/>
            </svg>
            <span>Shorts Admin</span>
          </div>
          
          <button onClick={handleLogout} className="logout-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="sidebar-tabs">
          <button 
            onClick={() => setActiveTab('videos')} 
            className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 7L16 12L23 17V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 5H3C1.89543 5 1 5.89543 1 7V17C1 18.1046 1.89543 19 3 19H14C15.1046 19 16 18.1046 16 17V7C16 5.89543 15.1046 5 14 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Videos
          </button>
          
          <button 
            onClick={() => setActiveTab('comments')} 
            className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Comments
          </button>
        </div>
        
        {activeTab === 'videos' && (
          <div className="sidebar-content">
            <div className="upload-section">
              <form onSubmit={handleUpload} className="upload-form">
                <label htmlFor="upload" className="upload-label">
                  <div className="upload-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>{video ? video.name : 'Select video to upload'}</span>
                  <input
                    id="upload"
                    type="file"
                    accept="video/mp4"
                    onChange={(e) => setVideo(e.target.files[0])}
                  />
                </label>
                
                <button
                  type="submit"
                  disabled={uploading || !video}
                  className={`upload-btn ${uploading ? 'uploading' : ''}`}
                >
                  {uploading ? (
                    <>
                      <div className="spinner"></div>
                      Uploading... {uploadProgress}%
                    </>
                  ) : 'Upload Video'}
                </button>
                
                {uploadProgress > 0 && (
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${uploadProgress}%`}}
                    ></div>
                  </div>
                )}
              </form>
              
              {status && (
                <div className={`status-message ${status.includes("Success") ? 'success' : 'error'}`}>
                  {status}
                </div>
              )}
            </div>
            
            <div className="stats-section">
              <h3>Storage Overview</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{shorts.length}</div>
                  <div className="stat-label">Total Videos</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{totalSize ? bytesToSize(totalSize) : "0 B"}</div>
                  <div className="stat-label">Total Size</div>
                </div>
              </div>
            </div>
            
            <div className="files-section">
              <h3>Uploaded Files</h3>
              <div className="files-list">
                {shorts.length === 0 ? (
                  <div className="empty-files">No videos uploaded yet</div>
                ) : shorts.map((s, i) => (
                  <div key={s.filename} className="file-item">
                    <div className="file-info">
                      <div className="file-name">{s.filename}</div>
                      <div className="file-size">{s.size ? bytesToSize(Number(s.size)) : ""}</div>
                    </div>
                    <button 
                      className="file-delete"
                      onClick={() => handleDelete(s.filename)}
                      title="Delete file"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      {mainContent}
      
      <style jsx>{`
        /* Global Styles */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          background: #0F0F13;
          color: #E0E0E0;
          line-height: 1.6;
        }
        
        /* Login Styles */
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: #0A0A0E;
        }
        
        .login-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          overflow: hidden;
        }
        
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
        }
        
        .orb-1 {
          width: 300px;
          height: 300px;
          background: rgba(79, 70, 229, 0.4);
          top: -150px;
          right: -150px;
        }
        
        .orb-2 {
          width: 500px;
          height: 500px;
          background: rgba(99, 102, 241, 0.3);
          bottom: -250px;
          left: -250px;
        }
        
        .orb-3 {
          width: 200px;
          height: 200px;
          background: rgba(139, 92, 246, 0.3);
          top: 50%;
          right: 20%;
        }
        
        .login-card {
          background: rgba(19, 19, 27, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          z-index: 10;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        
        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
          color: #6366F1;
          font-weight: 700;
          font-size: 18px;
        }
        
        .login-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
        }
        
        .login-header p {
          color: #A0A0B0;
          font-size: 14px;
        }
        
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .input-group label {
          font-size: 14px;
          font-weight: 500;
          color: #D0D0D0;
        }
        
        .input-group input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 12px 16px;
          color: #fff;
          font-size: 16px;
          transition: all 0.2s;
        }
        
        .input-group input:focus {
          outline: none;
          border-color: #6366F1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
        
        .input-group input::placeholder {
          color: #666;
        }
        
        .login-error {
          background: rgba(239, 68, 68, 0.2);
          color: #EF4444;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          text-align: center;
        }
        
        .login-button {
          background: #6366F1;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 14px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .login-button:hover {
          background: #4F46E5;
          transform: translateY(-1px);
        }
        
        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .login-button.loading {
          background: #4F46E5;
        }
        
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Dashboard Styles */
        .admin-dashboard {
          min-height: 100vh;
          display: flex;
          background: #0F0F13;
        }
        
        .sidebar {
          width: 340px;
          background: linear-gradient(180deg, #13151F 0%, #0D0E15 100%);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }
        
        .admin-dashboard.sidebar-collapsed .sidebar {
          transform: translateX(-100%);
          opacity: 0;
          width: 0;
        }
        
        .sidebar-header {
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .app-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          font-weight: 700;
          font-size: 18px;
        }
        
        .logout-btn {
          background: rgba(239, 68, 68, 0.2);
          color: #EF4444;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.3);
        }
        
        .sidebar-tabs {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .tab-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #A0A0B0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;
        }
        
        .tab-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }
        
        .tab-btn.active {
          background: rgba(99, 102, 241, 0.2);
          color: #6366F1;
        }
        
        .sidebar-content {
          flex: 1;
          padding: 0 16px 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .upload-section {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .upload-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 24px;
          border: 2px dashed rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        
        .upload-label:hover {
          border-color: #6366F1;
        }
        
        .upload-icon {
          width: 48px;
          height: 48px;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366F1;
        }
        
        .upload-label span {
          font-size: 14px;
          color: #A0A0B0;
        }
        
        .upload-label input {
          display: none;
        }
        
        .upload-btn {
          background: #6366F1;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .upload-btn:hover:not(:disabled) {
          background: #4F46E5;
        }
        
        .upload-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .upload-btn.uploading {
          background: #4F46E5;
        }
        
        .progress-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366F1, #8B5CF6);
          border-radius: 3px;
          transition: width 0.3s;
        }
        
        .status-message {
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          text-align: center;
          margin-top: 12px;
        }
        
        .status-message.success {
          background: rgba(16, 185, 129, 0.2);
          color: #10B981;
        }
        
        .status-message.error {
          background: rgba(239, 68, 68, 0.2);
          color: #EF4444;
        }
        
        .stats-section h3,
        .files-section h3 {
          font-size: 14px;
          font-weight: 600;
          color: #D0D0D0;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        
        .stat-item {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #6366F1;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 12px;
          color: #A0A0B0;
        }
        
        .files-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .empty-files {
          text-align: center;
          padding: 24px;
          color: #666;
          font-size: 14px;
        }
        
        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.2s;
        }
        
        .file-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        
        .file-info {
          flex: 1;
          min-width: 0;
        }
        
        .file-name {
          font-size: 13px;
          color: #D0D0D0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 4px;
        }
        
        .file-size {
          font-size: 11px;
          color: #666;
        }
        
        .file-delete {
          background: rgba(239, 68, 68, 0.2);
          color: #EF4444;
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .file-delete:hover {
          background: rgba(239, 68, 68, 0.3);
        }
        
        /* Main Content */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .content-header {
          padding: 24px 32px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .sidebar-toggle {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #A0A0B0;
          transition: all 0.2s;
        }
        
        .sidebar-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        
        .content-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin-right: auto;
        }
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .stats-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: rgba(99, 102, 241, 0.2);
          color: #6366F1;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
        }
        
        .video-grid {
          flex: 1;
          padding: 24px 32px;
          overflow-y: auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
          align-content: flex-start;
        }
        
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }
        
        .empty-icon {
          margin-bottom: 16px;
          opacity: 0.5;
        }
        
        .empty-state h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #A0A0B0;
        }
        
        .video-card {
          background: rgba(19, 19, 27, 0.5);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.2s;
        }
        
        .video-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          border-color: rgba(99, 102, 241, 0.3);
        }
        
        .video-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 16px 0;
        }
        
        .video-number {
          font-size: 12px;
          font-weight: 700;
          color: #6366F1;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .delete-btn {
          background: rgba(239, 68, 68, 0.2);
          color: #EF4444;
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.3);
        }
        
        .video-wrapper {
          padding: 12px;
        }
        
        .video-wrapper video {
          width: 100%;
          height: 200px;
          background: #000;
          border-radius: 8px;
          object-fit: cover;
        }
        
        .video-meta {
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .video-filename {
          font-size: 12px;
          color: #888;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 180px;
        }
        
        .video-views {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #0fa;
          font-weight: 600;
        }
        
        .caption-editor {
          padding: 16px;
        }
        
        .caption-editor label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #6366F1;
          margin-bottom: 8px;
        }
        
        .caption-editor textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 12px;
          color: #fff;
          font-size: 14px;
          resize: vertical;
          min-height: 80px;
          transition: all 0.2s;
        }
        
        .caption-editor textarea:focus {
          outline: none;
          border-color: #6366F1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
        
        .caption-editor textarea.error {
          border-color: #EF4444;
        }
        
        .caption-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
        }
        
        .char-count {
          font-size: 12px;
          color: #666;
        }
        
        .error-text {
          font-size: 12px;
          color: #EF4444;
          margin-right: auto;
          margin-left: 12px;
        }
        
        .save-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #6366F1;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .save-btn:hover:not(:disabled) {
          background: #4F46E5;
        }
        
        .save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .save-btn.loading {
          background: #4F46E5;
        }
        
        .save-btn.saved {
          background: #10B981;
        }
        
        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .video-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }
        }
        
        @media (max-width: 768px) {
          .admin-dashboard {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
            height: auto;
          }
          
          .admin-dashboard.sidebar-collapsed .sidebar {
            transform: translateY(-100%);
            height: 0;
          }
          
          .sidebar-content {
            overflow-y: visible;
          }
          
          .content-header {
            padding: 16px;
          }
          
          .video-grid {
            padding: 16px;
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
