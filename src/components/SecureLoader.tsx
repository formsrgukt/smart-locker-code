import React from 'react';

export default function SecureLoader() {
  return (
    <div className="w-full flex justify-center items-center">
      <style>{`
        :root {
          --bg: #ffffff;
          --text-secondary: #5f5e5a;
          --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .smart-loader {
          font-family: var(--font-sans);
          width: 100%;
          max-width: 420px;
        }
        .smart-loader svg { width: 100%; height: auto; }
        .smart-loader .fly { animation: fly 5s ease-in-out infinite; opacity: 0; }
        .smart-loader .f2 { animation-delay: .12s; }
        .smart-loader .f3 { animation-delay: .24s; }
        .smart-loader .f4 { animation-delay: .36s; }
        @keyframes fly {
          0% { opacity: 0; transform: translate(0,0) scale(1); }
          6%, 16% { opacity: 1; transform: translate(0,0) scale(1); }
          34% { opacity: 1; transform: translate(var(--dx),var(--dy)) scale(.35); }
          38%, 100% { opacity: 0; transform: translate(var(--dx),var(--dy)) scale(.2); }
        }
        .smart-loader .fx { transform-box: fill-box; transform-origin: center; }
        .smart-loader #pp { transform-box: fill-box; transform-origin: center; animation: pp 5s ease-in-out infinite; }
        @keyframes pp {
          0%, 34% { transform: scale(1); }
          38% { transform: scale(1.07); }
          45%, 100% { transform: scale(1); }
        }
        .smart-loader .ln { transform-box: fill-box; transform-origin: left center; animation: ln 5s ease-out infinite; transform: scaleX(0); }
        .smart-loader .l2 { animation-delay: .12s; }
        .smart-loader .l3 { animation-delay: .24s; }
        @keyframes ln {
          0%, 36% { transform: scaleX(0); }
          46%, 94% { transform: scaleX(1); }
          99%, 100% { transform: scaleX(0); }
        }
        .smart-loader #bd { transform-box: fill-box; transform-origin: center; animation: bd 5s ease-out infinite; transform: scale(0); }
        @keyframes bd {
          0% { transform: scale(0) rotate(0); }
          6% { transform: scale(1.15) rotate(0); }
          10%, 49% { transform: scale(1) rotate(0); }
          52% { transform: scale(.86) rotate(-7deg); }
          55% { transform: scale(1.14) rotate(6deg); }
          58% { transform: scale(.96) rotate(-3deg); }
          61% { transform: scale(1) rotate(0); }
          70% { transform: scale(1.07) rotate(0); }
          78% { transform: scale(1) rotate(0); }
          86% { transform: scale(1.07) rotate(0); }
          94% { transform: scale(1) rotate(0); }
          99%, 100% { transform: scale(0) rotate(0); }
        }
        .smart-loader #shk { transform-box: fill-box; transform-origin: right bottom; animation: shk 5s ease-in-out infinite; }
        @keyframes shk {
          0%, 6% { transform: rotate(0); }
          12%, 44% { transform: rotate(40deg); }
          50%, 100% { transform: rotate(0); }
        }
        .smart-loader #rg { transform-box: fill-box; transform-origin: center; animation: rg 5s ease-out infinite; opacity: 0; }
        @keyframes rg {
          0%, 50% { transform: scale(1); opacity: 0; }
          52% { transform: scale(1); opacity: .8; }
          66% { transform: scale(1.9); opacity: 0; }
          68%, 69% { transform: scale(1); opacity: 0; }
          70% { transform: scale(1); opacity: .8; }
          86% { transform: scale(1.9); opacity: 0; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        .smart-loader #wm { animation: wm 5s ease-out infinite; opacity: 0; }
        @keyframes wm {
          0%, 56% { opacity: 0; transform: translateY(6px); }
          64%, 93% { opacity: 1; transform: translateY(0); }
          98%, 100% { opacity: 0; transform: translateY(0); }
        }
        .smart-loader .tg { fill-opacity: 0; animation: tg 5s ease-out infinite; }
        .smart-loader .t2 { animation-delay: .25s; }
        .smart-loader .t3 { animation-delay: .5s; }
        @keyframes tg {
          0%, 62% { fill-opacity: 0; }
          70%, 93% { fill-opacity: 1; }
          98%, 100% { fill-opacity: 0; }
        }
        .smart-loader .st { fill-opacity: 0; animation-duration: 5s; animation-iteration-count: infinite; }
        .smart-loader .s1 { animation-name: s1; }
        .smart-loader .s2 { animation-name: s2; }
        .smart-loader .s3 { animation-name: s3; }
        @keyframes s1 {
          0%, 2% { fill-opacity: 0; }
          6%, 36% { fill-opacity: 1; }
          40%, 100% { fill-opacity: 0; }
        }
        @keyframes s2 {
          0%, 40% { fill-opacity: 0; }
          44%, 60% { fill-opacity: 1; }
          64%, 100% { fill-opacity: 0; }
        }
        @keyframes s3 {
          0%, 62% { fill-opacity: 0; }
          66%, 93% { fill-opacity: 1; }
          98%, 100% { fill-opacity: 0; }
        }
      `}</style>

      <div className="smart-loader">
        <svg viewBox="0 0 380 300" role="img" aria-label="Smart Locker loading animation">
          <title>Smart Locker signature loader</title>
          
          <rect x="130" y="50" width="120" height="120" rx="28" fill="#3C3489"/>
          <rect id="pp" x="158" y="72" width="64" height="80" rx="7" fill="#FFFFFF"/>
          <rect className="ln" x="169" y="88" width="42" height="5" rx="2.5" fill="#AFA9EC"/>
          <rect className="ln l2" x="169" y="101" width="42" height="5" rx="2.5" fill="#AFA9EC"/>
          <rect className="ln l3" x="169" y="114" width="26" height="5" rx="2.5" fill="#AFA9EC"/>

          <g transform="translate(24,20)">
            <g className="fly" style={{ '--dx': '155px', '--dy': '84px' } as React.CSSProperties}>
              <rect className="fx" width="22" height="16" rx="3" fill="#EF9F27"/>
              <rect x="4" y="5" width="10" height="2" rx="1" fill="#FFFFFF"/>
              <rect x="4" y="9" width="14" height="2" rx="1" fill="#FFFFFF"/>
              <text x="11" y="31" textAnchor="middle" fontSize="11" fill="var(--text-secondary)">Marksheet</text>
            </g>
          </g>
          <g transform="translate(324,20)">
            <g className="fly f2" style={{ '--dx': '-145px', '--dy': '84px' } as React.CSSProperties}>
              <rect className="fx" width="22" height="16" rx="3" fill="#D85A30"/>
              <rect x="4" y="5" width="10" height="2" rx="1" fill="#FFFFFF"/>
              <rect x="4" y="9" width="14" height="2" rx="1" fill="#FFFFFF"/>
              <text x="11" y="31" textAnchor="middle" fontSize="11" fill="var(--text-secondary)">ID Card</text>
            </g>
          </g>
          <g transform="translate(24,196)">
            <g className="fly f3" style={{ '--dx': '155px', '--dy': '-92px' } as React.CSSProperties}>
              <rect className="fx" width="22" height="16" rx="3" fill="#378ADD"/>
              <rect x="4" y="5" width="10" height="2" rx="1" fill="#FFFFFF"/>
              <rect x="4" y="9" width="14" height="2" rx="1" fill="#FFFFFF"/>
              <text x="11" y="31" textAnchor="middle" fontSize="11" fill="var(--text-secondary)">Certificate</text>
            </g>
          </g>
          <g transform="translate(324,196)">
            <g className="fly f4" style={{ '--dx': '-145px', '--dy': '-92px' } as React.CSSProperties}>
              <rect className="fx" width="22" height="16" rx="3" fill="#D4537E"/>
              <rect x="4" y="5" width="10" height="2" rx="1" fill="#FFFFFF"/>
              <rect x="4" y="9" width="14" height="2" rx="1" fill="#FFFFFF"/>
              <text x="11" y="31" textAnchor="middle" fontSize="11" fill="var(--text-secondary)">Resume</text>
            </g>
          </g>

          <circle id="rg" cx="224" cy="138" r="28" fill="none" stroke="#1D9E75" strokeWidth="2"/>
          <g id="bd">
            <circle cx="224" cy="138" r="28" fill="#1D9E75" stroke="#3C3489" strokeWidth="5"/>
            <path id="shk" d="M216 137 V131 a8 8 0 0 1 16 0 V137" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round"/>
            <rect x="211" y="136" width="26" height="20" rx="4" fill="#FFFFFF"/>
            <circle cx="224" cy="144" r="3" fill="#1D9E75"/>
            <rect x="223" y="145" width="2" height="6" rx="1" fill="#1D9E75"/>
          </g>

          <text id="wm" x="190" y="219" textAnchor="middle" fontSize="30" style={{ fontWeight: 500, letterSpacing: '.5px' }}>
            <tspan fill="#7F77DD">Smart</tspan> <tspan fill="#1D9E75">Locker</tspan>
          </text>
          {/* Changed fill from #FFFFFF to #64748b (slate-500) so it's visible on light bg */}
          <text x="190" y="244" textAnchor="middle" fontSize="13" style={{ letterSpacing: '1px' }}>
            <tspan className="tg" fill="#64748b">Secure,</tspan> <tspan className="tg t2" fill="#64748b">Private,</tspan> <tspan className="tg t3" fill="#64748b">Personal</tspan>
          </text>

          <g fontSize="13" textAnchor="middle">
            <text className="st s1" x="190" y="284" fill="var(--text-secondary)">Unlocking to receive your documents...</text>
            <text className="st s2" x="190" y="284" fill="var(--text-secondary)">Locking it all in...</text>
            <text className="st s3" x="190" y="284" fill="var(--text-secondary)">Safe and sound.</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
