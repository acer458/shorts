import React, { useState, useEffect } from "react";
import axios from "axios";
const HOST = "https://shorts-t2dk.onrender.com";

export default function VideoUpload() {
  const [video, setVideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get(HOST + "/shorts")
      .then(res => setVideos(res.data))
      .catch(() => {});
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!video) {
      setStatus('Please select a file.');
      return;
    }
    setUploadProgress(0);
    setStatus('');
    const formData = new FormData();
    formData.append('video', video);
    try {
      const res = await axios.post(HOST + '/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: pe => {
          setUploadProgress(Math.round((pe.loaded * 100) / pe.total));
        }
      });
      setVideos(prev => [res.data, ...prev]);
      setStatus('Upload successful!');
      setVideo(null);
      setUploadProgress(0);
    } catch (err) {
      setStatus('Upload failed: ' + (err.message || ''));
      setUploadProgress(0);
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 560 }}>
      <form onSubmit={handleUpload} style={{ display: "flex", alignItems: 'center', gap: 10 }}>
        <input type="file" onChange={e => setVideo(e.target.files[0])} accept="video/mp4" style={{ background: "#fff" }} />
        <button type="submit" style={{ background: "#2563eb", color: "#fff" }}>Upload</button>
      </form>
      {uploadProgress > 0 && (
        <div style={{ marginTop: 10, background: '#f3f3ff', borderRadius: 8, height: 14, width: "100%", boxShadow: "0 1px 2px #2562eb22" }}>
          <div style={{ width: `${uploadProgress}%`, background: '#2563eb', height: '100%', transition: "width .17s" }} />
        </div>
      )}
      {status && <div style={{ marginTop: 12, color: status.includes('success') ? "#259600" : "#c00" }}>{status}</div>}

      <h3 style={{ margin: "26px 0 12px 0", fontWeight: 600 }}>Uploaded Videos</h3>
      <ul style={{ background: "#f5f7fc", borderRadius: 8, padding: "14px 18px", minHeight: 80 }}>
        {videos.map(v =>
          <li key={v.filename} style={{ padding: "7px 0", borderBottom: "1px solid #e8e8fa" }}>
            {v.filename} <span style={{ color: "#2563eb", fontSize: 13 }}>{Math.round((v.size || 0) / 1024 / 102.4) / 10} MB</span>
          </li>
        )}
        {videos.length === 0 && <li style={{ color: "#888" }}>No videos</li>}
      </ul>
    </div>
  );
}

