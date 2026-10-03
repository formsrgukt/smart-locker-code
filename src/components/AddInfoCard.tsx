import React from 'react';
import './AddInfoCard.css';

interface AddInfoCardProps {
  onClick?: () => void;
}

export default function AddInfoCard({ onClick }: AddInfoCardProps) {
  return (
    <button className="add-info-card" type="button" aria-label="Add personal info" onClick={onClick}>
      <span className="add-info-glow"></span>

      <span className="add-info-stage">
        <span className="add-info-circle">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="3.6"/><path d="M5 20c0-3.9 3.1-6 7-6s7 2.1 7 6"/>
          </svg>
        </span>

        <span className="add-info-scene" aria-hidden="true">
          <span className="add-info-idcard">
            <span className="add-info-avatar">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.4"/><path d="M5.5 20c0-3.6 2.9-5.6 6.5-5.6s6.5 2 6.5 5.6"/></svg>
            </span>
            <span className="add-info-ln add-info-ln1"></span>
            <span className="add-info-ln add-info-ln2"></span>
            <span className="add-info-ln add-info-ln3"></span>
            <span className="add-info-badge">
              <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>
            </span>
          </span>
        </span>
      </span>

      <span className="add-info-labels text-slate-700">
        <span className="add-info-l-idle">Add Personal<br/>Info</span>
        <span className="add-info-l-up">Adding details…</span>
        <span className="add-info-l-saved">Details saved</span>
      </span>
    </button>
  );
}
