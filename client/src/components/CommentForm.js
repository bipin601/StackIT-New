import { useState, useEffect, useRef } from "react";
import api from "../services/api";

export default function CommentForm({ postId, type }) {
  const [body, setBody] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef(null);

  const charLimit = 600;
  const isValid = body.trim().length >= 5;

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments?type=${type}&postId=${postId}`);
      setComments(res.data);
    } catch {
      // silently fail on fetch
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => { fetchComments(); }, [postId, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setIsLoading(true);
    setError("");
    try {
      await api.post(
        "/comments",
        { body: body.trim(), type, postId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setBody("");
      setExpanded(false);
      await fetchComments();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to post comment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpand = () => {
    setExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Share+Tech+Mono&display=swap');

        .cf { font-family: 'Share Tech Mono', monospace; margin-top: 20px; }

        /* Comment list */
        .cf-list { display: flex; flex-direction: column; gap: 0; margin-bottom: 14px; }

        .cf-empty {
          font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(0,255,200,0.2); padding: 10px 0;
        }

        /* Skeleton loader */
        .cf-skeleton {
          height: 32px; margin-bottom: 6px;
          background: linear-gradient(90deg, rgba(0,255,200,0.04) 25%, rgba(0,255,200,0.08) 50%, rgba(0,255,200,0.04) 75%);
          background-size: 200% 100%;
          animation: cf-shimmer 1.4s ease-in-out infinite;
          border: 1px solid rgba(0,255,200,0.06);
        }
        @keyframes cf-shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }

        /* Individual comment */
        .cf-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(0,255,200,0.05);
          animation: cf-in 0.3s ease;
        }
        @keyframes cf-in { from{opacity:0;transform:translateY(5px);} to{opacity:1;transform:translateY(0);} }

        .cf-item:last-child { border-bottom: none; }

        .cf-item-marker {
          flex-shrink: 0; margin-top: 3px;
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(0,255,200,0.35);
          box-shadow: 0 0 6px rgba(0,255,200,0.3);
        }

        .cf-item-content { flex: 1; min-width: 0; }

        .cf-item-meta {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 3px;
        }

        .cf-item-author {
          font-size: 10px; letter-spacing: 0.12em;
          color: rgba(0,255,200,0.55); text-transform: uppercase;
        }

        .cf-item-time {
          font-size: 9px; color: rgba(0,255,200,0.2); letter-spacing: 0.08em;
        }

        .cf-item-body {
          font-size: 12px; color: rgba(255,255,255,0.55);
          line-height: 1.6; letter-spacing: 0.02em;
          word-break: break-word;
        }

        /* Divider between list and form */
        .cf-divider {
          height: 1px; margin-bottom: 12px;
          background: linear-gradient(90deg, rgba(0,255,200,0.1), transparent);
        }

        /* Collapsed trigger */
        .cf-trigger {
          display: flex; align-items: center; gap: 8px;
          background: none; border: none; cursor: pointer;
          color: rgba(0,255,200,0.4);
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
          padding: 5px 0;
          transition: color 0.2s;
        }
        .cf-trigger:hover { color: #00ffc8; }
        .cf-trigger-icon { font-size: 11px; transition: transform 0.2s; }
        .cf-trigger.open .cf-trigger-icon { transform: rotate(90deg); }

        /* Form area */
        .cf-form-area {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transform: translateY(-4px);
          transition: max-height 0.35s ease, opacity 0.3s ease, transform 0.3s ease;
        }
        .cf-form-area.open {
          max-height: 200px;
          opacity: 1;
          transform: translateY(0);
        }

        .cf-form { display: flex; flex-direction: column; gap: 10px; padding-top: 12px; }

        /* Input row */
        .cf-input-row { display: flex; gap: 8px; align-items: flex-start; }

        .cf-input-wrap { flex: 1; position: relative; }
        .cf-input-wrap::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          height: 1px; width: 0;
          background: linear-gradient(90deg, #00ffc8, #00c8ff);
          box-shadow: 0 0 6px #00ffc8;
          transition: width 0.3s ease; pointer-events: none;
        }
        .cf-input-wrap:focus-within::after { width: 100%; }

        .cf-input {
          width: 100%;
          background: rgba(0,255,200,0.03);
          border: 1px solid rgba(0,255,200,0.13);
          color: #e6fff8;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px; padding: 9px 12px;
          outline: none; border-radius: 0;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
          letter-spacing: 0.03em; -webkit-appearance: none;
        }
        .cf-input::placeholder { color: rgba(0,255,200,0.18); }
        .cf-input:focus {
          border-color: rgba(0,255,200,0.45);
          background: rgba(0,255,200,0.05);
          box-shadow: 0 0 16px rgba(0,255,200,0.06);
        }

        /* Submit button */
        .cf-btn {
          flex-shrink: 0;
          display: flex; align-items: center; gap: 6px;
          padding: 9px 16px;
          background: transparent;
          border: 1px solid rgba(0,255,200,0.35);
          color: #00ffc8;
          font-family: 'Orbitron', sans-serif;
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          cursor: pointer; position: relative; overflow: hidden;
          transition: color 0.25s, border-color 0.25s, box-shadow 0.25s;
          border-radius: 0; white-space: nowrap;
        }
        .cf-btn::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(0,255,200,0.08);
          opacity: 0; transition: opacity 0.25s;
        }
        .cf-btn:not(:disabled):hover::before { opacity: 1; }
        .cf-btn:not(:disabled):hover {
          border-color: #00ffc8;
          box-shadow: 0 0 20px rgba(0,255,200,0.15);
          color: #fff;
        }
        .cf-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .cf-loadbar {
          position: absolute; bottom: 0; left: 0;
          height: 1px; width: 100%;
          background: linear-gradient(90deg, transparent, #00ffc8, transparent);
          animation: lbar 1.2s ease-in-out infinite;
        }
        @keyframes lbar { 0%{transform:translateX(-100%);} 100%{transform:translateX(100%);} }

        /* Bottom row: char count + error */
        .cf-form-footer {
          display: flex; align-items: center; justify-content: space-between;
          gap: 10px;
        }

        .cf-charcount { font-size: 9px; color: rgba(0,255,200,0.25); letter-spacing: 0.1em; }

        .cf-error {
          font-size: 10px; color: #ff7070; letter-spacing: 0.05em;
          display: flex; align-items: center; gap: 6px;
          opacity: 0; transition: opacity 0.3s;
        }
        .cf-error.on { opacity: 1; }
      `}</style>

      <div className="cf">
        {/* Comment list */}
        <div className="cf-list">
          {isFetching ? (
            [1, 2].map((i) => <div key={i} className="cf-skeleton" />)
          ) : comments.length === 0 ? (
            <span className="cf-empty">// No comments yet</span>
          ) : (
            comments.map((c) => (
              <div className="cf-item" key={c._id}>
                <div className="cf-item-marker" />
                <div className="cf-item-content">
                  <div className="cf-item-meta">
                    <span className="cf-item-author">
                      {c.author?.username || "user"}
                    </span>
                    {c.createdAt && (
                      <span className="cf-item-time">
                        {new Date(c.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    )}
                  </div>
                  <div className="cf-item-body">{c.body}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cf-divider" />

        {/* Toggle trigger */}
        <button
          className={`cf-trigger ${expanded ? "open" : ""}`}
          type="button"
          onClick={expanded ? () => { setExpanded(false); setBody(""); setError(""); } : handleExpand}
        >
          <span className="cf-trigger-icon">▶</span>
          {expanded ? "Cancel" : `Add Comment`}
        </button>

        {/* Collapsible form */}
        <div className={`cf-form-area ${expanded ? "open" : ""}`}>
          <form className="cf-form" onSubmit={handleSubmit}>
            <div className="cf-input-row">
              <div className="cf-input-wrap">
                <input
                  ref={inputRef}
                  className="cf-input"
                  type="text"
                  value={body}
                  onChange={(e) => { setBody(e.target.value); setError(""); }}
                  placeholder="Add a comment…"
                  maxLength={charLimit}
                />
              </div>
              <button className="cf-btn" type="submit" disabled={isLoading || !isValid}>
                {isLoading ? (
                  <><span>Posting</span><div className="cf-loadbar" /></>
                ) : (
                  <><span>▶</span><span>Post</span></>
                )}
              </button>
            </div>

            <div className="cf-form-footer">
              <span className="cf-charcount">{body.length} / {charLimit}</span>
              <div className={`cf-error ${error ? "on" : ""}`}>
                <span>⚠</span><span>{error}</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}