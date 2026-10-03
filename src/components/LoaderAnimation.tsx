"use client";
import React, { useEffect, useRef } from 'react';
import './LoaderAnimation.css';

export default function LoaderAnimation({ className = "" }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!stageRef.current || !showcaseRef.current) return;
    const stage = stageRef.current;
    const showcase = showcaseRef.current;
    const caps = Array.from(showcase.querySelectorAll('.cap')) as HTMLElement[];

    const seq: [string, number][] = [['a', 4800], ['b', 3600], ['g', 5200], ['c', 5500], ['d', 4400], ['r', 900]];
    let i = 0, timer: any = 0;

    function apply(name: string) {
      stage.dataset.scene = name;
      if (name !== 'r') caps.forEach(c => c.classList.toggle('on', c.dataset.s === name));
    }
    
    function play() {
      const [name, ms] = seq[i];
      apply(name);
      timer = setTimeout(() => { i = (i + 1) % seq.length; play(); }, ms);
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { 
      apply('d'); 
      return; 
    }

    const handleVis = () => {
      clearTimeout(timer);
      if (!document.hidden) { 
        apply('r'); 
        timer = setTimeout(() => { i = 0; play(); }, 700); 
      }
    };
    
    document.addEventListener('visibilitychange', handleVis);
    play();
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVis);
    };
  }, []);

  return (
    <aside ref={showcaseRef} className={`showcase ${className}`} aria-label="How SMART LOCKER works">
      <i className="bg-dot" style={{left:'9%', top:'12%', width:'9px', height:'9px', '--d':'7s'} as any}></i>
      <i className="bg-dot" style={{right:'11%', top:'22%', width:'6px', height:'6px', '--c':'#c3a6ff', '--d':'9s', '--dx':'-10px', '--dy':'12px'} as any}></i>
      <i className="bg-dot" style={{left:'14%', bottom:'20%', width:'7px', height:'7px', '--c':'#7fb0ff', '--d':'8s', '--dy':'-10px'} as any}></i>
      <i className="bg-dot" style={{right:'8%', bottom:'26%', width:'10px', height:'10px', '--d':'10s', '--dx':'-6px'} as any}></i>

      <div ref={stageRef} className="stage" data-scene="a" aria-hidden="true">
        <div className="halo"></div>
        <div className="halo g"></div>

        {/* documents */}
        <div className="doc" style={{'--c':'#3b82f6', '--x0':'-92px', '--r0':'-14deg', '--ad':'.2s', '--fx':'-68px', '--fy':'58px', '--fr':'-9deg', '--rd':'.95s'} as any}>
          <b className="tag">ID</b><div className="row"><i className="av"></i><div style={{flex:1, display:'grid', gap:'4px'}}><i className="ln"></i><i className="ln s"></i></div></div><i className="ln"></i>
        </div>
        <div className="doc" style={{'--c':'#ef4444', '--x0':'84px', '--r0':'12deg', '--ad':'1.25s', '--fx':'68px', '--fy':'58px', '--fr':'9deg', '--rd':'1.1s'} as any}>
          <b className="tag">PDF</b><i className="ln"></i><i className="ln"></i><i className="ln s"></i><i className="ln"></i>
        </div>
        <div className="doc" style={{'--c':'#10b981', '--x0':'-18px', '--r0':'-6deg', '--ad':'2.3s', '--fx':'0px', '--fy':'74px', '--fr':'0deg', '--rd':'1.25s'} as any}>
          <b className="tag">PASS</b><div className="row"><i className="av"></i><div style={{flex:1, display:'grid', gap:'4px'}}><i className="ln"></i><i className="ln s"></i></div></div><i className="ln"></i>
        </div>

        {/* encrypted cloud storage */}
        <div className="cloud">
          <div className="c-float"><div className="c-wrap">
            <svg className="shape" viewBox="0 0 200 124" aria-hidden="true">
              <defs>
                <linearGradient id="cg" gradientUnits="userSpaceOnUse" x1="24" y1="10" x2="176" y2="124">
                  <stop offset="0" stopColor="#a79cff"/><stop offset=".5" stopColor="#7a6ff0"/><stop offset="1" stopColor="#6350e0"/>
                </linearGradient>
                <linearGradient id="sg" x1="0" x2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity="0"/><stop offset=".5" stopColor="#fff" stopOpacity=".7"/><stop offset="1" stopColor="#fff" stopOpacity="0"/>
                </linearGradient>
                <g id="cloudShape">
                  <rect x="22" y="66" width="132" height="50" rx="25"/>
                  <circle cx="52" cy="78" r="30"/><circle cx="88" cy="50" r="40"/>
                  <circle cx="130" cy="62" r="32"/><circle cx="152" cy="88" r="26"/>
                </g>
                <clipPath id="cloudClip"><use href="#cloudShape"/></clipPath>
              </defs>
              <use href="#cloudShape" fill="url(#cg)"/>
              <g clipPath="url(#cloudClip)">
                <ellipse cx="68" cy="30" rx="46" ry="16" fill="#fff" opacity=".16"/>
                <rect className="sweep" x="-70" y="0" width="60" height="124" fill="url(#sg)"/>
              </g>
            </svg>
            <div className="cipher"><span>A93F&middot;7CD2&middot;1E</span><span>5B08&middot;E4F1&middot;9A</span></div>
            <span className="ping"></span>
            <span className="lock"><span className="in">
              <svg viewBox="0 0 24 24"><path className="shackle" d="M8 11V8a4 4 0 018 0v3"/><rect className="body" x="5" y="11" width="14" height="10" rx="2.500"/></svg>
            </span></span>
          </div></div>
        </div>

        {/* scene a chips */}
        <div className="chips">
          <span className="chip" style={{'--cd':'1.8s'} as any}><svg viewBox="0 0 24 24"><path d="M5 12.500l4.500 4.500L19 7.500"/></svg>ID card</span>
          <span className="chip" style={{'--cd':'2.85s'} as any}><svg viewBox="0 0 24 24"><path d="M5 12.500l4.500 4.500L19 7.500"/></svg>PDF</span>
          <span className="chip" style={{'--cd':'3.9s'} as any}><svg viewBox="0 0 24 24"><path d="M5 12.500l4.500 4.500L19 7.500"/></svg>Passport</span>
        </div>
        {/* scene b chip */}
        <span className="enc-chip"><svg viewBox="0 0 24 24"><path d="M12 3l7 3v5.500c0 4.400-3 8.200-7 9.500-4-1.300-7-5.100-7-9.500V6l7-3z"/><path d="M9 12l2.200 2.200L15.500 10"/></svg>AES-256 encrypted</span>

        {/* scene g: Sign in with Google */}
        <div className="gcard">
          <div className="g-head">
            <span className="g-logo">
              <svg viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.500c3.540 0 6.710 1.220 9.210 3.600l6.850-6.850C35.900 2.380 30.470 0 24 0 14.620 0 6.510 5.380 2.560 13.220l7.980 6.190C12.430 13.720 17.740 9.500 24 9.500z"/>
                <path fill="#4285F4" d="M46.980 24.550c0-1.570-.15-3.090-.38-4.550H24v9.020h12.940c-.58 2.960-2.260 5.480-4.780 7.180l7.730 6c4.510-4.180 7.090-10.360 7.090-17.650z"/>
                <path fill="#FBBC05" d="M10.530 28.590c-.48-1.450-.76-2.990-.76-4.590s.27-3.140.76-4.590l-7.980-6.190C.92 16.460 0 20.120 0 24c0 3.880.92 7.540 2.560 10.780l7.970-6.190z"/>
                <path fill="#34A853" d="M24 48c6.480 0 11.930-2.130 15.890-5.810l-7.730-6c-2.150 1.450-4.920 2.300-8.160 2.300-6.260 0-11.570-4.220-13.470-9.910l-7.980 6.190C6.510 42.620 14.620 48 24 48z"/>
              </svg>
            </span>
            <div><h4>Sign in with Google</h4><small>to continue to SMART LOCKER</small></div>
            <span className="badge2">1 of 2</span>
          </div>
          <div className="acct">
            <span className="av">A</span>
            <div><b>Alex Morgan</b><small>alex.morgan@gmail.com</small></div>
            <span className="radio"></span>
          </div>
          <div className="gbtn">
            <span className="t1">Continue as Alex</span>
            <span className="t2"><i className="mini"></i>Signing in&hellip;</span>
            <span className="t3"><svg viewBox="0 0 24 24"><path d="M5 12.500l4.500 4.500L19 7.500"/></svg>Signed in with Google</span>
          </div>
          <div className="g-note">Your Google password is never shared with us</div>
        </div>
        <span className="g-ripple"></span>
        <div className="cursor">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2l15 9.500-6.500 1.500 3.500 7-3 1.500-3.500-7L4 19.500z" fill="#0f172a" stroke="#fff" strokeWidth="1.600" strokeLinejoin="round"/></svg>
        </div>

        {/* scene c: OTP message + verification card */}
        <div className="toast">
          <span className="ic"><svg viewBox="0 0 24 24"><rect x="7" y="2.500" width="10" height="19" rx="2.500"/><path d="M11 18.500h2"/></svg></span>
          <div><b>SMART LOCKER</b><small>Your code is <strong>482 915</strong></small></div>
        </div>
        <div className="otp">
          <div className="otp-head">
            <span className="shield">
              <svg className="s1" viewBox="0 0 24 24"><path d="M12 3l7 3v5.500c0 4.400-3 8.200-7 9.500-4-1.300-7-5.100-7-9.500V6l7-3z"/><path d="M9 12l2.200 2.200L15.500 10"/></svg>
              <svg className="s2" viewBox="0 0 24 24"><path d="M12 3l7 3v5.500c0 4.400-3 8.200-7 9.500-4-1.300-7-5.100-7-9.500V6l7-3z"/><path d="M9 12l2.200 2.200L15.500 10"/></svg>
            </span>
            <div><h4>2-step verification</h4><small>Extra protection for your files</small></div>
            <span className="badge2">2 of 2</span>
          </div>
          <div className="rows">
            <div className="row r1"><span className="ic"><span className="ok"><svg viewBox="0 0 24 24"><path d="M5 12.500l4.500 4.500L19 7.500"/></svg></span></span>Signed in with Google</div>
            <div className="row r2"><span className="ic"><span className="wait"></span><span className="ok"><svg viewBox="0 0 24 24"><path d="M5 12.500l4.500 4.500L19 7.500"/></svg></span></span>Enter the one-time passcode</div>
          </div>
          <div className="boxes">
            <span className="b" style={{'--t':'1.5s'} as any}><em>4</em></span><span className="b" style={{'--t':'1.8s'} as any}><em>8</em></span><span className="b" style={{'--t':'2.1s'} as any}><em>2</em></span>
            <span className="b" style={{'--t':'2.4s'} as any}><em>9</em></span><span className="b" style={{'--t':'2.7s'} as any}><em>1</em></span><span className="b" style={{'--t':'3s'} as any}><em>5</em></span>
          </div>
          <div className="bar"><i></i></div>
          <div className="stat">
            <span className="s1">Code expires in 00:30</span>
            <span className="s2"><i className="mini"></i>Verifying…</span>
            <span className="s3">Verified successfully</span>
          </div>
        </div>

        {/* scene d */}
        <div className="granted"><i><svg viewBox="0 0 24 24"><path d="M5 12.500l4.500 4.500L19 7.500"/></svg></i>Access granted</div>
      </div>

      <div className="caps" aria-hidden="true">
        <div className="cap on" data-s="a"><h3>Upload to your private cloud</h3><p>IDs, certificates and records are saved to your secure cloud storage in seconds.</p></div>
        <div className="cap" data-s="b"><h3>Encrypted in the cloud</h3><p>Every file is protected with AES-256 encryption before it is stored, so only you can read it.</p></div>
        <div className="cap" data-s="g"><h3>Sign in with Google</h3><p>Pick your Google account and continue &mdash; no new password to remember.</p></div>
        <div className="cap" data-s="c"><h3>Two-step verification</h3><p>Google sign-in plus a one-time passcode (OTP) confirms it&rsquo;s really you.</p></div>
        <div className="cap" data-s="d"><h3>Only you can open it</h3><p>Access is granted after both steps, so your documents stay private and safe.</p></div>
      </div>
    </aside>
  );
}
