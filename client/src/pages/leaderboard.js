import React, { use, useEffect, useState } from "react";
import "../CSS/leaderboard.css";

function Leaderboard() {
  //temporary data for testing
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const testData = [
      { username: "user1", rank: 1, numApps: 5, points: 100 },
      { username: "user2", rank: 2, numApps: 3, points: 80 },
      { username: "user3", rank: 3, numApps: 4, points: 60 },
      { username: "user4", rank: 4, numApps: 2, points: 40 },
      { username: "user5", rank: 5, numApps: 1, points: 20 },
    ];
    setUsers(testData);
  }, []);

  // const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   fetch("http://localhost:5001/api/leaderboard")
  //     .then((res) => res.json())
  //     .then((data) => setUsers(data))
  //     .catch((err) => console.error("Fetch failed:", err));
  // }, []);

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
