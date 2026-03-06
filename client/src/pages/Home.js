import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import QuestionList from "../components/QuestionList";

function normaliseTags(tags = []) {
  return tags
    .map(t => (typeof t === "string" ? t : t?.name))
    .filter(Boolean);
}

export default function Home() {
  const [mounted, setMounted]           = useState(false);
  const [scanY, setScanY]               = useState(0);
  const [activeTag, setActiveTag]       = useState(null);
  const [activeFilter, setActiveFilter] = useState("Latest");
  const [tags, setTags]                 = useState([]);
  const [tagsLoading, setTagsLoading]   = useState(true);
  const [totalQuestions, setTotalQuestions] = useState(null);
  const [theme, setTheme]               = useState(() => localStorage.getItem("si-theme") || "dark");
  const [searchParams]                  = useSearchParams();
  const navigate                        = useNavigate();

  const searchQuery = searchParams.get("search") || "";
  const isLight = theme === "light";

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
    const iv = setInterval(() => setScanY(v => (v + 0.5) % 100), 22);
    return () => clearInterval(iv);
  }, []);

  // Listen for theme changes dispatched by Header
  useEffect(() => {
    const handler = (e) => setTheme(e.detail);
    window.addEventListener("si-theme-change", handler);
    return () => window.removeEventListener("si-theme-change", handler);
  }, []);

  useEffect(() => {
    const load = async () => {
      setTagsLoading(true);
      try {
        const res = await api.get("/questions");
        const questions = Array.isArray(res.data)
          ? res.data
          : res.data?.questions ?? res.data?.data ?? [];
        setTotalQuestions(res.data?.total ?? res.data?.count ?? questions.length);
        const tagMap = {};
        questions.forEach(q => {
          normaliseTags(q.tags).forEach(name => {
            tagMap[name] = (tagMap[name] || 0) + 1;
          });
        });
        const sorted = Object.entries(tagMap)
          .sort(([, a], [, b]) => b - a)
          .map(([name, count]) => ({ name, count }));
        setTags(sorted);
      } catch {
        setTags([]);
      } finally {
        setTagsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;900&family=Share+Tech+Mono&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Dark theme (default) ── */
        body { background: #020c14; overflow-x: hidden; transition: background 0.4s; }
        body.si-light { background: #edf8f4; }

        .home-root {
          min-height: 100vh;
          background: #020c14;
          font-family: 'Share Tech Mono', monospace;
          position: relative; overflow: hidden;
          transition: background 0.4s;
        }
        body.si-light .home-root { background: #edf8f4; }

        /* Grid background */
        .home-root::before {
          content: ''; position: fixed; inset: 0;
          background-image: linear-gradient(rgba(0,255,200,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,200,0.025) 1px, transparent 1px);
          background-size: 52px 52px; pointer-events: none; z-index: 0;
          transition: opacity 0.4s;
        }
        body.si-light .home-root::before {
          background-image: linear-gradient(rgba(0,160,120,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,160,120,0.06) 1px, transparent 1px);
        }
        .home-root::after {
          content: ''; position: fixed; inset: 0;
          background: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,40,60,0.9) 0%, transparent 70%);
          pointer-events: none; z-index: 0; transition: opacity 0.4s;
        }
        body.si-light .home-root::after {
          background: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,180,140,0.08) 0%, transparent 70%);
        }

        .scanlines { position:fixed; inset:0; z-index:1; background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px); pointer-events:none; transition:opacity 0.4s; }
        body.si-light .scanlines { opacity: 0.3; }
        .scan-beam { position:fixed; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,rgba(0,255,200,0.12),rgba(0,255,200,0.4),rgba(0,200,255,0.3),transparent); z-index:2; pointer-events:none; filter:blur(1px); transition:opacity 0.4s; }
        body.si-light .scan-beam { opacity: 0.2; }

        /* Stats bar */
        .statsbar {
          position:relative; z-index:10;
          border-bottom:1px solid rgba(0,255,200,0.08);
          background:rgba(2,12,20,0.85); backdrop-filter:blur(20px);
          padding:0 32px; height:44px; display:flex; align-items:center;
          justify-content:flex-end; gap:24px;
          opacity:0; transform:translateY(-6px);
          transition:opacity 0.6s ease, transform 0.6s ease, background 0.4s, border-color 0.4s;
        }
        .statsbar.on { opacity:1; transform:translateY(0); }
        body.si-light .statsbar { background:rgba(220,245,238,0.9); border-bottom-color:rgba(0,160,120,0.12); }
        .stat { font-size:10px; letter-spacing:0.15em; color:rgba(0,255,200,0.35); text-transform:uppercase; transition:color 0.4s; }
        .stat strong { color:rgba(0,255,200,0.8); margin-right:4px; transition:color 0.4s; }
        body.si-light .stat { color:rgba(0,120,80,0.5); }
        body.si-light .stat strong { color:rgba(0,120,80,0.9); }
        .stat-dot { width:5px; height:5px; border-radius:50%; background:#00ffc8; box-shadow:0 0 6px #00ffc8; animation:blink 1.8s ease-in-out infinite; transition:background 0.4s, box-shadow 0.4s; }
        body.si-light .stat-dot { background:#00a070; box-shadow:0 0 6px rgba(0,160,120,0.6); }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }

        /* Layout */
        .layout {
          position:relative; z-index:5; display:flex; max-width:1200px;
          margin:0 auto; padding:32px 24px; gap:28px;
          opacity:0; transform:translateY(20px);
          transition:opacity 0.7s 0.2s ease, transform 0.7s 0.2s ease;
        }
        .layout.on { opacity:1; transform:translateY(0); }

        /* Sidebar */
        .sidebar { width:210px; flex-shrink:0; }
        .sidebar-hdr { display:flex; align-items:center; gap:8px; margin-bottom:14px; }
        .sidebar-title { font-family:'Orbitron',sans-serif; font-size:11px; font-weight:600; letter-spacing:0.28em; text-transform:uppercase; color:rgba(0,255,200,0.65); transition:color 0.4s; }
        body.si-light .sidebar-title { color:rgba(0,120,80,0.75); }
        .sidebar-line { flex:1; height:1px; background:linear-gradient(90deg,rgba(0,255,200,0.25),transparent); transition:background 0.4s; }
        body.si-light .sidebar-line { background:linear-gradient(90deg,rgba(0,160,120,0.3),transparent); }

        .tag-skel { height:34px; margin-bottom:4px; background:linear-gradient(90deg,rgba(0,255,200,0.04) 25%,rgba(0,255,200,0.07) 50%,rgba(0,255,200,0.04) 75%); background-size:200% 100%; animation:skel 1.4s ease-in-out infinite; border:1px solid rgba(0,255,200,0.05); }
        body.si-light .tag-skel { background:linear-gradient(90deg,rgba(0,160,120,0.05) 25%,rgba(0,160,120,0.1) 50%,rgba(0,160,120,0.05) 75%); background-size:200% 100%; border-color:rgba(0,160,120,0.08); }
        @keyframes skel { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }

        .tag-empty { font-size:10px; color:rgba(0,255,200,0.2); letter-spacing:0.15em; text-transform:uppercase; padding:10px 0; }
        body.si-light .tag-empty { color:rgba(0,120,80,0.3); }

        .tag-item {
          display:flex; align-items:center; justify-content:space-between;
          padding:8px 12px; margin-bottom:4px;
          border:1px solid rgba(0,255,200,0.07); background:rgba(0,255,200,0.02);
          cursor:pointer; position:relative; overflow:hidden;
          transition:border-color 0.2s, background 0.2s, transform 0.15s;
        }
        .tag-item::before { content:''; position:absolute; left:0; top:0; bottom:0; width:0; background:rgba(0,255,200,0.05); transition:width 0.25s ease; }
        .tag-item:hover::before, .tag-item.active::before { width:100%; }
        .tag-item:hover, .tag-item.active { border-color:rgba(0,255,200,0.35); transform:translateX(3px); }
        .tag-item.active { border-color:rgba(0,255,200,0.55); }
        body.si-light .tag-item { border-color:rgba(0,160,120,0.1); background:rgba(0,160,120,0.02); }
        body.si-light .tag-item::before { background:rgba(0,160,120,0.06); }
        body.si-light .tag-item:hover, body.si-light .tag-item.active { border-color:rgba(0,160,120,0.4); }
        body.si-light .tag-item.active { border-color:rgba(0,160,120,0.6); }

        .tag-left { display:flex; align-items:center; gap:7px; font-size:12px; color:rgba(0,255,200,0.65); letter-spacing:0.04em; transition:color 0.2s; }
        .tag-item.active .tag-left { color:#00ffc8; }
        body.si-light .tag-left { color:rgba(0,120,80,0.7); }
        body.si-light .tag-item.active .tag-left { color:#007850; }

        .tag-arrow { font-size:8px; color:rgba(0,255,200,0.25); transition:color 0.2s; }
        .tag-item:hover .tag-arrow, .tag-item.active .tag-arrow { color:#00ffc8; }
        body.si-light .tag-arrow { color:rgba(0,140,100,0.3); }
        body.si-light .tag-item:hover .tag-arrow, body.si-light .tag-item.active .tag-arrow { color:#007850; }

        .tag-count { font-size:10px; color:rgba(0,200,255,0.4); letter-spacing:0.04em; transition:color 0.4s; }
        body.si-light .tag-count { color:rgba(0,120,160,0.5); }

        /* Main content */
        .main { flex:1; min-width:0; }
        .main-hdr { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
        .main-eyebrow { font-size:9px; letter-spacing:0.3em; text-transform:uppercase; color:rgba(0,255,200,0.38); margin-bottom:5px; transition:color 0.4s; }
        body.si-light .main-eyebrow { color:rgba(0,120,80,0.5); }
        .main-title { font-family:'Orbitron',sans-serif; font-size:22px; font-weight:900; color:#e6fff8; letter-spacing:0.08em; text-transform:uppercase; transition:color 0.4s; }
        body.si-light .main-title { color:#0a2820; }
        .main-title span { color:#00ffc8; transition:color 0.4s; }
        body.si-light .main-title span { color:#007850; }

        .search-indicator { display:inline-flex; align-items:center; gap:8px; margin-top:6px; padding:3px 10px 3px 12px; border:1px solid rgba(0,255,200,0.25); background:rgba(0,255,200,0.04); font-size:11px; color:rgba(0,255,200,0.7); letter-spacing:0.06em; transition:all 0.4s; }
        .search-indicator button { background:none; border:none; color:rgba(0,255,200,0.4); cursor:pointer; font-size:14px; padding:0; transition:color 0.2s; }
        .search-indicator button:hover { color:#00ffc8; }
        body.si-light .search-indicator { border-color:rgba(0,160,120,0.3); background:rgba(0,160,120,0.05); color:rgba(0,120,80,0.8); }
        body.si-light .search-indicator button { color:rgba(0,140,100,0.5); }
        body.si-light .search-indicator button:hover { color:#007850; }

        .ask-btn {
          display:flex; align-items:center; gap:8px; padding:10px 20px;
          background:transparent; border:1px solid rgba(0,255,200,0.4);
          color:#00ffc8; font-family:'Orbitron',sans-serif; font-size:10px;
          font-weight:700; letter-spacing:0.25em; text-transform:uppercase;
          cursor:pointer; position:relative; overflow:hidden;
          transition:border-color 0.25s, box-shadow 0.25s, color 0.25s;
        }
        .ask-btn::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(0,255,200,0.1),rgba(0,150,255,0.06)); opacity:0; transition:opacity 0.25s; }
        .ask-btn:hover::before { opacity:1; }
        .ask-btn:hover { border-color:#00ffc8; box-shadow:0 0 24px rgba(0,255,200,0.14); color:#fff; }
        body.si-light .ask-btn { border-color:rgba(0,160,120,0.45); color:#007850; }
        body.si-light .ask-btn:hover { border-color:#00a070; color:#002810; box-shadow:0 0 20px rgba(0,160,120,0.15); }

        .filter-bar { display:flex; align-items:center; gap:6px; margin-bottom:18px; padding-bottom:14px; border-bottom:1px solid rgba(0,255,200,0.06); flex-wrap:wrap; transition:border-color 0.4s; }
        body.si-light .filter-bar { border-bottom-color:rgba(0,160,120,0.1); }

        .filter-btn { padding:5px 13px; font-family:'Share Tech Mono',monospace; font-size:10px; letter-spacing:0.15em; text-transform:uppercase; background:transparent; border:1px solid rgba(0,255,200,0.1); color:rgba(0,255,200,0.38); cursor:pointer; transition:border-color 0.2s,color 0.2s,background 0.2s; }
        .filter-btn:hover { border-color:rgba(0,255,200,0.3); color:rgba(0,255,200,0.7); }
        .filter-btn.active { border-color:rgba(0,255,200,0.5); color:#00ffc8; background:rgba(0,255,200,0.05); }
        body.si-light .filter-btn { border-color:rgba(0,160,120,0.12); color:rgba(0,120,80,0.45); }
        body.si-light .filter-btn:hover { border-color:rgba(0,160,120,0.3); color:rgba(0,120,80,0.8); }
        body.si-light .filter-btn.active { border-color:rgba(0,160,120,0.55); color:#007850; background:rgba(0,160,120,0.07); }

        .filter-sep { flex:1; }
        .result-count { font-size:10px; letter-spacing:0.1em; color:rgba(0,255,200,0.28); transition:color 0.4s; }
        body.si-light .result-count { color:rgba(0,120,80,0.45); }

        .tag-pill { display:inline-flex; align-items:center; gap:8px; padding:4px 10px 4px 12px; border:1px solid rgba(0,255,200,0.28); background:rgba(0,255,200,0.05); font-size:11px; color:rgba(0,255,200,0.75); letter-spacing:0.08em; margin-bottom:14px; transition:all 0.4s; }
        .tag-pill button { background:none; border:none; color:rgba(0,255,200,0.4); cursor:pointer; font-size:15px; line-height:1; padding:0; transition:color 0.2s; }
        .tag-pill button:hover { color:#00ffc8; }
        body.si-light .tag-pill { border-color:rgba(0,160,120,0.3); background:rgba(0,160,120,0.06); color:rgba(0,120,80,0.8); }
        body.si-light .tag-pill button { color:rgba(0,140,100,0.5); }
        body.si-light .tag-pill button:hover { color:#007850; }

        .panel { position:relative; border:1px solid rgba(0,255,200,0.1); padding:24px; background:rgba(2,12,20,0.5); backdrop-filter:blur(12px); transition:border-color 0.4s, background 0.4s; }
        body.si-light .panel { border-color:rgba(0,160,120,0.12); background:rgba(255,255,255,0.55); }
        .pb { position:absolute; width:16px; height:16px; }
        .pb-tl { top:-1px; left:-1px;   border-top:1px solid rgba(0,255,200,0.5); border-left:1px solid rgba(0,255,200,0.5); transition:border-color 0.4s; }
        .pb-tr { top:-1px; right:-1px;  border-top:1px solid rgba(0,255,200,0.5); border-right:1px solid rgba(0,255,200,0.5); transition:border-color 0.4s; }
        .pb-bl { bottom:-1px; left:-1px;  border-bottom:1px solid rgba(0,255,200,0.5); border-left:1px solid rgba(0,255,200,0.5); transition:border-color 0.4s; }
        .pb-br { bottom:-1px; right:-1px; border-bottom:1px solid rgba(0,255,200,0.5); border-right:1px solid rgba(0,255,200,0.5); transition:border-color 0.4s; }
        body.si-light .pb-tl, body.si-light .pb-tr, body.si-light .pb-bl, body.si-light .pb-br { border-color:rgba(0,160,120,0.45); }
      `}</style>

      <div className="home-root">
        <div className="scanlines" />
        <div className="scan-beam" style={{ top: `${scanY}%` }} />

        <div className={`statsbar ${mounted ? "on" : ""}`}>
          {totalQuestions !== null && (
            <div className="stat"><strong>{totalQuestions.toLocaleString()}</strong> questions</div>
          )}
          {tags.length > 0 && (
            <div className="stat"><strong>{tags.length}</strong> tags</div>
          )}
          <div className="stat-dot" />
        </div>

        <div className={`layout ${mounted ? "on" : ""}`}>
          <aside className="sidebar">
            <div className="sidebar-hdr">
              <span className="sidebar-title">Tags</span>
              <div className="sidebar-line" />
            </div>
            {tagsLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="tag-skel" style={{ width: `${68 + (i * 8) % 30}%` }} />
              ))
            ) : tags.length === 0 ? (
              <div className="tag-empty">// No tags yet</div>
            ) : (
              tags.map(({ name, count }) => (
                <div
                  key={name}
                  className={`tag-item ${activeTag === name ? "active" : ""}`}
                  onClick={() => setActiveTag(prev => prev === name ? null : name)}
                >
                  <div className="tag-left">
                    <span className="tag-arrow">▶</span>
                    {name}
                  </div>
                  <span className="tag-count">{count}</span>
                </div>
              ))
            )}
          </aside>

          <main className="main">
            <div className="main-hdr">
              <div>
                <div className="main-eyebrow">// Browse knowledge base</div>
                <h1 className="main-title">All <span>Questions</span></h1>
                {searchQuery && (
                  <div className="search-indicator">
                    <span>search: {searchQuery}</span>
                    <button onClick={() => navigate("/")}>×</button>
                  </div>
                )}
              </div>
              <button className="ask-btn" onClick={() => navigate("/ask")}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
                Ask Question
              </button>
            </div>

            <div className="filter-bar">
              {["Latest", "Active", "Unanswered", "Hot"].map(f => (
                <button
                  key={f}
                  className={`filter-btn ${activeFilter === f ? "active" : ""}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
              <div className="filter-sep" />
              <span className="result-count">
                {activeTag
                  ? `tag: ${activeTag}`
                  : searchQuery
                  ? `results for "${searchQuery}"`
                  : totalQuestions !== null
                  ? `${totalQuestions.toLocaleString()} questions`
                  : ""}
              </span>
            </div>

            {activeTag && (
              <div className="tag-pill">
                <span>tag: {activeTag}</span>
                <button onClick={() => setActiveTag(null)}>×</button>
              </div>
            )}

            <div className="panel">
              <div className="pb pb-tl" /><div className="pb pb-tr" />
              <div className="pb pb-bl" /><div className="pb pb-br" />
              <QuestionList
                activeTag={activeTag}
                filter={activeFilter}
                search={searchQuery}
              />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}