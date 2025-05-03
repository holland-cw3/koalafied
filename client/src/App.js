import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";

// import { useEffect } from "react";

import Home from "./pages/main";
import Register from "./pages/register";
import Login from "./pages/login";
import Leaderboard from "./pages/leaderboard";

function App() {
  // const blockInspectElement = (event) => {
  //   event.preventDefault();
  // }

  // useEffect(() =>{
  //   window.addEventListener('contextmenu', blockInspectElement);
  //   return function cleanup(){
  //     window.removeEventListener('contextmenu', blockInspectElement)
  //   }
  // })

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/*" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
