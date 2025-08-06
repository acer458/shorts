// AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import './AdminDashboard.css';

const HOST = "https://shorts-t2dk.onrender.com";

// ============= LOGIN FORM COMPONENT =============
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setStatus('');
    axios.post(HOST + "/admin/login", { email, password })
      .then(res => {
        localStorage.setItem("adminToken", res.data.token);
        onLogin();
      })
      .catch(() => setStatus("Wrong email or password!"));
  }

  return (
    <form onSubmit={handleSubmit} className="admin-login-form">
      <h2>Admin Login</h2>
      <input 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        type="email" 
        placeholder="Gmail" 
        required 
      />
      <input 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        type="password" 
        placeholder="Password" 
        required 
      />
      {status && <div className="login-error">{status}</div>}
      <button type="submit">Sign In</button>
    </form>
  )
}

// ============= VIDEOS TAB COMPONENT =============
function VideosTab({ host, onLogout }) {
  const [shorts, setShorts] = useState([]);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [editState, setEditState] = useState({});
  const [scrollCounts, setScrollCounts] = useState({});

  // Helper to add auth header if logged in
  function authHeaders() {
    const token = localStorage.getItem("adminToken");
    return token ? { "Authorization": `Bearer ${token}` } : {};
  }

  // Fetch all videos (and scroll/view counts)
  const refreshShorts = () => {
    axios
      .get(host + "/shorts")
      .then((res) => setShorts(res.data))
      .catch(() => setStatus("Could not fetch shorts."));

    axios.get(host + "/views")
      .then(res => setScrollCounts(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    refreshShorts();
  }, []);

  // UPLOAD handler
  const handleUpload = (e) => {
    e.preventDefault();
    if (!video) { setStatus("Please select a file!"); return; }
    setUploading(true); setUploadProgress(0); setStatus("");
    const formData = new FormData();
    formData.append("video", video);

    axios
      .post(host + "/upload", formData, {
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
          onLogout();
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
      .delete(`${host}/delete/${filename}`, {
        headers: { ...authHeaders() }
      })
      .then(() =>
        setShorts((prev) => prev.filter((s) => s.filename !== filename))
      )
      .catch(err => {
        if (err.response && err.response.status === 401) {
          setStatus("Login expired. Please log in again.");
          onLogout();
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
      .patch(`${host}/shorts/${filename}`, { caption }, { headers: { ...authHeaders() } })
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
          onLogout();
        } else {
          setEditState((prev) => ({
            ...prev,
            [filename]: { ...prev[filename], loading: false, error: "Failed to save" },
          }));
        }
      });
  };

  // Bytes to size utility
  const bytesToSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    return Math.round((bytes / Math.pow(1024, i)) * 10) / 10 + " " + sizes[i];
  };

  const totalSize = shorts.reduce(
    (sum, v) => sum + (v.size ? Number(v.size) : 0),
    0
  );

  return (
    <div className="videos-tab-container">
      <div className="video-list-container">
        <h2 className="video-list-title">Scrollable Videos</h2>
        <div className="video-list">
          {shorts.length === 0 && (
            <div className="no-videos-message">
              No videos uploaded yet.
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
                <span className="video-id">VIDEO-{i + 1}</span>
                <video
                  src={host + s.url}
                  controls
                  loop
                  className="video-player"
                />
                <small className="video-filename">{filename}</small>
                <div className="video-views">
                  <strong>Views/Scrolls:</strong>
                  <span>{viewCount}</span>
                </div>
                <div className="caption-section">
                  <label className="caption-label">
                    Caption / Title (shows to users):
                  </label>
                  <textarea
                    rows={2}
                    value={caption}
                    maxLength={250}
                    placeholder="Enter a clean caption for this video (up to 250 chars)..."
                    onChange={(e) => handleCaptionChange(filename, e.target.value)}
                    className={`caption-input ${state.error ? 'error' : ''}`}
                  />
                  <div className="caption-footer">
                    <span>{caption.length}/250</span>
                    {state.error && (
                      <span className="error-message">
                        {state.error}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => saveCaption(filename, origCaption)}
                    disabled={state.loading || caption === origCaption}
                    className="save-caption-btn"
                  >
                    {state.loading ? "Saving..." : state.saved ? "Saved ✓" : "Save"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="upload-section">
        <form onSubmit={handleUpload} className="upload-form">
          <label htmlFor="upload" className="upload-label">
            Upload Video
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
            className="submit-upload-btn"
          >
            {uploading ? "Uploading..." : "Submit"}
          </button>
          {uploadProgress > 0 && (
            <div className="upload-progress-container">
              <div 
                className="upload-progress-bar"
                style={{ width: `${uploadProgress}%` }}
              />
              <div className="upload-progress-text">
                {uploadProgress}%
              </div>
            </div>
          )}
          {status && (
            <div className={`status-message ${status.includes("Success") ? 'success' : 'error'}`}>
              {status}
            </div>
          )}
        </form>

        <div className="stats-section">
          <div className="stat-item">
            No. of videos: <span>{shorts.length}</span>
          </div>
          <div className="stat-item">
            File size: <span>{totalSize ? bytesToSize(totalSize) : "N/A"}</span>
          </div>
        </div>

        <div className="file-list-container">
          <h3 className="file-list-title">Uploaded Files</h3>
          {shorts.length === 0 ? (
            <div className="no-files-message">
              No videos uploaded yet.
            </div>
          ) : shorts.map((s, i) => {
            const filename = s.filename;
            return (
              <div key={filename} className="file-list-item">
                <span className="file-name">
                  {filename}
                </span>
                <span className="file-size">
                  {s.size ? bytesToSize(Number(s.size)) : ""}
                </span>
                <button
                  type="button"
                  className="delete-file-btn"
                  onClick={() => handleDelete(filename)}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============= COMMENTS TAB COMPONENT =============
function CommentsTab({ host }) {
  // This would be your AllComments component content
  return (
    <div className="comments-tab-container">
      <h2>Comments Management</h2>
      {/* Comments functionality would go here */}
      <p>Comments management interface will be implemented here.</p>
    </div>
  );
}

// ============= MAIN DASHBOARD COMPONENT =============
export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("adminToken"));
  const [activeTab, setActiveTab] = useState('videos');

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLoggedIn(false);
  };

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="admin-container">
      <div className="sidebar">
        <button 
          onClick={handleLogout} 
          className="logout-btn"
        >
          Logout
        </button>

        <div className="tab-buttons">
          <button
            onClick={() => setActiveTab('videos')}
            className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
          >
            Comments
          </button>
        </div>
      </div>

      <div className="main-content">
        {activeTab === 'videos' && (
          <VideosTab host={HOST} onLogout={handleLogout} />
        )}
        {activeTab === 'comments' && (
          <CommentsTab host={HOST} />
        )}
      </div>
    </div>
  );
}
