import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId, W, H, nodes = [], time = 0;
    const COLS = 22, ROWS = 14;
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      nodes = [];
      for (let r = 0; r <= ROWS; r++)
        for (let c = 0; c <= COLS; c++)
          nodes.push({ x:0, y:0, ox:(c/COLS)*W, oy:(r/ROWS)*H, phase:Math.random()*Math.PI*2, sp:0.3+Math.random()*0.4, amp:7+Math.random()*9 });
    };
    const draw = () => {
      ctx.clearRect(0,0,W,H); time+=0.007;
      nodes.forEach(n=>{ n.x=n.ox+Math.sin(time*n.sp+n.phase)*n.amp; n.y=n.oy+Math.cos(time*n.sp*0.7+n.phase)*n.amp*0.5; });
      for(let r=0;r<=ROWS;r++) for(let c=0;c<=COLS;c++){
        const i=r*(COLS+1)+c,n=nodes[i],a=0.05+0.035*Math.sin(time+n.phase);
        if(c<COLS){const rn=nodes[i+1];ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(rn.x,rn.y);ctx.strokeStyle=`rgba(0,255,200,${a})`;ctx.lineWidth=0.5;ctx.stroke();}
        if(r<ROWS){const bn=nodes[i+(COLS+1)];ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(bn.x,bn.y);ctx.strokeStyle=`rgba(0,180,255,${a})`;ctx.lineWidth=0.5;ctx.stroke();}
      }
      nodes.forEach(n=>{const p=0.35+0.65*Math.abs(Math.sin(time*0.8+n.phase));ctx.beginPath();ctx.arc(n.x,n.y,1.3,0,Math.PI*2);ctx.fillStyle=`rgba(0,255,200,${p*0.45})`;ctx.fill();});
      animId=requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener("resize",resize);
    return()=>{cancelAnimationFrame(animId);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={canvasRef} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}/>;
}

export default function Login() {
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");
  const [mounted, setMounted]       = useState(false);
  const [scanY, setScanY]           = useState(0);
  const [typedTitle, setTypedTitle] = useState("");
  const navigate  = useNavigate();
  const fullTitle = isRegister ? "REGISTER" : "ACCESS";

  useEffect(()=>{ setTimeout(()=>setMounted(true),80); },[]);
  useEffect(()=>{ const iv=setInterval(()=>setScanY(v=>(v+0.6)%100),20); return()=>clearInterval(iv); },[]);
  useEffect(()=>{
    setTypedTitle(""); let i=0;
    const t=setInterval(()=>{ i++; setTypedTitle(fullTitle.slice(0,i)); if(i>=fullTitle.length) clearInterval(t); },60);
    return()=>clearInterval(t);
  },[isRegister]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError("Email and password are required."); return; }

    setIsLoading(true); setError(""); setSuccess("");
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const res = await api.post(endpoint, { email: email.trim(), password });

      // Support multiple token response shapes: { token } or { data: { token } }
      const token = res.data?.token ?? res.data?.data?.token ?? res.data?.accessToken;
      if (token) localStorage.setItem("token", token);

      setSuccess(isRegister ? "Account created! Redirecting…" : "Access granted. Redirecting…");
      setTimeout(() => navigate("/"), 1200);

    } catch (err) {
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
      const msg =
        serverMsg ? serverMsg :
        status === 409 ? "An account with this email already exists." :
        status === 401 ? "Invalid email or password." :
        status === 400 ? "Please check your inputs and try again." :
        status === 404 ? "Auth endpoint not found — check your API URL." :
        err?.message === "Network Error" ? "Cannot reach server — is the backend running?" :
        "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;900&family=Share+Tech+Mono&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{overflow:hidden;background:#020c14;}
        .root{min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:'Share Tech Mono',monospace;position:relative;overflow:hidden;background:#020c14;}
        .root::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 70% 70% at 50% 50%,rgba(0,30,50,0.9) 0%,transparent 75%);z-index:1;pointer-events:none;}
        .scanlines{position:fixed;inset:0;z-index:2;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px);pointer-events:none;}
        .scan-beam{position:fixed;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,rgba(0,255,200,0.15),rgba(0,255,200,0.5),rgba(0,200,255,0.4),rgba(0,255,200,0.15),transparent);z-index:3;pointer-events:none;filter:blur(1px);}
        .particle{position:fixed;border-radius:50%;pointer-events:none;z-index:1;animation:floatup linear infinite;}
        @keyframes floatup{from{transform:translateY(105vh);opacity:0;}10%{opacity:1;}85%{opacity:0.6;}to{transform:translateY(-5vh);opacity:0;}}
        .card-outer{position:relative;z-index:10;opacity:0;transform:translateY(28px) scale(0.975);transition:opacity 0.9s cubic-bezier(0.16,1,0.3,1),transform 0.9s cubic-bezier(0.16,1,0.3,1);}
        .card-outer.on{opacity:1;transform:translateY(0) scale(1);}
        .glow-ring{position:absolute;inset:-1px;z-index:-1;background:linear-gradient(135deg,rgba(0,255,200,0.5),rgba(0,120,255,0.3),rgba(0,255,200,0.05),rgba(0,200,255,0.3));animation:hue-spin 8s linear infinite;}
        @keyframes hue-spin{from{filter:hue-rotate(0deg);}to{filter:hue-rotate(360deg);}}
        .card{width:440px;background:rgba(2,12,20,0.93);border:1px solid rgba(0,255,200,0.18);padding:48px 44px 44px;position:relative;overflow:hidden;backdrop-filter:blur(30px);}
        .card::after{content:'';position:absolute;top:0;left:-120%;width:55%;height:100%;background:linear-gradient(90deg,transparent,rgba(0,255,200,0.025),transparent);animation:sheen 5s ease-in-out infinite;pointer-events:none;}
        @keyframes sheen{0%{left:-120%;}100%{left:160%;}}
        .brk{position:absolute;width:22px;height:22px;}
        .brk-tl{top:0;left:0;border-top:2px solid #00ffc8;border-left:2px solid #00ffc8;}
        .brk-tr{top:0;right:0;border-top:2px solid #00ffc8;border-right:2px solid #00ffc8;}
        .brk-bl{bottom:0;left:0;border-bottom:2px solid #00ffc8;border-left:2px solid #00ffc8;}
        .brk-br{bottom:0;right:0;border-bottom:2px solid #00ffc8;border-right:2px solid #00ffc8;}
        .status{display:flex;align-items:center;gap:8px;margin-bottom:28px;opacity:0;animation:fup 0.5s 0.3s forwards;}
        .dot{width:7px;height:7px;border-radius:50%;background:#00ffc8;box-shadow:0 0 10px #00ffc8,0 0 20px rgba(0,255,200,0.4);animation:blink 1.6s ease-in-out infinite;}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:0.25;}}
        .status-txt{font-size:10px;color:rgba(0,255,200,0.55);letter-spacing:0.22em;text-transform:uppercase;}
        .title-row{margin-bottom:4px;opacity:0;animation:fup 0.5s 0.45s forwards;}
        .title{font-family:'Orbitron',sans-serif;font-size:30px;font-weight:900;color:#e6fff8;letter-spacing:0.1em;text-transform:uppercase;display:inline-block;}
        .title-cursor{display:inline-block;width:3px;height:0.85em;background:#00ffc8;margin-left:3px;vertical-align:middle;animation:cblink 0.8s step-start infinite;box-shadow:0 0 8px #00ffc8;}
        @keyframes cblink{0%,100%{opacity:1;}50%{opacity:0;}}
        .sub{font-size:10.5px;color:rgba(0,255,200,0.35);letter-spacing:0.12em;margin-top:7px;margin-bottom:34px;opacity:0;animation:fup 0.5s 0.55s forwards;}
        .hline{height:1px;background:linear-gradient(90deg,#00ffc8,rgba(0,255,200,0.12),transparent);margin-bottom:30px;opacity:0;animation:fup 0.5s 0.62s forwards;}
        .field{margin-bottom:20px;opacity:0;animation:fup 0.5s forwards;}
        .f1{animation-delay:0.68s;}.f2{animation-delay:0.78s;}
        .flabel{display:flex;align-items:center;gap:7px;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(0,255,200,0.45);margin-bottom:7px;}
        .flabel-dash{width:16px;height:1px;background:rgba(0,255,200,0.35);}
        .finput-wrap{position:relative;}
        .finput-wrap::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:#00ffc8;box-shadow:0 0 8px #00ffc8;transition:width 0.35s ease;}
        .finput-wrap:focus-within::after{width:100%;}
        .ficon{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:rgba(0,255,200,0.4);font-size:14px;pointer-events:none;line-height:1;}
        .finput{width:100%;background:rgba(0,255,200,0.03);border:1px solid rgba(0,255,200,0.14);color:#e6fff8;font-family:'Share Tech Mono',monospace;font-size:14px;padding:13px 14px 13px 40px;outline:none;transition:border-color 0.25s,background 0.25s,box-shadow 0.25s;border-radius:0;letter-spacing:0.04em;-webkit-appearance:none;}
        .finput::placeholder{color:rgba(0,255,200,0.18);}
        .finput:focus{border-color:rgba(0,255,200,0.55);background:rgba(0,255,200,0.05);box-shadow:0 0 22px rgba(0,255,200,0.07);}

        /* Feedback messages */
        .msg-box{display:flex;align-items:center;gap:9px;padding:10px 14px;font-size:11px;letter-spacing:0.04em;border-radius:0;opacity:0;max-height:0;overflow:hidden;margin-bottom:0;transition:opacity 0.3s,max-height 0.35s,margin-bottom 0.3s;}
        .msg-box.on{opacity:1;max-height:60px;margin-bottom:16px;}
        .msg-err{background:rgba(255,60,60,0.07);border:1px solid rgba(255,60,60,0.3);color:#ff7070;}
        .msg-ok{background:rgba(0,255,200,0.07);border:1px solid rgba(0,255,200,0.3);color:#00ffc8;}

        .btn-sub{width:100%;padding:15px;background:transparent;border:1px solid rgba(0,255,200,0.45);color:#00ffc8;font-family:'Orbitron',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;cursor:pointer;position:relative;overflow:hidden;transition:color 0.3s,border-color 0.3s,box-shadow 0.3s;margin-top:4px;opacity:0;animation:fup 0.5s 0.9s forwards;border-radius:0;}
        .btn-sub::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,255,200,0.13),rgba(0,150,255,0.08));opacity:0;transition:opacity 0.3s;}
        .btn-sub:not(:disabled):hover::before{opacity:1;}
        .btn-sub:not(:disabled):hover{border-color:#00ffc8;box-shadow:0 0 35px rgba(0,255,200,0.18);color:#fff;}
        .btn-sub:disabled{opacity:0.35;cursor:not-allowed;}
        .load-bar{position:absolute;bottom:0;left:0;height:2px;width:100%;background:linear-gradient(90deg,transparent,#00ffc8,#00c8ff,transparent);animation:lbar 1.4s ease-in-out infinite;}
        @keyframes lbar{0%{transform:translateX(-100%);}100%{transform:translateX(100%);}}
        .toggle-wrap{margin-top:22px;display:flex;align-items:center;justify-content:center;gap:12px;opacity:0;animation:fup 0.5s 1.0s forwards;}
        .tline{flex:1;height:1px;background:rgba(0,255,200,0.07);}
        .btn-tog{background:none;border:none;color:rgba(0,255,200,0.3);font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;cursor:pointer;padding:4px 0;transition:color 0.2s;}
        .btn-tog:hover{color:#00ffc8;}
        .hex{position:absolute;bottom:13px;right:16px;font-size:8px;color:rgba(0,255,200,0.18);letter-spacing:0.08em;}
        @keyframes fup{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
      `}</style>

      <div className="root">
        <ParticleCanvas />
        <div className="scanlines" />
        <div className="scan-beam" style={{ top:`${scanY}%` }} />

        {[...Array(14)].map((_,i)=>(
          <div key={i} className="particle" style={{
            left:`${4+(i*7.1)%93}%`,
            width:i%4===0?"3px":"2px", height:i%4===0?"3px":"2px",
            background:i%3===0?"rgba(0,200,255,0.6)":"rgba(0,255,200,0.5)",
            animationDuration:`${7+(i*1.1)%9}s`,
            animationDelay:`${(i*0.65)%7}s`,
          }}/>
        ))}

        <div className={`card-outer ${mounted?"on":""}`}>
          <div className="glow-ring"/>
          <div className="card">
            <div className="brk brk-tl"/><div className="brk brk-tr"/>
            <div className="brk brk-bl"/><div className="brk brk-br"/>

            <div className="status">
              <div className="dot"/>
              <span className="status-txt">{isRegister?"New User Initialization":"Secure Link Active"}</span>
            </div>

            <div className="title-row">
              <span className="title">{typedTitle}<span className="title-cursor"/></span>
            </div>
            <div className="sub">{isRegister?"// INIT NEW USER PROFILE":"// ENTER CREDENTIALS TO AUTHENTICATE"}</div>
            <div className="hline"/>

            <div className="field f1">
              <div className="flabel"><span className="flabel-dash"/>Email</div>
              <div className="finput-wrap">
                <span className="ficon">@</span>
                <input className="finput" type="email" value={email} placeholder="user@domain.net"
                  autoComplete="email"
                  onChange={e=>{ setEmail(e.target.value); setError(""); setSuccess(""); }}
                  onKeyDown={e=>e.key==="Enter"&&handleSubmit(e)}
                />
              </div>
            </div>

            <div className="field f2">
              <div className="flabel"><span className="flabel-dash"/>Password</div>
              <div className="finput-wrap">
                <span className="ficon">⬡</span>
                <input className="finput" type="password" value={password} placeholder="••••••••••••"
                  autoComplete={isRegister?"new-password":"current-password"}
                  onChange={e=>{ setPassword(e.target.value); setError(""); setSuccess(""); }}
                  onKeyDown={e=>e.key==="Enter"&&handleSubmit(e)}
                />
              </div>
            </div>

            {/* Error */}
            <div className={`msg-box msg-err ${error?"on":""}`}>
              <span style={{fontSize:15}}>⚠</span><span>{error}</span>
            </div>

            {/* Success */}
            <div className={`msg-box msg-ok ${success?"on":""}`}>
              <span style={{fontSize:15}}>✓</span><span>{success}</span>
            </div>

            <button className="btn-sub" onClick={handleSubmit} disabled={isLoading||!email||!password}>
              {isLoading
                ? <><span>{isRegister?"INITIALIZING…":"AUTHENTICATING…"}</span><div className="load-bar"/></>
                : isRegister?"INITIALIZE":"AUTHENTICATE"
              }
            </button>

            <div className="toggle-wrap">
              <div className="tline"/>
              <button className="btn-tog" onClick={()=>{ setIsRegister(v=>!v); setError(""); setSuccess(""); }}>
                {isRegister?"← Return to Login":"Create Account →"}
              </button>
              <div className="tline"/>
            </div>

            <div className="hex">SYS:AUTH v2.4</div>
          </div>
        </div>
      </div>
    </>
  );
}