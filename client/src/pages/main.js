import Footer from "../components/footer";
import Header from "../components/header";
import React, { useState } from "react";

import "../CSS/main.css";

function App() {
  const [username, setUsername] = useState("User");
  const [numKoalas, setNumKoalas] = useState(0);
  const [numApps, setNumApps] = useState(0);
  const [numInterviews, setNumInterviews] = useState(0);
  const [numOffers, setNumOffers] = useState(0);

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
