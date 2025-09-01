import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feed from "./Feed";
import VideoPlayer from "./VideoPlayer";
import AdminDashboard from "./AdminDashboard";
import About from "./About";
import About from "./Community";


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
