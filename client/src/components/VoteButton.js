import { useState } from "react";
import api from "../services/api";

export default function VoteButton({ type, id, votes: initialVotes, onVoted }) {
  const [votes, setVotes]       = useState(initialVotes ?? 0);
  const [userVote, setUserVote] = useState(null); // 'up' | 'down' | null
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [flash, setFlash]       = useState(null); // 'up' | 'down'

  const triggerFlash = (dir) => {
    setFlash(dir);
    setTimeout(() => setFlash(null), 500);
  };

  const handleVote = async (direction) => {
    if (loading) return;

    // Optimistic toggle: clicking same direction undoes the vote
    const isUndo = userVote === direction;
    const delta  = isUndo ? (direction === "up" ? -1 : 1)
                          : (direction === "up" ? (userVote === "down" ? 2 : 1)
                                                : (userVote === "up"  ? -2 : -1));

    setVotes(v => v + delta);
    setUserVote(isUndo ? null : direction);
    triggerFlash(direction);
    setError("");
    setLoading(true);

    try {
      await api.post(
        "/votes",
        { type, id, direction: isUndo ? "none" : direction },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (onVoted) onVoted();
    } catch (err) {
      // Revert optimistic update
      setVotes(v => v - delta);
      setUserVote(userVote);
      setError(err?.response?.status === 401 ? "Login to vote." : "Vote failed.");
      setTimeout(() => setError(""), 2500);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = votes > 0 ? "#00ffc8"
                   : votes < 0 ? "#ff6060"
                   : "rgba(255,255,255,0.4)";

  const scoreGlow  = votes > 0 ? "rgba(0,255,200,0.5)"
                   : votes < 0 ? "rgba(255,80,80,0.5)"
                   : "transparent";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Share+Tech+Mono&display=swap');

        .vb {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          font-family: 'Share Tech Mono', monospace;
          position: relative;
        }

        /* Vote button */
        .vb-btn {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,255,200,0.03);
          border: 1px solid rgba(0,255,200,0.14);
          color: rgba(0,255,200,0.4);
          cursor: pointer;
          position: relative; overflow: hidden;
          transition: border-color 0.2s, color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.1s;
          border-radius: 0;
          padding: 0;
          font-size: 13px; line-height: 1;
        }

        .vb-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: rgba(0,255,200,0.07);
          opacity: 0; transition: opacity 0.2s;
        }

        .vb-btn:hover:not(:disabled)::before { opacity: 1; }
        .vb-btn:hover:not(:disabled) {
          border-color: rgba(0,255,200,0.45);
          color: #00ffc8;
          box-shadow: 0 0 14px rgba(0,255,200,0.12);
        }

        .vb-btn:active:not(:disabled) { transform: scale(0.92); }
        .vb-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Active (voted) states */
        .vb-btn.active-up {
          border-color: rgba(0,255,200,0.6);
          color: #00ffc8;
          background: rgba(0,255,200,0.08);
          box-shadow: 0 0 18px rgba(0,255,200,0.2), inset 0 0 10px rgba(0,255,200,0.05);
        }

        .vb-btn.active-down {
          border-color: rgba(255,80,80,0.55);
          color: #ff6060;
          background: rgba(255,80,80,0.07);
          box-shadow: 0 0 18px rgba(255,80,80,0.18), inset 0 0 10px rgba(255,80,80,0.04);
        }

        /* Flash pulse on click */
        .vb-btn.flash-up  { animation: flash-up  0.45s ease; }
        .vb-btn.flash-down { animation: flash-down 0.45s ease; }

        @keyframes flash-up {
          0%  { box-shadow: 0 0 0 0 rgba(0,255,200,0.6); }
          50% { box-shadow: 0 0 0 8px rgba(0,255,200,0); }
          100%{ box-shadow: 0 0 0 0 rgba(0,255,200,0); }
        }
        @keyframes flash-down {
          0%  { box-shadow: 0 0 0 0 rgba(255,80,80,0.6); }
          50% { box-shadow: 0 0 0 8px rgba(255,80,80,0); }
          100%{ box-shadow: 0 0 0 0 rgba(255,80,80,0); }
        }

        /* Score display */
        .vb-score {
          font-family: 'Orbitron', sans-serif;
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.05em;
          min-width: 34px; text-align: center;
          padding: 3px 0;
          transition: color 0.3s, text-shadow 0.3s;
          user-select: none;
        }

        /* Arrow icons */
        .vb-arrow {
          display: block;
          width: 0; height: 0;
          transition: transform 0.15s;
        }

        .vb-arrow-up {
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 8px solid currentColor;
        }

        .vb-arrow-down {
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid currentColor;
        }

        .vb-btn:hover:not(:disabled) .vb-arrow-up   { transform: translateY(-2px); }
        .vb-btn:hover:not(:disabled) .vb-arrow-down { transform: translateY(2px); }

        /* Error tooltip */
        .vb-error {
          position: absolute;
          bottom: calc(100% + 6px); left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          padding: 5px 10px;
          background: rgba(10,15,25,0.95);
          border: 1px solid rgba(255,80,80,0.35);
          font-size: 10px; color: #ff7070;
          letter-spacing: 0.08em;
          pointer-events: none;
          opacity: 0; transition: opacity 0.25s;
          z-index: 20;
        }
        .vb-error.on { opacity: 1; }
        .vb-error::after {
          content: '';
          position: absolute; top: 100%; left: 50%;
          transform: translateX(-50%);
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid rgba(255,80,80,0.35);
        }

        /* Loading pip */
        .vb-loading {
          width: 4px; height: 4px; border-radius: 50%;
          background: #00ffc8; box-shadow: 0 0 6px #00ffc8;
          animation: pip 0.8s ease-in-out infinite alternate;
        }
        @keyframes pip { from{opacity:0.2;transform:scale(0.6);} to{opacity:1;transform:scale(1);} }
      `}</style>

      <div className="vb">
        {/* Error tooltip */}
        <div className={`vb-error ${error ? "on" : ""}`}>{error}</div>

        {/* Up button */}
        <button
          className={[
            "vb-btn",
            userVote === "up"  ? "active-up"   : "",
            flash    === "up"  ? "flash-up"    : "",
          ].join(" ").trim()}
          onClick={() => handleVote("up")}
          disabled={loading}
          aria-label="Upvote"
          title="Upvote"
        >
          <span className="vb-arrow vb-arrow-up" />
        </button>

        {/* Score */}
        {loading ? (
          <div className="vb-loading" />
        ) : (
          <span
            className="vb-score"
            style={{ color: scoreColor, textShadow: `0 0 12px ${scoreGlow}` }}
          >
            {votes > 0 ? `+${votes}` : votes}
          </span>
        )}

        {/* Down button */}
        <button
          className={[
            "vb-btn",
            userVote === "down" ? "active-down"  : "",
            flash    === "down" ? "flash-down"   : "",
          ].join(" ").trim()}
          onClick={() => handleVote("down")}
          disabled={loading}
          aria-label="Downvote"
          title="Downvote"
        >
          <span className="vb-arrow vb-arrow-down" />
        </button>
      </div>
    </>
  );
}