import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HOST = 'https://shorts-t2dk.onrender.com'; // Your backend URL

export default function VideosTab() {
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState('');

  // Fetch videos on mount
  useEffect(() => {
    fetchVideos();
  }, []);

  function fetchVideos() {
    axios.get(HOST + '/shorts')
      .then(res => setVideos(res.data))
      .catch(() => setStatus('Failed to load videos.'));
  }

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!videoFile) {
      setStatus('Please select a video file to upload.');
      return;
    }
    setStatus('');
    setUploading(true);
    const formData = new FormData();
    formData.append('video', videoFile);
    try {
      // Here you should attach admin auth token (if needed)
      const adminToken = localStorage.getItem('adminToken'); // or wherever you store it
      const res = await axios.post(HOST + '/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${adminToken}`,
        },
        onUploadProgress: e => {
          setUploadProgress(Math.round((e.loaded * 100) / e.total));
        },
      });
      setStatus('Upload successful.');
      setVideoFile(null);
      fetchVideos();
    } catch (error) {
      setStatus('Upload failed: ' + (error.response?.data?.error || error.message));
    }
    setUploading(false);
    setUploadProgress(0);
  };

  return (
    <div>
      <div style={{
        textAlign: 'center',
        padding: 40,
        border: '2px dashed var(--border-color)',
        borderRadius: 8,
        marginBottom: 30
      }}>
        <h2>Upload New Video</h2>
        <p>Drag and drop video files or click below to browse</p>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="video-upload-input"
        />
        <label htmlFor="video-upload-input" style={{
          display: 'inline-block',
          marginTop: 15,
          padding: '12px 24px',
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          borderRadius: 4,
          cursor: 'pointer',
          fontSize: 16,
          fontWeight: 500,
        }}>
          Choose File
        </label>
        <button
          onClick={handleUpload}
          disabled={!videoFile || uploading}
          style={{
            marginLeft: 15,
            padding: '12px 24px',
            backgroundColor: uploading ? '#999' : 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          {uploading ? `Uploading... ${uploadProgress}%` : 'Upload'}
        </button>
        {status && (
          <p style={{ marginTop: 15, color: status.includes('failed') ? 'red' : 'green' }}>{status}</p>
        )}
      </div>

      <h3>Your Video Library</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: 20,
        marginTop: 20
      }}>
        {videos.length === 0 && <p>No videos uploaded yet.</p>}
        {videos.map(video => (
          <div key={video.filename} style={{
            backgroundColor: 'var(--card-bg)',
            borderRadius: 8,
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{ height: 140, backgroundColor: '#ddd', position: 'relative' }}>
              {video.url ? (
                <video
                  src={HOST + video.url}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  controls
                />
              ) : (
                <div>No preview</div>
              )}
            </div>
            <div style={{ padding: 15 }}>
              <h4 style={{ fontWeight: 600, margin: '0 0 5px' }}>{video.caption || 'No title'}</h4>
              <div style={{ fontSize: 13, color: '#666' }}>
                Uploaded: {new Date(video.createdAt).toLocaleDateString()} • {video.views || 0} views
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
