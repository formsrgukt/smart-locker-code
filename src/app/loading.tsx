'use client';

import React from 'react';
import SecureLoader from '@/components/SecureLoader';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-slate-50 z-[9999] flex flex-col items-center justify-center animate-in fade-in duration-300">
      <SecureLoader />
    </div>
  );
}
