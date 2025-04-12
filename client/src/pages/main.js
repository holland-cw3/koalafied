import Footer from "../components/footer";
import Header from "../components/header";
import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import "../CSS/main.css";

function App() {
  // States for stats
  const [username, setUsername] = useState("User");
  const [numKoalas, setNumKoalas] = useState(0);
  const [numApps, setNumApps] = useState(0);
  const [numInterviews, setNumInterviews] = useState(0);
  const [numOffers, setNumOffers] = useState(0);

  // States for table
  const [selectedSorting, setSelectedSorting] = useState("newest");
  const [searchVal, setSearchVal] = useState("");
  const [statusVal, setStatusVal] = useState("all");

  // State for modal
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // list of user's applications
  // Get this from mongo db
  let ApplicationList = [
    {
      company: "GeoCam",
      position: "SWE Intern",
      link: "https://geocam.app/link",
      date: "4/19/2025",
      status: "Applied",
    },
    {
      company: "Club Running",
      position: "Webmaster",
      link: "https://umdclubrunning.com",
      date: "4/05/2025",
      status: "Interviewed",
    },
  ];

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

  function submitNewApp() {
    let company = document.getElementById("company").value;
    let position = document.getElementById("position").value;
    let link = document.getElementById("link").value;
    let date = document.getElementById("date").value;
    let status = document.getElementById("status").value;

    console.log(
      `Adding new application: Company: ${company} Position: ${position} Link: ${link} Date: ${date} Status: ${status}`
    );
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

  return (
    <div className="App">
      <Header />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <div className="modalDiv relative">
            <div className="flex justify-between items-center">
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
            </div>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <span className="line">
                <label className=" block mb-1 mt-2" htmlFor="company">
                  Company:
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  placeholder="Company"
                  className=" w-full p-2 border rounded"
                  required
                />
              </span>

              <span className="line">
                <label className="block mb-1 mt-2" htmlFor="position">
                  Position:
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  placeholder="Position"
                  className="w-full p-2 border rounded"
                  required
                />
              </span>

              <span className="line">
                <label className=" block mb-1 mt-2" htmlFor="link">
                  Link:
                </label>
                <input
                  type="url"
                  id="link"
                  name="link"
                  placeholder="Link"
                  className=" w-full p-2 border rounded"
                />
              </span>

              <span className="line">
                <label className=" block mb-1 mt-2" htmlFor="date">
                  Date:
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className=" w-full p-2 border rounded"
                  required
                />
              </span>

              <span className="line">
                <label className=" block mb-1 mt-2" htmlFor="status">
                  Status:
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue="Applied"
                  className=" w-full p-2 border rounded"
                  required
                >
                  <option value="Applied">Applied</option>
                  <option value="Interviewed">Interviewed</option>
                  <option value="Offered">Offered</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </span>

              <button
                type="submit"
                onClick={submitNewApp}
                className="line bg-blue-500 text-white px-4 py-2 rounded mt-4"
              >
                Submit
              </button>
            </Typography>
          </div>
        </Box>
      </Modal>
      <div class="tableBody">
        <div class="stats">
          <h2>{username}</h2>
          <h3>Koala Count: {numKoalas}</h3>
          <h3 className="silver">Applications: {numApps}</h3>
          <h3 className="bronze">Interviews: {numInterviews}</h3>
          <h3 className="gold">Offers: {numOffers}</h3>
        </div>
        <div class="table">
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
                class="w-auto px-2 py-0 m-0 bg-white"
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
        <div class="notes">
          <textarea
            id="noteField"
            placeholder="Write any notes, reminders, or contact information here"
          ></textarea>
          <button class="saveButton">Save</button>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
