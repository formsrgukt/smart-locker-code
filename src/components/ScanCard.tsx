import React from 'react';
import './ScanCard.css';

interface ScanCardProps {
  onClick: () => void;
}

export default function ScanCard({ onClick }: ScanCardProps) {
  return (
    <button className="scan-card-root scan-card-btn" type="button" aria-label="Scan document" onClick={onClick}>
      <span className="scan-card-stage">
        <span className="scan-card-ripple"></span>
        <span className="scan-card-pulse"></span>
        <span className="scan-card-badge">
          <svg className="scan-card-frame" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9V6a2 2 0 012-2h3"/><path d="M15 4h3a2 2 0 012 2v3"/>
            <path d="M20 15v3a2 2 0 01-2 2h-3"/><path d="M9 20H6a2 2 0 01-2-2v-3"/>
          </svg>
          <span className="scan-card-page"></span>
          <span className="scan-card-beam"></span>
          <svg className="scan-card-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 12.5l3 3 6-7"/></svg>
        </span>
      </span>

      <span className="scan-card-labels">
        <span className="sc-l-idle">Scan<br/>Document</span>
        <span className="sc-l-up">Scanning...</span>
        <span className="sc-l-done">Document<br/>scanned</span>
      </span>
    </button>
  );
}
