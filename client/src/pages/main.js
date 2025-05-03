import Header from "../components/header";
import { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, MenuItem } from "@mui/material";

/* -------- Components  -------- */
import StatNotes from "../components/stats"; // Statistics and Quests
import KoalaFooter from "../components/koalaFooter";

import "../CSS/main.css";
const globalKoalaList = require("../koalas/koalas.json").koalas;

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
  statusTimeout,
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

async function submitNewApp(status) {
  let company = document.getElementById("company").value;
  let position = document.getElementById("position").value;
  let link = document.getElementById("link").value;
  let date = document.getElementById("date").value;
  let statusVal = status;

  console.log("Status is: " + statusVal);

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
          status: statusVal,
        }),
      }
    );

    if (response.ok) {
      await load();
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
      return;
    } else {
      alert("User not authenticated");
    }
  } catch (error) {
    console.error("Error submitting data:", error);
  }
}

export default function App() {
  if (!localStorage.getItem("token")) {
    window.location.href = "/";
  }

  // States for table
  const [selectedSorting, setSelectedSorting] = useState("newest");
  const [searchVal, setSearchVal] = useState("");
  const [statusVal, setStatusVal] = useState("all");

  // for add app
  const [status, setStatus] = useState("Applied");

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

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);

  function setKoalaListHelp(newList) {
    setKoalaList(newList);
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
        "update status"
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
      "top level"
    );
  });

  useEffect(() => {}, [koalaList]);

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
      <Header isHomePage={true} />
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
              top: "13%",
              left: "33.5%",
              width: "27%",
              bgcolor: "#9f7e53",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              border: "1px solid black",
            }}
          >
            <div className="flex justify-center items-center mb-4">
              <div class="modalHeader">
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  className="text-gray-700 font-bold"
                >
                  Add A New Application
                </Typography>

                <button
                  onClick={handleClose}
                  className="closeModalBtn"
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>

              {/* form inputs here */}
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
                  className="hideOutline"
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
                  className="hideOutline"
                  defaultValue={date}
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
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
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
                  class="loginBtn"
                  onClick={async () => {
                    const success = await submitNewApp(status);
                    if (success) {
                      handleClose();
                      await new Promise((res) => setTimeout(res, 500)); // short delay
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
                        "submit app"
                        // koalaListChanged
                      );
                    }
                  }}
                  className="submitButton line bg-blue-500 text-white px-4 py-2 rounded"
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
              border: "1px solid black",
            }}
          >
            <div class="newKoala">
              <div class="modalHeader">
                {newKoala ? (
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    New Koala Unlockled!
                  </Typography>
                ) : (
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
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
                  <img
                    src={koalaImage}
                    className="koalaDesPic"
                    alt="koala"
                  ></img>
                  <p>{koalaDesc}</p>
                </div>
              </div>
            </div>
          </Box>
        )}
      </Modal>

      <div className="tableBody">
        <StatNotes
          username={username}
          numApps={numApps}
          numInterviews={numInterviews}
          numOffers={numOffers}
          numKoalas={numKoalas}
        />

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
          <div className="appTable ">
            {apps.length > 0 ? (
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
              </table>
            ) : (
              <div class="noApps">Nothing to see here! Start Applying!</div>
            )}
          </div>
        </div>
        <div className="notes">
          <textarea
            id="noteField"
            placeholder="Write any notes, reminders, or contact information here"
            onBlur={() => saveNotes()}
          ></textarea>
        </div>
        <KoalaFooter
          koalaList={koalaList}
          handleOpenNewKoala={handleOpenNewKoala}
          handleClose={handleClose}
        />
      </div>
    </div>
  );
}
