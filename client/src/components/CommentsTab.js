import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HOST = 'https://shorts-t2dk.onrender.com';

export default function CommentsTab() {
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState('');

  const fetchComments = () => {
    axios.get(HOST + '/admin/all-comments', {
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    })
      .then(res => setComments(res.data))
      .catch(() => setStatus('Failed to load comments.'));
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = (videoFilename, commentIdx) => {
    if (!window.confirm('Delete this comment?')) return;
    axios.delete(`${HOST}/admin/comments/${videoFilename}/${commentIdx}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    })
      .then(() => {
        setComments(c => c.filter(cmt => !(cmt.videoFilename === videoFilename && cmt.index === commentIdx)));
      })
      .catch(() => setStatus('Failed to delete comment.'));
  };

  return (
    <div style={{ maxHeight: 500, overflowY: 'auto', backgroundColor: 'var(--card-bg)', borderRadius: 8, padding: 25 }}>
      <h2>Recent Comments</h2>
      {status && <p style={{ color: 'red' }}>{status}</p>}
      {comments.length === 0 && <p>No comments found.</p>}
      {comments.map(({ videoFilename, videoCaption, comment, index }) => (
        <div key={`${videoFilename}-${index}`} style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          padding: '15px 0'
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            backgroundColor: '#ddd', marginRight: 15, flexShrink: 0
          }} />
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontWeight: 600, marginBottom: 5
            }}>
                <span>{comment.name || 'Anonymous'}</span>
                <small style={{ fontSize: 12, color: '#888', fontWeight: 'normal' }}>
                  {/* You can add comment timestamp here if available */}
                </small>
            </div>
            <p style={{ color: '#555', marginBottom: 8 }}>{comment.text}</p>
            <div style={{ fontSize: 13 }}>
              <button
                onClick={() => handleDelete(videoFilename, index)}
                style={{ color: 'var(--primary-color)', cursor: 'pointer', border: 'none', background: 'transparent', padding: 0 }}
              >Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
