import { useState, useEffect } from "react";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

const BADGE_COLORS = {
  gold:   { bg:"rgba(255,200,50,0.1)",   border:"rgba(255,200,50,0.4)",   dot:"#ffc832", glow:"rgba(255,200,50,0.5)"  },
  silver: { bg:"rgba(180,200,220,0.08)", border:"rgba(180,200,220,0.35)", dot:"#b4c8dc", glow:"rgba(180,200,220,0.4)" },
  bronze: { bg:"rgba(200,130,80,0.08)",  border:"rgba(200,130,80,0.35)",  dot:"#c88250", glow:"rgba(200,130,80,0.4)"  },
  default:{ bg:"rgba(0,255,200,0.06)",   border:"rgba(0,255,200,0.3)",    dot:"#00ffc8", glow:"rgba(0,255,200,0.4)"   },
};

function badgeStyle(badge) {
  const b = badge.toLowerCase();
  if (b.includes("gold"))   return BADGE_COLORS.gold;
  if (b.includes("silver")) return BADGE_COLORS.silver;
  if (b.includes("bronze")) return BADGE_COLORS.bronze;
  return BADGE_COLORS.default;
}

function StatCard({ label, value, accent, isLight }) {
  return (
    <div className="stat-card">
      <div className="stat-value" style={accent ? { color: accent, textShadow: `0 0 16px ${accent}` } : {}}>
        {value ?? "—"}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function Profile({ userId }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [mounted, setMounted] = useState(false);
  const [scanY, setScanY]     = useState(0);
  const [activeTab, setActiveTab] = useState("questions");
  const { isLight } = useTheme();

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
    const iv = setInterval(() => setScanY(v => (v + 0.5) % 100), 22);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/users/${userId || "me"}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(res.data);
      } catch {
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;900&family=Share+Tech+Mono&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        .pf-root { min-height:100vh; background:#020c14; font-family:'Share Tech Mono',monospace; position:relative; overflow:hidden; transition:background 0.4s; }
        body.si-light .pf-root { background:#edf8f4; }
        .pf-root::before { content:''; position:fixed; inset:0; background-image:linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px); background-size:52px 52px; pointer-events:none; z-index:0; }
        body.si-light .pf-root::before { background-image:linear-gradient(rgba(0,160,120,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(0,160,120,0.06) 1px,transparent 1px); }
        .pf-root::after { content:''; position:fixed; inset:0; background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(0,35,55,0.95) 0%,transparent 70%); pointer-events:none; z-index:0; }
        body.si-light .pf-root::after { background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(0,160,120,0.07) 0%,transparent 70%); }
        .scanlines { position:fixed; inset:0; z-index:1; pointer-events:none; background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px); transition:opacity 0.4s; }
        body.si-light .scanlines { opacity:0.25; }
        .scan-beam { position:fixed; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,rgba(0,255,200,0.12),rgba(0,255,200,0.4),rgba(0,200,255,0.3),rgba(0,255,200,0.12),transparent); z-index:2; pointer-events:none; filter:blur(1px); transition:opacity 0.4s; }
        body.si-light .scan-beam { opacity:0.2; }
        .pf-content { position:relative; z-index:5; max-width:860px; margin:0 auto; padding:48px 24px 80px; opacity:0; transform:translateY(20px); transition:opacity 0.7s ease,transform 0.7s ease; }
        .pf-content.on { opacity:1; transform:translateY(0); }
        .pf-skeleton-wrap { display:flex; flex-direction:column; gap:18px; }
        .pf-skel { height:40px; border:1px solid rgba(0,255,200,0.06); background:linear-gradient(90deg,rgba(0,255,200,0.04) 25%,rgba(0,255,200,0.08) 50%,rgba(0,255,200,0.04) 75%); background-size:200% 100%; animation:skel-shim 1.4s ease-in-out infinite; }
        body.si-light .pf-skel { background:linear-gradient(90deg,rgba(0,160,120,0.05) 25%,rgba(0,160,120,0.1) 50%,rgba(0,160,120,0.05) 75%); background-size:200% 100%; }
        @keyframes skel-shim { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }
        .pf-error { display:flex; align-items:center; gap:10px; padding:14px 18px; border:1px solid rgba(255,60,60,0.3); background:rgba(255,60,60,0.06); font-size:12px; color:#ff7070; letter-spacing:0.06em; }
        .pf-hero { position:relative; margin-bottom:32px; border:1px solid rgba(0,255,200,0.12); background:rgba(2,12,20,0.7); backdrop-filter:blur(20px); padding:36px 36px 32px; overflow:hidden; opacity:0; animation:fup 0.5s 0.2s forwards; transition:background 0.4s,border-color 0.4s; }
        body.si-light .pf-hero { background:rgba(230,250,244,0.75); border-color:rgba(0,160,120,0.15); }
        @keyframes fup { from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);} }
        .pf-hero::after { content:''; position:absolute; top:0; left:-120%; width:55%; height:100%; background:linear-gradient(90deg,transparent,rgba(0,255,200,0.025),transparent); animation:sheen 7s ease-in-out infinite; pointer-events:none; }
        @keyframes sheen { 0%{left:-120%;} 100%{left:160%;} }
        .brk { position:absolute; width:20px; height:20px; }
        .brk-tl{top:-1px;left:-1px;  border-top:2px solid rgba(0,255,200,0.6);border-left:2px solid rgba(0,255,200,0.6);}
        .brk-tr{top:-1px;right:-1px; border-top:2px solid rgba(0,255,200,0.6);border-right:2px solid rgba(0,255,200,0.6);}
        .brk-bl{bottom:-1px;left:-1px;  border-bottom:2px solid rgba(0,255,200,0.6);border-left:2px solid rgba(0,255,200,0.6);}
        .brk-br{bottom:-1px;right:-1px; border-bottom:2px solid rgba(0,255,200,0.6);border-right:2px solid rgba(0,255,200,0.6);}
        body.si-light .brk-tl,body.si-light .brk-tr,body.si-light .brk-bl,body.si-light .brk-br { border-color:rgba(0,160,120,0.5); }
        .pf-hero-top { display:flex; align-items:flex-start; gap:24px; margin-bottom:28px; flex-wrap:wrap; }
        .pf-avatar { flex-shrink:0; width:72px; height:72px; border:1px solid rgba(0,255,200,0.3); background:rgba(0,255,200,0.04); display:flex; align-items:center; justify-content:center; position:relative; transition:border-color 0.35s,background 0.35s; }
        body.si-light .pf-avatar { border-color:rgba(0,160,120,0.3); background:rgba(0,160,120,0.05); }
        .pf-avatar::before { content:''; position:absolute; inset:-4px; border:1px solid rgba(0,255,200,0.1); }
        body.si-light .pf-avatar::before { border-color:rgba(0,160,120,0.12); }
        .pf-avatar-letter { font-family:'Orbitron',sans-serif; font-size:28px; font-weight:900; color:#00ffc8; text-shadow:0 0 20px rgba(0,255,200,0.6); transition:color 0.35s,text-shadow 0.35s; }
        body.si-light .pf-avatar-letter { color:#007850; text-shadow:0 0 16px rgba(0,160,120,0.4); }
        .pf-avatar-dot { position:absolute; bottom:-3px; right:-3px; width:10px; height:10px; border-radius:50%; background:#00ffc8; box-shadow:0 0 10px #00ffc8; border:2px solid #020c14; animation:blink 1.8s ease-in-out infinite; transition:background 0.35s,box-shadow 0.35s,border-color 0.35s; }
        body.si-light .pf-avatar-dot { background:#00a070; box-shadow:0 0 8px rgba(0,160,120,0.6); border-color:#edf8f4; }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }
        .pf-info { flex:1; min-width:0; }
        .pf-eyebrow { font-size:9px; letter-spacing:0.28em; text-transform:uppercase; color:rgba(0,255,200,0.4); margin-bottom:6px; transition:color 0.35s; }
        body.si-light .pf-eyebrow { color:rgba(0,120,80,0.55); }
        .pf-username { font-family:'Orbitron',sans-serif; font-size:22px; font-weight:900; color:#e6fff8; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:4px; word-break:break-all; transition:color 0.35s; }
        body.si-light .pf-username { color:#0a2820; }
        .pf-email { font-size:11px; color:rgba(0,255,200,0.4); letter-spacing:0.08em; margin-bottom:10px; transition:color 0.35s; }
        body.si-light .pf-email { color:rgba(0,120,80,0.6); }
        .pf-joined { font-size:10px; color:rgba(0,255,200,0.25); letter-spacing:0.1em; transition:color 0.35s; }
        body.si-light .pf-joined { color:rgba(0,120,80,0.45); }
        .pf-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; padding-top:24px; border-top:1px solid rgba(0,255,200,0.07); transition:border-color 0.35s; }
        body.si-light .pf-stats { border-top-color:rgba(0,160,120,0.1); }
        .stat-card { padding:16px 14px; border:1px solid rgba(0,255,200,0.08); background:rgba(0,255,200,0.02); text-align:center; transition:border-color 0.2s,background 0.2s; }
        .stat-card:hover { border-color:rgba(0,255,200,0.2); background:rgba(0,255,200,0.04); }
        body.si-light .stat-card { border-color:rgba(0,160,120,0.1); background:rgba(0,160,120,0.03); }
        body.si-light .stat-card:hover { border-color:rgba(0,160,120,0.25); background:rgba(0,160,120,0.06); }
        .stat-value { font-family:'Orbitron',sans-serif; font-size:22px; font-weight:900; color:#e6fff8; letter-spacing:0.05em; margin-bottom:6px; transition:color 0.35s; }
        body.si-light .stat-value { color:#0a2820; }
        .stat-label { font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:rgba(0,255,200,0.35); transition:color 0.35s; }
        body.si-light .stat-label { color:rgba(0,120,80,0.55); }
        .pf-section { margin-bottom:28px; opacity:0; animation:fup 0.5s 0.35s forwards; }
        .pf-section-header { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
        .pf-section-title { font-family:'Orbitron',sans-serif; font-size:11px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; color:rgba(0,255,200,0.7); transition:color 0.35s; }
        body.si-light .pf-section-title { color:rgba(0,120,80,0.8); }
        .pf-section-line { flex:1; height:1px; background:linear-gradient(90deg,rgba(0,255,200,0.15),transparent); transition:background 0.35s; }
        body.si-light .pf-section-line { background:linear-gradient(90deg,rgba(0,160,120,0.2),transparent); }
        .pf-badges { display:flex; flex-wrap:wrap; gap:8px; }
        .pf-badge { display:inline-flex; align-items:center; gap:7px; padding:5px 12px; font-size:11px; letter-spacing:0.06em; }
        .pf-badge-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
        .pf-tabs { display:flex; gap:0; margin-bottom:20px; border-bottom:1px solid rgba(0,255,200,0.08); opacity:0; animation:fup 0.5s 0.45s forwards; transition:border-color 0.35s; }
        body.si-light .pf-tabs { border-bottom-color:rgba(0,160,120,0.12); }
        .pf-tab { padding:10px 20px; background:none; border:none; font-family:'Share Tech Mono',monospace; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:rgba(0,255,200,0.3); cursor:pointer; position:relative; transition:color 0.2s; border-bottom:2px solid transparent; margin-bottom:-1px; }
        .pf-tab:hover { color:rgba(0,255,200,0.7); }
        .pf-tab.active { color:#00ffc8; border-bottom-color:#00ffc8; }
        body.si-light .pf-tab { color:rgba(0,120,80,0.4); }
        body.si-light .pf-tab:hover { color:rgba(0,120,80,0.8); }
        body.si-light .pf-tab.active { color:#007850; border-bottom-color:#007850; }
        .pf-activity { display:flex; flex-direction:column; gap:0; opacity:0; animation:fup 0.5s 0.55s forwards; }
        .pf-activity-empty { font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:rgba(0,255,200,0.2); padding:20px 0; transition:color 0.35s; }
        body.si-light .pf-activity-empty { color:rgba(0,120,80,0.3); }
        .pf-activity-item { display:flex; align-items:flex-start; gap:14px; padding:14px 0; border-bottom:1px solid rgba(0,255,200,0.05); transition:background 0.15s,border-color 0.35s; }
        body.si-light .pf-activity-item { border-bottom-color:rgba(0,160,120,0.08); }
        .pf-activity-item:hover { background:rgba(0,255,200,0.02); }
        body.si-light .pf-activity-item:hover { background:rgba(0,160,120,0.03); }
        .pf-activity-item:last-child { border-bottom:none; }
        .pf-activity-score { flex-shrink:0; min-width:36px; text-align:center; padding:4px 8px; border:1px solid rgba(0,255,200,0.15); font-family:'Orbitron',sans-serif; font-size:12px; font-weight:700; color:rgba(0,255,200,0.7); transition:all 0.35s; }
        body.si-light .pf-activity-score { border-color:rgba(0,160,120,0.2); color:rgba(0,120,80,0.8); }
        .pf-activity-body { flex:1; min-width:0; }
        .pf-activity-title { font-size:13px; color:rgba(255,255,255,0.65); line-height:1.5; letter-spacing:0.02em; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; transition:color 0.35s; }
        body.si-light .pf-activity-title { color:rgba(10,40,32,0.75); }
        .pf-activity-meta { font-size:10px; color:rgba(0,255,200,0.25); letter-spacing:0.08em; transition:color 0.35s; }
        body.si-light .pf-activity-meta { color:rgba(0,120,80,0.45); }
        .particle { position:fixed; border-radius:50%; pointer-events:none; z-index:1; animation:floatup linear infinite; }
        @keyframes floatup { from{transform:translateY(105vh);opacity:0;} 10%{opacity:0.8;} 85%{opacity:0.4;} to{transform:translateY(-5vh);opacity:0;} }
      `}</style>

      <div className="pf-root">
        <div className="scanlines" />
        <div className="scan-beam" style={{ top: `${scanY}%` }} />
        {[...Array(8)].map((_, i) => (
          <div key={i} className="particle" style={{
            left:`${6+(i*11.5)%90}%`, width:i%3===0?"3px":"2px", height:i%3===0?"3px":"2px",
            background:i%2===0?"rgba(0,255,200,0.5)":"rgba(0,200,255,0.45)",
            boxShadow:`0 0 4px ${i%2===0?"rgba(0,255,200,0.8)":"rgba(0,200,255,0.8)"}`,
            animationDuration:`${8+(i*1.4)%9}s`, animationDelay:`${(i*0.9)%8}s`,
          }} />
        ))}

        <div className={`pf-content ${mounted ? "on" : ""}`}>
          {loading ? (
            <div className="pf-skeleton-wrap">
              {[80,40,60,100,50].map((w,i) => (
                <div key={i} className="pf-skel" style={{ width:`${w}%`, height:i===0?72:36 }} />
              ))}
            </div>
          ) : error ? (
            <div className="pf-error"><span>⚠</span><span>{error}</span></div>
          ) : user && (
            <>
              <div className="pf-hero">
                <div className="brk brk-tl"/><div className="brk brk-tr"/>
                <div className="brk brk-bl"/><div className="brk brk-br"/>
                <div className="pf-hero-top">
                  <div className="pf-avatar">
                    <span className="pf-avatar-letter">{(user.username||user.email||"U")[0].toUpperCase()}</span>
                    <div className="pf-avatar-dot" />
                  </div>
                  <div className="pf-info">
                    <div className="pf-eyebrow">// User Profile</div>
                    <div className="pf-username">{user.username || "Anonymous"}</div>
                    <div className="pf-email">{user.email}</div>
                    {user.createdAt && (
                      <div className="pf-joined">
                        Joined {new Date(user.createdAt).toLocaleDateString(undefined,{year:"numeric",month:"long"})}
                      </div>
                    )}
                  </div>
                </div>
                <div className="pf-stats">
                  <StatCard label="Reputation" value={user.reputation?.toLocaleString()} accent={isLight?"#007850":"#00ffc8"} isLight={isLight} />
                  <StatCard label="Questions"  value={user.questionCount??user.questions?.length??0} isLight={isLight} />
                  <StatCard label="Answers"    value={user.answerCount??user.answers?.length??0} isLight={isLight} />
                  <StatCard label="Badges"     value={user.badges?.length??0} accent={isLight?"#b08000":"#ffc832"} isLight={isLight} />
                </div>
              </div>

              {user.badges?.length > 0 && (
                <div className="pf-section">
                  <div className="pf-section-header">
                    <span className="pf-section-title">Badges</span>
                    <div className="pf-section-line" />
                  </div>
                  <div className="pf-badges">
                    {user.badges.map((badge, i) => {
                      const s = badgeStyle(badge);
                      return (
                        <span key={i} className="pf-badge" style={{background:s.bg,border:`1px solid ${s.border}`,color:s.dot}}>
                          <span className="pf-badge-dot" style={{background:s.dot,boxShadow:`0 0 6px ${s.glow}`}} />
                          {badge}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {(user.questions?.length > 0 || user.answers?.length > 0) && (
                <>
                  <div className="pf-tabs">
                    {["questions","answers"].map(tab => (
                      <button key={tab} className={`pf-tab ${activeTab===tab?"active":""}`} onClick={()=>setActiveTab(tab)}>
                        {tab} ({user[tab]?.length??0})
                      </button>
                    ))}
                  </div>
                  <div className="pf-activity">
                    {(user[activeTab]??[]).length === 0 ? (
                      <div className="pf-activity-empty">// No {activeTab} yet</div>
                    ) : (
                      (user[activeTab]??[]).map((item,i) => (
                        <div key={item._id??i} className="pf-activity-item">
                          <div className="pf-activity-score">{item.votes??item.score??0}</div>
                          <div className="pf-activity-body">
                            <div className="pf-activity-title">{item.title??item.body??"Untitled"}</div>
                            <div className="pf-activity-meta">
                              {item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"}) : "—"}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}