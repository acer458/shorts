const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

let videos = [];

app.post('/upload', upload.single('video'), (req, res) => {
    const videoUrl = `/uploads/${req.file.filename}`;
    videos.unshift({ url: videoUrl, createdAt: new Date() });
    res.json({ success: true, url: videoUrl });
});

app.get('/shorts', (req, res) => {
    res.json(videos);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

// DELETE endpoint to remove a video file -- place BELOW your uploads and shorts endpoints!

const fs = require('fs');
const path = require('path');

// If you're not already tracking the "videos" array in memory, define it above with your other globals
// let videos = []; // If not already present

app.delete('/delete/:filename', adminAuth, (req, res) => {
  const filename = req.params.filename;
  // If you use persistent disk, change 'uploads' to your persistent folder if needed
  const filePath = path.join(__dirname, 'uploads', filename); // or '/mnt/data/uploads/filename' for persistent disk

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(404).json({ error: 'File not found.' });
    }
    // Remove the deleted file from the in-memory videos list, if you keep one
    videos = videos.filter(v => !v.url.endsWith(filename));
    res.json({ success: true });
  });
});

