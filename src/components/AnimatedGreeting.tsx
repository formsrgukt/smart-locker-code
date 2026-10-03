import React, { useEffect, useState } from 'react';

interface AnimatedGreetingProps {
  name: string;
  photoUrl?: string | null;
}

export default function AnimatedGreeting({ name, photoUrl }: AnimatedGreetingProps) {
  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening');
  }, []);

  if (!greeting) return null; // Avoid hydration mismatch

  // Split strings into characters for animation
  const renderWord = (text: string, isName: boolean = false, startIndex: number = 0) => {
    return (
      <span className={`greet-w ${isName ? 'greet-name' : ''}`} aria-hidden="true">
        {text.split('').map((char, index) => (
          <span 
            key={index} 
            className="greet-ch" 
            style={{ '--i': startIndex + index } as React.CSSProperties}
          >
            {char}
          </span>
        ))}
      </span>
    );
  };

  const greetingStr = `${greeting}, `;
  
  return (
    <section className="greet-card" aria-live="polite">
      <div className="greet-avatar" aria-hidden="true">
        <div className="greet-in">
          <span className="greet-pulse"></span>
          <span className="greet-pulse p2"></span>
          <div className="greet-ring"></div>
          <div className="greet-face">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="" />
            ) : (
              <svg className="greet-ui" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#6c8cff"/>
                    <stop offset="1" stopColor="#3fcfa6"/>
                  </linearGradient>
                </defs>
                <circle className="greet-head" cx="12" cy="8" r="4" pathLength="1"/>
                <path className="greet-body" d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" pathLength="1"/>
              </svg>
            )}
          </div>
          <span className="greet-status"></span>
        </div>
      </div>
      <div className="greet-content">
        <h1 aria-label={`${greeting}, ${name}.`}>
          {renderWord(greetingStr, false, 0)}
          {renderWord(name, true, greetingStr.length)}
          <span className="greet-dot" aria-hidden="true"></span>
        </h1>
        <p className="greet-sub">Everything important, right where you need it.</p>
      </div>
    </section>
  );
}
