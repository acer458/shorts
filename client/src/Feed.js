// client/src/Feed.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const HOST = "https://shorts-t2dk.onrender.com"; // your backend URL

export default function Feed() {
  const [shorts, setShorts] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    axios.get(HOST + "/shorts")
      .then((res) => setShorts(res.data))
      .catch(() => setStatus("Unable to load shorts."));
  }, []);

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", marginTop: 24 }}>Shorts Feed</h2>
      {status && (
        <div style={{ color: "#f33", textAlign: "center", marginTop: 10 }}>
          {status}
        </div>
      )}
      <div style={{ maxWidth: 400, margin: "auto" }}>
        {shorts.length === 0 && !status && (
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
