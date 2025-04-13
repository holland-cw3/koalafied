import Header from "../components/header";
import React, { useState, useRef } from "react";
import { useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import "../CSS/main.css";
const globalKoalaList = require("../koalas/koalas.json").koalas;

function animateKoalas(koalaObjList, koalaTimeoutRef) {
  // console.log("Animating!");
  // console.log(koalaObjList.length);
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  koalaObjList.forEach((koala) => {
    const elem = document.getElementById(koala.elemId);
    if (!elem) return;

    if (koala.sleepTime <= 0) {
      let shouldSleep = koala.walkTime <= 0;

      if (shouldSleep) {
        koala.sleepTime = Math.random() * 50 + 10;
      } else {
        const directionMultiplier = koala.direction === "left" ? -1 : 1;

        // Update horizontal position
        koala.leftPos += Math.random() * 4 * directionMultiplier;
        koala.leftPos = clamp(koala.leftPos, 5, 1000);
        // if at one end flip direction
        if (koala.leftPos === 1000 || koala.leftPos === 5) {
          if (koala.direction === "right") {
            koala.direction = "left";
          } else {
            koala.direction = "right";
          }
        }
        elem.style.left = `${koala.leftPos}px`;

        // Update vertical position
        let doUpDown = Math.random() * 10 >= 5;
        if (doUpDown) {
          koala.bottomPos += Math.random() * 2 - 1;
          koala.bottomPos = clamp(koala.bottomPos, 5, 10);
          elem.style.bottom = `${koala.bottomPos}px`;
        }

        let doRotation = Math.random() * 10 >= 3;
        if (doRotation)
          elem.style.transform = "rotate(" + (Math.random() * 4 - 2) + "deg)";

        koala.walkTime--;
      }
    } else {
      koala.sleepTime--;

      if (koala.sleepTime <= 0) {
        koala.walkTime = Math.random() * 150 + 25;
        let changeDirection = Math.random() * 100 > 90;
        if (changeDirection) {
          if (koala.direction === "left") {
            koala.direction = "right";
          } else {
            koala.direction = "left";
          }
        }
      }

      let doRotation = Math.random() * 10 >= 8;
      if (doRotation)
        elem.style.transform = "rotate(" + (Math.random() * 4 - 2) + "deg)";
    }
  });

  clearTimeout(koalaTimeoutRef.current);
  koalaTimeoutRef.current = setTimeout(() => {
    animateKoalas(koalaObjList, koalaTimeoutRef);
  }, 100);
}

function compareKoalaLists(newList, oldList) {
  let newKoalas = [];
  for (let i = 0; i < newList.length; i++) {
    if (i >= oldList.length) newKoalas.push(newList[i]);
  }
  return newKoalas;
}

function getKoalaById(id) {
  // console.log("Koala list length: " + globalKoalaList.length);
  for (let i = 0; i < globalKoalaList.length; i++) {
    // console.log(globalKoalaList[i].id);
    if (id === globalKoalaList[i].id) return globalKoalaList[i];
  }
  return { name: "", description: "" };
}

async function load(
  setApps,
  setUsername,
  setNumKoalas,
  setNumApps,
  setNumInterviews,
  setNumOffers,
  setKoalaListHelp,
  koalaList,
  handleOpenNewKoala,
  koalaTimeout,
  koalaObjList,
  statusTimeout,
  printStr
  // koalaListChanged
) {
  const token = localStorage.getItem("token");

  try {
    // const response = await fetch("https://koala-fied-3.onrender.com/viewApplications", {
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
      setApps(data.applications);
      setUsername(data.username);
      // Replace with length of list of koalas
      setNumKoalas(data.koalas.length);
      setNumApps(data.numApps);
      setNumInterviews(data.numInterviews);
      setNumOffers(data.numOffers);

      // Check if the users has received any new koala's
      let newKoalas = compareKoalaLists(data.koalas, koalaList);
      if (newKoalas.length !== 0 && koalaList.length !== 0) {
        // Update how to display a new koala
        console.log("A NEW KOALA!!");

        for (let i = 0; i < newKoalas.length; i++) {
          let newKoala = getKoalaById(newKoalas[i]);

          handleOpenNewKoala(
            newKoala.name,
            newKoala.description,
            newKoala.filename,
            true
          );

          console.log(
            "I just unlocked the " + newKoala.name + ", " + newKoala.description
          );
        }
      }

      setKoalaListHelp(data.koalas);

      if (data.notes !== "") {
        document.getElementById("noteField").value = data.notes;
      }

      console.log("Origin: " + printStr);

      clearTimeout(statusTimeout);
      statusTimeout = setTimeout(() => {
        let applications = data.applications;
        for (let i = 0; i < applications.length; i++) {
          let item = applications[i];
          document.getElementById(
            "status_" + item.company + item.position
          ).value = item.status;
          console.log("Changing status");
        }
      }, 300);

      return;
    }
  } catch (error) {
    console.error("Error submitting data:", error);
  }
}

async function submitNewApp() {
  let company = document.getElementById("company").value;
  let position = document.getElementById("position").value;
  let link = document.getElementById("link").value;
  let date = document.getElementById("date").value;
  let status = document.getElementById("status").value;

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      "https://koala-fied-3.onrender.com/addApplication",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company: company,
          position: position,
          link: link,
          date: date,
          status: status,
        }),
      }
    );

    if (response.ok) {
      return true;
    } else {
      alert("User not authenticated");
      return false;
    }
  } catch (error) {
    console.error("Error submitting data:", error);
    return false;
  }
}

async function saveNotes(setNotes) {
  const token = localStorage.getItem("token");
  let notes = document.getElementById("noteField").value;

  try {
    const response = await fetch(
      "https://koala-fied-3.onrender.com/updateNotes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          notes: notes,
        }),
      }
    );

    if (response.ok) {
      // const data = await response.json();
      // console.log(data.applications);
      // setNotes(data.applications);
      return;
    } else {
      alert("User not authenticated");
    }
  } catch (error) {
    console.error("Error submitting data:", error);
  }
}

function App() {
  if (!localStorage.getItem("token")) {
    window.location.href = "/login";
  }

  function inKoalaList(id, list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) return true;
    }
    return false;
  }

  // States for table
  const [selectedSorting, setSelectedSorting] = useState("newest");
  const [searchVal, setSearchVal] = useState("");
  const [statusVal, setStatusVal] = useState("all");

  // State for modal
  const [open, setOpen] = useState(false);
  const [modalAddingApp, setModalAddingApp] = useState(true);

  const [koalaName, setKoalaName] = useState("");
  const [koalaDesc, setKoalaDesc] = useState("");
  const [koalaImage, setKoalaImage] = useState("");
  const [newKoala, setNewKoala] = useState(true);

  const [apps, setApps] = useState([]);

  // States for stats
  const [username, setUsername] = useState("User");
  const [numKoalas, setNumKoalas] = useState(0);
  const [koalaList, setKoalaList] = useState([]);
  const [numApps, setNumApps] = useState(0);
  const [numInterviews, setNumInterviews] = useState(0);
  const [numOffers, setNumOffers] = useState(0);

  function setKoalaListHelp(newList) {
    setKoalaList(newList);
    // // koalaListChanged();
  }

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

  const [koalaObjList, setKoalaObjList] = useState([]);

  let koalaTimeout = useRef(null);
  let statusTimeout = useRef(null);

  useEffect(() => {
    const newKoalas = [];

    koalaList.forEach((koalaId, i) => {
      const koala = getKoalaById(koalaId);

      if (!koalaObjList.some((k) => k.id === koala.id)) {
        console.log("Adding koala!");
        newKoalas.push({
          id: koala.id,
          desc: koala.description,
          name: koala.name,
          filename: koala.filename,
          elemId: koala.id + "-" + i,
          leftPos: Math.random() * 1000,
          bottomPos: Math.random() * 10,
          direction: Math.random() < 0.5 ? "left" : "right",
          zIndex: Math.random() * 100 + 50,
          src: require("../koalas/" + koala.filename),
          sleepTime: 0,
          walkTime: Math.random() * 150 + 50,
        });
      }
    });

    if (newKoalas.length > 0) {
      setKoalaObjList((prev) => {
        const combined = [...prev, ...newKoalas];
        animateKoalas(combined, koalaTimeout);
        return combined;
      });
    } else {
      animateKoalas(koalaObjList, koalaTimeout);
    }
  }, [koalaList, koalaObjList]);

  const handleOpen = () => {
    setOpen(true);
    setModalAddingApp(true);
  };

  const handleOpenNewKoala = (name, desc, filename, isNewKoala) => {
    setOpen(true);
    setModalAddingApp(false);
    setKoalaName(name);
    setKoalaDesc(desc);
    setNewKoala(isNewKoala);
    setKoalaImage(koalaImages[filename]);
  };

  const handleClose = () => {
    setOpen(false);
    setModalAddingApp(true);
    setNewKoala(true);
  };

  // list of user's applications
  // Get this from mongo db

  async function updateStatus(company, position, selectId) {
    let newStatus = document.getElementById(selectId).value;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://koala-fied-3.onrender.com/updateStatus",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user: username,
            company: company,
            position: position,
            status: newStatus,
          }),
        }
      );

      await new Promise((res) => setTimeout(res, 300)); // short delay
      await load(
        setApps,
        setUsername,
        setNumKoalas,
        setNumApps,
        setNumInterviews,
        setNumOffers,
        setKoalaListHelp,
        koalaList,
        handleOpenNewKoala,
        koalaTimeout,
        koalaObjList,
        statusTimeout,
        "update status"
        // koalaListChanged
      );

      if (response.ok) {
        return true;
      } else {
        alert("User not authenticated");
        return false;
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      return false;
    }
  }

  useEffect(() => {
    load(
      setApps,
      setUsername,
      setNumKoalas,
      setNumApps,
      setNumInterviews,
      setNumOffers,
      setKoalaListHelp,
      koalaList,
      handleOpenNewKoala,
      koalaTimeout,
      koalaObjList,
      statusTimeout,
      "top level"
      // koalaListChanged
    );
  }, []);

  useEffect(() => {
    // // koalaListChanged();
  }, [koalaList]);

  switch (selectedSorting) {
    case "oldest":
      try {
        apps.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      } catch {}
      break;
    case "newest":
      try {
        apps.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      } catch {}
      break;
    default:
      try {
        apps.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      } catch {}
  }

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveNotes(); // Save notes before the page is closed
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="App">
      <Header />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {modalAddingApp ? (
          // Display the add application modal
          <Box
            sx={{
              position: "absolute",
              top: "25%",
              left: "22.5%",
              width: "50%",
              height: "40vh",
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",

              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add A New Application
              </Typography>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-black text-xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>

              {/* form inputs here */}
              <div id="modal-modal-description">
                <div className="line mb-2">
                  <label htmlFor="company">Company:</label>
                  <input
                    type="text"
                    id="company"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="line mb-2">
                  <label htmlFor="position">Position:</label>
                  <input
                    type="text"
                    id="position"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="line mb-2">
                  <label htmlFor="link">Link:</label>
                  <input
                    type="url"
                    id="link"
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="line mb-2">
                  <label htmlFor="date">Date:</label>
                  <input
                    type="date"
                    id="date"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="line mb-4">
                  <label htmlFor="status">Status:</label>
                  <select
                    id="status"
                    className="w-full p-2 border rounded"
                    defaultValue="Applied"
                    required
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interviewed">Interviewed</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <button
                  type="submit"
                  onClick={async () => {
                    const success = await submitNewApp();
                    if (success) {
                      handleClose();
                      await new Promise((res) => setTimeout(res, 300)); // short delay
                      await load(
                        setApps,
                        setUsername,
                        setNumKoalas,
                        setNumApps,
                        setNumInterviews,
                        setNumOffers,
                        setKoalaListHelp,
                        koalaList,
                        handleOpenNewKoala,
                        koalaTimeout,
                        koalaObjList,
                        statusTimeout,
                        "submit app"
                        // koalaListChanged
                      );
                    }
                  }}
                  className="line bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </div>
          </Box>
        ) : (
          // Display the new koala modal
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
              border:'1px solid black'
            }}
          >
            <div class='newKoala'>
              <div class='modalHeader'>
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
              <div class='kDesc'>
              
              <div class='centerr'>
              <img src={koalaImage} className="koalaDesPic" alt='koala'></img>
              <p>{koalaDesc}</p>

              </div>
              </div>
             
            </div>
          </Box>
        )}
      </Modal>

      <div className="tableBody">
        <div className="stats">
          <div className="stats2">
            <h2>
              <span class="underline">Stats For:</span>
              <span class="us">{username}</span>
            </h2>
            <h3 class="kCount">Koala Count: {numKoalas}</h3>
            <h3 className="silver">Applications: {numApps}</h3>
            <h3 className="bronze">Interviews: {numInterviews}</h3>
            <h3 className="gold">Offers: {numOffers}</h3>
            <h3 className="kCount">New Koalas:</h3>
          </div>
        </div>
        <div className="table">
          <h4 class="sorter">
            <span className="line">
              Status:{" "}
              <select
                value={statusVal}
                onChange={(e) => {
                  setStatusVal(e.target.value);
                }}
              >
                <option value="all">All</option>
                <option value="Applied">Applied</option>
                <option value="Interviewed">Interviewed</option>
                <option value="Offered">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </span>
            <span className="line">
              Search:{" "}
              <input
                type="text"
                className="w-auto px-2 py-0 m-0 bg-white"
                placeholder="Search company or position name"
                onChange={(e) => setSearchVal(e.target.value)}
              ></input>{" "}
            </span>
            <span className="line">
              Sort By:{" "}
              <select
                value={selectedSorting}
                onChange={(e) => setSelectedSorting(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </span>
            <button className="line" onClick={handleOpen}>
              Add Application
            </button>
          </h4>
          <div className="appTable overflow-x-auto max-w-full">
            {(apps.length > 0 ?
            <table className="table-auto apps">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {apps
                  .filter(
                    (item) =>
                      (searchVal === "" ||
                        item.company
                          .toLowerCase()
                          .includes(searchVal.toLowerCase()) ||
                        item.position
                          .toLowerCase()
                          .includes(searchVal.toLowerCase()) ||
                        item.meet) &&
                      (statusVal === "all" || statusVal === item.status)
                  )
                  .map((item) => (
                    <tr>
                      <td>{item.company}</td>
                      <td>
                        <a
                          href={item.linkString}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.position}
                        </a>
                      </td>
                      <td>{item.date}</td>
                      <td>
                        <select
                          id={"status_" + item.company + item.position}
                          defaultValue={item.status}
                          className="statusSelect"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Interviewed">Interviewed</option>
                          <option value="Offered">Offer</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        <button
                          onClick={async () => {
                            updateStatus(
                              item.company,
                              item.position,
                              "status_" + item.company + item.position
                            );
                          }}
                          class="updateBtn"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table> : <div class='noApps'>
          
            Nothing to see here! Start Applying!
            
            </div>)}
          </div>
        </div>
        <div className="notes">
          <textarea
            id="noteField"
            placeholder="Write any notes, reminders, or contact information here"
            onBlur={() => saveNotes()}
          ></textarea>
        </div>
        <div className="footer">
          <div className="koalas">
            {koalaObjList.map((item) => (
              <img
                id={item.elemId}
                className="koalaSprite"
                src={item.src}
                alt={item.name}
                style={{
                  left: item.leftPos,
                  bottom: item.bottomPos,
                  zIndex: item.zIndex,
                }}
                onClick={() =>
                  handleOpenNewKoala(item.name, item.desc, item.filename, false)
                }
              ></img>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
