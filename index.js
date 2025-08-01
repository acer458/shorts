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

// In-memory video list
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

// Upload endpoint (admin only)
app.post('/upload', adminAuth, upload.single('video'), (req, res) => {
  const videoUrl = `/uploads/${req.file.filename}`;
  const stats = fs.statSync(path.join('uploads', req.file.filename)); // for size (bytes)
  videos.unshift({
    url: videoUrl,
    createdAt: new Date(),
    size: stats.size     // <-- include file size!
  });
  res.json({ success: true, url: videoUrl });
});

// Get all shorts and send file size info to admin dashboard
app.get('/shorts', (req, res) => {
  res.json(videos);
});

// Delete endpoint (admin only)
app.delete('/delete/:filename', adminAuth, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(404).json({ error: 'File not found.' });
    }
    // Remove the video from the in-memory videos list:
    videos = videos.filter(v => !v.url.endsWith(filename));
    res.json({ success: true });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
