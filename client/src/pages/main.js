// import Footer from "../components/footer";
import Header from "../components/header";
import React, { useState, useRef } from "react";
import { useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import "../CSS/main.css";
const globalKoalaList = require("../koalas/koalas.json").koalas;

function animateKoalas(koalaObjList, koalaTimeoutRef) {
  console.log("Animating!");
  console.log(koalaObjList.length);
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  koalaObjList.forEach((koala) => {
    const elem = document.getElementById(koala.elemId);
    if (!elem) return;

    const directionMultiplier = koala.direction === "left" ? -1 : 1;

    // Update horizontal position
    koala.leftPos += Math.random() * 25 * directionMultiplier;
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
    koala.topPos += Math.random() * 5 - 2.5;
    koala.topPos = clamp(koala.topPos, 5, 10);
    elem.style.top = `${koala.topPos}px`;

    elem.style.transform = "rotate(" + (Math.random() * 5 - 2.5) + ")";
  });

  clearTimeout(koalaTimeoutRef.current);
  koalaTimeoutRef.current = setTimeout(() => {
    animateKoalas(koalaObjList, koalaTimeoutRef);
  }, 500);
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
    const response = await fetch("http://localhost:5001/viewApplications", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

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

          handleOpenNewKoala(newKoala.name, newKoala.description);

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
    } else {
      alert("User not authenticated");
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
      // "https://koala-fied-3.onrender.com/addApplication",
      "http://localhost:5001/addApplication",
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
      // "https://koala-fied-3.onrender.com/updateNotes",
      "http://localhost:5001/updateNotes",
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
  const [koalaDesc, setkoalaDesc] = useState("");

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
          filename: "../koalas/" + koala.filename,
          elemId: koala.id + "-" + i,
          leftPos: Math.random() * 1000,
          topPos: Math.random() * 10,
          direction: Math.random() < 0.5 ? "left" : "right",
          src: require("../koalas/" + koala.filename),
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

  const handleOpenNewKoala = (name, desc) => {
    setOpen(true);
    setModalAddingApp(false);
    setKoalaName(name);
    setkoalaDesc(desc);
  };

  const handleClose = () => {
    setOpen(false);
    setModalAddingApp(true);
  };

  // list of user's applications
  // Get this from mongo db

  async function updateStatus(company, position, selectId) {
    let newStatus = document.getElementById(selectId).value;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        // "https://koala-fied-3.onrender.com/updateStatus",
        "http://localhost:5001/updateStatus",
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
              bgcolor: "background.paper",
              // display: "flex",

              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <div className="flex justify-center items-center mb-4">
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                className="text-gray-700 font-bold"
              >
                Add A New Application
              </Typography>
            </div>
            {/* {form inputs here} */}
            <div id="modal-modal-description">
              <TextField
                id="company"
                label="Company"
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 1 }}
                InputProps={{
                  style: {
                    backgroundColor: "#d2b48c",
                    padding: "10px",
                    borderRadius: "5px",
                    boxShadow: "2px 2px",
                  },
                }}
              />

              <TextField
                id="position"
                label="Position"
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 1 }}
                InputProps={{
                  style: {
                    backgroundColor: "#d2b48c",
                    padding: "10px",
                    borderRadius: "5px",
                    boxShadow: "2px 2px",
                  },
                }}
              />

              <TextField
                id="link"
                label="Link"
                variant="outlined"
                fullWidth
                sx={{ mb: 1 }}
                InputProps={{
                  style: {
                    backgroundColor: "#d2b48c",
                    padding: "10px",
                    borderRadius: "5px",
                    boxShadow: "2px 2px",
                  },
                }}
              />

              <TextField
                id="date"
                label="Date"
                type="date"
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 1 }}
                InputLabelProps={{
                  shrink: true, // Ensures the label stays above the input
                }}
                InputProps={{
                  style: {
                    backgroundColor: "#d2b48c",
                    padding: "10px",
                    borderRadius: "5px",
                    boxShadow: "2px 2px",
                  },
                }}
              />
              <TextField
                id="status"
                label="Status"
                variant="outlined"
                select
                fullWidth
                defaultValue="Applied"
                required
                sx={{ mb: 1 }}
                InputProps={{
                  style: {
                    backgroundColor: "#d2b48c",
                    padding: "10px",
                    borderRadius: "5px",
                    boxShadow: "2px 2px",
                  },
                }}
              >
                <MenuItem value="Applied">Applied</MenuItem>
                <MenuItem value="Interviewed">Interviewed</MenuItem>
                <MenuItem value="Offered">Offered</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </TextField>
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
          </Box>
        ) : (
          // Display the new koala modal
          <Box
            sx={{
              position: "absolute",
              top: "25%",
              left: "22.5%",
              width: "50%",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                New Koala Unlockled!
              </Typography>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-black text-xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
              <h3>{koalaName}</h3>
              <h4>{koalaDesc}</h4>
            </div>
          </Box>
        )}
      </Modal>

      <div className="tableBody">
        <div className="stats">
          <div className="stats2">
            <h2>Stats For: {username}</h2>
            <h3 className="kCount">Koala Count: {numKoalas}</h3>
            <h3 className="silver">Applications: {numApps}</h3>
            <h3 className="bronze">Interviews: {numInterviews}</h3>
            <h3 className="gold">Offers: {numOffers}</h3>
            <br></br>
            <h3 className="kCount">New Koalas:</h3>
          </div>
        </div>
        <div className="table">
          <h4 className="sorter">
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
          {/* Displaying records table based on filters */}
          <div className="overflow-x-auto max-w-full">
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
            </table>
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
                style={{ left: item.leftPos, top: item.topPos }}
              ></img>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
