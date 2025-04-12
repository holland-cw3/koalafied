import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";

import Home from "./pages/main";
import Register from "./pages/login";
import Login from "./pages/login2";


import Leaderboard from "./pages/leaderboard";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
