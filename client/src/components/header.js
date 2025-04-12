import '../CSS/header.css';

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

      <div className="header-center">
        <h1>KOALAFIED</h1>
      </div>

      <div className="header-right">
        <button className="logout-button" onClick={() => logout()}>
          LOGOUT
        </button>
      </div>
    </div>
  );
}