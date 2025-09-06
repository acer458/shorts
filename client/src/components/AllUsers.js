import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HOST = "https://shorts-t2dk.onrender.com";

export default function AllUsers({ authHeaders }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(HOST + "/admin/users", {
                    headers: authHeaders()
                });
                setUsers(res.data);
            } catch (err) {
                setError("Failed to fetch user data. Check your admin login.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [authHeaders]);

    const handleDownload = () => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            alert("Admin token not found. Please log in again.");
            return;
        }

        window.open(HOST + "/admin/users/download-csv", "_blank");
    };

    if (loading) {
        return <div className="loading-state">Loading user data...</div>;
    }

    if (error) {
        return <div className="error-state">{error}</div>;
    }

    return (
        <div className="tab-content">
            <div className="content-header">
                <h1>Registered Users</h1>
                <div className="header-actions">
                    <button className="download-btn" onClick={handleDownload}>
                        Download CSV
                    </button>
                    <div className="stats-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {users.length} Users
                    </div>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Signed Up Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{new Date(user.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <style>{`
                /* New styles for the users table and buttons */
                .tab-content {
                    padding: 24px 32px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto;
                    background: #f1f5f9;
                }
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .data-table th, .data-table td {
                    padding: 15px;
                    text-align: left;
                    border-bottom: 1px solid #e2e8f0;
                }
                .data-table th {
                    background: #f8fafc;
                    font-size: 13px;
                    font-weight: 700;
                    color: #475569;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .data-table tr:hover {
                    background: #fafbff;
                }
                .data-table td {
                    font-size: 14px;
                    color: #334155;
                }
                .download-btn {
                    background: #10b981;
                    color: white;
                    border: none;
                    padding: 10px 18px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .download-btn:hover {
                    background: #047857;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
                }
                .stats-badge svg {
                    color: #10b981;
                }
            `}</style>
        </div>
    );
}
