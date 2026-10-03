import React from 'react';
import './UploadCard.css';

interface UploadCardProps {
  onClick: () => void;
  isUploading: boolean;
  isSuccess?: boolean;
  disabled?: boolean;
  uploadProgress?: number;
}

export default function UploadCard({ onClick, isUploading, isSuccess, disabled, uploadProgress }: UploadCardProps) {
  let stateClass = '';
  if (isUploading) stateClass = 'is-uploading';
  else if (isSuccess) stateClass = 'is-success';

  return (
    <button 
      className={`upload-card-root upload-card-btn ${stateClass}`} 
      type="button" 
      aria-label="Upload document to your private drive"
      onClick={onClick}
      disabled={disabled || isUploading}
    >
      <span className="upload-card-glow"></span>

      <span className="upload-card-stage">
        <span className="upload-card-circle">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3"/><path d="M12 15V4"/><path d="M7.5 8.5L12 4l4.5 4.5"/>
          </svg>
        </span>

        <span className="upload-card-scene" aria-hidden="true">
          <span 
            className="upload-card-doc"
            style={{ transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          ></span>
          <span className="upload-card-drive">
            <span className="upload-card-slot"></span>
            <span className="upload-card-track">
              <span className="upload-card-fill"></span>
            </span>
            <span className="upload-card-led"></span>
          </span>
          <span className="upload-card-lock">
            <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{width: '14px', height: '14px'}}>
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
        </span>
      </span>

      <span className="upload-card-labels">
        <span className="uc-l-idle">Upload<br/>Document</span>
        <span className="uc-l-up">Uploading...</span>
        <span className="uc-l-saved">Saved to<br/>Private Drive</span>
      </span>
    </button>
  );
}
