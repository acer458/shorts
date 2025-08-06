// =========================
// SHORTS APP FULL BACKEND
// - User signup/login/email verification (via YOUR Gmail via Nodemailer)
// - JWT user authentication for comments/likes
// - Admin protected endpoints for video upload/edit/delete
// - JWT secret and admin password = Hindi@1234
// =========================

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendVerificationEmail } = require('./email.js'); // Uses Nodemailer+Gmail!

const app = express();
app.use(cors());
app.use(express.json());

// =======================
// CONFIGURATION / CONSTANTS
// =======================
const DISK_PATH = '/data'; // Render persistent disk mount path
const VIDEOS_JSON = path.join(__dirname, 'videos.json');
const USERS_JSON = path.join(__dirname, 'users.json');

const ADMIN_EMAIL = "propscholars@gmail.com";
const ADMIN_PASSWORD = "Hindi@1234";
const JWT_SECRET = process.env.JWT_SECRET || "Hindi@1234"; // Should always be set in env

// =======================
// HELPER FUNCTIONS - VIDEOS DB
// =======================

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

// =======================
// HELPER FUNCTIONS - USERS DB
// =======================
function getUsers() {
  if (!fs.existsSync(USERS_JSON)) return [];
  try { return JSON.parse(fs.readFileSync(USERS_JSON, 'utf-8') || '[]'); } catch { return []; }
}
function saveUsers(users) {
  fs.writeFileSync(USERS_JSON, JSON.stringify(users, null, 2), 'utf-8');
}
function findUserByEmail(users, email) {
  return users.find(u => u.email === email);
}
function findUserByUsername(users, username) {
  return users.find(u => u.username === username);
}
function findUserById(users, id) {
  return users.find(u => u.id === id);
}
function findUserByToken(users, token) {
  return users.find(u => u.verifyToken === token);
}

// =======================
// ENSURE STORAGE DIR AND JSON FILES EXIST
// =======================
if (!fs.existsSync(DISK_PATH)) fs.mkdirSync(DISK_PATH, { recursive: true });
if (!fs.existsSync(VIDEOS_JSON)) saveVideos([]);
if (!fs.existsSync(USERS_JSON)) saveUsers([]);

// =======================
// ADMIN LOGIN & GUARD
// =======================

app.post("/admin/login", (req, res) => {
  const { email, password } = req.body || {};
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "4h" });
    return res.json({ token });
  }
  res.status(401).json({ error: "Unauthorized" });
});

function adminJwtAuth(req, res, next) {
  const header = req.header("Authorization");
  if (!header) return res.status(401).json({ error: "No token" });
  const token = header.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.email !== ADMIN_EMAIL) throw new Error();
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// ==============================
// USER AUTH & EMAIL VERIFICATION
// ==============================

// ==== USER SIGNUP ====
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body || {};
  if (
    !/^[a-zA-Z0-9_]{3,16}$/.test(username) ||
    !/^[^@]+@gmail\.com$/.test(email) ||
    !password || password.length < 6
  ) return res.status(400).send("Invalid username, email, or password.");

  let users = getUsers();
  if (findUserByEmail(users, email)) return res.status(400).send("Email already in use.");
  if (findUserByUsername(users, username)) return res.status(400).send("Username already taken.");

  const hash = await bcrypt.hash(password, 10);
  const verifyToken = crypto.randomBytes(24).toString("hex");

  const newUser = {
    id: crypto.randomUUID(),
    username,
    email,
    hash,
    verified: false,
    verifyToken,
    created: Date.now()
  };
  users.push(newUser);
  saveUsers(users);

  try {
    // Use your production frontend for verification link
    await sendVerificationEmail(email, verifyToken, "https://shorts-frontend-xnw5.onrender.com");
    res.send("Verification email sent. Check your inbox.");
  } catch (err) {
    // Cleanup user on error
    users = getUsers().filter(u => u.email !== email);
    saveUsers(users);
    res.status(500).send("Failed to send verification email. Please try again.");
  }
});

// ==== USER EMAIL VERIFICATION ====
app.get("/api/verify", (req, res) => {
  const { token } = req.query;
  let users = getUsers();
  const user = findUserByToken(users, token);
  if (!user) return res.status(400).send("Invalid or expired verification link.");
  user.verified = true;
  user.verifyToken = undefined;
  saveUsers(users);
  res.send("Email verified! You can now log in.");
});

// ==== USER LOGIN ====
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body || {};
  const users = getUsers();
  const user = findUserByEmail(users, email);
  if (!user) return res.status(401).send("No such account.");
  if (!user.verified) return res.status(403).send("Email not verified.");
  const matched = await bcrypt.compare(password, user.hash);
  if (!matched) return res.status(401).send("Incorrect password.");
  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: "10d" }
  );
  res.json({ token, username: user.username });
});

// ==== USER JWT AUTHENTICATION MIDDLEWARE ====
function userJwtAuth(req, res, next) {
  const header = req.header("Authorization");
  if (!header || !header.startsWith("Bearer ")) return res.status(401).json({ error: "Missing token" });
  try {
    const data = jwt.verify(header.slice(7), JWT_SECRET);
    req.user = data;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ==============================
// PUBLIC VIDEO ENDPOINTS
// ==============================

// Get all shorts
app.get('/shorts', (req, res) => {
  res.json(getVideos());
});

// Get a single short
app.get('/shorts/:filename', (req, res) => {
  const videos = getVideos();
  const vid = findVideo(videos, req.params.filename);
  if (!vid) return res.status(404).json({ error: "Video not found" });
  res.json(vid);
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

// Like (AUTH REQUIRED, only once per user)
app.post('/shorts/:filename/like', userJwtAuth, (req, res) => {
  const videos = getVideos();
  const vid = findVideo(videos, req.params.filename);
  if (!vid) return res.status(404).json({ error: "Video not found" });

  vid.likesBy = vid.likesBy || [];
  if (!vid.likesBy.includes(req.user.id)) {
    vid.likes = (vid.likes || 0) + 1;
    vid.likesBy.push(req.user.id);
    saveVideos(videos);
  }

  res.json({ success: true, likes: vid.likes });
});

// Add a comment (AUTH REQUIRED)
app.post('/shorts/:filename/comment', userJwtAuth, (req, res) => {
  const { text } = req.body || {};
  if (!text || typeof text !== "string") return res.status(400).json({ error: "No comment text." });

  const videos = getVideos();
  const vid = findVideo(videos, req.params.filename);
  if (!vid) return res.status(404).json({ error: "Video not found." });

  vid.comments = vid.comments || [];
  vid.comments.push({
    name: req.user.username,
    userId: req.user.id,
    text: text.trim(),
    created: Date.now()
  });
  saveVideos(videos);
  res.json({ success: true, comments: vid.comments });
});

// =======================
// ADMIN VIDEO ENDPOINTS
// =======================

// Multer storage for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, DISK_PATH),
  filename: (req, file, cb) => {
    cb(null, `${crypto.randomUUID()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Helper: SHA256 hash for deduplication
function fileHashSync(filepath) {
  const buffer = fs.readFileSync(filepath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

// Upload video (admin only, avoids duplicates)
app.post('/upload', adminJwtAuth, upload.single('video'), (req, res) => {
  const tempPath = path.join(DISK_PATH, req.file.filename);
  let videos = getVideos();
  let incomingHash;
  try { incomingHash = fileHashSync(tempPath); }
  catch {
    fs.unlinkSync(tempPath);
    return res.status(400).json({ error: "Failed to read file for hashing." });
  }
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
    return res.status(400).json({ error: "Caption too long." });
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
    likesBy: [],
    views: 0,
    comments: []
  });
  saveVideos(videos);
  res.json({ success: true, url: videoUrl, filename: req.file.filename });
});

// Edit caption (admin only)
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
  return res.status(400).json({ error: "No caption sent." });
});

// Delete video (admin only)
app.delete('/delete/:filename', adminJwtAuth, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(DISK_PATH, filename);
  let deletedVideo = null;

  if (fs.existsSync(filePath)) {
    try { fs.unlinkSync(filePath); }
    catch { return res.status(500).json({ error: "Failed to delete video file." }); }
  }
  let videos = getVideos();
  const initialLength = videos.length;
  videos = videos.filter(v => {
    if (v.filename === filename) { deletedVideo = v; return false; }
    return true;
  });
  if (!deletedVideo && initialLength === videos.length)
    return res.status(404).json({ error: "Video not found." });

  saveVideos(videos);
  res.json({ success: true, deleted: filename });
});

// Serve uploaded videos
app.use('/uploads', express.static(DISK_PATH));

// Disk debug endpoint (for admin)
app.get('/_diskdebug', (req, res) => {
  try {
    const files = fs.existsSync(DISK_PATH) ? fs.readdirSync(DISK_PATH) : [];
    res.json({ disk_path: DISK_PATH, files });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ========= SERVER LISTEN ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
