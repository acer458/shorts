import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feed from "./Feed";
import VideoPlayer from "./VideoPlayer";
import AdminDashboard from "./AdminDashboard";
import About from "./pages/About";  // Correct path here

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/shorts/:filename" element={<VideoPlayer />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Feed />} /> {/* Correct catch-all path */}
      </Routes>
    </BrowserRouter>
  );
}
