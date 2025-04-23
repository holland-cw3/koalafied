import React, { useEffect, useState } from "react";
import Header from "../components/header";
import "../CSS/leaderboard.css";
import { Modal, Box, Typography } from "@mui/material";
import KoalaFooter from "../components/koalaFooter";

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
};

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

  function setKoalaListHelp(newList) {
    setKoalaList(newList);
    // // koalaListChanged();
  }

  useEffect(() => {
    load(
      setKoalaListHelp,
      koalaList,
      handleOpenNewKoala,
      "top level"
      // koalaListChanged
    );
  });

  async function load(
    setKoalaListHelp,
    printStr
    // koalaListChanged
  ) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://koala-fied-3.onrender.com/viewApplications",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        setKoalaListHelp(data.koalas);

        if (data.notes !== "") {
          document.getElementById("noteField").value = data.notes;
        }

        console.log("Origin: " + printStr);

        return;
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  }

  const [open, setOpen] = useState(false);

  const [koalaName, setKoalaName] = useState("");
  const [koalaDesc, setKoalaDesc] = useState("");
  const [koalaImage, setKoalaImage] = useState("");
  const [newKoala, setNewKoala] = useState(true);
  const [koalaList, setKoalaList] = useState([]);

  const koalaImages = importAll(
    require.context("../koalas", false, /\.(png|jpe?g|svg)$/)
  );
  function importAll(r) {
    let images = {};
    r.keys().forEach((key) => {
      images[key.replace("./", "")] = r(key);
    });
    return images;
  }

  const handleOpenNewKoala = (name, desc, filename, isNewKoala) => {
    setOpen(true);
    setKoalaName(name);
    setKoalaDesc(desc);
    setNewKoala(isNewKoala);
    setKoalaImage(koalaImages[filename]);
  };

  const handleClose = () => {
    setOpen(false);
    setNewKoala(true);
  };

  return (
    <div className="App">
      <Header isHomePage={false} />
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "18%",
            left: "33.5%",
            width: "27%",
            bgcolor: "#9f7e53",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            border: "1px solid black",
          }}
        >
          <div class="newKoala">
            <div class="modalHeader">
              {newKoala ? (
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  New Koala Unlockled!
                </Typography>
              ) : (
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Your Koala!
                </Typography>
              )}
              <button
                onClick={handleClose}
                className="closeModalBtn"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <h3>{koalaName}</h3>
            <div class="kDesc">
              <div class="centerr">
                <img src={koalaImage} className="koalaDesPic" alt="koala"></img>
                <p>{koalaDesc}</p>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      <KoalaFooter
        koalaList={koalaList}
        handleOpenNewKoala={handleOpenNewKoala}
        handleClose={handleClose}
      />
    </div>
  );
}

export default Leaderboard;
