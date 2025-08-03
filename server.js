// const http = require('http');
// const fs = require('fs');
// const path = require('path');
// const url = require('url');

// // Location of your videos.json "database"
// const VIDEOS_JSON = path.join(__dirname, 'videos.json');
// const ADMIN_KEY = 'Hindi@1234';

// // Helpers
// function getVideos() {
//   if (!fs.existsSync(VIDEOS_JSON)) return [];
//   return JSON.parse(fs.readFileSync(VIDEOS_JSON, 'utf-8') || '[]');
// }
// function saveVideos(videos) {
//   fs.writeFileSync(VIDEOS_JSON, JSON.stringify(videos, null, 2), 'utf-8');
// }
// function parseBody(req) {
//   return new Promise((resolve) => {
//     let body = '';
//     req.on('data', chunk => { body += chunk; });
//     req.on('end', () => {
//       try { resolve(JSON.parse(body)); }
//       catch { resolve({}); }
//     });
//   });
// }

// const server = http.createServer(async (req, res) => {
//   const parsedUrl = url.parse(req.url, true);

//   const matchUpdateCaption = /^\/shorts\/([^/]+)\/update_caption$/i.exec(parsedUrl.pathname);
//   const matchDelete = /^\/delete\/([^/]+)$/i.exec(parsedUrl.pathname);

//   // CORS for FE requests
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type,x-admin-key");
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
//   if (req.method === "OPTIONS") return res.end();

//   // 1. Get all videos
//   if (req.method === "GET" && parsedUrl.pathname === "/shorts") {
//     const videos = getVideos();
//     res.writeHead(200, { "Content-Type": "application/json" });
//     return res.end(JSON.stringify(videos));
//   }

//   // 2. Update caption (case-insensitive matching!)
//   if (req.method === "POST" && matchUpdateCaption) {
//     const filename = matchUpdateCaption[1];
//     const body = await parseBody(req);
//     const { caption } = body;

//     if (typeof caption !== "string" || caption.length > 250) {
//       res.writeHead(400);
//       return res.end(JSON.stringify({ error: "Invalid caption" }));
//     }

//     let videos = getVideos();
//     // Use case-insensitive comparison for filename!
//     let video = videos.find(v =>
//       v.url && v.url.split('/').pop().toLowerCase() === filename.toLowerCase()
//     );

//     if (!video) {
//       res.writeHead(404);
//       return res.end(JSON.stringify({ error: "Video not found" }));
//     }
//     video.caption = caption;
//     saveVideos(videos);
//     res.writeHead(200, { "Content-Type": "application/json" });
//     return res.end(JSON.stringify({ success: true }));
//   }

//   // 3. Upload (STUB: You should implement real file uploads in prod)
//   if (req.method === "POST" && parsedUrl.pathname === "/upload") {
//     if (req.headers['x-admin-key'] !== ADMIN_KEY) {
//       res.writeHead(401);
//       return res.end(JSON.stringify({ error: "Unauthorized" }));
//     }
//     // Respond success for now - replace with real upload/save!
//     res.writeHead(200, { "Content-Type": "application/json" });
//     return res.end(JSON.stringify({ success: true }));
//   }

//   // 4. Delete by filename
//   if (req.method === "DELETE" && matchDelete) {
//     if (req.headers['x-admin-key'] !== ADMIN_KEY) {
//       res.writeHead(401);
//       return res.end('Unauthorized');
//     }
//     const filename = matchDelete[1];
//     let videos = getVideos();
//     videos = videos.filter(v =>
//       v.url && v.url.split("/").pop().toLowerCase() !== filename.toLowerCase()
//     );
//     saveVideos(videos);
//     res.writeHead(200, { "Content-Type": "application/json" });
//     return res.end(JSON.stringify({ success: true }));
//   }

//   // Default: Not found
//   res.writeHead(404);
//   res.end('Not found');
// });

// server.listen(process.env.PORT || 3000, () => {
//   console.log(`Server running on port ${process.env.PORT || 3000}`);
// });
