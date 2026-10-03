'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import LoginButton from '@/components/LoginButton';
import Logo from '@/components/Logo';
import LoaderAnimation from '@/components/LoaderAnimation';

export default function LoginPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [expectedOtp, setExpectedOtp] = useState('');
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);

  const notifyLogin = async (email: string, displayName: string) => {
    try {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists() && userDoc.data().loginAlerts !== true) {
          return; // Alerts are disabled
        }
      }

      // Fetch location data based on user IP
      const geoResponse = await fetch('https://get.geojs.io/v1/ip/geo.json');
      const geoData = await geoResponse.json();
      const location = `${geoData.city || 'Unknown City'}, ${geoData.country || 'Unknown Country'}`;
      
      const time = new Date().toLocaleString('en-US', { 
        dateStyle: 'full', 
        timeStyle: 'long' 
      });

      // Basic device parsing from user agent
      const ua = navigator.userAgent;
      let browser = "Unknown Browser";
      if (ua.includes("Firefox")) browser = "Firefox";
      else if (ua.includes("Edg")) browser = "Edge";
      else if (ua.includes("Chrome")) browser = "Chrome";
      else if (ua.includes("Safari")) browser = "Safari";
      
      let os = "Unknown OS";
      if (ua.includes("Win")) os = "Windows";
      else if (ua.includes("Mac")) os = "MacOS";
      else if (ua.includes("Linux")) os = "Linux";
      if (ua.includes("Android")) os = "Android";
      else if (ua.includes("like Mac")) os = "iOS";
      
      const deviceDetails = `${browser} on ${os}`;

      const htmlMessage = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Security Alert</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px 0; color: #1f2937;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin: 0 auto; overflow: hidden;">
            <tr>
              <td style="padding: 30px; text-align: center; border-bottom: 1px solid #f0f0f0; background: linear-gradient(to bottom, #f8fafc, #ffffff);">
                <img src="data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%0A%20%20%3Crect%20x%3D%2225%22%20y%3D%2220%22%20width%3D%2240%22%20height%3D%2255%22%20rx%3D%224%22%20fill%3D%22none%22%20stroke%3D%22%237e77e5%22%20stroke-width%3D%223.5%22%20%2F%3E%0A%20%20%3Cline%20x1%3D%2233%22%20y1%3D%2232%22%20x2%3D%2257%22%20y2%3D%2232%22%20stroke%3D%22%23a9a3f2%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%2F%3E%0A%20%20%3Cline%20x1%3D%2233%22%20y1%3D%2242%22%20x2%3D%2257%22%20y2%3D%2242%22%20stroke%3D%22%23a9a3f2%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%2F%3E%0A%20%20%3Cline%20x1%3D%2233%22%20y1%3D%2252%22%20x2%3D%2245%22%20y2%3D%2252%22%20stroke%3D%22%23a9a3f2%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%2F%3E%0A%20%20%3Ccircle%20cx%3D%2260%22%20cy%3D%2260%22%20r%3D%2218%22%20fill%3D%22%231b9e6f%22%20stroke%3D%22%237e77e5%22%20stroke-width%3D%223%22%20%2F%3E%0A%20%20%3Crect%20x%3D%2253%22%20y%3D%2258%22%20width%3D%2214%22%20height%3D%2210%22%20rx%3D%221.5%22%20fill%3D%22white%22%20%2F%3E%0A%20%20%3Cpath%20d%3D%22M%2056%2058%20V%2054%20A%204%204%200%200%201%2064%2054%20V%2058%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%222%22%20%2F%3E%0A%20%20%3Ccircle%20cx%3D%2260%22%20cy%3D%2262%22%20r%3D%221.5%22%20fill%3D%22%231b9e6f%22%20%2F%3E%0A%20%20%3Cline%20x1%3D%2260%22%20y1%3D%2263%22%20x2%3D%2260%22%20y2%3D%2265%22%20stroke%3D%22%231b9e6f%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20%2F%3E%0A%3C%2Fsvg%3E" alt="Smart Locker Logo" width="60" height="60" style="display: block; margin: 0 auto 15px auto;" />
                <h2 style="font-size: 20px; font-weight: 800; color: #111827; margin: 0; letter-spacing: -0.5px;">SMART <span style="color: #2563eb;">LOCKER</span></h2>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px;">
                <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 16px 0; color: #111827;">New Login Detected</h3>
                <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: #4b5563;">
                  Hello ${displayName || 'User'},<br><br>
                  We noticed a new sign-in to your Smart Locker account. Here are the details of this session:
                </p>
                
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                  <tr>
                    <td style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
                      <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Time</p>
                      <p style="margin: 4px 0 0 0; font-size: 15px; color: #111827;">${time}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
                      <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Location</p>
                      <p style="margin: 4px 0 0 0; font-size: 15px; color: #111827;">${location}</p>
                      <p style="margin: 2px 0 0 0; font-size: 13px; color: #6b7280;">IP: ${geoData.ip || 'Unknown'}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 16px;">
                      <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Device</p>
                      <p style="margin: 4px 0 0 0; font-size: 15px; color: #111827;">${deviceDetails}</p>
                    </td>
                  </tr>
                </table>
                
                <p style="font-size: 14px; line-height: 1.5; margin: 24px 0 0 0; color: #6b7280;">
                  If this was you, you can safely ignore this email. If you did not authorize this login, we recommend securing your account immediately.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #f0f0f0;">
                <p style="margin: 0; font-size: 12px; color: #9ca3af;">&copy; ${new Date().getFullYear()} Smart Locker Inc. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      await emailjs.send(
        'service_6m82mme',
        'template_2m2gg46',
        {
          to_email: email,
          user_email: email,
          email: email,
          to_name: displayName || 'User',
          user_name: displayName || 'User',
          subject: 'Security Alert: New Login to SMART LOCKER',
          message: htmlMessage
        },
        '8pRwM5MI0Z83K63oA'
      );
    } catch (error) {
      console.error("Failed to send login notification", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (sessionStorage.getItem('otpVerified') === 'true') {
          router.push('/dashboard');
        } else {
          // Check if user has disabled 2-step verification
          try {
            const userRef = doc(db, 'users', currentUser.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists() && userDoc.data().twoStepVerification === false) {
              // 2FA is explicitly disabled, bypass OTP and redirect directly
              sessionStorage.setItem('otpVerified', 'true');
              
              // SEND LOGIN ALERT
              if (currentUser.email) {
                 notifyLogin(currentUser.email, currentUser.displayName || '');
              }
              
              router.push('/dashboard');
              return;
            }
          } catch (e) {
            console.error("Error fetching user security preferences", e);
          }
          
          // Otherwise, proceed to ask for OTP
          setUser(currentUser);
          setIsCheckingAuth(false);
        }
      } else {
        setUser(null);
        setShowOtp(false);
        setIsCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (user && !showOtp && !sessionStorage.getItem('expectedOtp')) {
      sendOtp(user.email || '', user.displayName || '');
    } else if (user && sessionStorage.getItem('expectedOtp')) {
      setExpectedOtp(sessionStorage.getItem('expectedOtp')!);
      setShowOtp(true);
    }
  }, [user, showOtp]);

  useEffect(() => {
    if (showOtp && timeLeft > 0 && !verifying) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !error) {
      setError('Time out. Please resend the code.');
    }
  }, [showOtp, timeLeft, verifying, error]);

  const sendOtp = async (email: string, displayName: string) => {
    setLoadingOtp(true);
    setError('');
    setTimeLeft(60);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedOtp(code);
    sessionStorage.setItem('expectedOtp', code);
    
    const htmlMessage = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 30px 10px; margin: 0; color: #1e293b;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01); margin: 0 auto; overflow: hidden; border: 1px solid #f1f5f9;">
          <tr>
            <td style="padding: 40px 30px 30px 30px; text-align: center; border-bottom: 1px solid #f1f5f9; background: linear-gradient(to bottom, #f8fafc, #ffffff);">
              <img src="data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%0A%20%20%3Crect%20x%3D%2225%22%20y%3D%2220%22%20width%3D%2240%22%20height%3D%2255%22%20rx%3D%224%22%20fill%3D%22none%22%20stroke%3D%22%237e77e5%22%20stroke-width%3D%223.5%22%20%2F%3E%0A%20%20%3Cline%20x1%3D%2233%22%20y1%3D%2232%22%20x2%3D%2257%22%20y2%3D%2232%22%20stroke%3D%22%23a9a3f2%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%2F%3E%0A%20%20%3Cline%20x1%3D%2233%22%20y1%3D%2242%22%20x2%3D%2257%22%20y2%3D%2242%22%20stroke%3D%22%23a9a3f2%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%2F%3E%0A%20%20%3Cline%20x1%3D%2233%22%20y1%3D%2252%22%20x2%3D%2245%22%20y2%3D%2252%22%20stroke%3D%22%23a9a3f2%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%2F%3E%0A%20%20%3Ccircle%20cx%3D%2260%22%20cy%3D%2260%22%20r%3D%2218%22%20fill%3D%22%231b9e6f%22%20stroke%3D%22%237e77e5%22%20stroke-width%3D%223%22%20%2F%3E%0A%20%20%3Crect%20x%3D%2253%22%20y%3D%2258%22%20width%3D%2214%22%20height%3D%2210%22%20rx%3D%221.5%22%20fill%3D%22white%22%20%2F%3E%0A%20%20%3Cpath%20d%3D%22M%2056%2058%20V%2054%20A%204%204%200%200%201%2064%2054%20V%2058%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%222%22%20%2F%3E%0A%20%20%3Ccircle%20cx%3D%2260%22%20cy%3D%2262%22%20r%3D%221.5%22%20fill%3D%22%231b9e6f%22%20%2F%3E%0A%20%20%3Cline%20x1%3D%2260%22%20y1%3D%2263%22%20x2%3D%2260%22%20y2%3D%2265%22%20stroke%3D%22%231b9e6f%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20%2F%3E%0A%3C%2Fsvg%3E" alt="Smart Locker Logo" width="72" height="72" style="display: block; margin: 0 auto 16px auto;" />
              <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.5px;">SMART <span style="color: #6366f1;">LOCKER</span></h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 16px 0; color: #0f172a; text-align: center;">Verify your identity</h1>
              <p style="font-size: 16px; line-height: 1.6; margin: 0 0 36px 0; color: #475569; text-align: center;">
                Hi <strong style="color: #0f172a;">${displayName || 'User'}</strong>,<br>
                Please use the following 6-digit verification code to complete your secure sign-in request. This code will expire shortly.
              </p>
              
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 36px;">
                <tr>
                  <td align="center">
                    <div style="background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%); border: 2px dashed #cbd5e1; border-radius: 12px; padding: 24px; display: inline-block; min-width: 280px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
                      <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 40px; font-weight: 900; letter-spacing: 16px; color: #334155; margin-right: -16px; display: block; text-align: center;">${code}</span>
                    </div>
                  </td>
                </tr>
              </table>
              
              <p style="font-size: 14px; line-height: 1.5; margin: 0; color: #64748b; text-align: center; background-color: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                If you did not attempt to sign in to Smart Locker, someone else may be trying to access your account. Please secure your Google account immediately.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 30px; background-color: #f8fafc; text-align: center; border-top: 1px solid #f1f5f9;">
              <p style="font-size: 13px; font-weight: 500; color: #64748b; margin: 0;">&copy; ${new Date().getFullYear()} Smart Locker Inc. All rights reserved.</p>
              <p style="font-size: 11px; color: #94a3b8; margin: 8px 0 0 0;">This is an automated security message. Please do not reply.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    try {
      await emailjs.send(
        'service_6m82mme',
        'template_2m2gg46',
        {
          to_email: email,
          user_email: email,
          email: email,
          to_name: displayName || 'User',
          user_name: displayName || 'User',
          otp: code,
          otp_code: code,
          code: code,
          subject: `Your SMART LOCKER Verification Code is ${code}`,
          message: htmlMessage
        },
        '8pRwM5MI0Z83K63oA'
      );
      setShowOtp(true);
    } catch (err: any) {
      console.error('Failed to send OTP', err);
      setError('Failed to send OTP email. Please try again.');
    }
    setLoadingOtp(false);
  };

  const verifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setVerifying(true);
    
    // Simulate slight network delay for better UX
    setTimeout(async () => {
      if (otp.trim() === expectedOtp) {
        sessionStorage.setItem('otpVerified', 'true');
        sessionStorage.removeItem('expectedOtp');
        
        // Fire off the login notification email in the background
        if (user?.email) {
          notifyLogin(user.email, user.displayName || '');
        }

        router.push('/dashboard');
      } else {
        setError('Invalid verification code. Please try again.');
        setVerifying(false);
      }
    }, 800);
  };

  const handleCancel = async () => {
    sessionStorage.removeItem('expectedOtp');
    await signOut(auth);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-200">
        <LoaderAnimation />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200 selection:bg-blue-100 selection:text-blue-900 p-4 md:p-8">
      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-300/70 p-8 sm:p-10 md:p-12 border border-slate-200 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-16">
        
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center w-full md:w-1/2">
          
          {!showOtp && !loadingOtp && (
            <>
              <div className="mb-6 flex items-center justify-center">
                <Logo className="w-20 h-20 drop-shadow-xl" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4 leading-tight">
                Welcome to <br className="hidden sm:block" />
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  SMART LOCKER
                </span>
              </h1>
              <p className="text-lg text-slate-500 mb-8 max-w-md">
                Sign in to access your secure, private digital locker for all your important documents.
              </p>

              <LoginButton 
                variant="solid" 
                text="Continue with Google" 
                className="w-full py-4 rounded-2xl text-lg shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-shadow" 
              />

              {error && !showOtp && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="mt-8 flex items-center justify-center gap-3 text-base text-slate-400">
                <ShieldCheck size={20} className="text-green-500" />
                <span>Secure authentication via Google</span>
              </div>
            </>
          )}

          {loadingOtp && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Sending Verification Code</h2>
              <p className="text-slate-500">We are emailing a secure one-time passcode to your account.</p>
            </div>
          )}

          {showOtp && !loadingOtp && (
            <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 shadow-inner">
                  <Mail size={32} strokeWidth={2.5} />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">Check your email</h2>
                <p className="text-slate-500">
                  We've sent a 6-digit verification code to <br/>
                  <strong className="text-slate-800">{user?.email}</strong>
                </p>
              </div>

              <form onSubmit={verifyOtp} className="w-full">
                <div className="mb-6 relative">
                  <div className="flex justify-between gap-2 mb-6 relative">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`flex-1 h-14 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center bg-white border-2 text-2xl font-bold transition-colors ${
                          otp.length === i ? 'border-blue-500 ring-4 ring-blue-500/10' : 
                          otp.length > i ? 'border-slate-300 text-slate-900' : 'border-slate-200 text-transparent'
                        }`}
                      >
                        {otp[i] || ''}
                      </div>
                    ))}
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-text disabled:cursor-not-allowed"
                      autoFocus
                      required
                      disabled={timeLeft === 0 || verifying}
                    />
                  </div>

                  <div className="mb-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ease-linear ${timeLeft > 10 ? 'bg-blue-500' : 'bg-red-500'}`}
                      style={{ width: `${(timeLeft / 60) * 100}%` }}
                    ></div>
                  </div>
                  <p className={`text-center text-sm font-semibold ${timeLeft > 10 ? 'text-slate-400' : 'text-red-500'}`}>
                    {timeLeft > 0 ? `Code expires in 00:${timeLeft.toString().padStart(2, '0')}` : 'Code expired'}
                  </p>

                  {error && (
                    <p className="absolute -bottom-6 left-0 right-0 text-red-500 text-sm font-medium">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={otp.length !== 6 || verifying || timeLeft === 0}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl text-lg font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {verifying ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> Verifying...
                    </>
                  ) : (
                    <>
                      Verify & Continue <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-4">
                <button 
                  onClick={() => sendOtp(user?.email || '', user?.displayName || '')}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Didn't receive a code? Resend
                </button>
                <button 
                  onClick={handleCancel}
                  className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Cancel and sign out
                </button>
              </div>
            </div>
          )}

        </div>

        <div className="hidden md:flex flex-col relative z-10 w-full md:w-1/2 items-center justify-center bg-slate-50/50 rounded-3xl p-6 border border-slate-100/50 min-h-[400px]">
          <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-6 drop-shadow-xl">
            <ShieldCheck size={64} />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Secure & Private</h3>
          <p className="text-sm text-slate-500 text-center max-w-xs">Your personal documents are encrypted and safely stored in your digital locker.</p>
        </div>
      </div>
    </div>
  );
}
