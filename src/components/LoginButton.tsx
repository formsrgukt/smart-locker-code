'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface LoginButtonProps {
  className?: string;
  text?: string;
  variant?: 'outline' | 'solid';
}

export default function LoginButton({ className = "", text = "Sign In", variant = "solid" }: LoginButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // Clear any previous OTP session data so it ALWAYS asks for a new OTP on every login
    sessionStorage.removeItem('otpVerified');
    sessionStorage.removeItem('expectedOtp');
    
    try {
      const provider = new GoogleAuthProvider();
      // Force Google to prompt the user for their account every time for extra security
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
      // The auth state listener in the login page or dashboard will handle the redirect after return.
    } catch (error: any) {
      console.error(error);
      alert('Login failed: ' + (error?.message || String(error)));
      setLoading(false);
    }
  };

  const baseStyles = "inline-flex items-center justify-center transition-all disabled:opacity-70 disabled:cursor-not-allowed";
  const solidStyles = "px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-sm hover:shadow-md active:scale-95";
  const outlineStyles = "text-sm font-medium text-slate-600 hover:text-slate-900";

  const appliedStyles = variant === 'solid' ? solidStyles : outlineStyles;

  return (
    <button onClick={handleLogin} disabled={loading} className={`${baseStyles} ${appliedStyles} ${className}`}>
      {loading ? (
        'Connecting...'
      ) : (
        <>
          {text.includes('Google') && (
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          {text}
        </>
      )}
    </button>
  );
}
