import "../CSS/header.css";

import logo from "../images/logo.png";

function logout() {
  localStorage.setItem("token", "");
  window.location.href = "/login";
}

export default function Header({ isHomePage }) {
  return (
    <div className="header">
      <div className="header-left">
        {isHomePage ? (
          <button
            className="leaderboard-button"
            onClick={() => (window.location.href = "/leaderboard")}
          >
            Leaderboard
          </button>
        ) : (
          <button
            className="leaderboard-button"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Home
          </button>
        )}
      </div>

      <img className="logo" src={logo} alt="logo" />

      <div className="header-right">
        <button className="logout-button" onClick={() => logout()}>
          Logout
        </button>
      </div>
    </div>
  );
}
