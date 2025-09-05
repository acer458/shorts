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
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2Z" stroke="url(#gradient1)" strokeWidth="2"/>
              <path d="M12 21V11L22 16L12 21Z" fill="url(#gradient1)"/>
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:"#667eea"}} />
                  <stop offset="100%" style={{stopColor:"#764ba2"}} />
                </linearGradient>
              </defs>
            </svg>
            <span>Propscholar Admin</span>
          </div>
          <div className="welcome-text">
            <h2>Welcome back</h2>
            <p>Access your admin dashboard with style</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="L22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input 
                id="email"
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
                type="email" 
                placeholder="admin@propscholar.com" 
                required 
              />
            </div>
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input 
                id="password"
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                type="password" 
                placeholder="Enter your password" 
                required 
              />
            </div>
          </div>
          
          {status && (
            <div className="login-error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {status}
            </div>
          )}
          
          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            <span className="button-content">
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Signing you in...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sign In
                </>
              )}
            </span>
          </button>
        </form>
        
        <div className="login-footer">
          <div className="security-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12L11 14L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Secure Admin Access
          </div>
        </div>
      </div>
      
      <div className="login-background">
        <div className="mesh-gradient"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
          <div className="shape shape-6"></div>
        </div>
        <div className="particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
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

  const cssStyles = `
    /* Global Styles */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: #f8fafc;
      color: #334155;
      line-height: 1.6;
    }
    
    /* Ultra Premium Login Styles */
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      background: #0f0f23;
    }
    
    .login-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 0;
    }
    
    .mesh-gradient {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
        linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      filter: blur(100px);
      opacity: 0.6;
      animation: gradientShift 15s ease infinite;
    }
    
    @keyframes gradientShift {
      0%, 100% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(180deg); }
    }
    
    .floating-shapes {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    
    .shape {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
      backdrop-filter: blur(10px);
      animation: floatAround 20s linear infinite;
    }
    
    .shape-1 {
      width: 300px;
      height: 300px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
      background: linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    }
    
    .shape-2 {
      width: 200px;
      height: 200px;
      top: 60%;
      right: 15%;
      animation-delay: -5s;
      background: linear-gradient(45deg, rgba(255, 119, 198, 0.1), rgba(120, 219, 255, 0.1));
    }
    
    .shape-3 {
      width: 150px;
      height: 150px;
      top: 30%;
      right: 30%;
      animation-delay: -10s;
      background: linear-gradient(45deg, rgba(120, 219, 255, 0.1), rgba(255, 176, 119, 0.1));
    }
    
    .shape-4 {
      width: 100px;
      height: 100px;
      bottom: 20%;
      left: 20%;
      animation-delay: -15s;
      background: linear-gradient(45deg, rgba(255, 176, 119, 0.1), rgba(102, 126, 234, 0.1));
    }
    
    .shape-5 {
      width: 250px;
      height: 250px;
      top: 70%;
      left: 60%;
      animation-delay: -7s;
      background: linear-gradient(45deg, rgba(118, 75, 162, 0.1), rgba(255, 119, 198, 0.1));
    }
    
    .shape-6 {
      width: 180px;
      height: 180px;
      top: 50%;
      left: 5%;
      animation-delay: -12s;
      background: linear-gradient(45deg, rgba(120, 219, 255, 0.1), rgba(102, 126, 234, 0.1));
    }
    
    @keyframes floatAround {
      0% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(30px, -30px) rotate(120deg); }
      66% { transform: translate(-20px, 20px) rotate(240deg); }
      100% { transform: translate(0, 0) rotate(360deg); }
    }
    
    .particles {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    
    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      animation: particleFloat 10s linear infinite;
    }
    
    .particle:nth-child(1) { left: 10%; animation-delay: 0s; }
    .particle:nth-child(2) { left: 20%; animation-delay: -2s; }
    .particle:nth-child(3) { left: 30%; animation-delay: -4s; }
    .particle:nth-child(4) { left: 40%; animation-delay: -6s; }
    .particle:nth-child(5) { left: 60%; animation-delay: -1s; }
    .particle:nth-child(6) { left: 70%; animation-delay: -3s; }
    .particle:nth-child(7) { left: 80%; animation-delay: -5s; }
    .particle:nth-child(8) { left: 90%; animation-delay: -7s; }
    
    @keyframes particleFloat {
      0% { 
        transform: translateY(100vh) scale(0);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% { 
        transform: translateY(-100px) scale(1);
        opacity: 0;
      }
    }
    
    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(40px);
      border-radius: 32px;
      padding: 60px 50px;
      width: 100%;
      max-width: 480px;
      z-index: 10;
      box-shadow: 
        0 60px 120px rgba(0, 0, 0, 0.3),
        0 30px 60px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.9),
        inset 0 -1px 0 rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.2);
      position: relative;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }
    
    .login-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
    }
    
    .login-card:hover {
      transform: translateY(-10px) scale(1.02);
      box-shadow: 
        0 80px 160px rgba(0, 0, 0, 0.4),
        0 40px 80px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.9),
        inset 0 -1px 0 rgba(255, 255, 255, 0.1);
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .logo {
      display: flex;
      align-items: center;
