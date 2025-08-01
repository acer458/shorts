import React, { useEffect, useState } from "react";
import axios from "axios";

// Your backend URL
const HOST = "https://shorts-t2dk.onrender.com";

// Same ADMIN_KEY as in your backend and App.js earlier
const ADMIN_KEY = "Hindi@1234"; // <--- Set your secret

export default function AdminDashboard() {
  const [shorts, setShorts] = useState([]);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");

  // Fetch all shorts
  useEffect(() => {
    axios
      .get(HOST + "/shorts")
      .then((res) => setShorts(res.data))
      .catch(() => setStatus("Could not fetch shorts."));
  }, []);

  // Handle video upload
  const handleUpload = (e) => {
    e.preventDefault();
    if (!video) return;
    setUploading(true);
    setStatus("");

    const formData = new FormData();
    formData.append("video", video);

    axios
      .post(HOST + "/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-admin-key": ADMIN_KEY,
        },
      })
      .then((res) => {
        setShorts((prev) => [res.data, ...prev]);
        setVideo(null);
        setStatus("Upload Successful!");
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          setStatus("Upload Failed: Unauthorized (check admin key)");
        } else {
          setStatus("Upload Failed.");
        }
      })
      .finally(() => setUploading(false));
  };

  return (
    <div style={{ background: "#010", color: "#fff", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", marginTop: 24 }}>Admin Dashboard</h2>
      <form
        style={{
          margin: 20,
          padding: 10,
          borderRadius: 8,
          background: "#222",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 400,
        }}
        onSubmit={handleUpload}
      >
        <b>Upload New Short Video</b>
        {status && (
          <div
            style={{
              background: status.includes("Successful") ? "#0f0" : "#f33",
              color: "#000",
              borderRadius: 4,
              padding: "4px 0",
              textAlign: "center",
              marginBottom: 5,
            }}
          >
            {status}
          </div>
        )}
        <input
          accept="video/mp4"
          type="file"
          onChange={(e) => setVideo(e.target.files[0])}
        />
        <button type="submit" disabled={uploading || !video}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <small style={{ color: "#ccc" }}>
          Only .mp4 videos allowed. (Admin-only dashboard)
        </small>
      </form>
      <div style={{ maxWidth: 400, margin: "auto" }}>
        <h4>All Shorts</h4>
        {shorts.length === 0 && (
          <div style={{ color: "#aab", textAlign: "center", marginTop: 48 }}>
            No videos uploaded yet.
          </div>
        )}
        {shorts.map((s, i) => (
          <video
            key={i}
            src={HOST + s.url}
            controls
            loop
            style={{
              width: "100%",
              height: "60vh",
              objectFit: "cover",
              marginBottom: 20,
              borderRadius: 12,
            }}
          />
        ))}
      </div>
    </div>
  );
}
