
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email') || 'your email address';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-zinc-950 to-zinc-950 text-center">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-10">
          <div className="w-20 h-20 bg-indigo-600/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-indigo-500/20 shadow-2xl shadow-indigo-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-4">Check your inbox</h1>
          <p className="text-zinc-400 leading-relaxed text-sm">
            We have sent you a verification email to <span className="text-indigo-400 font-bold">{email}</span>. 
            Verify it and log in to start creating.
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            to="/login"
            className="block w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-[0.98] focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            Login
          </Link>
          
          <div className="pt-4">
            <p className="text-xs text-zinc-500">
              Didn't receive the email? <button className="text-indigo-400 font-bold hover:text-indigo-300 ml-1">Resend link</button>
            </p>
          </div>
        </div>

        <p className="mt-12 text-[10px] text-zinc-600 uppercase tracking-widest font-black">
          Lumina AI © 2024
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
