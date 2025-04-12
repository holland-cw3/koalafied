import '../CSS/header.css';

import logo from '../logo.png';

function logout(){
  localStorage.setItem('token', '')
  alert("Successfully Logged Out");
  window.location.href = "/login";
}

export default function Header() {


  return (
    <div className="header">
      <div className="header-left">
        <a href="/leaderboard" className="leaderboard-link">
          LEADERBOARD
        </a>
      </div>

        <img src={logo} alt='logo'/>

      <div className="header-right">
        <button className="logout-button" onClick={() => logout()}>
          LOGOUT
        </button>
      </div>
    </div>
  );
}