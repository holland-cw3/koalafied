import Footer from "../components/footer";
import Header from "../components/header";
import React, { useState } from "react";
import { useEffect } from "react";

import "../CSS/main.css";

async function load(setApps) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:5000/viewApplications", {
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



function App() {
  if (!localStorage.getItem("token")) {
    window.location.href = "/login";
  }

  const [username, setUsername] = useState("User");
  const [numKoalas, setNumKoalas] = useState(0);
  const [numApps, setNumApps] = useState(0);
  const [numInterviews, setNumInterviews] = useState(0);
  const [numOffers, setNumOffers] = useState(0);

  const [apps, setApps] = useState([])

  useEffect(() => {
    load(setApps);
  }, []);

  return (
    <div className="App">
      <Header />
      <div class="tableBody">
        <div class="stats">
          <h2>{username}</h2>
          <h3>Koala Count: {numKoalas}</h3>
          <h3 className="silver">Applications: {numApps}</h3>
          <h3 className="bronze">Interviews: {numInterviews}</h3>
          <h3 className="gold">Offers: {numOffers}</h3>
        </div>

        <div class="table"></div>
        <div class="notes"></div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
