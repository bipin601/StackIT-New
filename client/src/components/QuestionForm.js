import { useState, useRef } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function QuestionForm() {
  const [title, setTitle]       = useState("");
  const [body, setBody]         = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags]         = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);
  const { isLight } = useTheme();

  const tagInputRef = useRef("");
  const tagsRef     = useRef([]);
  const navigate    = useNavigate();
  const charLimit   = 10000;
  const bodyPct     = Math.min((body.length / charLimit) * 100, 100);

  const syncTags = (next) => { tagsRef.current = next; setTags(next); };
  const syncTagInput = (val) => { tagInputRef.current = val; setTagInput(val); };

  const commitTag = (raw, currentTags) => {
    const val = raw.trim().toLowerCase().replace(/[^a-z0-9.\-+#_]/g, "");
    if (val && !currentTags.includes(val) && currentTags.length < 6) {
      const next = [...currentTags, val]; syncTags(next); syncTagInput(""); return next;
    }
    syncTagInput(""); return currentTags;
  };

  const handleTagKeyDown = (e) => {
    if (["Enter", ",", "Tab"].includes(e.key)) { e.preventDefault(); commitTag(tagInputRef.current, tagsRef.current); }
    if (e.key === "Backspace" && !tagInputRef.current && tagsRef.current.length) syncTags(tagsRef.current.slice(0,-1));
  };
  const handleTagBlur = () => { if (tagInputRef.current.trim()) commitTag(tagInputRef.current, tagsRef.current); };
  const removeTag = (t) => syncTags(tagsRef.current.filter(x => x !== t));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError("Title is required."); return; }
    if (!body.trim())  { setError("Body is required.");  return; }
    const finalTags = tagInputRef.current.trim() ? commitTag(tagInputRef.current, tagsRef.current) : tagsRef.current;
    setIsLoading(true); setError("");
    try {
      await api.post("/questions", { title: title.trim(), body: body.trim(), tags: finalTags });
      setSuccess(true);
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error ||
        (err?.response?.status === 401 ? "You must be logged in to post." :
         err?.response?.status === 400 ? "Invalid data — check your inputs." : "Submission failed. Please try again.");
      setError(msg);
    } finally { setIsLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
        .qf { font-family:'Share Tech Mono',monospace; display:flex; flex-direction:column; gap:28px; }
        .qf-field { display:flex; flex-direction:column; gap:8px; }
        .qf-label { display:flex; align-items:center; gap:8px; font-size:9px; letter-spacing:0.28em; text-transform:uppercase; color:rgba(0,255,200,0.5); transition:color 0.35s; }
        body.si-light .qf-label { color:rgba(0,120,80,0.65); }
        .qf-label-dash { width:18px; height:1px; background:rgba(0,255,200,0.35); transition:background 0.35s; }
        body.si-light .qf-label-dash { background:rgba(0,160,120,0.4); }
        .qf-label-req { color:rgba(0,255,200,0.3); margin-left:2px; }
        body.si-light .qf-label-req { color:rgba(0,160,120,0.4); }
        .qf-hint { font-size:10px; color:rgba(255,255,255,0.25); letter-spacing:0.04em; line-height:1.5; margin-top:-4px; transition:color 0.35s; }
        body.si-light .qf-hint { color:rgba(0,80,50,0.45); }
        .qf-input-wrap { position:relative; }
        .qf-input-wrap::after { content:''; position:absolute; bottom:0; left:0; height:1px; width:0; background:linear-gradient(90deg,#00ffc8,#00c8ff); box-shadow:0 0 8px #00ffc8; transition:width 0.35s ease; pointer-events:none; }
        .qf-input-wrap:focus-within::after { width:100%; }
        body.si-light .qf-input-wrap::after { background:linear-gradient(90deg,#00a070,#0088aa); box-shadow:0 0 8px rgba(0,160,120,0.4); }
        .qf-input, .qf-textarea { width:100%; background:rgba(0,255,200,0.03); border:1px solid rgba(0,255,200,0.13); color:#e6fff8; font-family:'Share Tech Mono',monospace; font-size:13px; padding:12px 14px; outline:none; transition:border-color 0.25s,background 0.25s,box-shadow 0.25s,color 0.35s; border-radius:0; -webkit-appearance:none; letter-spacing:0.03em; resize:none; }
        .qf-input::placeholder,.qf-textarea::placeholder { color:rgba(0,255,200,0.18); }
        .qf-input:focus,.qf-textarea:focus { border-color:rgba(0,255,200,0.5); background:rgba(0,255,200,0.05); box-shadow:0 0 22px rgba(0,255,200,0.07),inset 0 0 16px rgba(0,255,200,0.025); }
        body.si-light .qf-input,body.si-light .qf-textarea { background:rgba(0,140,100,0.04); border-color:rgba(0,140,100,0.18); color:#0a2820; }
        body.si-light .qf-input::placeholder,body.si-light .qf-textarea::placeholder { color:rgba(0,100,70,0.3); }
        body.si-light .qf-input:focus,body.si-light .qf-textarea:focus { border-color:rgba(0,160,120,0.45); background:rgba(0,160,120,0.05); box-shadow:0 0 18px rgba(0,160,120,0.07); }
        .qf-textarea { min-height:200px; line-height:1.65; }
        .qf-textarea-footer { display:flex; justify-content:space-between; align-items:center; margin-top:6px; }
        .qf-charbar-wrap { flex:1; max-width:160px; height:2px; background:rgba(0,255,200,0.08); position:relative; }
        body.si-light .qf-charbar-wrap { background:rgba(0,160,120,0.1); }
        .qf-charbar { position:absolute; left:0; top:0; height:100%; background:linear-gradient(90deg,#00ffc8,#00c8ff); box-shadow:0 0 6px rgba(0,255,200,0.5); transition:width 0.2s ease; }
        body.si-light .qf-charbar { background:linear-gradient(90deg,#00a070,#0088aa); }
        .qf-charcount { font-size:10px; color:rgba(0,255,200,0.3); letter-spacing:0.08em; transition:color 0.35s; }
        body.si-light .qf-charcount { color:rgba(0,120,80,0.5); }
        .qf-tag-box { display:flex; flex-wrap:wrap; align-items:center; gap:7px; background:rgba(0,255,200,0.03); border:1px solid rgba(0,255,200,0.13); padding:9px 12px; cursor:text; transition:border-color 0.25s,background 0.25s,box-shadow 0.25s; min-height:46px; }
        .qf-tag-box:focus-within { border-color:rgba(0,255,200,0.5); background:rgba(0,255,200,0.05); box-shadow:0 0 22px rgba(0,255,200,0.07); }
        body.si-light .qf-tag-box { background:rgba(0,140,100,0.04); border-color:rgba(0,140,100,0.18); }
        body.si-light .qf-tag-box:focus-within { border-color:rgba(0,160,120,0.45); background:rgba(0,160,120,0.05); }
        .qf-tag { display:inline-flex; align-items:center; gap:6px; padding:3px 9px 3px 10px; border:1px solid rgba(0,255,200,0.3); background:rgba(0,255,200,0.06); font-size:11px; color:rgba(0,255,200,0.85); letter-spacing:0.06em; animation:tag-pop 0.2s ease; }
        body.si-light .qf-tag { border-color:rgba(0,160,120,0.3); background:rgba(0,160,120,0.08); color:rgba(0,100,60,0.9); }
        @keyframes tag-pop { from{transform:scale(0.8);opacity:0;} to{transform:scale(1);opacity:1;} }
        .qf-tag-remove { background:none; border:none; padding:0; color:rgba(0,255,200,0.4); font-size:13px; cursor:pointer; line-height:1; transition:color 0.15s; }
        .qf-tag-remove:hover { color:#ff7070; }
        .qf-tag-input { flex:1; min-width:120px; background:none; border:none; outline:none; color:#e6fff8; font-family:'Share Tech Mono',monospace; font-size:13px; letter-spacing:0.04em; transition:color 0.35s; }
        body.si-light .qf-tag-input { color:#0a2820; }
        .qf-tag-input::placeholder { color:rgba(0,255,200,0.18); }
        body.si-light .qf-tag-input::placeholder { color:rgba(0,100,70,0.3); }
        .qf-tag-hint { font-size:10px; color:rgba(0,255,200,0.25); letter-spacing:0.08em; transition:color 0.35s; }
        body.si-light .qf-tag-hint { color:rgba(0,120,80,0.4); }
        .qf-tag-preview { font-size:10px; color:rgba(0,255,200,0.28); letter-spacing:0.07em; margin-top:-2px; transition:color 0.35s; }
        body.si-light .qf-tag-preview { color:rgba(0,100,60,0.4); }
        .qf-tag-preview span { color:rgba(0,255,200,0.55); }
        body.si-light .qf-tag-preview span { color:rgba(0,120,70,0.7); }
        .qf-msg { display:flex; align-items:center; gap:10px; padding:11px 14px; font-size:11px; letter-spacing:0.04em; opacity:0; max-height:0; overflow:hidden; margin-bottom:0; transition:opacity 0.3s,max-height 0.35s,margin-bottom 0.3s; }
        .qf-msg.on { opacity:1; max-height:60px; margin-bottom:0; }
        .qf-msg-err { background:rgba(255,60,60,0.07); border:1px solid rgba(255,60,60,0.28); color:#ff7070; }
        .qf-msg-ok  { background:rgba(0,255,200,0.07); border:1px solid rgba(0,255,200,0.3); color:#00ffc8; }
        body.si-light .qf-msg-ok { background:rgba(0,160,120,0.07); border-color:rgba(0,160,120,0.3); color:#007850; }
        .qf-divider { height:1px; background:linear-gradient(90deg,rgba(0,255,200,0.12),transparent); transition:background 0.35s; }
        body.si-light .qf-divider { background:linear-gradient(90deg,rgba(0,160,120,0.15),transparent); }
        .qf-submit-row { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
        .qf-submit-meta { font-size:10px; color:rgba(0,255,200,0.25); letter-spacing:0.1em; transition:color 0.35s; }
        body.si-light .qf-submit-meta { color:rgba(0,120,80,0.4); }
        .qf-btn { display:flex; align-items:center; gap:10px; padding:14px 32px; background:transparent; border:1px solid rgba(0,255,200,0.45); color:#00ffc8; font-family:'Orbitron',sans-serif; font-size:11px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; cursor:pointer; position:relative; overflow:hidden; transition:color 0.3s,border-color 0.3s,box-shadow 0.3s; border-radius:0; }
        .qf-btn::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(0,255,200,0.12),rgba(0,150,255,0.07)); opacity:0; transition:opacity 0.3s; }
        .qf-btn:not(:disabled):hover::before { opacity:1; }
        .qf-btn:not(:disabled):hover { border-color:#00ffc8; box-shadow:0 0 32px rgba(0,255,200,0.18); color:#fff; }
        .qf-btn:disabled { opacity:0.35; cursor:not-allowed; }
        body.si-light .qf-btn { border-color:rgba(0,160,120,0.4); color:#007850; }
        body.si-light .qf-btn:not(:disabled):hover { border-color:#00a070; color:#002810; box-shadow:0 0 20px rgba(0,160,120,0.15); }
        .qf-load-bar { position:absolute; bottom:0; left:0; height:2px; width:100%; background:linear-gradient(90deg,transparent,#00ffc8,#00c8ff,transparent); animation:lbar 1.4s ease-in-out infinite; }
        @keyframes lbar { 0%{transform:translateX(-100%);} 100%{transform:translateX(100%);} }
        .qf-btn-icon { font-size:14px; }
      `}</style>

      <form className="qf" onSubmit={handleSubmit}>
        <div className="qf-field">
          <label className="qf-label"><span className="qf-label-dash" />Title<span className="qf-label-req">*</span></label>
          <p className="qf-hint">Summarise your problem in one clear sentence.</p>
          <div className="qf-input-wrap">
            <input className="qf-input" type="text" value={title}
              onChange={e => { setTitle(e.target.value); setError(""); }}
              placeholder="e.g. How do I reverse a linked list in Python?" maxLength={150} />
          </div>
        </div>
        <div className="qf-field">
          <label className="qf-label"><span className="qf-label-dash" />Body<span className="qf-label-req">*</span></label>
          <p className="qf-hint">Include all context — code snippets, errors, and what you've tried.</p>
          <div className="qf-input-wrap">
            <textarea className="qf-textarea" value={body}
              onChange={e => { setBody(e.target.value); setError(""); }}
              placeholder="Describe your problem in detail..." maxLength={charLimit} />
          </div>
          <div className="qf-textarea-footer">
            <div className="qf-charbar-wrap"><div className="qf-charbar" style={{ width: `${bodyPct}%` }} /></div>
            <span className="qf-charcount">{body.length} / {charLimit.toLocaleString()}</span>
          </div>
        </div>
        <div className="qf-field">
          <label className="qf-label"><span className="qf-label-dash" />Tags</label>
          <p className="qf-hint">Up to 6. Press <strong style={{color:"rgba(0,255,200,0.5)"}}>Enter</strong> or <strong style={{color:"rgba(0,255,200,0.5)"}}>comma</strong> to add.</p>
          <div className="qf-tag-box" onClick={e => e.currentTarget.querySelector("input")?.focus()}>
            {tags.map(t => (
              <span className="qf-tag" key={t}>{t}
                <button type="button" className="qf-tag-remove" onClick={() => removeTag(t)}>×</button>
              </span>
            ))}
            <input className="qf-tag-input" value={tagInput}
              onChange={e => syncTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown} onBlur={handleTagBlur}
              placeholder={tags.length === 0 ? "python, react, sql…" : tags.length < 6 ? "add more…" : ""}
              disabled={tags.length >= 6} />
          </div>
          {tags.length >= 6 && <span className="qf-tag-hint">Maximum 6 tags reached.</span>}
          {(tags.length > 0 || tagInput.trim()) && (
            <div className="qf-tag-preview">
              Sending: <span>[{[...tags, ...(tagInput.trim() ? [tagInput.trim().toLowerCase().replace(/[^a-z0-9.\-+#_]/g,"")] : [])].map(t=>`"${t}"`).join(", ")}]</span>
            </div>
          )}
        </div>
        <div className="qf-divider" />
        <div className={`qf-msg qf-msg-err ${error ? "on" : ""}`}><span style={{fontSize:15}}>⚠</span><span>{error}</span></div>
        <div className={`qf-msg qf-msg-ok ${success ? "on" : ""}`}><span style={{fontSize:15}}>✓</span><span>Question posted! Redirecting…</span></div>
        <div className="qf-submit-row">
          <span className="qf-submit-meta">
            {success ? "// posted successfully"
              : [title && "title", body && "body", tags.length > 0 && `${tags.length} tag${tags.length>1?"s":""}`].filter(Boolean).join(" · ") || "// fill in required fields"}
          </span>
          <button className="qf-btn" type="submit" disabled={isLoading || success || !title.trim() || !body.trim()}>
            {isLoading ? <><span>Submitting</span><div className="qf-load-bar" /></>
              : success ? <><span>✓</span><span>Posted</span></>
              : <><span className="qf-btn-icon">▶</span><span>Submit Query</span></>}
          </button>
        </div>
      </form>
    </>
  );
}