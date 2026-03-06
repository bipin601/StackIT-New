import { useState } from "react";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

export default function AnswerForm({ questionId, onAnswerPosted }) {
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { isLight } = useTheme();

  const charLimit = 8000;
  const bodyPct = Math.min((body.length / charLimit) * 100, 100);
  const isValid = body.trim().length >= 20;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) { setError("Answer must be at least 20 characters."); return; }
    setIsLoading(true); setError("");
    try {
      await api.post("/answers", { body: body.trim(), questionId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      setSuccess(true); setBody("");
      setTimeout(() => { setSuccess(false); if (onAnswerPosted) onAnswerPosted(); else window.location.reload(); }, 1200);
    } catch (err) {
      setError(err?.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
        .af-wrap { font-family:'Share Tech Mono',monospace; position:relative; border:1px solid rgba(0,255,200,0.1); background:rgba(2,12,20,0.6); backdrop-filter:blur(16px); padding:28px 30px 30px; margin-top:40px; transition:background 0.35s,border-color 0.35s; }
        body.si-light .af-wrap { background:rgba(230,250,244,0.7); border-color:rgba(0,160,120,0.15); }
        .af-brk { position:absolute; width:18px; height:18px; }
        .af-brk-tl { top:-1px;left:-1px;   border-top:2px solid rgba(0,255,200,0.55);border-left:2px solid rgba(0,255,200,0.55); }
        .af-brk-tr { top:-1px;right:-1px;  border-top:2px solid rgba(0,255,200,0.55);border-right:2px solid rgba(0,255,200,0.55); }
        .af-brk-bl { bottom:-1px;left:-1px;  border-bottom:2px solid rgba(0,255,200,0.55);border-left:2px solid rgba(0,255,200,0.55); }
        .af-brk-br { bottom:-1px;right:-1px; border-bottom:2px solid rgba(0,255,200,0.55);border-right:2px solid rgba(0,255,200,0.55); }
        body.si-light .af-brk-tl,body.si-light .af-brk-tr,body.si-light .af-brk-bl,body.si-light .af-brk-br { border-color:rgba(0,160,120,0.5); }
        .af-wrap::after { content:''; position:absolute; top:0; left:-120%; width:55%; height:100%; background:linear-gradient(90deg,transparent,rgba(0,255,200,0.02),transparent); animation:af-sheen 7s ease-in-out infinite; pointer-events:none; }
        @keyframes af-sheen { 0%{left:-120%;} 100%{left:160%;} }
        .af-header { display:flex; align-items:center; gap:10px; margin-bottom:22px; padding-bottom:18px; border-bottom:1px solid rgba(0,255,200,0.07); transition:border-color 0.35s; }
        body.si-light .af-header { border-bottom-color:rgba(0,160,120,0.1); }
        .af-dot { width:6px; height:6px; border-radius:50%; background:#00ffc8; box-shadow:0 0 8px #00ffc8; animation:af-blink 1.8s ease-in-out infinite; flex-shrink:0; transition:background 0.35s,box-shadow 0.35s; }
        body.si-light .af-dot { background:#00a070; box-shadow:0 0 8px rgba(0,160,120,0.5); }
        @keyframes af-blink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }
        .af-header-title { font-family:'Orbitron',sans-serif; font-size:13px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:#e6fff8; transition:color 0.35s; }
        body.si-light .af-header-title { color:#0a2820; }
        .af-header-title span { color:#00ffc8; transition:color 0.35s; }
        body.si-light .af-header-title span { color:#007850; }
        .af-header-line { flex:1; height:1px; background:linear-gradient(90deg,rgba(0,255,200,0.15),transparent); transition:background 0.35s; }
        body.si-light .af-header-line { background:linear-gradient(90deg,rgba(0,160,120,0.2),transparent); }
        .af-form { display:flex; flex-direction:column; gap:16px; }
        .af-label { display:flex; align-items:center; gap:8px; font-size:9px; letter-spacing:0.28em; text-transform:uppercase; color:rgba(0,255,200,0.5); transition:color 0.35s; }
        body.si-light .af-label { color:rgba(0,120,80,0.65); }
        .af-label-dash { width:16px; height:1px; background:rgba(0,255,200,0.35); transition:background 0.35s; }
        body.si-light .af-label-dash { background:rgba(0,160,120,0.4); }
        .af-hint { font-size:10px; color:rgba(255,255,255,0.25); letter-spacing:0.03em; margin-top:-10px; transition:color 0.35s; }
        body.si-light .af-hint { color:rgba(0,80,50,0.45); }
        .af-textarea-wrap { position:relative; }
        .af-textarea-wrap::after { content:''; position:absolute; bottom:0; left:0; height:1px; width:0; background:linear-gradient(90deg,#00ffc8,#00c8ff); box-shadow:0 0 8px #00ffc8; transition:width 0.35s ease; pointer-events:none; }
        .af-textarea-wrap:focus-within::after { width:100%; }
        body.si-light .af-textarea-wrap::after { background:linear-gradient(90deg,#00a070,#0088aa); box-shadow:0 0 8px rgba(0,160,120,0.4); }
        .af-textarea { width:100%; min-height:160px; background:rgba(0,255,200,0.03); border:1px solid rgba(0,255,200,0.13); color:#e6fff8; font-family:'Share Tech Mono',monospace; font-size:13px; line-height:1.7; padding:13px 14px; outline:none; resize:vertical; transition:border-color 0.25s,background 0.25s,box-shadow 0.25s,color 0.35s; border-radius:0; letter-spacing:0.03em; -webkit-appearance:none; }
        .af-textarea::placeholder { color:rgba(0,255,200,0.18); }
        .af-textarea:focus { border-color:rgba(0,255,200,0.5); background:rgba(0,255,200,0.05); box-shadow:0 0 22px rgba(0,255,200,0.07),inset 0 0 16px rgba(0,255,200,0.025); }
        body.si-light .af-textarea { background:rgba(0,140,100,0.04); border-color:rgba(0,140,100,0.18); color:#0a2820; }
        body.si-light .af-textarea::placeholder { color:rgba(0,100,70,0.3); }
        body.si-light .af-textarea:focus { border-color:rgba(0,160,120,0.45); background:rgba(0,160,120,0.05); box-shadow:0 0 18px rgba(0,160,120,0.07); }
        .af-footer { display:flex; align-items:center; justify-content:space-between; gap:12px; }
        .af-charbar-wrap { flex:1; max-width:140px; height:2px; background:rgba(0,255,200,0.08); position:relative; }
        body.si-light .af-charbar-wrap { background:rgba(0,160,120,0.1); }
        .af-charbar { position:absolute; left:0; top:0; height:100%; background:linear-gradient(90deg,#00ffc8,#00c8ff); box-shadow:0 0 6px rgba(0,255,200,0.5); transition:width 0.2s ease; }
        body.si-light .af-charbar { background:linear-gradient(90deg,#00a070,#0088aa); box-shadow:0 0 6px rgba(0,160,120,0.4); }
        .af-charcount { font-size:10px; color:rgba(0,255,200,0.3); letter-spacing:0.08em; transition:color 0.35s; }
        body.si-light .af-charcount { color:rgba(0,120,80,0.5); }
        .af-minlength { font-size:10px; letter-spacing:0.08em; transition:color 0.3s; }
        .af-minlength.ok  { color:rgba(0,255,200,0.5); }
        .af-minlength.bad { color:rgba(255,150,50,0.5); }
        body.si-light .af-minlength.ok  { color:rgba(0,140,90,0.7); }
        body.si-light .af-minlength.bad { color:rgba(200,100,0,0.6); }
        .af-error { display:flex; align-items:center; gap:9px; padding:10px 14px; background:rgba(255,60,60,0.07); border:1px solid rgba(255,60,60,0.28); font-size:11px; color:#ff7070; letter-spacing:0.04em; opacity:0; max-height:0; overflow:hidden; transition:opacity 0.3s,max-height 0.3s; }
        .af-error.on { opacity:1; max-height:60px; }
        .af-success { display:flex; align-items:center; gap:10px; padding:12px 16px; background:rgba(0,255,200,0.06); border:1px solid rgba(0,255,200,0.3); font-size:11px; color:#00ffc8; letter-spacing:0.08em; text-transform:uppercase; opacity:0; max-height:0; overflow:hidden; transition:opacity 0.35s,max-height 0.35s; }
        .af-success.on { opacity:1; max-height:60px; }
        body.si-light .af-success { background:rgba(0,160,120,0.07); border-color:rgba(0,160,120,0.3); color:#007850; }
        .af-success-icon { font-size:16px; }
        .af-submit-row { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; padding-top:4px; border-top:1px solid rgba(0,255,200,0.06); transition:border-color 0.35s; }
        body.si-light .af-submit-row { border-top-color:rgba(0,160,120,0.1); }
        .af-meta { font-size:10px; color:rgba(0,255,200,0.22); letter-spacing:0.1em; transition:color 0.35s; }
        body.si-light .af-meta { color:rgba(0,120,80,0.4); }
        .af-btn { display:flex; align-items:center; gap:9px; padding:13px 28px; background:transparent; border:1px solid rgba(0,255,200,0.4); color:#00ffc8; font-family:'Orbitron',sans-serif; font-size:10px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; cursor:pointer; position:relative; overflow:hidden; transition:color 0.3s,border-color 0.3s,box-shadow 0.3s; border-radius:0; }
        .af-btn::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(0,255,200,0.12),rgba(0,150,255,0.07)); opacity:0; transition:opacity 0.3s; }
        .af-btn:not(:disabled):hover::before { opacity:1; }
        .af-btn:not(:disabled):hover { border-color:#00ffc8; box-shadow:0 0 30px rgba(0,255,200,0.18); color:#fff; }
        .af-btn:disabled { opacity:0.32; cursor:not-allowed; }
        body.si-light .af-btn { border-color:rgba(0,160,120,0.4); color:#007850; }
        body.si-light .af-btn:not(:disabled):hover { border-color:#00a070; color:#002810; box-shadow:0 0 20px rgba(0,160,120,0.15); }
        .af-btn-icon { font-size:13px; }
        .af-loadbar { position:absolute; bottom:0; left:0; height:2px; width:100%; background:linear-gradient(90deg,transparent,#00ffc8,#00c8ff,transparent); animation:lbar 1.4s ease-in-out infinite; }
        @keyframes lbar { 0%{transform:translateX(-100%);} 100%{transform:translateX(100%);} }
      `}</style>

      <div className="af-wrap">
        <div className="af-brk af-brk-tl" /><div className="af-brk af-brk-tr" />
        <div className="af-brk af-brk-bl" /><div className="af-brk af-brk-br" />
        <div className="af-header">
          <div className="af-dot" />
          <span className="af-header-title">Post an <span>Answer</span></span>
          <div className="af-header-line" />
        </div>
        <form className="af-form" onSubmit={handleSubmit}>
          <label className="af-label"><span className="af-label-dash" />Your Response</label>
          <p className="af-hint">Be thorough — include code examples and explanations where relevant.</p>
          <div className="af-textarea-wrap">
            <textarea className="af-textarea" value={body}
              onChange={(e) => { setBody(e.target.value); setError(""); }}
              placeholder="Write your answer here…" maxLength={charLimit} />
          </div>
          <div className="af-footer">
            <div className="af-charbar-wrap"><div className="af-charbar" style={{ width: `${bodyPct}%` }} /></div>
            <span className="af-charcount">{body.length} / {charLimit.toLocaleString()}</span>
            <span className={`af-minlength ${isValid ? "ok" : "bad"}`}>
              {isValid ? "✓ min length ok" : `${Math.max(0, 20 - body.trim().length)} chars to go`}
            </span>
          </div>
          <div className={`af-error ${error ? "on" : ""}`}><span style={{fontSize:15}}>⚠</span><span>{error}</span></div>
          <div className={`af-success ${success ? "on" : ""}`}><span className="af-success-icon">✓</span><span>Answer submitted — refreshing…</span></div>
          <div className="af-submit-row">
            <span className="af-meta">{isValid ? "// ready to transmit" : "// answer too short"}</span>
            <button className="af-btn" type="submit" disabled={isLoading || !isValid || success}>
              {isLoading
                ? <><span>Posting</span><div className="af-loadbar" /></>
                : <><span className="af-btn-icon">▶</span><span>Post Answer</span></>}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}