// index.js (or app.js if you use require('./app') from index.js)

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const jwt = require("jsonwebtoken");
const { randomUUID } = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const DISK_PATH = '/data'; // Your Render persistent disk path

// Health/debug endpoint
app.get('/_diskdebug', (req, res) => {
  try {
    const files = fs.existsSync(DISK_PATH) ? fs.readdirSync(DISK_PATH) : [];
    res.json({ disk_path: DISK_PATH, files });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

if (!fs.existsSync(DISK_PATH)) fs.mkdirSync(DISK_PATH, { recursive: true });

const VIDEOS_JSON = path.join(__dirname, 'videos.json');
function getVideos() {
  if (!fs.existsSync(VIDEOS_JSON)) return [];
  try { return JSON.parse(fs.readFileSync(VIDEOS_JSON, 'utf-8') || '[]'); } catch { return []; }
}
function saveVideos(videos) {
  fs.writeFileSync(VIDEOS_JSON, JSON.stringify(videos, null, 2), 'utf-8');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, DISK_PATH),
  filename: (req, file, cb) => cb(null, randomUUID() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.use('/uploads', express.static(DISK_PATH));

// --- ADMIN LOGIN SYSTEM (JWT) ---
const ADMIN_EMAIL = "propscholars@gmail.com";
const ADMIN_PASSWORD = "Hindi@1234";
const SECRET = "super-strong-secret-key-change-this"; // Change for production

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

function findVideo(videos, filename) {
  return videos.find(v => v.filename === filename);
}

// === PUBLIC ENDPOINTS ===
app.get('/shorts', (req, res) => { res.json(getVideos()); });

app.get('/shorts/:filename', (req, res) => {
  const videos = getVideos();
  const vid = findVideo(videos, req.params.filename);
  if (!vid) return res.status(404).json({ error: "Video not found" });
  res.json(vid);
});

app.post('/shorts/:filename/view', (req, res) => {
  const videos = getVideos();
  const vid = findVideo(videos, req.params.filename);
  if (!vid) return res.status(404).json({ error: "Video not found" });
  vid.views = (vid.views || 0) + 1;
  saveVideos(videos);
  res.json({ success: true, views: vid.views });
});

app.post('/shorts/:filename/like', (req, res) => {
  const videos = getVideos();
  const vid = findVideo(videos, req.params.filename);
  if (!vid) return res.status(404).json({ error: "Video not found" });
  vid.likes = (vid.likes || 0) + 1;
  saveVideos(videos);
  res.json({ success: true, likes: vid.likes });
});

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
app.post('/upload', adminJwtAuth, upload.single('video'), (req, res) => {
  const filename = req.file.filename;
  const videoUrl = `/uploads/${filename}`;
  const stats = fs.statSync(path.join(DISK_PATH, filename));
  const caption = typeof req.body.caption === "string" ? req.body.caption.trim() : "";
  const author = typeof req.body.author === "string" ? req.body.author.trim() : "";
  if (caption.length > 250) {
    fs.unlinkSync(path.join(DISK_PATH, filename));
    return res.status(400).json({ error: "Caption too long" });
  }
  let videos = getVideos();
  videos.unshift({
    url: videoUrl,
    filename,
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

app.delete('/delete/:filename', adminJwtAuth, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(DISK_PATH, filename);
  if (fs.existsSync(filePath)) {
    try { fs.unlinkSync(filePath); } catch (err) {}
  }
  let videos = getVideos();
  videos = videos.filter(v => v.filename !== filename);
  saveVideos(videos);
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
