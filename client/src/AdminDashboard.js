import React, { useEffect, useState } from "react";
import axios from "axios";

const HOST = "https://shorts-t2dk.onrender.com"; // Your backend URL
const ADMIN_KEY = "Hindi@1234"; // Replace with your real admin key

function bytesToSize(bytes) {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return Math.round(bytes / Math.pow(1024, i) * 10) / 10 + " " + sizes[i];
}

export default function AdminDashboard() {
  const [shorts, setShorts] = useState([]);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    axios
      .get(HOST + "/shorts")
      .then((res) => setShorts(res.data))
      .catch(() => setStatus("Could not fetch shorts."));
  }, []);

  // ---->>>> This is the only part that needs fixing <<<<----
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
          // Do NOT set Content-Type for multipart/form-data here!
          "x-admin-key": ADMIN_KEY,
        },
      })
      .then((res) => {
        axios.get(HOST + "/shorts").then((r) => setShorts(r.data));
        setVideo(null);
        setStatus("Upload Successful!");
      })
      .catch((err) => {
        setUploading(false);
        if (err.response && err.response.status === 401) {
          setStatus("Upload Failed: Unauthorized (Check admin key)");
        } else if (err.response && err.response.status === 413) {
          setStatus("Upload Failed: File too large.");
        } else {
          setStatus("Upload Failed: " + (err.message || ""));
        }
        // Debug
        console.error("Upload error:", err);
      })
      .finally(() => setUploading(false));
  };

  const handleDelete = (filename) => {
    if (!window.confirm("Delete this video permanently?")) return;
    axios
      .delete(`${HOST}/delete/${filename}`, {
        headers: { "x-admin-key": ADMIN_KEY },
      })
      .then(() => setShorts((prev) => prev.filter((s) => !s.url.endsWith(filename))))
      .catch(() => alert("Delete failed!"));
  };

  const totalSize = shorts.reduce(
    (sum, v) => sum + (v.size ? Number(v.size) : 0),
    0
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#181C23",
        display: "flex",
        flexDirection: "row",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* LEFT: Upload button + Sidebar */}
      <div
        style={{
          flex: "0 0 340px",
          padding: "32px 18px",
          background: "linear-gradient(180deg, #0a1d4c 70%, #1a1529 100%)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {/* Upload Button */}
        <form
          onSubmit={handleUpload}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <label
            htmlFor="upload"
            style={{
              background: "#47A3F3",
              color: "#fff",
              fontWeight: 600,
              fontSize: 18,
              padding: "12px 22px",
              borderRadius: 8,
              cursor: "pointer",
              display: "inline-block",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Upload Video
            <input
              id="upload"
              type="file"
              accept="video/mp4"
              style={{ display: "none" }}
              onChange={(e) => setVideo(e.target.files[0])}
            />
          </label>
          <button
            type="submit"
            disabled={uploading || !video}
            style={{
              background: uploading ? "#333" : "#0bb259",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              border: "none",
              borderRadius: 5,
              padding: "8px 0",
              cursor: uploading || !video ? "wait" : "pointer",
            }}
          >
            {uploading ? "Uploading..." : "Submit"}
          </button>
          {status && (
            <div
              style={{
                background: status.includes("Success") ? "#0f0" : "#f33",
                color: "#000",
                padding: "4px 0",
                borderRadius: 4,
                textAlign: "center",
                fontWeight: 500,
                marginTop: 4,
              }}
            >
              {status}
            </div>
          )}
        </form>

        {/* Video statistics */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontWeight: "bold" }}>
            No. of videos:{" "}
            <span style={{ color: "#22d3ee" }}>{shorts.length}</span>
          </div>
          <div>
            File size:{" "}
            <span style={{ color: "#22d3ee" }}>
              {totalSize ? bytesToSize(totalSize) : "N/A"}
            </span>
          </div>
        </div>

        {/* File List (Table-like) */}
        <div
          style={{
            background: "#111116",
            padding: 16,
            borderRadius: 10,
            boxShadow: "0 2px 12px #0002",
            minHeight: 150,
            maxHeight: 330,
            overflowY: "auto",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 6, color: "#fff" }}>
            Uploaded Files
          </div>
          {shorts.length === 0 && (
            <div style={{ color: "#aaa", textAlign: "center", fontSize: 14 }}>
              No videos uploaded yet.
            </div>
          )}
          {shorts.map((s, i) => {
            const filename = s.url.split("/").pop();
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "5px 0",
                  borderBottom:
                    i === shorts.length - 1 ? "none" : "1px solid #23223c",
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    color: "#abe",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    wordBreak: "break-all",
                    maxWidth: 150,
                  }}
                >
                  {filename}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "#fff9",
                    margin: "0 8px",
                  }}
                >
                  {s.size ? bytesToSize(Number(s.size)) : ""}
                </span>
                <button
                  type="button"
                  style={{
                    background: "#e11d48",
                    color: "#fff",
                    fontWeight: 600,
                    border: "none",
                    borderRadius: 4,
                    fontSize: 13,
                    padding: "2px 9px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDelete(filename)}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Scrollable Videos */}
      <div
        style={{
          flex: 1,
          margin: "36px 24px 36px 0",
          background: "#000",
          borderRadius: 18,
          boxShadow: "0 6px 16px #0003",
          padding: "24px 0 24px 24px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: 22,
            color: "#8cd9ff",
            marginBottom: 18,
          }}
        >
          Scrollable Videos
        </div>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 30,
          }}
        >
          {shorts.length === 0 && (
            <div
              style={{
                color: "#888",
                textAlign: "center",
                marginTop: 100,
              }}
            >
              No videos uploaded yet.
            </div>
          )}
          {shorts.map((s, i) => (
            <div
              key={i}
              style={{
                background: "#1a1529",
                borderRadius: 12,
                padding: 15,
                boxShadow: "0 1px 10px #0002",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <span
                style={{
                  color: "#68d",
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                VIDEO-{i + 1}
              </span>
              <video
                src={HOST + s.url}
                controls
                loop
                style={{
                  width: "100%",
                  maxHeight: "280px",
                  background: "#000",
                  borderRadius: 10,
                  objectFit: "cover",
                }}
              />
              <small
                style={{
                  color: "#aaa",
                }}
              >
                {s.url.split("/").pop()}
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
