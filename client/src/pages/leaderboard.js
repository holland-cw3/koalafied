import React, { useEffect, useState } from "react";
import "../CSS/leaderboard.css";
// import treeVine from '../images/PixelatedTreeBranch.png';

// const leaderboardStyle = {
//   backgroundImage: `url(${treeVine}), url(${treeVine})`,
//   backgroundRepeat: 'no-repeat',
//   backgroundPosition: 'top center, bottom center',
//   backgroundSize: 'contain',
// };

import searcher from "../images/searcher.png";
const headerStyle = {
  backgroundImage: `url(${searcher})`,
}

function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://koala-fied-3.onrender.com/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => b.points - a.points);
        setUsers(sorted);
      })
      .catch((err) => console.error("Fetch failed:", err));
  }, []);

  return (
    <>
      
      <div className="home-btn" style={headerStyle}>
        <a href="/">Home</a>
      </div>
      <div className="leaderboard" style={headerStyle}>
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
                  <span className="apps2">{user.numApps} applications </span>
                  <span className="points">{user.points} pts</span>
                </li>
              );
            })}
        </ol>
      </div>
    </>

  );
}

export default Leaderboard;
