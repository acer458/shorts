import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HOST = "https://shorts-t2dk.onrender.com";

export default function AllComments() {
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState('');

  function authHeaders() {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  const fetchComments = () => {
    axios.get(HOST + '/admin/all-comments', { headers: authHeaders() })
      .then(res => setComments(res.data))
      .catch(() => setStatus('Unable to load comments.'));
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = (videoFilename, commentIdx) => {
    if (!window.confirm('Delete this comment?')) return;
    axios.delete(`${HOST}/admin/comments/${videoFilename}/${commentIdx}`, { headers: authHeaders() })
      .then(() => {
        setComments(prev => prev.filter(cmt => !(cmt.videoFilename === videoFilename && cmt.index === commentIdx)));
      })
      .catch(() => setStatus('Failed to delete comment.'));
  };

  return (
    <div style={{ padding: 36 }}>
      <h2>All Comments Moderation</h2>
      {status && <div style={{ color: 'red' }}>{status}</div>}
      <table style={{ width: '100%', background: '#fff', borderRadius: 8, marginTop: 24, fontSize: 15 }}>
        <thead>
          <tr style={{ background: '#f5f7fc' }}>
            <th style={{ padding: 8 }}>Video</th>
            <th style={{ padding: 8 }}>Comment</th>
            <th style={{ padding: 8 }}>User</th>
            <th style={{ padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', color: '#888', padding: 16 }}>
                No comments yet.
              </td>
            </tr>
          )}
          {comments.map(c => (
            <tr key={c.videoFilename + "_" + c.index}>
              <td style={{ padding: 8, fontWeight: 500 }}>{c.videoCaption || c.videoFilename}</td>
              <td style={{ padding: 8 }}>{c.comment.text}</td>
              <td style={{ padding: 8 }}>{c.comment.name || "Anonymous"}</td>
              <td>
                <button
                  style={{ background: '#fe5555', color: '#fff', border: 'none', borderRadius: 5, padding: '4px 12px', cursor: 'pointer' }}
                  onClick={() => handleDelete(c.videoFilename, c.index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
