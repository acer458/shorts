import React, { useEffect, useState } from "react";
import axios from "axios";

// 1. Set your backend URL here
const HOST = "https://shorts-t2dk.onrender.com";

// 2. Set your admin secret key here (keep it secret!)
const ADMIN_KEY = "Hindi@1234"; // <-- CHANGE THIS

export default function App() {
  const [shorts, setShorts] = useState([]);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(""); // Upload status

  // Fetch existing videos
  useEffect(() => {
    axios
      .get(`${HOST}/shorts`)
      .then((res) => setShorts(res.data))
      .catch(() => setStatus("Could not fetch shorts."));
  }, []);

  // Handles video upload
  const handleUpload = (e) => {
    e.preventDefault();
    if (!video) return;
    setUploading(true);
    setStatus("");

    const formData = new FormData();
    formData.append("video", video);

    axios
      .post(`${HOST}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-admin-key": ADMIN_KEY, // The admin key is sent here
        },
      })
      .then((res) => {
        setShorts((prev) => [res.data, ...prev]);
        setVideo(null);
        setStatus("Upload Successful!");
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.status === 401
        ) {
          setStatus("Upload Failed: Unauthorized. (Check your admin key!)");
        } else {
          setStatus("Upload Failed.");
        }
      })
      .finally(() => setUploading(false));
  };

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      {/* Admin Upload Form */}
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
        <b>Admin Upload Video</b>
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
          Only .mp4 videos allowed. This form is admin-only: uploads require the correct key.
        </small>
      </form>
      {/* Shorts Feed */}
      <div style={{ maxWidth: 400, margin: "auto" }}>
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
