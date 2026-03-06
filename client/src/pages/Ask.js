import { useState, useEffect } from "react";
import QuestionForm from "../components/QuestionForm";
import { useTheme } from "../context/ThemeContext";

export default function Ask() {
  const [mounted, setMounted] = useState(false);
  const [scanY, setScanY] = useState(0);
  const { isLight } = useTheme();

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
    const iv = setInterval(() => setScanY((v) => (v + 0.5) % 100), 22);
    return () => clearInterval(iv);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;900&family=Share+Tech+Mono&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #020c14; transition: background 0.4s; }
        body.si-light { background: #edf8f4; }

        .ask-root {
          min-height: 100vh;
          background: #020c14;
          font-family: 'Share Tech Mono', monospace;
          position: relative;
          overflow: hidden;
          transition: background 0.4s;
        }
        body.si-light .ask-root { background: #edf8f4; }

        /* Grid background */
        .ask-root::before {
          content: ''; position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(0,255,200,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,200,0.025) 1px, transparent 1px);
          background-size: 52px 52px;
          pointer-events: none; z-index: 0;
        }
        body.si-light .ask-root::before {
          background-image:
            linear-gradient(rgba(0,160,120,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,160,120,0.06) 1px, transparent 1px);
        }

        .ask-root::after {
          content: ''; position: fixed; inset: 0;
          background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,35,55,0.95) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        body.si-light .ask-root::after {
          background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,160,120,0.07) 0%, transparent 70%);
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

        /* Page content */
        .ask-content {
          position: relative; z-index: 5;
          max-width: 780px; margin: 0 auto;
          padding: 48px 24px 80px;
          opacity: 0; transform: translateY(22px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .ask-content.on { opacity: 1; transform: translateY(0); }

        /* Page heading */
        .ask-heading {
          margin-bottom: 36px;
          opacity: 0; animation: fup 0.5s 0.2s forwards;
        }
        @keyframes fup {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ask-eyebrow {
          font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(0,255,200,0.4); margin-bottom: 8px;
          transition: color 0.35s;
        }
        body.si-light .ask-eyebrow { color: rgba(0,120,80,0.55); }

        .ask-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 26px; font-weight: 900;
          color: #e6fff8; letter-spacing: 0.08em; text-transform: uppercase;
          transition: color 0.35s;
        }
        body.si-light .ask-title { color: #0a2820; }

        .ask-title span {
          color: #00ffc8; text-shadow: 0 0 20px rgba(0,255,200,0.4);
          transition: color 0.35s, text-shadow 0.35s;
        }
        body.si-light .ask-title span { color: #007850; text-shadow: 0 0 14px rgba(0,160,120,0.3); }

        .ask-title-line {
          height: 1px; margin-top: 14px;
          background: linear-gradient(90deg, #00ffc8, rgba(0,255,200,0.08), transparent);
          transition: background 0.35s;
        }
        body.si-light .ask-title-line {
          background: linear-gradient(90deg, #00a070, rgba(0,160,120,0.1), transparent);
        }

        /* Tips row */
        .ask-tips {
          display: flex; gap: 12px; margin-bottom: 28px;
          opacity: 0; animation: fup 0.5s 0.35s forwards;
          flex-wrap: wrap;
        }

        .tip-card {
          flex: 1; min-width: 160px; padding: 14px 16px;
          border: 1px solid rgba(0,255,200,0.08);
          background: rgba(0,255,200,0.02);
          position: relative; overflow: hidden;
          transition: border-color 0.35s, background 0.35s;
        }
        body.si-light .tip-card {
          border-color: rgba(0,160,120,0.12);
          background: rgba(0,160,120,0.03);
        }

        .tip-card::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, #00ffc8, rgba(0,200,255,0.3));
          transition: background 0.35s;
        }
        body.si-light .tip-card::before {
          background: linear-gradient(180deg, #00a070, rgba(0,160,120,0.3));
        }

        .tip-label {
          font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(0,255,200,0.5); margin-bottom: 5px;
          transition: color 0.35s;
        }
        body.si-light .tip-label { color: rgba(0,120,80,0.65); }

        .tip-text {
          font-size: 11px; color: rgba(255,255,255,0.35);
          line-height: 1.55; letter-spacing: 0.02em;
          transition: color 0.35s;
        }
        body.si-light .tip-text { color: rgba(10,40,32,0.55); }

        /* Panel */
        .ask-panel {
          position: relative;
          border: 1px solid rgba(0,255,200,0.12);
          background: rgba(2,12,20,0.7);
          backdrop-filter: blur(20px);
          padding: 36px 36px 40px;
          opacity: 0; animation: fup 0.5s 0.45s forwards;
          transition: background 0.4s, border-color 0.4s;
        }
        body.si-light .ask-panel {
          background: rgba(230,250,244,0.75);
          border-color: rgba(0,160,120,0.15);
        }

        /* Corner brackets */
        .brk { position: absolute; width: 20px; height: 20px; }
        .brk-tl { top:-1px; left:-1px;   border-top:2px solid rgba(0,255,200,0.6); border-left:2px solid rgba(0,255,200,0.6); }
        .brk-tr { top:-1px; right:-1px;  border-top:2px solid rgba(0,255,200,0.6); border-right:2px solid rgba(0,255,200,0.6); }
        .brk-bl { bottom:-1px; left:-1px;  border-bottom:2px solid rgba(0,255,200,0.6); border-left:2px solid rgba(0,255,200,0.6); }
        .brk-br { bottom:-1px; right:-1px; border-bottom:2px solid rgba(0,255,200,0.6); border-right:2px solid rgba(0,255,200,0.6); }
        body.si-light .brk-tl, body.si-light .brk-tr,
        body.si-light .brk-bl, body.si-light .brk-br { border-color: rgba(0,160,120,0.5); }

        /* Shimmer */
        .ask-panel::after {
          content: ''; position: absolute; top: 0; left: -120%; width: 55%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0,255,200,0.025), transparent);
          animation: sheen 6s ease-in-out infinite; pointer-events: none;
        }
        @keyframes sheen { 0%{left:-120%;} 100%{left:160%;} }

        .panel-status {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 24px; padding-bottom: 20px;
          border-bottom: 1px solid rgba(0,255,200,0.07);
          transition: border-color 0.35s;
        }
        body.si-light .panel-status { border-bottom-color: rgba(0,160,120,0.1); }

        .panel-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #00ffc8; box-shadow: 0 0 8px #00ffc8;
          animation: blink 1.8s ease-in-out infinite;
          transition: background 0.35s, box-shadow 0.35s;
        }
        body.si-light .panel-dot { background: #00a070; box-shadow: 0 0 8px rgba(0,160,120,0.5); }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }

        .panel-status-txt {
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(0,255,200,0.45);
          transition: color 0.35s;
        }
        body.si-light .panel-status-txt { color: rgba(0,120,80,0.6); }

        /* Particles */
        .particle { position: fixed; border-radius: 50%; pointer-events: none; z-index: 1; animation: floatup linear infinite; }
        @keyframes floatup {
          from { transform: translateY(105vh); opacity: 0; }
          10%  { opacity: 0.8; }
          85%  { opacity: 0.4; }
          to   { transform: translateY(-5vh); opacity: 0; }
        }
        body.si-light .particle { opacity: 0.4; }
      `}</style>

      <div className="ask-root">
        <div className="scanlines" />
        <div className="scan-beam" style={{ top: `${scanY}%` }} />

        {[...Array(10)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${5 + (i * 9.7) % 92}%`,
            width: i % 3 === 0 ? "3px" : "2px",
            height: i % 3 === 0 ? "3px" : "2px",
            background: i % 2 === 0 ? "rgba(0,255,200,0.55)" : "rgba(0,200,255,0.5)",
            boxShadow: `0 0 5px ${i % 2 === 0 ? "rgba(0,255,200,0.8)" : "rgba(0,200,255,0.8)"}`,
            animationDuration: `${8 + (i * 1.3) % 8}s`,
            animationDelay: `${(i * 0.8) % 7}s`,
          }} />
        ))}

        <div className={`ask-content ${mounted ? "on" : ""}`}>

          <div className="ask-heading">
            <div className="ask-eyebrow">// Submit a new query</div>
            <h1 className="ask-title">Ask a <span>Question</span></h1>
            <div className="ask-title-line" />
          </div>

          <div className="ask-tips">
            {[
              { label: "Be Specific",  text: "Narrow down your problem to a single, precise question." },
              { label: "Show Context", text: "Include relevant code, errors, and what you've already tried." },
              { label: "Add Tags",     text: "Tag your question with relevant technologies to reach experts." },
            ].map((t) => (
              <div className="tip-card" key={t.label}>
                <div className="tip-label">{t.label}</div>
                <div className="tip-text">{t.text}</div>
              </div>
            ))}
          </div>

          <div className="ask-panel">
            <div className="brk brk-tl" /><div className="brk brk-tr" />
            <div className="brk brk-bl" /><div className="brk brk-br" />
            <div className="panel-status">
              <div className="panel-dot" />
              <span className="panel-status-txt">New Question Interface — Ready</span>
            </div>
            <QuestionForm />
          </div>

        </div>
      </div>
    </>
  );
}