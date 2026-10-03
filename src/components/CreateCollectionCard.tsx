import React from 'react';
import './CreateCollectionCard.css';

interface CreateCollectionCardProps {
  onClick: () => void;
}

export default function CreateCollectionCard({ onClick }: CreateCollectionCardProps) {
  return (
    <button className="create-collection-card" type="button" aria-label="Create collection" onClick={onClick}>
      <span className="cc-glow"></span>

      <span className="cc-stage">
        <span className="cc-circle">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3.5 7a2 2 0 012-2h3.6l2.2 2.4h7.2a2 2 0 012 2V17a2 2 0 01-2 2H5.5a2 2 0 01-2-2z"/>
          </svg>
        </span>

        <span className="cc-folder" aria-hidden="true">
          <span className="cc-back"></span>
          <span className="cc-d cc-d1"></span>
          <span className="cc-d cc-d2"></span>
          <span className="cc-d cc-d3"></span>
          <span className="cc-front"></span>
          <span className="cc-badge">
            <svg viewBox="0 0 24 24">
              <path d="M5 12.5l4.5 4.5L19 7.5"/>
            </svg>
          </span>
        </span>
      </span>

      <span className="cc-labels">
        <span className="cc-l-idle">Create<br/>Collection</span>
        <span className="cc-l-up">Adding items</span>
        <span className="cc-l-saved">Collection created</span>
      </span>
    </button>
  );
}
