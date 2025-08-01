const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Ensure uploads folder exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Multer setup for video storage
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// In-memory video list (will reset on server restart)
let videos = [];

// --- Admin Auth Middleware ---
function adminAuth(req, res, next) {
  const ADMIN_KEY = 'Hindi@1234'; // Set your real secret key
  if (req.header("x-admin-key") === ADMIN_KEY) {
    return next();
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

// Helper: find video object by filename
function findVideo(filename) {
  return videos.find(v => v.url.endsWith(filename));
}

// --- PUBLIC ENDPOINTS ---

// Get all shorts and their details
app.get('/shorts', (req, res) => {
  res.json(videos);
});

// Like a video (anyone)
app.post('/shorts/:filename/like', (req, res) => {
  const filename = req.params.filename;
  const vid = findVideo(filename);
  if (!vid) return res.status(404).json({ error: "Video not found" });
  vid.likes = (vid.likes || 0) + 1;
  res.json({ success: true, likes: vid.likes });
});

// Add a comment (anyone)
app.use(express.json()); // Needed for POST bodies!
app.post('/shorts/:filename/comment', (req, res) => {
  const filename = req.params.filename;
  const { name = "Anonymous", text } = req.body;
  if (!text) return res.status(400).json({ error: "No comment text" });
  const vid = findVideo(filename);
  if (!vid) return res.status(404).json({ error: "Video not found" });
  vid.comments = vid.comments || [];
  vid.comments.push({ name, text });
  res.json({ success: true, comments: vid.comments });
});

// --- ADMIN ENDPOINTS ---

// Upload endpoint (multi-field: accept caption, author, etc)
app.post('/upload', adminAuth, upload.single('video'), (req, res) => {
  const videoUrl = `/uploads/${req.file.filename}`;
  const stats = fs.statSync(path.join('uploads', req.file.filename));

  // Parse possible fields sent by frontend form (caption + author optional)
  // If sent via admin dashboard as JSON: use req.body.caption etc
  const caption = req.body.caption || "";
  const author = req.body.author || "";

  videos.unshift({
    url: videoUrl,
    createdAt: new Date(),
    size: stats.size,
    caption,
    author,
    likes: 0,
    comments: []
  });

  res.json({ success: true, url: videoUrl });
});

// Delete endpoint (admin only)
app.delete('/delete/:filename', adminAuth, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err) return res.status(404).json({ error: 'File not found.' });
    videos = videos.filter(v => !v.url.endsWith(filename));
    res.json({ success: true });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
