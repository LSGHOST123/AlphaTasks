
import React, { useState } from 'react';
import { User } from '../types';
import { CheckSquare, Mail, Lock, ArrowRight, Github, ChevronRight } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: '1',
      name: email.split('@')[0] || 'Alpha-User',
      email: email
    });
  };

  const handleSkip = () => {
    onLogin({
      id: '1',
      name: 'Alpha-01',
      email: 'demo@alphatasks.io'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] p-6 selection:bg-[#39ff14] selection:text-black">
      <div className="w-full max-w-[440px] space-y-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[28%] bg-[#39ff14] text-black shadow-[0_0_30px_rgba(57,255,20,0.4)] mb-2 transform hover:rotate-6 transition-transform duration-500">
            <CheckSquare size={40} strokeWidth={3} />
          </div>
          <div className="space-y-1">
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase">
              ALPHA<span className="text-[#39ff14] neon-text">TASKS</span>
            </h1>
            <p className="text-zinc-500 text-xs font-black tracking-[0.3em] uppercase opacity-70">Freelancer Command Center</p>
          </div>
        </div>

        <div className="bg-zinc-900 p-10 rounded-[40px] shadow-2xl border border-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#39ff14] opacity-[0.02] rounded-full -mr-16 -mt-16" />
          
          <div className="mb-10 text-left">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              {isLogin ? 'SYSTEM ACCESS' : 'INITIALIZE NODE'}
            </h2>
            <p className="text-sm text-zinc-500 font-medium mt-1">
              {isLogin ? 'Enter credentials for biometric bypass' : 'Create an administrative profile'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Secure Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#39ff14] transition-colors" size={18} />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nexus.com"
                  className="w-full pl-12 pr-4 py-4 bg-zinc-800 border border-zinc-700 rounded-2xl focus:ring-2 focus:ring-[#39ff14]/50 focus:bg-zinc-800 focus:border-[#39ff14] outline-none transition-all text-sm font-bold text-white placeholder-zinc-700 shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#39ff14] transition-colors" size={18} />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-zinc-800 border border-zinc-700 rounded-2xl focus:ring-2 focus:ring-[#39ff14]/50 focus:bg-zinc-800 focus:border-[#39ff14] outline-none transition-all text-sm font-bold text-white placeholder-zinc-700 shadow-inner"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-xs font-black text-zinc-500 hover:text-[#39ff14] uppercase tracking-widest transition-colors">RESET ACCESS?</button>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-5 bg-[#39ff14] text-black rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-[#c6ff00] hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-[#39ff14]/20 mt-4 flex items-center justify-center text-xs"
            >
              <span>{isLogin ? 'INITIATE LOGIN' : 'DEPLOY PROFILE'}</span>
              <ArrowRight className="ml-3" size={18} strokeWidth={3} />
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-zinc-800 space-y-6">
            <div className="relative flex items-center">
              <div className="flex-1 border-t border-zinc-800"></div>
              <span className="px-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">GUEST ACCESS</span>
              <div className="flex-1 border-t border-zinc-800"></div>
            </div>

            <button 
              onClick={handleSkip}
              className="w-full py-4 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:text-[#39ff14] hover:border-[#39ff14] transition-all flex items-center justify-center space-x-3 group"
            >
              <Activity className="w-4 h-4 group-hover:animate-pulse" />
              <span>OVERRIDE AUTH (DEMO)</span>
            </button>
          </div>
        </div>

        <div className="space-y-6 text-center">
          <p className="text-xs font-bold text-zinc-600 tracking-wider">
            {isLogin ? "NEW OPERATIVE?" : "EXISTING NODE?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-3 font-black text-[#39ff14] hover:underline uppercase tracking-tighter"
            >
              {isLogin ? 'REGISTER PROTOCOL' : 'ACCESS TERMINAL'}
            </button>
          </p>
          
          <div className="flex justify-center space-x-6 text-zinc-700">
            <Github className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            <Activity className="w-5 h-5 hover:text-[#39ff14] cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}

const Activity = ({ size, className }: { size?: number, className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);
