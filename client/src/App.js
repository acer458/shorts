import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feed from "./Feed";
import VideoPlayer from "./VideoPlayer";
import AdminDashboard from "./AdminDashboard";
import { AuthProvider } from "./context/AuthContext"; // <-- New: provide context

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main (random order, all videos) */}
          <Route path="/" element={<Feed />} />
          {/* Single video by filename (direct link) */}
          <Route path="/shorts/:filename" element={<VideoPlayer />} />
          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Optional: Not found route (uncomment if you have a 404 page) */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
