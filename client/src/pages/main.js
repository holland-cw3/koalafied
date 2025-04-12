import Footer from "../components/footer";
import Header from "../components/header";
import React, { useState } from "react";
import { useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import "../CSS/main.css";

async function load(setApps) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:5001/viewApplications", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.applications);
      setApps(data.applications);
      return;
    } else {
      alert("User not authenticated");
    }
  } catch (error) {
    console.error("Error submitting data:", error);
  }
}

async function submitNewApp(setApps) {
  let company = document.getElementById("company").value;
  let position = document.getElementById("position").value;
  let link = document.getElementById("link").value;
  let date = document.getElementById("date").value;
  let status = document.getElementById("status").value;

  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:5001/addApplication", {
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
    });

    if (response.ok) {
      load(setApps);
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

  // States for stats
  // Load this data from the server
  // When loading in user's notes used doc get el by id to add notes in
  // State wont allow editing
  const [username, setUsername] = useState("User");
  const [numKoalas, setNumKoalas] = useState(0);
  const [numApps, setNumApps] = useState(0);
  const [numInterviews, setNumInterviews] = useState(0);
  const [numOffers, setNumOffers] = useState(0);
  const [notes, setNotes] = useState("");

  // States for table
  const [selectedSorting, setSelectedSorting] = useState("newest");
  const [searchVal, setSearchVal] = useState("");
  const [statusVal, setStatusVal] = useState("all");

  // State for modal
  const [open, setOpen] = useState(false);

  const [apps, setApps] = useState([]);
  let ApplicationList = apps;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // list of user's applications
  // Get this from mongo db

  function updateStatus(company, position, selectId) {
    // Replace this with function to update the position status using the express endpoint

    let newStatus = document.getElementById(selectId).value;

    console.log(
      "application for " +
        position +
        " at " +
        company +
        " status is: " +
        newStatus
    );
  }

  // Connect to backend
  function saveNotes() {
    let notes = document.getElementById("noteField").value;

    console.log("Notes: " + notes);
  }

  switch (selectedSorting) {
    case "oldest":
      ApplicationList.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      break;
    case "newest":
      ApplicationList.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      break;
    default:
      ApplicationList.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }

  useEffect(() => {
    load(setApps);
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
                onClick={() => {
                  submitNewApp(setApps);
                  handleClose();
                }}
                className="line bg-blue-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </Box>
      </Modal>
      <div className="tableBody">
        <div className="stats">
          <h2>{username}</h2>
          <h3>Koala Count: {numKoalas}</h3>
          <h3 className="silver">Applications: {numApps}</h3>
          <h3 className="bronze">Interviews: {numInterviews}</h3>
          <h3 className="gold">Offers: {numOffers}</h3>
          <br></br>
          <h3>New Koalas:</h3>
        </div>
        <div className="table">
          <h4>
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
                <option value="Offer">Offer</option>
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
          <br></br>
          {/* Displaying records table based on filters */}
          <div className="overflow-x-auto max-w-full">
            <table className="mb-10 table-auto">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ApplicationList.filter(
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
                ).map((item) => (
                  <tr>
                    <td>{item.company}</td>
                    <td>
                      <a href={item.link} target="_blank">
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
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <button
                        onClick={() => {
                          updateStatus(
                            item.company,
                            item.position,
                            "status_" + item.company + item.position
                          );
                        }}
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
          ></textarea>
          <button className="saveButton" onClick={saveNotes}>
            Save
          </button>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
