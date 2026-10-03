import React from 'react';
import Link from 'next/link';
import { 
  Menu, ShieldCheck, FileText, User, FolderSearch, Lock, 
  ChevronRight, FileBadge, GraduationCap, Briefcase, 
  Smartphone, Laptop, Cloud, Mail, File, ArrowRight
} from 'lucide-react';
import Logo from '@/components/Logo';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#FDFDFD]/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Logo className="w-10 h-10 -ml-1 drop-shadow-sm" />
              <span className="font-bold text-xl tracking-tight text-slate-900">SMART LOCKER</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">How it Works</Link>
              <Link href="#security" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Security</Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Sign In</Link>
              <Link href="/login" className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md active:scale-95">
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button className="text-slate-600 hover:text-slate-900 p-2">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              
              {/* Left Text */}
              <div className="flex-1 text-center lg:text-left z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-8 border border-blue-100">
                  <Lock size={14} />
                  Your Personal Digital Locker
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
                  Everything important.<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    One private place.
                  </span>
                </h1>
                
                <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Keep your documents, certificates, academic records, and personal information organized in one secure locker — ready whenever you need them.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-8">
                  <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-[0_8px_30px_rgb(37,99,235,0.2)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.3)] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2">
                    Create My Locker <ChevronRight size={18} />
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-700 font-medium border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center">
                    Sign In
                  </Link>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-slate-500">
                  <ShieldCheck size={16} className="text-green-500" />
                  <span>Private by design &bull; Your files belong to you</span>
                </div>
              </div>

              {/* Right Visual */}
              <div className="flex-1 relative w-full max-w-2xl lg:max-w-none">
                {/* Decorative background blur */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
                
                {/* Main Dashboard Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-6 z-10 overflow-hidden ring-1 ring-slate-900/5 transition-transform duration-700 hover:scale-[1.02]">
                  
                  <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User size={16} />
                      </div>
                      My Locker
                    </h3>
                    <div className="text-sm text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">12 Documents</div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {['Identity', 'Education', 'Career', 'Projects'].map((cat, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-colors cursor-default border border-slate-100 hover:border-blue-100">
                        {i === 0 && <FileBadge className="text-blue-500" size={24} />}
                        {i === 1 && <GraduationCap className="text-indigo-500" size={24} />}
                        {i === 2 && <Briefcase className="text-teal-500" size={24} />}
                        {i === 3 && <FolderSearch className="text-purple-500" size={24} />}
                        <span className="text-xs font-medium text-slate-600">{cat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recent Files</div>
                    {[
                      { name: 'College_ID.pdf', icon: <FileBadge size={16}/>, size: '2.4 MB', date: 'Today' },
                      { name: 'Semester_Results.pdf', icon: <GraduationCap size={16}/>, size: '1.1 MB', date: 'Yesterday' },
                      { name: 'Resume.pdf', icon: <FileText size={16}/>, size: '845 KB', date: 'Last week' },
                      { name: 'Project_Report.pdf', icon: <FolderSearch size={16}/>, size: '5.2 MB', date: 'Last week' },
                    ].map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            {file.icon}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-700">{file.name}</div>
                            <div className="text-xs text-slate-400">{file.size} &bull; {file.date}</div>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-[bounce_5s_ease-in-out_infinite] z-20">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-50 text-red-500 p-2 rounded-lg"><FileText size={20} /></div>
                    <div>
                      <div className="text-sm font-bold text-slate-700">Resume.pdf</div>
                      <div className="text-xs text-slate-400">Updated</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-8 -left-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-[bounce_6s_ease-in-out_infinite_reverse] z-20">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-50 text-emerald-500 p-2 rounded-lg"><GraduationCap size={20} /></div>
                    <div>
                      <div className="text-sm font-bold text-slate-700">Marksheet.pdf</div>
                      <div className="text-xs text-slate-400">Education</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM TO SOLUTION SECTION */}
        <section className="py-24 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Stop searching everywhere.</h2>
            </div>
            
            <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-4 relative max-w-5xl mx-auto">
              
              {/* Before */}
              <div className="flex-1 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative transition-all duration-300 hover:shadow-md">
                <div className="text-center mb-8">
                  <h3 className="text-lg font-semibold text-slate-500 uppercase tracking-widest mb-2">Before SMART LOCKER</h3>
                  <p className="text-slate-600 font-medium">Important files are everywhere.</p>
                </div>
                <div className="relative h-64 w-full">
                  <div className="absolute top-4 left-4 bg-slate-100 p-3 rounded-xl border border-slate-200 flex items-center gap-2 shadow-sm text-sm text-slate-600 hover:-translate-y-1 transition-transform"><Smartphone size={16}/> Phone</div>
                  <div className="absolute top-12 right-8 bg-slate-100 p-3 rounded-xl border border-slate-200 flex items-center gap-2 shadow-sm text-sm text-slate-600 hover:-translate-y-1 transition-transform"><FolderSearch size={16}/> Downloads</div>
                  <div className="absolute bottom-24 left-12 bg-slate-100 p-3 rounded-xl border border-slate-200 flex items-center gap-2 shadow-sm text-sm text-slate-600 hover:-translate-y-1 transition-transform"><Mail size={16}/> Email</div>
                  <div className="absolute top-32 left-1/2 -translate-x-1/2 bg-green-50 p-3 rounded-xl border border-green-100 flex items-center gap-2 shadow-sm text-sm text-green-700 hover:-translate-y-1 transition-transform"><File size={16}/> WhatsApp</div>
                  <div className="absolute bottom-8 right-12 bg-slate-100 p-3 rounded-xl border border-slate-200 flex items-center gap-2 shadow-sm text-sm text-slate-600 hover:-translate-y-1 transition-transform"><Laptop size={16}/> Laptop</div>
                  <div className="absolute bottom-4 left-1/3 bg-slate-100 p-3 rounded-xl border border-slate-200 flex items-center gap-2 shadow-sm text-sm text-slate-600 hover:-translate-y-1 transition-transform"><Cloud size={16}/> Cloud</div>
                </div>
              </div>

              {/* Arrow Indicator */}
              <div className="hidden md:flex flex-col justify-center items-center px-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                  <ArrowRight size={24} />
                </div>
              </div>

              {/* After */}
              <div className="flex-1 bg-blue-600 p-8 rounded-3xl border border-blue-500 shadow-lg relative text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="text-center mb-8">
                  <h3 className="text-lg font-semibold text-blue-200 uppercase tracking-widest mb-2">With SMART LOCKER</h3>
                  <p className="text-white font-medium">Everything important, together.</p>
                </div>
                <div className="h-64 w-full bg-blue-700/50 rounded-2xl border border-blue-400/50 p-6 flex flex-col justify-center gap-3 backdrop-blur-sm">
                  <div className="bg-white/10 p-3 rounded-xl border border-white/20 flex items-center gap-3 backdrop-blur-md">
                    <FileBadge className="text-blue-200" size={20}/>
                    <span className="font-medium text-sm">Documents</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl border border-white/20 flex items-center gap-3 backdrop-blur-md">
                    <GraduationCap className="text-blue-200" size={20}/>
                    <span className="font-medium text-sm">Certificates</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl border border-white/20 flex items-center gap-3 backdrop-blur-md">
                    <Briefcase className="text-blue-200" size={20}/>
                    <span className="font-medium text-sm">Academic Records</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl border border-white/20 flex items-center gap-3 backdrop-blur-md">
                    <User className="text-blue-200" size={20}/>
                    <span className="font-medium text-sm">Personal Info</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FEATURE PREVIEW */}
        <section id="features" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Your important things, organized.</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">A modern approach to managing your student life files.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <FileText size={24}/>, title: 'Documents', desc: 'Store your important files in one organized place.', color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: <User size={24}/>, title: 'Personal Info', desc: 'Keep essential personal and academic information ready.', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { icon: <FolderSearch size={24}/>, title: 'Smart Organization', desc: 'Categorize and find documents without digging through folders.', color: 'text-purple-600', bg: 'bg-purple-50' },
                { icon: <Lock size={24}/>, title: 'Private Locker', desc: 'Your personal information stays inside your private locker.', color: 'text-teal-600', bg: 'bg-teal-50' },
              ].map((f, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all group hover:-translate-y-1 cursor-default">
                  <div className={`w-14 h-14 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{f.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECURITY SECTION */}
        <section id="security" className="py-24 bg-slate-900 text-white overflow-hidden relative rounded-[2.5rem] mx-4 sm:mx-6 lg:mx-8 mb-24">
          {/* subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6 border border-blue-500/30">
                  <ShieldCheck size={24} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Private means private.</h2>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                  Your locker is designed as a personal space. Your documents and information should only be accessible to you.
                </p>
                <ul className="space-y-4">
                  {[
                    'Private personal locker',
                    'Secure authentication',
                    'Controlled access',
                    'Easy document management'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300 bg-slate-800/30 w-fit px-4 py-2 rounded-full border border-slate-700/50">
                      <ShieldCheck size={16} className="text-blue-400 shrink-0" />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 backdrop-blur-xl shadow-2xl transition-transform hover:scale-[1.02] duration-500">
                <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-6">
                  <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                    <Lock size={20} className="text-slate-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Secure Vault</h3>
                    <p className="text-sm text-slate-400">Access Restricted</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-slate-700 rounded-full w-3/4"></div>
                  <div className="h-4 bg-slate-700 rounded-full w-1/2"></div>
                  <div className="h-4 bg-slate-700 rounded-full w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-24 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How it Works</h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 relative max-w-4xl mx-auto">
              {/* Desktop connecting line */}
              <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-200 z-0"></div>
              
              {[
                { step: '01', title: 'Create your locker' },
                { step: '02', title: 'Add what matters' },
                { step: '03', title: 'Find it when you need it' }
              ].map((s, i) => (
                <div key={i} className="flex-1 relative z-10 text-center group cursor-default">
                  <div className="w-24 h-24 mx-auto bg-white rounded-3xl border-2 border-slate-100 group-hover:border-blue-100 group-hover:shadow-md transition-all flex items-center justify-center text-3xl font-bold text-blue-600 mb-6 shadow-sm">
                    {s.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{s.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-blue-600 rounded-[2.5rem] p-10 md:p-20 text-center text-white shadow-2xl relative overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Ready to organize your important documents?</h2>
                <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                  Create your personal locker and keep everything important within reach.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/dashboard" className="px-8 py-4 rounded-2xl bg-white text-blue-600 font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2">
                    Create My Locker <ChevronRight size={20} />
                  </Link>
                  <Link href="/dashboard" className="px-8 py-4 rounded-2xl bg-blue-700/50 text-white font-semibold text-lg hover:bg-blue-700 transition-colors border border-blue-500 flex items-center justify-center">
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white">
                  <Lock size={12} />
                </div>
                <span className="font-bold text-lg text-slate-900">SMART LOCKER</span>
              </div>
              <p className="text-slate-500 font-medium max-w-xs">Everything important. One private place.</p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4 uppercase text-sm tracking-wider">Product</h4>
              <ul className="space-y-3">
                <li><Link href="#features" className="text-slate-500 hover:text-blue-600 transition-colors">Features</Link></li>
                <li><Link href="#security" className="text-slate-500 hover:text-blue-600 transition-colors">Security</Link></li>
                <li><Link href="#how-it-works" className="text-slate-500 hover:text-blue-600 transition-colors">How it Works</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4 uppercase text-sm tracking-wider">Account</h4>
              <ul className="space-y-3">
                <li><Link href="/dashboard" className="text-slate-500 hover:text-blue-600 transition-colors">Sign In</Link></li>
                <li><Link href="/dashboard" className="text-slate-500 hover:text-blue-600 transition-colors">Create Account</Link></li>
                <li><Link href="/privacy" className="text-slate-500 hover:text-blue-600 transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="text-slate-500 hover:text-blue-600 transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">© 2026 SMART LOCKER. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
