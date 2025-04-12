import React, { use, useEffect, useState } from "react";
import "../CSS/leaderboard.css";

function Leaderboard() {
  //temporary data for testing
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const testData = [
      { username: "user1", numApps: 3, points: 80 },
      { username: "user4", numApps: 4, points: 60 },
      { username: "user3", numApps: 2, points: 40 },
      { username: "user5", numApps: 1, points: 20 },
      { username: "user2", numApps: 5, points: 100 },
    ];
    const sortedData = testData.sort((a, b) => b.points - a.points); // Sort by points descending
    setUsers(sortedData);
  }, []);

  // const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   fetch("http://localhost:5000/api/leaderboard")
  //     .then((res) => res.json())
  //     .then((data) => setUsers(data))
  //     .catch((err) => console.error("Fetch failed:", err));
  // }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Username</th>
          <th># of Applications</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, i) => {
          let medal = "";
          if (i === 0) medal = "🥇";
          else if (i === 1) medal = "🥈";
          else if (i === 2) medal = "🥉";

          return (
            <tr key={i} className="fade-in">
              <td>{medal || i + 1}</td>
              <td>{user.username}</td>
              <td>{user.numApps}</td>
              <td>{user.points}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Leaderboard;
