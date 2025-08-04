const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json()); // For parsing JSON bodies

// === DATABASE SETUP ===
const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/yourapp";
mongoose.connect(MONGODB_URI).then(() => console.log("MongoDB connected"));

// ---------- USER MODEL ----------
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  passwordHash: String
});
const User = mongoose.model("User", userSchema);

const DISK_PATH = './data'; // Change as needed

if (!fs.existsSync(DISK_PATH)) fs.mkdirSync(DISK_PATH, { recursive: true });

// Video Database
const VIDEOS_JSON = path.join(__dirname, 'videos.json');
function getVideos() {
  if (!fs.existsSync(VIDEOS_JSON)) return [];
  try { return JSON.parse(fs.readFileSync(VIDEOS_JSON, 'utf-8') || '[]'); } catch { return []; }
}
function saveVideos(videos) {
  fs.writeFileSync(VIDEOS_JSON, JSON.stringify(videos, null, 2), 'utf-8');
}
function findVideo(videos, filename) {
  return videos.find(v => v.filename === filename);
}
function findVideoByHash(videos, hash) {
  return videos.find(v => v.sha256 === hash);
}
function fileHashSync(filepath) {
  const buffer = fs.readFileSync(filepath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

// === AUTH ===
const SECRET = process.env.JWT_SECRET || "super-strong-secret-key";

// -- AUTH ROUTES --
app.post('/auth/signup', async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username)
    return res.status(400).json({ error: "email/password/username required" });
  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists)
    return res.status(409).json({ error: "Email or username already in use" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, username, passwordHash });
  const token = jwt.sign({ userId: user._id, username: user.username }, SECRET, { expiresIn: "7d" });
  res.json({ user: { id: user._id, email, username }, token });
});
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.passwordHash))
    return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ userId: user._id, username: user.username }, SECRET, { expiresIn: "7d" });
  res.json({ user: { id: user._id, email, username: user.username }, token });
});
function requireAuth(req, res, next) {
  const header = req.header("Authorization");
  if (!header || !header.startsWith("Bearer ")) return res.status(401).json({ error: "No or bad token" });
  try {
    req.user = jwt.verify(header.substring(7), SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ==== VIDEO ENDPOINTS ====

// Serve static video files
app.use('/uploads', express.static(DISK_PATH));

// Get all shorts
app.get('/shorts', (req, res) => { res.json(getVideos()); });
// Get one short
app.get('/shorts/:filename', (req,res) => {
  const vid = findVideo(getVideos(), req.params.filename);
  if (!vid) return res.status(404).json({ error: "Video not found" });
  res.json(vid);
});
// Add view (records user if logged in)
app.post('/shorts/:filename/view', requireAuth, (req,res) => {
  const videos = getVideos();
  const vid = findVideo(videos, req.params.filename);
  if (!vid) return res.status(404).json({ error: "Video not found" });
  vid.views = (vid.views || 0) + 1;
  if (!vid.viewedBy) vid.viewedBy = [];
  if (!vid.viewedBy.includes(req.user.userId)) vid.viewedBy.push(req.user.userId);
  saveVideos(videos);
  res.json({ success: true, views: vid.views });
});
// Like
app.post('/shorts/:filename/like', requireAuth, (req,res) => {
  const videos = getVideos();
  const vid = findVideo(videos, req.params.filename);
  if (!vid) return res.status(404).json({ error: "Video not found" });
  vid.likes = (vid.likes || 0) + 1;
  if (!vid.likedBy) vid.likedBy = [];
  if (!vid.likedBy.includes(req.user.userId)) vid.likedBy.push(req.user.userId);
  saveVideos(videos);
  res.json({ success: true, likes: vid.likes });
});
// Comment (records username)
app.post('/shorts/:filename/comment', requireAuth, (req,res) => {
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: "No comment text" });
  const videos = getVideos();
  const vid = findVideo(videos, req.params.filename);
  if (!vid) return res.status(404).json({ error: "Video not found" });
  vid.comments = vid.comments || [];
  vid.comments.push({ userId: req.user.userId, username: req.user.username, text });
  saveVideos(videos);
  res.json({ success: true, comments: vid.comments });
});

// === ADMIN UPLOADS, DELETE ETC (as in your original) ===

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, DISK_PATH),
  filename: (req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

app.post('/upload', upload.single('video'), (req, res) => {
  const tempPath = path.join(DISK_PATH, req.file.filename);
  let videos = getVideos();
  let incomingHash;
  try { incomingHash = fileHashSync(tempPath); }
  catch { fs.unlinkSync(tempPath); return res.status(400).json({ error: "Failed to read file" }); }
  const dup = findVideoByHash(videos, incomingHash);
  if (dup) { fs.unlinkSync(tempPath); return res.json({ success: true, duplicate: true, url: dup.url, filename: dup.filename }); }
  const videoUrl = `/uploads/${req.file.filename}`;
  const stats = fs.statSync(tempPath);
  const caption = typeof req.body.caption === "string" ? req.body.caption.trim() : "";
  const author = typeof req.body.author === "string" ? req.body.author.trim() : "";
  if (caption.length > 250) { fs.unlinkSync(tempPath); return res.status(400).json({ error: "Caption too long" }); }
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
    likedBy: [],
    viewedBy: [],
    comments: []
  });
  saveVideos(videos);
  res.json({ success: true, url: videoUrl, filename: req.file.filename });
});

app.patch('/shorts/:filename', (req, res) => {
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

app.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(DISK_PATH, filename);
  let deletedVideo = null;
  if (fs.existsSync(filePath)) {
    try { fs.unlinkSync(filePath); } catch (err) {
      return res.status(500).json({ error: "Failed to delete video file" });
    }
  }
  let videos = getVideos();
  const initialLength = videos.length;
  videos = videos.filter(v => {
    if (v.filename === filename) { deletedVideo = v; return false; }
    return true;
  });
  if (!deletedVideo && initialLength === videos.length)
    return res.status(404).json({ error: "Video not found" });
  saveVideos(videos);
  res.json({ success: true, deleted: filename });
});

// Debug endpoint
app.get('/_diskdebug', (req, res) => {
  try {
    const files = fs.existsSync(DISK_PATH) ? fs.readdirSync(DISK_PATH) : [];
    res.json({ disk_path: DISK_PATH, files });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
