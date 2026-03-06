import { useParams, Link } from "react-router-dom";
import Profile from "../components/Profile";

export default function User() {
  const { id } = useParams();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Share+Tech+Mono&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .up-breadcrumb {
          position: relative; z-index: 10;
          font-family: 'Share Tech Mono', monospace;
          padding: 14px 24px;
          max-width: 860px; margin: 0 auto;
          display: flex; align-items: center; gap: 8px;
          border-bottom: 1px solid rgba(0,255,200,0.06);
          animation: up-fup 0.4s ease both;
        }

        @keyframes up-fup {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .up-bc-link {
          font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(0,255,200,0.4); text-decoration: none;
          transition: color 0.2s;
        }
        .up-bc-link:hover { color: #00ffc8; }

        .up-bc-sep {
          font-size: 10px; color: rgba(0,255,200,0.2);
        }

        .up-bc-current {
          font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(0,255,200,0.25);
        }

        .up-bc-id {
          margin-left: auto;
          display: flex; align-items: center; gap: 8px;
        }

        .up-bc-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #00ffc8; box-shadow: 0 0 6px #00ffc8;
          animation: up-blink 1.8s ease-in-out infinite;
        }
        @keyframes up-blink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }

        .up-bc-id-text {
          font-size: 9px; letter-spacing: 0.15em;
          color: rgba(0,255,200,0.15);
        }

        .up-bc-me-badge {
          font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
          padding: 2px 8px;
          border: 1px solid rgba(0,255,200,0.25);
          background: rgba(0,255,200,0.05);
          color: rgba(0,255,200,0.5);
        }
      `}</style>

      <nav className="up-breadcrumb" aria-label="Breadcrumb">
        <Link to="/"        className="up-bc-link">Home</Link>
        <span className="up-bc-sep">▶</span>
        <Link to="/users"   className="up-bc-link">Users</Link>
        <span className="up-bc-sep">▶</span>
        <span className="up-bc-current">
          {id === "me" ? "My Profile" : "User Profile"}
        </span>

        <div className="up-bc-id">
          {id === "me"
            ? <span className="up-bc-me-badge">● You</span>
            : <span className="up-bc-id-text">ID: {id}</span>
          }
          <div className="up-bc-dot" />
        </div>
      </nav>

      <Profile userId={id} />
    </>
  );
}