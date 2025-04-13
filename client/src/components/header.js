import '../CSS/header.css';

import logo from '../images/logo.png';

function logout(){
  localStorage.setItem('token', '')
  window.location.href = "/login";
}



export default function Header() {


  return (
    <div className="header">
      <div className="header-left">
        <button className="leaderboard-button" onClick={() => window.location.href = "/leaderboard"}>
          Leaderboard
        </button>
        
      </div>

        <img src={logo} alt='logo'/>

      <div className="header-right">
        <button className="logout-button" onClick={() => logout()}>
          Logout
        </button>
      </div>
    </div>
  );
}