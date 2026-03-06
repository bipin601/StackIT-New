import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { toggleTheme, isLight } = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/?search=${encodeURIComponent(search.trim())}`);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;900&family=Share+Tech+Mono&display=swap');
        .hdr { position:sticky; top:0; z-index:100; font-family:'Share Tech Mono',monospace; border-bottom:1px solid rgba(0,255,200,0.1); background:rgba(2,12,20,0.88); backdrop-filter:blur(24px); opacity:0; transform:translateY(-8px); transition:opacity 0.5s ease,transform 0.5s ease,background 0.35s,box-shadow 0.35s,border-color 0.35s; }
        .hdr.on { opacity:1; transform:translateY(0); }
        .hdr.scrolled { background:rgba(2,10,18,0.97); border-bottom-color:rgba(0,255,200,0.18); box-shadow:0 4px 40px rgba(0,0,0,0.6),0 1px 0 rgba(0,255,200,0.08); }
        body.si-light .hdr { background:rgba(240,250,248,0.92); border-bottom-color:rgba(0,160,120,0.18); }
        body.si-light .hdr.scrolled { background:rgba(235,248,244,0.98); border-bottom-color:rgba(0,160,120,0.3); box-shadow:0 4px 40px rgba(0,80,60,0.1),0 1px 0 rgba(0,160,120,0.1); }
        .hdr-topline { height:1px; background:linear-gradient(90deg,transparent 0%,#00ffc8 30%,#00c8ff 60%,transparent 100%); background-size:200% 100%; animation:slide-line 4s linear infinite; }
        body.si-light .hdr-topline { background:linear-gradient(90deg,transparent 0%,#00a882 30%,#0088bb 60%,transparent 100%); background-size:200% 100%; }
        @keyframes slide-line { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }
        .hdr-inner { display:flex; align-items:center; padding:0 28px; height:58px; gap:16px; }
        .logo { text-decoration:none; font-family:'Orbitron',sans-serif; font-weight:900; font-size:16px; letter-spacing:0.12em; color:#e6fff8; text-transform:uppercase; white-space:nowrap; position:relative; flex-shrink:0; transition:color 0.35s; }
        body.si-light .logo { color:#0a2820; }
        .logo span { color:#00ffc8; text-shadow:0 0 16px rgba(0,255,200,0.6); transition:color 0.35s,text-shadow 0.35s; }
        body.si-light .logo span { color:#00a070; text-shadow:0 0 12px rgba(0,180,130,0.3); }
        .logo::after { content:''; position:absolute; bottom:-2px; left:0; right:0; height:1px; background:linear-gradient(90deg,#00ffc8,transparent); transform:scaleX(0); transform-origin:left; transition:transform 0.3s ease; }
        .logo:hover::after { transform:scaleX(1); }
        .search-wrap { flex:1; max-width:480px; position:relative; }
        .search-form { display:flex; position:relative; }
        .search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:rgba(0,255,200,0.35); font-size:13px; pointer-events:none; transition:color 0.2s; z-index:1; }
        .search-wrap:focus-within .search-icon { color:rgba(0,255,200,0.8); }
        body.si-light .search-icon { color:rgba(0,140,100,0.5); }
        body.si-light .search-wrap:focus-within .search-icon { color:rgba(0,140,100,0.9); }
        .search-input { width:100%; background:rgba(0,255,200,0.03); border:1px solid rgba(0,255,200,0.12); color:#e6fff8; font-family:'Share Tech Mono',monospace; font-size:13px; padding:9px 40px 9px 36px; outline:none; letter-spacing:0.04em; transition:border-color 0.25s,background 0.25s,box-shadow 0.25s,color 0.35s; border-radius:0; -webkit-appearance:none; }
        .search-input::placeholder { color:rgba(0,255,200,0.2); }
        .search-input:focus { border-color:rgba(0,255,200,0.5); background:rgba(0,255,200,0.05); box-shadow:0 0 20px rgba(0,255,200,0.07); }
        body.si-light .search-input { background:rgba(0,140,100,0.05); border-color:rgba(0,140,100,0.2); color:#0a2820; }
        body.si-light .search-input::placeholder { color:rgba(0,100,70,0.35); }
        body.si-light .search-input:focus { border-color:rgba(0,160,120,0.5); background:rgba(0,160,120,0.06); box-shadow:0 0 20px rgba(0,160,120,0.08); }
        .search-wrap::after { content:''; position:absolute; bottom:0; left:0; height:1px; width:0%; background:linear-gradient(90deg,#00ffc8,#00c8ff); box-shadow:0 0 8px #00ffc8; transition:width 0.35s ease; pointer-events:none; }
        .search-wrap:focus-within::after { width:100%; }
        body.si-light .search-wrap::after { background:linear-gradient(90deg,#00a070,#0088aa); box-shadow:0 0 8px rgba(0,160,120,0.4); }
        .search-btn { position:absolute; right:0; top:0; bottom:0; padding:0 12px; background:transparent; border:none; border-left:1px solid rgba(0,255,200,0.1); color:rgba(0,255,200,0.4); font-size:13px; cursor:pointer; transition:color 0.2s,background 0.2s; }
        .search-btn:hover { color:#00ffc8; background:rgba(0,255,200,0.05); }
        body.si-light .search-btn { border-left-color:rgba(0,140,100,0.15); color:rgba(0,140,100,0.5); }
        body.si-light .search-btn:hover { color:#00a070; background:rgba(0,160,120,0.06); }
        .nav-divider { width:1px; height:24px; background:rgba(0,255,200,0.1); flex-shrink:0; transition:background 0.35s; }
        body.si-light .nav-divider { background:rgba(0,140,100,0.15); }
        .nav-links { display:flex; align-items:center; gap:4px; }
        .nav-link { display:flex; align-items:center; gap:6px; padding:7px 13px; text-decoration:none; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:rgba(0,255,200,0.45); border:1px solid transparent; transition:color 0.2s,border-color 0.2s,background 0.2s; white-space:nowrap; position:relative; cursor:pointer; background:none; font-family:'Share Tech Mono',monospace; }
        .nav-link::before { content:''; position:absolute; inset:0; background:rgba(0,255,200,0.05); opacity:0; transition:opacity 0.2s; }
        .nav-link:hover { color:#00ffc8; border-color:rgba(0,255,200,0.25); }
        .nav-link:hover::before { opacity:1; }
        body.si-light .nav-link { color:rgba(0,120,80,0.65); }
        body.si-light .nav-link:hover { color:#008060; border-color:rgba(0,160,120,0.3); }
        body.si-light .nav-link::before { background:rgba(0,160,120,0.06); }
        .nav-link-icon { font-size:12px; opacity:0.7; }
        .nav-link-ask { color:#00ffc8; border-color:rgba(0,255,200,0.35); background:rgba(0,255,200,0.04); }
        .nav-link-ask:hover { border-color:#00ffc8; box-shadow:0 0 20px rgba(0,255,200,0.15); color:#fff; }
        body.si-light .nav-link-ask { color:#008060; border-color:rgba(0,160,120,0.4); background:rgba(0,160,120,0.05); }
        body.si-light .nav-link-ask:hover { border-color:#00a070; color:#003820; box-shadow:0 0 16px rgba(0,160,120,0.15); }
        .nav-link-logout:hover { color:#ff7070; border-color:rgba(255,80,80,0.3); }
        .nav-link-logout:hover::before { background:rgba(255,80,80,0.04); opacity:1; }
        .nav-link-login { color:#00ffc8; border-color:rgba(0,255,200,0.4); font-family:'Orbitron',sans-serif; font-weight:700; font-size:10px; padding:8px 18px; }
        .nav-link-login:hover { box-shadow:0 0 24px rgba(0,255,200,0.18); color:#fff; }
        body.si-light .nav-link-login { color:#007050; border-color:rgba(0,160,120,0.4); }
        body.si-light .nav-link-login:hover { color:#003820; box-shadow:0 0 16px rgba(0,160,120,0.15); }
        .theme-toggle { position:relative; width:52px; height:28px; background:none; border:1px solid rgba(0,255,200,0.25); cursor:pointer; flex-shrink:0; overflow:hidden; transition:border-color 0.3s,box-shadow 0.3s; display:flex; align-items:center; padding:0 4px; }
        .theme-toggle:hover { border-color:rgba(0,255,200,0.5); box-shadow:0 0 14px rgba(0,255,200,0.1); }
        body.si-light .theme-toggle { border-color:rgba(0,140,100,0.3); }
        body.si-light .theme-toggle:hover { border-color:rgba(0,160,120,0.6); box-shadow:0 0 14px rgba(0,160,120,0.12); }
        .toggle-track { position:absolute; inset:0; background:rgba(0,255,200,0.04); transition:background 0.35s; }
        body.si-light .toggle-track { background:rgba(0,180,130,0.08); }
        .toggle-thumb { position:relative; z-index:1; width:20px; height:20px; border:1px solid rgba(0,255,200,0.4); background:rgba(2,12,20,0.8); display:flex; align-items:center; justify-content:center; font-size:11px; line-height:1; transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1),background 0.35s,border-color 0.35s; transform:translateX(0); }
        .theme-toggle.light-mode .toggle-thumb { transform:translateX(24px); background:rgba(230,255,245,0.9); border-color:rgba(0,160,120,0.5); }
        .status-dot { width:6px; height:6px; border-radius:50%; background:#00ffc8; box-shadow:0 0 8px #00ffc8; animation:blink 1.8s ease-in-out infinite; flex-shrink:0; transition:background 0.35s,box-shadow 0.35s; }
        body.si-light .status-dot { background:#00a070; box-shadow:0 0 8px rgba(0,160,120,0.5); }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }
        .menu-toggle { display:none; background:none; border:1px solid rgba(0,255,200,0.2); color:rgba(0,255,200,0.6); padding:6px 10px; cursor:pointer; font-family:'Share Tech Mono',monospace; font-size:12px; transition:color 0.2s,border-color 0.2s; }
        .menu-toggle:hover { color:#00ffc8; border-color:rgba(0,255,200,0.5); }
        body.si-light .menu-toggle { border-color:rgba(0,140,100,0.25); color:rgba(0,140,100,0.7); }
        body.si-light .menu-toggle:hover { color:#007050; border-color:rgba(0,160,120,0.5); }
        @media (max-width:700px) {
          .menu-toggle { display:flex; align-items:center; gap:6px; }
          .nav-links { display:none; }
          .nav-links.open { display:flex; flex-direction:column; align-items:stretch; position:absolute; top:100%; left:0; right:0; background:rgba(2,10,18,0.98); border-bottom:1px solid rgba(0,255,200,0.12); padding:12px 16px; gap:6px; backdrop-filter:blur(20px); }
          body.si-light .nav-links.open { background:rgba(235,250,245,0.98); border-bottom-color:rgba(0,160,120,0.15); }
          .hdr-inner { position:relative; flex-wrap:wrap; height:auto; padding:12px 16px; }
          .search-wrap { order:3; max-width:100%; flex:1 1 100%; }
          .nav-divider { display:none; }
        }
      `}</style>

      <header className={`hdr ${mounted ? "on" : ""} ${scrolled ? "scrolled" : ""}`}>
        <div className="hdr-topline" />
        <div className="hdr-inner">
          <Link to="/" className="logo">Stack<span>It</span></Link>
          <div className="search-wrap">
            <form className="search-form" onSubmit={handleSearch}>
              <span className="search-icon">⌕</span>
              <input ref={inputRef} className="search-input" type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions, tags, users..." autoComplete="off" />
              <button type="submit" className="search-btn" aria-label="Search">▶</button>
            </form>
          </div>
          <div className="nav-divider" />
          <button className={`theme-toggle ${isLight ? "light-mode" : ""}`} onClick={toggleTheme}
            aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}>
            <div className="toggle-track" />
            <div className="toggle-thumb">{isLight ? "☀" : "◑"}</div>
          </button>
          <button className="menu-toggle" onClick={() => setMenuOpen(v => !v)}>
            <span>{menuOpen ? "✕" : "≡"}</span><span>MENU</span>
          </button>
          <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
            {token ? (
              <>
                <div className="status-dot" title="Authenticated" />
                <Link to="/ask" className="nav-link nav-link-ask"><span className="nav-link-icon">+</span>Ask</Link>
                <Link to="/users/me" className="nav-link"><span className="nav-link-icon">◈</span>Profile</Link>
                <button className="nav-link nav-link-logout" onClick={logout}><span className="nav-link-icon">⏻</span>Logout</button>
              </>
            ) : (
              <Link to="/login" className="nav-link nav-link-login">Authenticate</Link>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}