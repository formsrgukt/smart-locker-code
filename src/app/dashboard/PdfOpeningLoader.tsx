import React from 'react';
import './PdfOpeningLoader.css';

export default function PdfOpeningLoader() {
  return (
    <div className="pdf-loader-wrapper animate-in fade-in duration-300">
      <div className="loader" role="status" aria-live="polite">
        <div className="scene" aria-hidden="true">
          <span className="ground"></span>
          <div className="lift">
            <div className="book">
              <div className="page">
                <i></i><i></i><i></i><i></i><span className="cast"></span>
              </div>
              <div className="cover">
                <div className="face front"><span className="badge">PDF</span></div>
                <div className="face back"><i></i><i></i><i></i></div>
              </div>
            </div>
          </div>
        </div>
        <div className="label">
          Opening PDF<span className="dots"><span>.</span><span>.</span><span>.</span></span>
        </div>
      </div>
    </div>
  );
}
