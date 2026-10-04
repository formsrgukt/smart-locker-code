import React, { useEffect, useState } from 'react';

interface AnimatedGreetingProps {
  name: string;
  photoUrl?: string | null;
}

export default function AnimatedGreeting({ name, photoUrl }: AnimatedGreetingProps) {
  const [greeting, setGreeting] = useState('');
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening');
    
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('greetingAnimated')) {
        setHasAnimated(true);
      } else {
        sessionStorage.setItem('greetingAnimated', 'true');
      }
    }
  }, []);

  if (!greeting) return null; // Avoid hydration mismatch

  // Split strings into characters for animation
  const renderWord = (text: string, isName: boolean = false, startIndex: number = 0) => {
    if (isName) {
      return (
        <span 
          className="greet-w greet-ch" 
          style={{ '--i': startIndex } as React.CSSProperties}
          aria-hidden="true"
        >
          <span className="greet-name">{text}</span>
        </span>
      );
    }
    return (
      <span className="greet-w" aria-hidden="true">
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

      <div className="greet-content">
        <h1 aria-label={`${greeting}, ${name}`}>
          {hasAnimated ? (
            <>
              {greetingStr}<span className="greet-name">{name}</span>
            </>
          ) : (
            <>
              {renderWord(greetingStr, false, 0)}
              {renderWord(name, true, greetingStr.length)}
            </>
          )}
        </h1>
        <p 
          className="greet-sub"
          style={hasAnimated ? { animation: 'none', opacity: 1, clipPath: 'none' } : undefined}
        >
          Everything important, right where you need it.
        </p>
      </div>
    </section>
  );
}
