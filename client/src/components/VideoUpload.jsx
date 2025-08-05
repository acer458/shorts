// import { useState } from 'react';
// import ProgressBar from './ProgressBar';

// const VideoUpload = () => {
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [videos, setVideos] = useState([]);

//   const handleUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Simulate upload progress
//     const interval = setInterval(() => {
//       setUploadProgress(prev => {
//         if (prev >= 100) {
//           clearInterval(interval);
//           setVideos(prev => [...prev, file.name]);
//           return 0;
//         }
//         return prev + 10;
//       });
//     }, 500);
//   };

//   return (
//     <div className="video-upload">
//       <h2>Upload Video</h2>
//       <input 
//         type="file" 
//         accept="video/*" 
//         onChange={handleUpload} 
//         className="upload-input"
//       />
      
//       {uploadProgress > 0 && (
//         <ProgressBar progress={uploadProgress} />
//       )}

//       <div className="video-list">
//         <h3>Your Videos</h3>
//         {videos.map((video, index) => (
//           <div key={index} className="video-item">
//             {video}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default VideoUpload;
