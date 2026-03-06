import { useState, useEffect } from "react";
import api from "../services/api";
import VoteButton from "./VoteButton";
import AnswerForm from "./AnswerForm";
import CommentForm from "./CommentForm";
import TagList from "./TagList";
import { useTheme } from "../context/ThemeContext";

export default function QuestionDetail({ questionId }) {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [mounted, setMounted]   = useState(false);
  const [scanY, setScanY]       = useState(0);
  const { isLight } = useTheme();

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
    const iv = setInterval(() => setScanY(v => (v + 0.5) % 100), 22);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [qRes, aRes] = await Promise.all([
          api.get(`/questions/${questionId}`),
          api.get(`/answers?questionId=${questionId}`),
        ]);
        setQuestion(qRes.data);
        setAnswers(Array.isArray(aRes.data) ? aRes.data : aRes.data?.answers ?? []);
      } catch {
        setError("Failed to load question.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [questionId]);

  const handleAnswerPosted = async () => {
    try {
      const res = await api.get(`/answers?questionId=${questionId}`);
      setAnswers(Array.isArray(res.data) ? res.data : res.data?.answers ?? []);
    } catch { /* silent */ }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;900&family=Share+Tech+Mono&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #020c14; transition: background 0.4s; }
        body.si-light { background: #edf8f4; }

        .qd-root {
          min-height: 100vh; background: #020c14;
          font-family: 'Share Tech Mono', monospace;
          position: relative; overflow: hidden;
          transition: background 0.4s;
        }
        body.si-light .qd-root { background: #edf8f4; }

        .qd-root::before {
          content: ''; position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(0,255,200,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,200,0.025) 1px, transparent 1px);
          background-size: 52px 52px; pointer-events: none; z-index: 0;
        }
        body.si-light .qd-root::before {
          background-image:
            linear-gradient(rgba(0,160,120,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,160,120,0.06) 1px, transparent 1px);
        }
        .qd-root::after {
          content: ''; position: fixed; inset: 0;
          background: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,35,55,0.95) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        body.si-light .qd-root::after {
          background: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,160,120,0.07) 0%, transparent 70%);
        }

        .scanlines {
          position: fixed; inset: 0; z-index: 1; pointer-events: none;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px);
          transition: opacity 0.4s;
        }
        body.si-light .scanlines { opacity: 0.25; }

        .scan-beam {
          position: fixed; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(0,255,200,0.12), rgba(0,255,200,0.4), rgba(0,200,255,0.3), rgba(0,255,200,0.12), transparent);
          z-index: 2; pointer-events: none; filter: blur(1px);
          transition: opacity 0.4s;
        }
        body.si-light .scan-beam { opacity: 0.2; }

        .particle { position: fixed; border-radius: 50%; pointer-events: none; z-index: 1; animation: floatup linear infinite; }
        @keyframes floatup { from{transform:translateY(105vh);opacity:0;} 10%{opacity:.7;} 85%{opacity:.3;} to{transform:translateY(-5vh);opacity:0;} }
        body.si-light .particle { opacity: 0.35; }

        .qd-content {
          position: relative; z-index: 5;
          max-width: 860px; margin: 0 auto;
          padding: 48px 24px 100px;
          opacity: 0; transform: translateY(20px);
          transition: opacity .7s ease, transform .7s ease;
        }
        .qd-content.on { opacity: 1; transform: translateY(0); }

        /* Skeleton */
        .qd-skel-wrap { display: flex; flex-direction: column; gap: 14px; }
        .qd-skel {
          border: 1px solid rgba(0,255,200,0.06);
          background: linear-gradient(90deg, rgba(0,255,200,0.04) 25%, rgba(0,255,200,0.08) 50%, rgba(0,255,200,0.04) 75%);
          background-size: 200% 100%;
          animation: skel 1.4s ease-in-out infinite;
        }
        body.si-light .qd-skel {
          background: linear-gradient(90deg, rgba(0,160,120,0.05) 25%, rgba(0,160,120,0.1) 50%, rgba(0,160,120,0.05) 75%);
          background-size: 200% 100%;
          border-color: rgba(0,160,120,0.08);
        }
        @keyframes skel { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }

        /* Error */
        .qd-err { display:flex; align-items:center; gap:10px; padding:14px 18px; border:1px solid rgba(255,60,60,.3); background:rgba(255,60,60,.06); font-size:12px; color:#ff7070; letter-spacing:.06em; }

        /* Panel base */
        .panel {
          position: relative;
          border: 1px solid rgba(0,255,200,0.12);
          background: rgba(2,12,20,0.75);
          backdrop-filter: blur(20px);
          padding: 32px 36px;
          overflow: hidden;
          transition: background 0.4s, border-color 0.4s;
        }
        body.si-light .panel {
          background: rgba(230,250,244,0.75);
          border-color: rgba(0,160,120,0.15);
        }
        .panel::after {
          content:''; position:absolute; top:0; left:-120%; width:55%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(0,255,200,.022),transparent);
          animation:sheen 7s ease-in-out infinite; pointer-events:none;
        }
        @keyframes sheen { 0%{left:-120%;} 100%{left:160%;} }

        /* Corner brackets */
        .brk { position:absolute; width:18px; height:18px; }
        .brk-tl { top:-1px;left:-1px;   border-top:2px solid rgba(0,255,200,.55);border-left:2px solid rgba(0,255,200,.55); }
        .brk-tr { top:-1px;right:-1px;  border-top:2px solid rgba(0,255,200,.55);border-right:2px solid rgba(0,255,200,.55); }
        .brk-bl { bottom:-1px;left:-1px;  border-bottom:2px solid rgba(0,255,200,.55);border-left:2px solid rgba(0,255,200,.55); }
        .brk-br { bottom:-1px;right:-1px; border-bottom:2px solid rgba(0,255,200,.55);border-right:2px solid rgba(0,255,200,.55); }
        body.si-light .brk-tl, body.si-light .brk-tr,
        body.si-light .brk-bl, body.si-light .brk-br { border-color: rgba(0,160,120,0.5); }

        @keyframes fup { from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);} }

        /* Question panel */
        .qd-q-panel { margin-bottom: 32px; animation: fup .5s .15s both; }

        .qd-q-eyebrow { display:flex; align-items:center; gap:8px; margin-bottom:14px; }

        .qd-dot {
          width:6px; height:6px; border-radius:50%;
          background:#00ffc8; box-shadow:0 0 8px #00ffc8;
          animation:blink 1.8s ease-in-out infinite;
          transition: background 0.35s, box-shadow 0.35s;
        }
        body.si-light .qd-dot { background:#00a070; box-shadow:0 0 8px rgba(0,160,120,0.5); }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:.2;} }

        .qd-q-meta {
          font-size:9px; letter-spacing:.25em; text-transform:uppercase;
          color:rgba(0,255,200,.4);
          transition: color 0.35s;
        }
        body.si-light .qd-q-meta { color: rgba(0,120,80,0.55); }

        .qd-q-title {
          font-family:'Orbitron',sans-serif;
          font-size:20px; font-weight:900; color:#e6fff8;
          letter-spacing:.05em; line-height:1.35;
          margin-bottom:20px;
          transition: color 0.35s;
        }
        body.si-light .qd-q-title { color: #0a2820; }

        .qd-q-body {
          font-size:13px; color:rgba(255,255,255,.6);
          line-height:1.8; letter-spacing:.025em;
          margin-bottom:22px; white-space:pre-wrap;
          border-left:2px solid rgba(0,255,200,.15);
          padding-left:16px;
          transition: color 0.35s, border-color 0.35s;
        }
        body.si-light .qd-q-body {
          color: rgba(10,40,32,0.7);
          border-left-color: rgba(0,160,120,0.25);
        }

        .qd-q-footer {
          display:flex; align-items:center; gap:16px; flex-wrap:wrap;
          padding-top:18px; border-top:1px solid rgba(0,255,200,.06);
          transition: border-color 0.35s;
        }
        body.si-light .qd-q-footer { border-top-color: rgba(0,160,120,0.1); }

        .qd-date {
          font-size:10px; color:rgba(0,255,200,.25); letter-spacing:.1em;
          transition: color 0.35s;
        }
        body.si-light .qd-date { color: rgba(0,120,80,0.45); }

        /* Divider */
        .qd-divider {
          display:flex; align-items:center; gap:12px; margin-bottom:24px;
          animation: fup .5s .3s both;
        }
        .qd-divider-label {
          font-family:'Orbitron',sans-serif;
          font-size:11px; font-weight:700; letter-spacing:.22em; text-transform:uppercase;
          color:rgba(0,255,200,.6); white-space:nowrap;
          transition: color 0.35s;
        }
        body.si-light .qd-divider-label { color: rgba(0,120,80,0.75); }

        .qd-divider-line {
          flex:1; height:1px;
          background:linear-gradient(90deg,rgba(0,255,200,.2),transparent);
          transition: background 0.35s;
        }
        body.si-light .qd-divider-line { background: linear-gradient(90deg,rgba(0,160,120,0.25),transparent); }

        .qd-divider-count {
          font-size:10px; color:rgba(0,255,200,.3); letter-spacing:.1em;
          transition: color 0.35s;
        }
        body.si-light .qd-divider-count { color: rgba(0,120,80,0.5); }

        /* Answers list */
        .qd-answers { display:flex; flex-direction:column; gap:16px; margin-bottom:8px; }

        .qd-answer {
          position:relative;
          border:1px solid rgba(0,255,200,.09);
          background:rgba(2,12,20,.65);
          backdrop-filter:blur(12px);
          padding:24px 28px;
          overflow:hidden;
          animation: fup .4s both;
          transition: border-color .2s, background 0.4s;
        }
        .qd-answer:hover { border-color:rgba(0,255,200,.2); }
        body.si-light .qd-answer {
          background: rgba(220,248,240,0.6);
          border-color: rgba(0,160,120,0.1);
        }
        body.si-light .qd-answer:hover { border-color: rgba(0,160,120,0.28); }

        /* Accepted */
        .qd-answer.accepted {
          border-color:rgba(0,255,200,.35);
          background:rgba(0,255,200,.03);
        }
        body.si-light .qd-answer.accepted {
          border-color: rgba(0,160,120,0.45);
          background: rgba(0,160,120,0.06);
        }

        .qd-accepted-badge {
          display:inline-flex; align-items:center; gap:6px;
          padding:3px 10px; margin-bottom:12px;
          border:1px solid rgba(0,255,200,.35);
          background:rgba(0,255,200,.07);
          font-size:9px; letter-spacing:.2em; text-transform:uppercase;
          color:#00ffc8;
          transition: all 0.35s;
        }
        body.si-light .qd-accepted-badge {
          border-color: rgba(0,160,120,0.4);
          background: rgba(0,160,120,0.08);
          color: #007850;
        }

        .qd-answer-body {
          font-size:13px; color:rgba(255,255,255,.6);
          line-height:1.8; letter-spacing:.025em;
          margin-bottom:16px; white-space:pre-wrap;
          transition: color 0.35s;
        }
        body.si-light .qd-answer-body { color: rgba(10,40,32,0.7); }

        .qd-answer-footer {
          display:flex; align-items:center; gap:14px; flex-wrap:wrap;
          padding-top:14px; border-top:1px solid rgba(0,255,200,.05);
          transition: border-color 0.35s;
        }
        body.si-light .qd-answer-footer { border-top-color: rgba(0,160,120,0.08); }

        .qd-answer-meta {
          font-size:10px; color:rgba(0,255,200,.22); letter-spacing:.08em;
          transition: color 0.35s;
        }
        body.si-light .qd-answer-meta { color: rgba(0,120,80,0.45); }

        /* No answers */
        .qd-no-answers {
          padding:24px; text-align:center;
          border:1px dashed rgba(0,255,200,.1);
          font-size:11px; letter-spacing:.15em; text-transform:uppercase;
          color:rgba(0,255,200,.2);
          animation: fup .5s .35s both;
          transition: all 0.35s;
        }
        body.si-light .qd-no-answers {
          border-color: rgba(0,160,120,0.15);
          color: rgba(0,120,80,0.35);
        }
      `}</style>

      <div className="qd-root">
        <div className="scanlines" />
        <div className="scan-beam" style={{ top: `${scanY}%` }} />

        {[...Array(8)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${6 + (i * 11.5) % 90}%`,
            width: i % 3 === 0 ? "3px" : "2px",
            height: i % 3 === 0 ? "3px" : "2px",
            background: i % 2 === 0 ? "rgba(0,255,200,.5)" : "rgba(0,200,255,.45)",
            boxShadow: `0 0 4px ${i%2===0?"rgba(0,255,200,.8)":"rgba(0,200,255,.8)"}`,
            animationDuration: `${8+(i*1.4)%9}s`,
            animationDelay: `${(i*.9)%8}s`,
          }} />
        ))}

        <div className={`qd-content ${mounted ? "on" : ""}`}>

          {loading && (
            <div className="qd-skel-wrap">
              {[[100,48],[75,24],[90,18],[60,18],[80,18]].map(([w,h],i) => (
                <div key={i} className="qd-skel" style={{ width:`${w}%`, height:`${h}px` }} />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="qd-err"><span>⚠</span><span>{error}</span></div>
          )}

          {!loading && !error && question && (
            <>
              {/* Question panel */}
              <div className="panel qd-q-panel">
                <div className="brk brk-tl"/><div className="brk brk-tr"/>
                <div className="brk brk-bl"/><div className="brk brk-br"/>

                <div className="qd-q-eyebrow">
                  <div className="qd-dot" />
                  <span className="qd-q-meta">// Question</span>
                </div>

                <h1 className="qd-q-title">{question.title}</h1>
                <p className="qd-q-body">{question.body}</p>

                <div className="qd-q-footer">
                  <VoteButton type="question" id={question._id} votes={question.votes} />
                  <TagList tags={question.tags} />
                  {question.createdAt && (
                    <span className="qd-date">
                      {new Date(question.createdAt).toLocaleDateString(undefined, { year:"numeric", month:"short", day:"numeric" })}
                    </span>
                  )}
                </div>

                <CommentForm postId={question._id} type="question" />
              </div>

              {/* Answers divider */}
              <div className="qd-divider">
                <span className="qd-divider-label">Answers</span>
                <div className="qd-divider-line" />
                <span className="qd-divider-count">{answers.length} response{answers.length !== 1 ? "s" : ""}</span>
              </div>

              {/* Answer list */}
              {answers.length === 0 ? (
                <div className="qd-no-answers">// No answers yet — be the first to respond</div>
              ) : (
                <div className="qd-answers">
                  {answers.map((a, i) => (
                    <div
                      key={a._id}
                      className={`qd-answer ${a.accepted ? "accepted" : ""}`}
                      style={{ animationDelay: `${0.35 + i * 0.08}s` }}
                    >
                      <div className="brk brk-tl"/><div className="brk brk-tr"/>
                      <div className="brk brk-bl"/><div className="brk brk-br"/>

                      {a.accepted && (
                        <div className="qd-accepted-badge">✓ Accepted Answer</div>
                      )}

                      <p className="qd-answer-body">{a.body}</p>

                      <div className="qd-answer-footer">
                        <VoteButton type="answer" id={a._id} votes={a.votes} />
                        {a.author?.username && (
                          <span className="qd-answer-meta">by {a.author.username}</span>
                        )}
                        {a.createdAt && (
                          <span className="qd-answer-meta">
                            {new Date(a.createdAt).toLocaleDateString(undefined, { year:"numeric", month:"short", day:"numeric" })}
                          </span>
                        )}
                        <CommentForm postId={a._id} type="answer" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Post answer */}
              <AnswerForm questionId={questionId} onAnswerPosted={handleAnswerPosted} />
            </>
          )}

        </div>
      </div>
    </>
  );
}