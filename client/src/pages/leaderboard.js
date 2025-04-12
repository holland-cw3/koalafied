import React, { useEffect, useState } from "react";
import "../CSS/leaderboard.css";

function Leaderboard() {
  //temporary data for testing
  // const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   const testData = [
  //     { username: "user1", numApps: 3, points: 80 },
  //     { username: "user4", numApps: 4, points: 60 },
  //     { username: "user3", numApps: 2, points: 40 },
  //     { username: "user5", numApps: 1, points: 20 },
  //     { username: "user2", numApps: 5, points: 100 },
  //     { username: "user6", numApps: 3, points: 95 },
  //     { username: "user9", numApps: 4, points: 35 },
  //     { username: "user7", numApps: 2, points: 65 },
  //     { username: "user8", numApps: 1, points: 80 },
  //     { username: "user10", numApps: 5, points: 75 },
  //     { username: "user1", numApps: 3, points: 80 },
  //     { username: "user4", numApps: 4, points: 60 },
  //     { username: "user3", numApps: 2, points: 40 },
  //     { username: "user5", numApps: 1, points: 20 },
  //     { username: "user2", numApps: 5, points: 100 },
  //     { username: "user6", numApps: 3, points: 95 },
  //     { username: "user9", numApps: 4, points: 35 },
  //     { username: "user7", numApps: 2, points: 65 },
  //     { username: "user8", numApps: 1, points: 80 },
  //     { username: "user10", numApps: 5, points: 75 },
  //   ];
  //   const sortedData = testData.sort((a, b) => b.points - a.points); // Sort by points descending
  //   setUsers(sortedData);
  // }, []);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => b.points - a.points);
        setUsers(sorted);
      })
      .catch((err) => console.error("Fetch failed:", err));
  }, []);

  return (
    <>
      <div className="home-btn">
        <a href="/">Home</a>
      </div>
      <div className="leaderboard">
        <h2>Leaderboard 🏆</h2>
        <ol>
          {users
            .sort((a, b) => b.points - a.points)
            .slice(0, 10)
            .map((user, i) => {
              let rankDisplay = "";
              if (i === 0) rankDisplay = "🥇";
              else if (i === 1) rankDisplay = "🥈";
              else if (i === 2) rankDisplay = "🥉";
              else rankDisplay = `${i + 1}`;
              return (
                <li key={i} className="fade-in">
                  <span className="rank">{rankDisplay}</span>
                  <span className="user">{user.username}</span>
                  <span className="apps">{user.numApps} applications </span>
                  <span className="points">{user.points} pts</span>
                </li>
              );
            })}
        </ol>
      </div>
    </>

    // <table>
    //   <thead>
    //     <tr>
    //       <th>Rank</th>
    //       <th>Username</th>
    //       <th># of Applications</th>
    //       <th>Points</th>
    //     </tr>
    //   </thead>
    //   <tbody>
    //     {users.map((user, i) => {
    //       let medal = "";
    //       if (i === 0) medal = "🥇";
    //       else if (i === 1) medal = "🥈";
    //       else if (i === 2) medal = "🥉";

    //       return (
    //         <tr key={i} className="fade-in">
    //           <td>{medal || i + 1}</td>
    //           <td>{user.username}</td>
    //           <td>{user.numApps}</td>
    //           <td>{user.points}</td>
    //         </tr>
    //       );
    //     })}
    //   </tbody>
    // </table>
  );
}

export default Leaderboard;
