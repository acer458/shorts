const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// Persistent Disk Path - MUST match Render disk mount path (e.g., '/data')
const DISK_PATH = '/data';
if (!fs.existsSync(DISK_PATH)) fs.mkdirSync(DISK_PATH, { recursive: true });

// Store all metadata in persistent disk
const VIDEOS_JSON = path.join(DISK_PATH, 'videos.json');
const USERS_JSON = path.join(DISK_PATH, 'users.json');

function getVideos() {
  if (!fs.existsSync(VIDEOS_JSON)) return [];
  try { return JSON.parse(fs.readFileSync(VIDEOS_JSON, 'utf-8') || '[]'); } catch { return []; }
}
function saveVideos(videos) {
  fs.writeFileSync(VIDEOS_JSON, JSON.stringify(videos, null, 2), 'utf-8');
}

function getUsers() {
  if (!fs.existsSync(USERS_JSON)) return [];
  try { return JSON.parse(fs.readFileSync(USERS_JSON, 'utf-8') || '[]'); } catch { return []; }
}
function saveUsers(users) {
  fs.writeFileSync(USERS_JSON, JSON.stringify(users, null, 2), 'utf-8');
}

// Debug endpoint for Render disk checks
app.get('/_diskdebug', (req, res) => {
  try {
    const files = fs.existsSync(DISK_PATH) ? fs.readdirSync(DISK_PATH) : [];
    res.json({ disk_path: DISK_PATH, files });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ========== Admin Auth ===========
const ADMIN_EMAIL = "propscholars@gmail.com";
const ADMIN_PASSWORD = "Hindi@1234";
const SECRET = "super-strong-secret-key-change-this"; // Use env var in production

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

// ========== User Auth ===========
function userJwtAuth(req, res, next) {
  const header = req.header("Authorization");
  if (!header) return res.status(401).json({ error: "No token" });
  const token = header.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // Attach user info to request
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

app.post("/user/signup", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { name, email, password: hashedPassword, id: crypto.randomUUID() };
  users.push(newUser);
  saveUsers(users);

  const token = jwt.sign({ id: newUser.id, name: newUser.name }, SECRET, { expiresIn: "7d" });
  res.status(201).json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});

app.post("/user/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user.id, name: user.name }, SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// ========== Multer for uploads ==========
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, DISK_PATH),
  filename: (req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname)}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 150 * 1024 * 1024 } // 150MB per video file!
});

// Serve uploaded videos
app.use('/uploads', express.static(DISK_PATH));

// Helper utilities
function fileHashSync(filepath) {
  const buffer = fs.readFileSync(filepath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}
function findVideo(videos, filename) {
  return videos.find(v => v.filename === filename);
}
function findVideoByHash(videos, hash) {
  return videos.find(v => v.sha256 === hash);
}

// ================== Admin comments moderation endpoints ==================
// (ADD any new admin endpoints here, as in your last step!)

// List all comments
app.get('/admin/all-comments', adminJwtAuth, (req, res) => {
  const videos = getVideos();
  const allComments = [];
  videos.forEach((video) => {
    (video.comments || []).forEach((comment, idx) => {
      allComments.push({
        videoFilename: video.filename,
        videoCaption: video.caption || '',
        comment,
        index: idx,
      });
    });
  });
  res.json(allComments);
});

// Delete a comment by video and comment index
app.delete('/admin/comments/:videoFilename/:commentIdx', adminJwtAuth, (req, res) => {
  const { videoFilename, commentIdx } = req.params;
  const videos = getVideos();
  const video = videos.find(v => v.filename === videoFilename);
  if (!video) return res.status(404).json({ error: "Video not found" });
  const idx = parseInt(commentIdx, 10);
  if (isNaN(idx) || !video.comments || !video.comments[idx])
    return res.status(404).json({ error: "Comment not found" });
  video.comments.splice(idx, 1);
  saveVideos(videos);
  res.json({ success: true });
});

// ================== Public & Upload Endpoints ==================

// List all videos
app.get('/shorts', (req, res) => res.json(getVideos()));

// Get a single video by filename
app.get('/shorts/:filename', (req, res) => {
  const v = findVideo(getVideos(), req.params.filename);
  if (!v) return res.status(404).json({ error: "Video not found" });
  res.json(v);
});

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

// Add a comment - Now requires user authentication!
app.post('/shorts/:filename/comment', userJwtAuth, (req, res) => {
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: "No comment text" });

  const videos = getVideos();
  const vid = findVideo(videos, req.params.filename);
  if (!vid) return res.status(404).json({ error: "Video not found" });

  vid.comments = vid.comments || [];
  vid.comments.push({
    name: req.user.name,
    text,
    createdAt: new Date(),
    userId: req.user.id
  });
  saveVideos(videos);
  res.json({ success: true, comments: vid.comments });
});

// Upload video (dedupe by hash)
app.post('/upload', adminJwtAuth, upload.single('video'), (req, res) => {
  const tempPath = path.join(DISK_PATH, req.file.filename);
  let videos = getVideos();

  let incomingHash;
  try {
    incomingHash = fileHashSync(tempPath);
  } catch {
    fs.unlinkSync(tempPath);
    return res.status(400).json({ error: "Failed to read file for hashing." });
  }
  // Duplicate check
  const dup = findVideoByHash(videos, incomingHash);
  if (dup) {
    fs.unlinkSync(tempPath);
    return res.json({
      success: true,
      duplicate: true,
      url: dup.url,
      message: "Duplicate upload detected. Using existing video URL.",
      filename: dup.filename
    });
  }

  const videoUrl = `/uploads/${req.file.filename}`;
  const stats = fs.statSync(tempPath);
  const caption = typeof req.body.caption === "string" ? req.body.caption.trim() : "";
  const author = typeof req.body.author === "string" ? req.body.author.trim() : "";
  if (caption.length > 250) {
    fs.unlinkSync(tempPath);
    return res.status(400).json({ error: "Caption too long" });
  }
  videos.unshift({
    url: videoUrl,
    filename: req.file.filename,
    sha256: incomingHash,
    createdAt: new Date(),
    size: stats.size,
    caption,
    author,
    likes: 0,
    views: 0,
    comments: []
  });
  saveVideos(videos);
  res.json({ success: true, url: videoUrl, filename: req.file.filename });
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

// DELETE video
app.delete('/delete/:filename', adminJwtAuth, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(DISK_PATH, filename);
  let deletedVideo = null;

  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      return res.status(500).json({ error: "Failed to delete video file" });
    }
  }
  let videos = getVideos();
  const initialLength = videos.length;
  videos = videos.filter(v => {
    if (v.filename === filename) {
      deletedVideo = v;
      return false;
    }
    return true;
  });
  if (!deletedVideo && initialLength === videos.length)
    return res.status(404).json({ error: "Video not found" });

  saveVideos(videos);
  res.json({ success: true, deleted: filename });
});

// Handle Multer errors nicely (file too large, etc)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: "File too large" });
    }
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

// Standard Express catch-all
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || 'Unknown server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


