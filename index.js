const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json()); // For parsing JSON bodies

const DISK_PATH = '/data'; // Use your Render disk mount path!

// Ensure disk path exists (server startup)
if (!fs.existsSync(DISK_PATH)) fs.mkdirSync(DISK_PATH, { recursive: true });

// Persistent video "database"
const VIDEOS_JSON = path.join(__dirname, 'videos.json');
function getVideos() {
  if (!fs.existsSync(VIDEOS_JSON)) return [];
  try { return JSON.parse(fs.readFileSync(VIDEOS_JSON, 'utf-8') || '[]'); } catch { return []; }
}
function saveVideos(videos) {
  fs.writeFileSync(VIDEOS_JSON, JSON.stringify(videos, null, 2), 'utf-8');
}

// Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, DISK_PATH),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Serve static files from disk for video playback
app.use('/uploads', express.static(DISK_PATH));

// === ADMIN LOGIN SYSTEM (JWT) ===
const ADMIN_EMAIL = "propscholars@gmail.com";      // CHANGE THIS!
const ADMIN_PASSWORD = "Hindi@1234";    // CHANGE THIS!
const SECRET = "super-strong-secret-key-change-this"; // Use env variable for production!

app.post("/admin/login", (req, res) => {
  const { email, password } = req.body || {};
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, SECRET, { expiresIn: "4h" });
    return res.json({ token });
  }
  res.status(401).json({ error: "Unauthorized" });
});

function adminJwtAuth(req, res, next) {
  const header = req.header("Authorization");
  if (!header) return res.status(401).json({ error: "No token" });
  const token = header.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.email !== ADMIN_EMAIL) throw new Error();
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Helper: Find video by filename
function findVideo(videos, filename) {
  return videos.find(v => v.url && v.url.split('/').pop() === filename);
}

// === PUBLIC ENDPOINTS ===

// Get ALL shorts
app.get('/shorts', (req, res) => { res.json(getVideos()); });

// Increment view count
app.post('/shorts/:filename/view', (req, res) => {
  const videos = getVideos();
  const vid = findVideo(videos, req.params.filename);
  if (!vid) return res.status(404).json({ error: "Video not found" });
  vid.views = (vid.views || 0) + 1;
  saveVideos(videos);
  res.json({ success: true, views: vid.views });
});

// Like (increment like count)
app.post('/shorts/:filename/like', (req, res) => {
  const videos = getVideos();
  const vid = findVideo(videos, req.params.filename);
  if (!vid) return res.status(404).json({ error: "Video not found" });
  vid.likes = (vid.likes || 0) + 1;
  saveVideos(videos);
  res.json({ success: true, likes: vid.likes });
});

// Add a comment
app.post('/shorts/:filename/comment', (req, res) => {
  const { name = "Anonymous", text } = req.body || {};
  if (!text) return res.status(400).json({ error: "No comment text" });
  const videos = getVideos();
  const vid = findVideo(videos, req.params.filename);
  if (!vid) return res.status(404).json({ error: "Video not found" });
  vid.comments = vid.comments || [];
  vid.comments.push({ name, text });
  saveVideos(videos);
  res.json({ success: true, comments: vid.comments });
});

// === ADMIN ENDPOINTS ===

// UPLOAD (with caption, optional author)
app.post('/upload', adminJwtAuth, upload.single('video'), (req, res) => {
  const videoUrl = `/uploads/${req.file.filename}`;
  const stats = fs.statSync(path.join(DISK_PATH, req.file.filename));
  const caption = typeof req.body.caption === "string" ? req.body.caption.trim() : "";
  const author = typeof req.body.author === "string" ? req.body.author.trim() : "";
  if (caption.length > 250) {
    fs.unlinkSync(path.join(DISK_PATH, req.file.filename));
    return res.status(400).json({ error: "Caption too long" });
  }
  let videos = getVideos();
  videos.unshift({
    url: videoUrl,
    filename: req.file.filename,
    createdAt: new Date(),
    size: stats.size,
    caption,
    author,
    likes: 0,
    views: 0,
    comments: []
  });
  saveVideos(videos);
  res.json({ success: true, url: videoUrl });
});

// PATCH (edit caption)
app.patch('/shorts/:filename', adminJwtAuth, (req, res) => {
  const filename = req.params.filename;
  const { caption } = req.body || {};
  let videos = getVideos();
  const vid = findVideo(videos, filename);
  if (!vid) return res.status(404).json({ error: "Video not found" });

  if (typeof caption === "string") {
    if (caption.length > 250) return res.status(400).json({ error: "Caption too long" });
    vid.caption = caption.trim();
    saveVideos(videos);
    return res.json({ success: true, updated: { caption: vid.caption } });
  }
  return res.status(400).json({ error: "No caption sent" });
});

// Delete video
app.delete('/delete/:filename', adminJwtAuth, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(DISK_PATH, filename);
  if (fs.existsSync(filePath)) {
    try { fs.unlinkSync(filePath); } catch (err) {}
  }
  let videos = getVideos();
  videos = videos.filter(v => v.url.split('/').pop() !== filename);
  saveVideos(videos);
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
