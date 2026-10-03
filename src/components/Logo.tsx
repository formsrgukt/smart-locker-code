import React from 'react';

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Document Outline */}
      <rect x="16" y="12" width="32" height="42" rx="4" fill="white" stroke="#7A6BED" strokeWidth="4" />
      
      {/* Document Lines */}
      <line x1="24" y1="24" x2="40" y2="24" stroke="#A79CF4" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="24" y1="32" x2="40" y2="32" stroke="#A79CF4" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="24" y1="40" x2="34" y2="40" stroke="#A79CF4" strokeWidth="3.5" strokeLinecap="round" />

      {/* Security Badge Circle */}
      <circle cx="48" cy="44" r="14" fill="#18A773" stroke="#7A6BED" strokeWidth="4" />

      {/* Padlock Body */}
      <rect x="42" y="43" width="12" height="9" rx="1.5" fill="white" />
      
      {/* Padlock Shackle */}
      <path d="M44.5 43V39.5C44.5 37.567 46.067 36 48 36C49.933 36 51.5 37.567 51.5 39.5V43" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Keyhole */}
      <path d="M48 45.5C47.1716 45.5 46.5 46.1716 46.5 47C46.5 47.5304 46.775 47.9965 47.199 48.2435L47.5 49.5H48.5L48.801 48.2435C49.225 47.9965 49.5 47.5304 49.5 47C49.5 46.1716 48.8284 45.5 48 45.5Z" fill="#18A773" />
    </svg>
  );
}
