const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Path to the video database (flat file for demo)
const VIDEOS_JSON = path.join(__dirname, 'videos.json');

// Helper: read video DB
function getVideos() {
  if (!fs.existsSync(VIDEOS_JSON)) return [];
  return JSON.parse(fs.readFileSync(VIDEOS_JSON, 'utf-8') || '[]');
}
// Helper: save video DB
function saveVideos(videos) {
  fs.writeFileSync(VIDEOS_JSON, JSON.stringify(videos, null, 2), 'utf-8');
}
// Helper: read POST body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { resolve({}); }
    });
    req.on('error', reject);
  });
}

const ADMIN_KEY = 'Hindi@1234'; // Change as needed

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const matchUpdateCaption = /^\/shorts\/([^/]+)\/update_caption$/.exec(parsedUrl.pathname);
  const matchDelete = /^\/delete\/([^/]+)$/.exec(parsedUrl.pathname);

  // CORS for browser/React requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,x-admin-key");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.end();

  // 1. Get all shorts
  if (req.method === "GET" && parsedUrl.pathname === "/shorts") {
    const videos = getVideos();
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(videos));
  }

  // 2. Update caption for a video
  if (req.method === "POST" && matchUpdateCaption) {
    const filename = matchUpdateCaption[1];
    const body = await parseBody(req);
    const { caption } = body;
    if (typeof caption !== "string" || caption.length > 250) {
      res.writeHead(400);
      return res.end(JSON.stringify({ error: "Invalid caption" }));
    }
    let videos = getVideos();
    let video = videos.find(v => v.url.split("/").pop() === filename);
    if (!video) {
      res.writeHead(404); return res.end(JSON.stringify({ error: "Video not found" }));
    }
    video.caption = caption;
    saveVideos(videos);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ success: true }));
  }

  // 3. Upload (stub, implement as needed; requires multipart parser for real usage)
  if (req.method === "POST" && parsedUrl.pathname === "/upload") {
    // Example: check admin key
    if (req.headers['x-admin-key'] !== ADMIN_KEY) {
      res.writeHead(401);
      return res.end(JSON.stringify({ error: "Unauthorized" }));
    }
    // For demo, respond as successful. In production, parse multipart form to save video file!
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ success: true }));
  }

  // 4. Delete video (demo)
  if (req.method === "DELETE" && matchDelete) {
    if (req.headers['x-admin-key'] !== ADMIN_KEY) {
      res.writeHead(401); return res.end('Unauthorized');
    }
    const filename = matchDelete[1];
    let videos = getVideos();
    videos = videos.filter(v => v.url.split("/").pop() !== filename);
    saveVideos(videos);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ success: true }));
  }

  // 5. Not found
  res.writeHead(404);
  res.end('Not found');
});

// Render uses process.env.PORT
server.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
