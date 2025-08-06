import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HOST = "https://shorts-t2dk.onrender.com";

export default function AllComments() {
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingIds, setDeletingIds] = useState(new Set());

  function authHeaders() {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : null;
  }

  const fetchComments = () => {
    const headers = authHeaders();
    if (!headers) {
      setStatus('Not authenticated');
      return;
    }
    setLoading(true);
    setStatus('');
    axios.get(HOST + '/admin/all-comments', { headers })
      .then(res => setComments(res.data))
      .catch(() => setStatus('Unable to load comments.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = (videoFilename, commentIdx) => {
    if (!window.confirm('Delete this comment?')) return;
    const headers = authHeaders();
    if (!headers) {
      setStatus('Not authenticated');
      return;
    }
    const id = `${videoFilename}-${commentIdx}`;
    setDeletingIds(prev => new Set(prev).add(id));
    setStatus('');
    axios.delete(`${HOST}/admin/comments/${videoFilename}/${commentIdx}`, { headers })
      .then(() => {
        setComments(c => c.filter(cmt => !(cmt.videoFilename === videoFilename && cmt.index === commentIdx)));
      })
      .catch(() => setStatus('Failed to delete comment.'))
      .finally(() => {
        setDeletingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      });
  };

  if (loading) return <div style={{ padding: 36 }}>Loading comments...</div>;

  return (
    <div style={{ padding: 36 }}>
      <h2>All Comments Moderation</h2>
      {status && <div style={{ color: 'red', marginBottom: 12 }}>{status}</div>}
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
          {comments.map(c => {
            const deleting = deletingIds.has(`${c.videoFilename}-${c.index}`);
            return (
              <tr key={`${c.videoFilename}_${c.index}`}>
                <td style={{ padding: 8, fontWeight: 500 }}>{c.videoCaption || c.videoFilename}</td>
                <td style={{ padding: 8 }}>{c.comment.text}</td>
                <td style={{ padding: 8 }}>{c.comment.name || "Anonymous"}</td>
                <td>
                  <button
                    disabled={deleting}
                    style={{
                      background: '#fe5555',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 5,
                      padding: '4px 12px',
                      cursor: deleting ? 'not-allowed' : 'pointer',
                      opacity: deleting ? 0.6 : 1,
                    }}
                    onClick={() => handleDelete(c.videoFilename, c.index)}
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
