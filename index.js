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
