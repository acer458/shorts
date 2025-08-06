import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function CommentsTab({ host }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [deletingIds, setDeletingIds] = useState(new Set());

  // Authorization header with token
  function authHeaders() {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : null;
  }

  // Fetch all comments for all videos
  const fetchComments = () => {
    const headers = authHeaders();
    if (!headers) {
      setStatus('Not authenticated');
      return;
    }
    setLoading(true);
    setStatus('');
    axios.get(host + '/admin/all-comments', { headers })
      .then(res => setComments(res.data))
      .catch(() => setStatus('Unable to load comments.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, []);

  // Delete a comment by video filename and comment index
  const handleDelete = (videoFilename, commentIdx) => {
    if (!window.confirm('Delete this comment?')) return;

    const headers = authHeaders();
    if (!headers) {
      setStatus('Not authenticated');
      return;
    }

    const id = `${videoFilename}_${commentIdx}`;
    setDeletingIds(prev => new Set(prev).add(id));
    setStatus('');

    axios.delete(`${host}/admin/comments/${videoFilename}/${commentIdx}`, { headers })
      .then(() => {
        setComments(prev => prev.filter(cmt => !(cmt.videoFilename === videoFilename && cmt.index === commentIdx)));
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

  if (loading) return <div style={{ padding: 36 }}>Loading comments…</div>;

  return (
    <div style={{
      padding: 36,
      backgroundColor: 'white',
      borderRadius: 8,
      color: '#333',
      maxHeight: 600,
      overflowY: 'auto',
    }}>
      <h2>All Comments Moderation</h2>
      {status && <div style={{ color: 'red', marginBottom: 10 }}>{status}</div>}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f7fc' }}>
            <th style={{ padding: 8, borderBottom: '1px solid #ccc' }}>Video</th>
            <th style={{ padding: 8, borderBottom: '1px solid #ccc' }}>Comment</th>
            <th style={{ padding: 8, borderBottom: '1px solid #ccc' }}>User</th>
            <th style={{ padding: 8, borderBottom: '1px solid #ccc' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: 16, color: '#888' }}>
                No comments yet.
              </td>
            </tr>
          ) : (
            comments.map(c => {
              const deleting = deletingIds.has(`${c.videoFilename}_${c.index}`);
              return (
                <tr key={`${c.videoFilename}_${c.index}`} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 8, fontWeight: 'bold' }}>{c.videoCaption || c.videoFilename}</td>
                  <td style={{ padding: 8 }}>{c.comment.text}</td>
                  <td style={{ padding: 8 }}>{c.comment.name || 'Anonymous'}</td>
                  <td style={{ padding: 8 }}>
                    <button
                      onClick={() => handleDelete(c.videoFilename, c.index)}
                      disabled={deleting}
                      style={{
                        padding: '5px 12px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        cursor: deleting ? 'not-allowed' : 'pointer',
                        opacity: deleting ? 0.6 : 1,
                      }}
                    >
                      {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
