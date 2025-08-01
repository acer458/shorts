import React, { useEffect, useState } from "react";
import axios from "axios";

const HOST = "https://shorts-t2dk.onrender.com/"; // Replace with your actual backend URL

export default function App() {
  const [shorts, setShorts] = useState([]);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    axios.get(HOST + "/shorts").then((res) => setShorts(res.data));
  }, []);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!video) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("video", video);

    axios
      .post(HOST + "/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setShorts((prev) => [res.data, ...prev]);
        setVideo(null);
      })
      .finally(() => setUploading(false));
  };

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
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
        <input
          accept="video/*"
          type="file"
          onChange={(e) => setVideo(e.target.files[0])}
        />
        <button type="submit" disabled={uploading || !video}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      <div style={{ maxWidth: 400, margin: "auto" }}>
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
