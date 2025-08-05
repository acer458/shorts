const UserAnalytics = () => {
  // Sample data - replace with real API calls
  const userStats = [
    { id: 1, name: 'John Doe', hoursWatched: 42 },
    { id: 2, name: 'Jane Smith', hoursWatched: 38 },
    { id: 3, name: 'Bob Johnson', hoursWatched: 25 },
  ];

  return (
    <div className="user-analytics">
      <h2>User Analytics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{userStats.length}</p>
        </div>
        <div className="stat-card">
          <h3>Most Active</h3>
          <p>{userStats.reduce((prev, current) => 
            (prev.hoursWatched > current.hoursWatched) ? prev : current
          ).name}</p>
        </div>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Hours Watched</th>
          </tr>
        </thead>
        <tbody>
          {userStats.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.hoursWatched}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserAnalytics;
