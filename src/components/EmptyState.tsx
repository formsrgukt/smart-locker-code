import React from 'react';

export default function EmptyState() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12">
      <style>{`
        .empty-state { text-align: center; max-width: 340px; width: 100%; margin: 0 auto; }
        .empty-state svg { width: 100%; height: auto; display: block; overflow: visible; }
        .empty-state .a { transform-box: fill-box; transform-origin: center; }
        .empty-state .ring { animation: empty-ring 3.6s ease-in-out infinite; }
        .empty-state .float { animation: empty-float 3.6s ease-in-out infinite; }
        .empty-state .shadow { animation: empty-shadow 3.6s ease-in-out infinite; }
        .empty-state .ghostL { animation: empty-ghostL 3.6s ease-in-out infinite; }
        .empty-state .ghostR { animation: empty-ghostR 3.6s ease-in-out infinite; }
        .empty-state .sk { animation: empty-sk 2.4s ease-in-out infinite; }
        .empty-state .sk2 { animation-delay: .25s; }
        .empty-state .sk3 { animation-delay: .5s; }
        .empty-state .sk4 { animation-delay: .75s; }
        .empty-state .badge { animation: empty-badge 2.4s cubic-bezier(.4,0,.2,1) infinite; }
        .empty-state .d { animation: empty-rise 4.8s ease-in-out infinite; opacity: 0; }
        .empty-state .d2 { animation-delay: 1.6s; }
        .empty-state .d3 { animation-delay: 3.2s; }
        @keyframes empty-float { 0%, 100% { transform: translateY(6px); } 50% { transform: translateY(-8px); } }
        @keyframes empty-shadow { 0%, 100% { transform: scale(.88); opacity: .55; } 50% { transform: scale(1.05); opacity: .3; } }
        @keyframes empty-ring { 0%, 100% { transform: scale(.96); opacity: .7; } 50% { transform: scale(1.04); opacity: 1; } }
        @keyframes empty-ghostL { 0%, 100% { transform: rotate(-6deg) translate(-6px,4px); } 50% { transform: rotate(-11deg) translate(-12px,-2px); } }
        @keyframes empty-ghostR { 0%, 100% { transform: rotate(6deg) translate(6px,4px); } 50% { transform: rotate(11deg) translate(12px,-2px); } }
        @keyframes empty-sk { 0%, 100% { opacity: .35; } 50% { opacity: 1; } }
        @keyframes empty-badge { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.14); } }
        @keyframes empty-rise { 0% { transform: translateY(20px); opacity: 0; } 25% { opacity: .9; } 100% { transform: translateY(-70px); opacity: 0; } }
      `}</style>

      <div className="empty-state">
        <svg viewBox="0 0 380 260" role="img" aria-label="A blank document floating with a plus badge">
          <circle className="a ring" cx="190" cy="140" r="108" fill="#eff6ff" /> {/* blue-50 (accent soft) */}
          <ellipse className="a shadow" cx="190" cy="252" rx="52" ry="7" fill="#cbd5e1" /> {/* slate-300 (muted) */}
          <g className="a ghostL"><rect x="138" y="82" width="96" height="124" rx="8" fill="#f8fafc" stroke="#e2e8f0" /></g> {/* slate-50 / slate-200 */}
          <g className="a ghostR"><rect x="146" y="82" width="96" height="124" rx="8" fill="#f8fafc" stroke="#e2e8f0" /></g>
          
          <g className="a float">
            <rect x="140" y="78" width="100" height="130" rx="8" fill="#ffffff" stroke="#e2e8f0" /> {/* white surface */}
            <path d="M216 78 L240 102 L224 102 Q216 102 216 94 Z" fill="#f8fafc" stroke="#e2e8f0" strokeLinejoin="round" />
            
            <rect className="a sk" x="156" y="118" width="58" height="7" rx="3.5" fill="#e2e8f0" />
            <rect className="a sk sk2" x="156" y="136" width="68" height="7" rx="3.5" fill="#e2e8f0" />
            <rect className="a sk sk3" x="156" y="154" width="48" height="7" rx="3.5" fill="#e2e8f0" />
            <rect className="a sk sk4" x="156" y="172" width="62" height="7" rx="3.5" fill="#e2e8f0" />
            
            <g className="a badge">
              <circle cx="240" cy="202" r="19" fill="#2563eb" /> {/* blue-600 (accent) */}
              <path d="M240 193V211M231 202H249" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>
          </g>
          <circle className="d" cx="110" cy="200" r="4" fill="#2563eb" />
          <circle className="d d2" cx="272" cy="180" r="3" fill="#2563eb" />
          <circle className="d d3" cx="96" cy="150" r="2.5" fill="#2563eb" />
        </svg>
        
        <h3 className="text-xl font-bold text-slate-900 mt-2">No documents yet</h3>
        <p className="text-sm text-slate-500 mt-2 font-medium">Click the Upload button on the left to add your first document securely into the locker.</p>
      </div>
    </div>
  );
}
