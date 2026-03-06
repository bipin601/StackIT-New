import { useParams, Link } from "react-router-dom";
import QuestionDetail from "../components/QuestionDetail";
import { useTheme } from "../context/ThemeContext";

export default function Question() {
  const { id } = useParams();
  const { isLight } = useTheme();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Share+Tech+Mono&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .qp-breadcrumb {
          position: relative; z-index: 10;
          font-family: 'Share Tech Mono', monospace;
          padding: 14px 24px;
          max-width: 860px; margin: 0 auto;
          display: flex; align-items: center; gap: 8px;
          border-bottom: 1px solid rgba(0,255,200,0.06);
          animation: qp-fup 0.4s ease both;
          transition: border-color 0.35s;
        }
        body.si-light .qp-breadcrumb {
          border-bottom-color: rgba(0,160,120,0.1);
        }

        @keyframes qp-fup {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .qp-bc-link {
          font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(0,255,200,0.4); text-decoration: none;
          transition: color 0.2s;
        }
        .qp-bc-link:hover { color: #00ffc8; }
        body.si-light .qp-bc-link { color: rgba(0,120,80,0.55); }
        body.si-light .qp-bc-link:hover { color: #007850; }

        .qp-bc-sep {
          font-size: 10px; color: rgba(0,255,200,0.2);
          transition: color 0.35s;
        }
        body.si-light .qp-bc-sep { color: rgba(0,160,120,0.25); }

        .qp-bc-current {
          font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(0,255,200,0.25);
          max-width: 260px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          transition: color 0.35s;
        }
        body.si-light .qp-bc-current { color: rgba(0,100,60,0.45); }

        .qp-bc-id {
          margin-left: auto;
          font-size: 9px; letter-spacing: 0.15em;
          color: rgba(0,255,200,0.15);
          transition: color 0.35s;
        }
        body.si-light .qp-bc-id { color: rgba(0,120,80,0.25); }
      `}</style>

      <nav className="qp-breadcrumb" aria-label="Breadcrumb">
        <Link to="/" className="qp-bc-link">Home</Link>
        <span className="qp-bc-sep">▶</span>
        <Link to="/" className="qp-bc-link">Questions</Link>
        <span className="qp-bc-sep">▶</span>
        <span className="qp-bc-current">Question</span>
        <span className="qp-bc-id">ID: {id}</span>
      </nav>

      <QuestionDetail questionId={id} />
    </>
  );
}