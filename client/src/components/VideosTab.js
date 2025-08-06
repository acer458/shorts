import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function VideosTab({ host, onLogout }) {
  const [shorts, setShorts] = useState([]);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [editState, setEditState] = useState({});
  const [scrollCounts, setScrollCounts] = useState({});

  // Helper: Get auth headers
  function authHeaders() {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Fetch videos and scroll counts
  const refreshShorts = () => {
    axios.get(host + '/shorts')
      .then(res => setShorts(res.data))
      .catch(() => setStatus('Could not fetch shorts.'));

    axios.get(host + '/views')
      .then(res => setScrollCounts(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    refreshShorts();
    // eslint-disable-next-line
  }, []);

  // Upload handler
  const handleUpload = (e) => {
    e.preventDefault();
    if (!video) {
      setStatus('Please select a file!');
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    setStatus('');
    const formData = new FormData();
    formData.append('video', video);

    axios.post(host + '/upload', formData, {
      headers: {
        ...authHeaders(),
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: e => {
        setUploadProgress(Math.round((e.loaded * 100) / e.total));
      }
    })
      .then(() => {
        setVideo(null);
        setStatus('Upload Successful!');
        setUploadProgress(0);
        refreshShorts();
      })
      .catch(err => {
        setUploading(false);
        setUploadProgress(0);
        if (err.response && err.response.status === 401) {
          setStatus('Login expired. Please log in again.');
          onLogout();
        } else if (err.response && err.response.status === 413) {
          setStatus('Upload Failed: File too large.');
        } else {
          setStatus('Upload Failed: ' + (err.message || ''));
        }
        console.error('Upload error:', err);
      })
      .finally(() => setUploading(false));
  };

  // Delete video
  const handleDelete = (filename) => {
    if (!window.confirm('Delete this video permanently?')) return;
    axios.delete(`${host}/delete/${filename}`, { headers: { ...authHeaders() } })
      .then(() => {
        setShorts(prev => prev.filter(s => s.filename !== filename));
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          setStatus('Login expired. Please log in again.');
          onLogout();
        } else {
          alert('Delete failed!');
        }
      });
  };

  // Edit caption handler
  const handleCaptionChange = (filename, value) => {
    setEditState(prev => ({
      ...prev,
      [filename]: { ...prev[filename], caption: value, saved: false, error: null }
    }));
  };

  const saveCaption = (filename, origCaption) => {
    const caption = (editState[filename]?.caption || '').trim();
    if (caption === (origCaption || '')) return;
    setEditState(prev => ({
      ...prev,
      [filename]: { ...prev[filename], loading: true, error: null }
    }));

    axios.patch(`${host}/shorts/${filename}`, { caption }, { headers: { ...authHeaders() } })
      .then(() => {
        setShorts(current => current.map(video =>
          video.filename === filename ? { ...video, caption } : video
        ));
        setEditState(prev => ({
          ...prev,
          [filename]: { ...prev[filename], loading: false, saved: true, error: null }
        }));
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          onLogout();
        } else {
          setEditState(prev => ({
            ...prev,
            [filename]: { ...prev[filename], loading: false, error: 'Failed to save' }
          }));
        }
      });
  };

  // Helpers
  const bytesToSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    return Math.round((bytes / Math.pow(1024, i)) * 10) / 10 + ' ' + sizes[i];
  };

  const totalSize = shorts.reduce((sum, v) => sum + (v.size ? Number(v.size) : 0), 0);

  return (
    <div style={{ color: '#fff' }}>
      <form onSubmit={handleUpload} style={{ marginBottom: 20 }}>
        <label
          htmlFor="upload-video"
          style={{
            backgroundColor: '#4a6bff',
            padding: '10px 20px',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 600,
            display: 'inline-block',
          }}
        >
          Select video
        </label>
        <input
          id="upload-video"
          type="file"
          accept="video/mp4"
          style={{ display: 'none' }}
          onChange={e => setVideo(e.target.files[0])}
        />
        <button
          type="submit"
          disabled={!video || uploading}
          style={{
            marginLeft: 10,
            padding: '10px 20px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: uploading ? '#888' : '#0bb259',
            color: 'white',
            cursor: !video || uploading ? 'not-allowed' : 'pointer',
            fontWeight: '600'
          }}
        >
          {uploading ? `Uploading... ${uploadProgress}%` : 'Upload'}
        </button>
      </form>
      {status && (
        <div style={{ marginBottom: 10, color: status.includes('Failed') ? '#f66' : '#0f0' }}>{status}</div>
      )}

      <div style={{ marginBottom: 20 }}>
        <strong>No. of videos:</strong> {shorts.length} &nbsp;&nbsp;
        <strong>Total size:</strong> {totalSize ? bytesToSize(totalSize) : 'N/A'}
      </div>

      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {shorts.length === 0 ? (
          <p>No videos uploaded yet.</p>
        ) : shorts.map((video, idx) => {
          const filename = video.filename;
          const state = editState[filename] || {};
          const origCaption = video.caption ?? '';
          const caption = state.caption !== undefined ? state.caption : origCaption;
          const viewCount = scrollCounts[filename] || 0;

          return (
            <div key={filename} style={{
              background: '#222',
              padding: 15,
              marginBottom: 10,
              borderRadius: 10,
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: 6 }}>Video #{idx + 1}</div>
              <video
                src={host + video.url}
                controls
                loop
                style={{
                  width: '100%',
                  maxHeight: 200,
                  borderRadius: 10,
                  marginBottom: 8,
                }}
              />
              <small style={{ color: '#ccc', display: 'block', marginBottom: 8 }}>{filename}</small>
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
                  Caption (shown to users):
                </label>
                <textarea
                  rows={2}
                  maxLength={250}
                  value={caption}
                  onChange={e => handleCaptionChange(filename, e.target.value)}
                  style={{
                    width: '100%',
                    borderRadius: 6,
                    border: state.error ? '1.5px solid #f66' : '1px solid #555',
                    backgroundColor: '#111',
                    color: '#eee',
                    padding: 8,
                    resize: 'vertical',
                  }}
                />
                <div style={{ fontSize: 12, color: '#888', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <div>{caption.length} / 250</div>
                  <div>
                    {state.error && <span style={{ color: '#f66' }}>{state.error}</span>}
                    {!state.error && state.saved && <span style={{ color: '#4caf50' }}>Saved ✓</span>}
                  </div>
                </div>
                <button
                  disabled={state.loading || caption === origCaption}
                  onClick={() => saveCaption(filename, origCaption)}
                  style={{
                    marginTop: 8,
                    padding: '6px 16px',
                    borderRadius: 6,
                    border: 'none',
                    backgroundColor: '#4a6bff',
                    color: 'white',
                    fontWeight: 600,
                    cursor: (state.loading || caption === origCaption) ? 'not-allowed' : 'pointer',
                    opacity: (state.loading || caption === origCaption) ? 0.6 : 1,
                  }}
                >
                  {state.loading ? 'Saving…' : 'Save'}
                </button>
              </div>
              <button
                onClick={() => handleDelete(filename)}
                style={{
                  backgroundColor: '#e74c3c',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                Delete Video
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
