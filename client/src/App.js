import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import Login from "./components/Login";
import Home from "./pages/Home";
import Ask from "./pages/Ask";
import Question from "./pages/Question";
import User from "./pages/User";
import "./App.css";

function ScrollRestoration() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function NotFound() {
  useEffect(() => {
    let frame, t = 0;
    const beam = document.getElementById("nf-beam");
    const tick = () => { t = (t + 0.5) % 100; if (beam) beam.style.top = `${t}%`; frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;900&family=Share+Tech+Mono&display=swap');
        .nf-root { min-height:100vh; display:flex; align-items:center; justify-content:center; font-family:'Share Tech Mono',monospace; position:relative; overflow:hidden; }
        .nf-beam { position:fixed; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,rgba(0,255,200,0.12),rgba(0,255,200,0.4),rgba(0,200,255,0.3),transparent); pointer-events:none; z-index:2; filter:blur(1px); }
        .nf-inner { position:relative; z-index:5; text-align:center; padding:60px 40px; border:1px solid rgba(0,255,200,0.12); background:rgba(2,12,20,0.8); backdrop-filter:blur(20px); animation:nf-in 0.6s ease both; }
        body.si-light .nf-inner { background:rgba(230,250,244,0.92); border-color:rgba(0,160,120,0.2); }
        @keyframes nf-in { from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);} }
        .nf-brk { position:absolute; width:18px; height:18px; }
        .nf-tl{top:-1px;left:-1px;  border-top:2px solid rgba(0,255,200,.55);border-left:2px solid rgba(0,255,200,.55);}
        .nf-tr{top:-1px;right:-1px; border-top:2px solid rgba(0,255,200,.55);border-right:2px solid rgba(0,255,200,.55);}
        .nf-bl{bottom:-1px;left:-1px;  border-bottom:2px solid rgba(0,255,200,.55);border-left:2px solid rgba(0,255,200,.55);}
        .nf-br{bottom:-1px;right:-1px; border-bottom:2px solid rgba(0,255,200,.55);border-right:2px solid rgba(0,255,200,.55);}
        body.si-light .nf-tl,body.si-light .nf-tr,body.si-light .nf-bl,body.si-light .nf-br { border-color:rgba(0,160,120,0.5); }
        .nf-code { font-family:'Orbitron',sans-serif; font-size:80px; font-weight:900; line-height:1; color:rgba(0,255,200,0.15); letter-spacing:0.1em; margin-bottom:16px; position:relative; }
        body.si-light .nf-code { color:rgba(0,160,120,0.15); }
        .nf-code::after { content:'404'; position:absolute; inset:0; color:#00ffc8; opacity:0; animation:nf-glitch 4s infinite steps(1); text-shadow:0 0 30px rgba(0,255,200,0.8); }
        body.si-light .nf-code::after { color:#007850; text-shadow:0 0 30px rgba(0,160,120,0.6); }
        @keyframes nf-glitch { 0%,88%,100%{opacity:0;transform:translate(0);}90%{opacity:.7;transform:translate(-4px,2px);}92%{opacity:0;}94%{opacity:.5;transform:translate(4px,-2px);}96%{opacity:0;} }
        .nf-title { font-family:'Orbitron',sans-serif; font-size:14px; font-weight:700; letter-spacing:0.3em; text-transform:uppercase; color:#e6fff8; margin-bottom:10px; }
        body.si-light .nf-title { color:#0a2820; }
        .nf-sub { font-size:11px; color:rgba(0,255,200,0.35); letter-spacing:0.12em; margin-bottom:32px; }
        body.si-light .nf-sub { color:rgba(0,120,80,0.5); }
        .nf-btn { display:inline-flex; align-items:center; gap:8px; padding:12px 28px; border:1px solid rgba(0,255,200,0.4); color:#00ffc8; font-family:'Orbitron',sans-serif; font-size:10px; font-weight:700; letter-spacing:0.25em; text-transform:uppercase; text-decoration:none; transition:border-color .25s,box-shadow .25s,color .25s; background:transparent; }
        body.si-light .nf-btn { border-color:rgba(0,160,120,0.4); color:#007850; }
        .nf-btn:hover { border-color:#00ffc8; color:#fff; box-shadow:0 0 28px rgba(0,255,200,0.18); }
        body.si-light .nf-btn:hover { border-color:#00a070; color:#002810; }
      `}</style>
      <div className="nf-root">
        <div id="nf-beam" className="nf-beam" />
        <div className="nf-inner">
          <div className="nf-brk nf-tl"/><div className="nf-brk nf-tr"/>
          <div className="nf-brk nf-bl"/><div className="nf-brk nf-br"/>
          <div className="nf-code">404</div>
          <div className="nf-title">Signal Lost</div>
          <div className="nf-sub">// The node you requested does not exist</div>
          <a href="/" className="nf-btn"><span>◀</span><span>Return to Base</span></a>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollRestoration />
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <>
                <Header />
                <main>
                  <Routes>
                    <Route path="/"              element={<Home />} />
                    <Route path="/ask"           element={<ProtectedRoute><Ask /></ProtectedRoute>} />
                    <Route path="/questions/:id" element={<Question />} />
                    <Route path="/users/:id"     element={<ProtectedRoute><User /></ProtectedRoute>} />
                    <Route path="*"              element={<NotFound />} />
                  </Routes>
                </main>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}