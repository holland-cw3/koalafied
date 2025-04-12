import React, { useEffect, useState } from "react";
import '../CSS/leaderboard.css'


function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/leaderboard")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Fetch failed:", err));
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Rank</th>
          <th># of Applications</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, i) => (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>{user.username}</td>
            <td>{user.rank}</td>
            <td>{user.numApps}</td>
            <td>{user.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Leaderboard;
