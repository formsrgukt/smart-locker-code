'use client';

import React, { useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import { ChevronLeft, ChevronRight, Plus, Minus, LayoutList, File as FileIcon, Eye, Lock } from 'lucide-react';
import SecureLoader from '@/components/SecureLoader';
import PdfOpeningLoader from './PdfOpeningLoader';

if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

export default function PdfViewer({ file, onClose }: { file: any, onClose: () => void }) {
  // Use raw github url first to bypass regional CDN blocking of jsdelivr
  const url = file.urls?.raw || file.url;
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfScale, setPdfScale] = useState<number>(1.0);
  const [viewMode, setViewMode] = useState<'single' | 'continuous'>('continuous');

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-slate-200/50 relative overflow-hidden">
      {/* Combined Header & Toolkit */}
      <div className="w-full bg-white border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-4 z-20 shrink-0 shadow-sm">
        
        {/* Left: Title */}
        <h3 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2 truncate max-w-[40%] sm:max-w-[30%]"><Eye size={20} className="text-blue-600 shrink-0"/> <span className="truncate">{file.name}</span></h3>
        
        {/* Center: Toolkit */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 flex-1 order-3 w-full sm:order-none sm:w-auto mt-2 sm:mt-0">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button onClick={() => setViewMode('single')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'single' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800'}`} title="Single Page"><FileIcon size={16}/></button>
            <button onClick={() => setViewMode('continuous')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'continuous' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800'}`} title="Continuous Scroll"><LayoutList size={16}/></button>
          </div>

          <div className="hidden sm:block w-px h-5 bg-slate-300"></div>

          <div className="flex items-center gap-1 sm:gap-3">
            <button onClick={() => setPageNumber(Math.max(1, pageNumber - 1))} disabled={pageNumber <= 1 || viewMode === 'continuous'} className="p-1 rounded-md text-slate-600 hover:bg-slate-200 hover:text-blue-600 disabled:opacity-30 transition-colors"><ChevronLeft size={20}/></button>
            <span className="text-slate-700 text-xs sm:text-sm font-semibold tracking-wide w-16 text-center">{viewMode === 'continuous' ? `All ${numPages || '?'}` : `${pageNumber} / ${numPages || '?'}`}</span>
            <button onClick={() => setPageNumber(Math.min(numPages || 1, pageNumber + 1))} disabled={pageNumber >= (numPages || 1) || viewMode === 'continuous'} className="p-1 rounded-md text-slate-600 hover:bg-slate-200 hover:text-blue-600 disabled:opacity-30 transition-colors"><ChevronRight size={20}/></button>
          </div>
          
          <div className="hidden sm:block w-px h-5 bg-slate-300"></div>
          
          <div className="flex items-center gap-1 sm:gap-3">
            <button onClick={() => setPdfScale(Math.max(0.5, pdfScale - 0.25))} className="p-1 rounded-md text-slate-600 hover:bg-slate-200 hover:text-blue-600 transition-colors"><Minus size={18}/></button>
            <span className="text-slate-700 text-xs sm:text-sm font-semibold w-12 text-center">{Math.round(pdfScale * 100)}%</span>
            <button onClick={() => setPdfScale(Math.min(3, pdfScale + 0.25))} className="p-1 rounded-md text-slate-600 hover:bg-slate-200 hover:text-blue-600 transition-colors"><Plus size={18}/></button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 order-2 sm:order-none">
          <button onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-200 transition-colors active:scale-95">Close</button>
        </div>
      </div>

      {/* Document Canvas */}
      <div className="w-full h-full overflow-auto flex flex-col items-center pt-8 pb-32 px-4 scroll-smooth">
        {error ? (
          <div className="mt-20 flex flex-col items-center max-w-md text-center p-8 bg-red-50 rounded-3xl">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Failed to load document</h3>
            <p className="text-slate-500 text-sm">{error}</p>
          </div>
        ) : (
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(err) => setError(err.message)}
            onSourceError={(err) => setError(err.message)}
            loading={<PdfOpeningLoader />}
            className="flex flex-col items-center gap-4 sm:gap-8 max-w-full"
          >
            {viewMode === 'continuous' ? (
            Array.from(new Array(numPages || 0), (el, index) => (
              <Page 
                key={`page_${index + 1}`}
                pageNumber={index + 1} 
                scale={pdfScale} 
                loading={<PdfOpeningLoader />}
                renderTextLayer={false} 
                renderAnnotationLayer={false}
                className="bg-white shadow-2xl max-w-full"
              />
            ))
          ) : (
            <Page 
              pageNumber={pageNumber} 
              scale={pdfScale} 
              loading={<PdfOpeningLoader />}
              renderTextLayer={false} 
              renderAnnotationLayer={false}
              className="bg-white shadow-2xl max-w-full"
            />
          )}
        </Document>
        )}
      </div>
    </div>
  );
}
