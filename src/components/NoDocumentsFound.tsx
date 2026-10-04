import React from 'react';

export default function NoDocumentsFound({ message = "We couldn't find any documents matching your search." }: { message?: string }) {
  return (
    <div className="mt-8 bg-transparent py-16 flex flex-col items-center text-center">
      <div className="nodoc-stage" aria-hidden="true">
        <div className="nodoc-ghost">
          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
        </div>
        <div className="nodoc-doc">
          <b className="tag"></b>
          <i className="ln"></i><i className="ln"></i><i className="ln"></i><i className="ln"></i><i className="ln"></i>
        </div>
        <div className="nodoc-ring"></div>
        <div className="nodoc-mag">
          <svg viewBox="0 0 72 72">
            <circle className="nodoc-lens-fill" cx="30" cy="30" r="20"/>
            <line className="nodoc-handle" x1="45" y1="45" x2="62" y2="62"/>
            <circle className="nodoc-lens" cx="30" cy="30" r="20"/>
            <g className="nodoc-xm"><path d="M23 23l14 14M37 23L23 37"/></g>
          </svg>
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mt-6 mb-2">No documents found</h3>
      <p className="text-slate-500 max-w-sm">{message}</p>
    </div>
  );
}
