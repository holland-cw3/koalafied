import '../CSS/header.css';

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
        <button className="logout-button" onClick={() => alert('Logging out...')}>
          LOGOUT
        </button>
      </div>
    </div>
  );
}