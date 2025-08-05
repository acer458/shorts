import React, { useEffect, useState } from 'react';
import axios from "axios";
const HOST = "https://shorts-t2dk.onrender.com";

export default function UserStats() {
  const [usersCount, setUsersCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    axios.get(HOST + '/users/count')
      .then(res => setUsersCount(res.data.count))
      .catch(() => setUsersCount(0));

    axios.get(HOST + '/users/leaderboard')
      .then(res => setLeaderboard(res.data))
      .catch(() => setLeaderboard([]));
  }, []);

  return (
    <div style={{ padding: 18 }}>
      <h2>Total Registered Users</h2>
      <p style={{ fontSize: 38, fontWeight: 800, color: "#2563eb" }}>{usersCount}</p>
      <h2 style={{ marginTop: 30 }}>Top Watchers</h2>
      <ol>
        {leaderboard.map(user => (
          <li key={user.username} style={{ margin: "0 0 8px 0", fontSize: 18 }}>
            <span style={{ fontWeight: 600, color: "#225" }}>{user.username}</span>
            <span style={{ marginLeft: 12, color: "#16b900" }}>{(Math.round(user.watchHours * 10) / 10)} hours</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
