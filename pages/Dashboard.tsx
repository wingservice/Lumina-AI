
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, GeneratedImage } from '../types';
import { mockBackend } from '../services/apiService';
import { ICONS } from '../constants';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [recentImages, setRecentImages] = useState<GeneratedImage[]>([]);

  useEffect(() => {
    if (user) {
      const history = mockBackend.getHistory(user.id);
      setRecentImages(history.slice(0, 4));
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10 animate-in fade-in duration-700">
      {/* Hero / Welcome */}
      <section className="relative overflow-hidden bg-indigo-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-indigo-600/20">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">Create without limits, <br/>{user.name.split(' ')[0]}.</h1>
          <p className="text-indigo-100 text-lg opacity-90 mb-8">You have <span className="font-bold underline underline-offset-4">{user.credits} credits</span> remaining. What will you imagine today?</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/studio" className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-50 transition-all active:scale-95">
              Launch Studio
            </Link>
            <Link to="/credits" className="px-8 py-3 bg-indigo-700/50 backdrop-blur-md text-white border border-indigo-400/30 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all">
              Top Up Credits
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-indigo-400/20 rounded-full translate-y-1/2 blur-2xl"></div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center mb-4">
            <ICONS.CreditCard />
          </div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Credit Balance</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black">{user.credits}</span>
            <span className="text-zinc-500 text-sm font-medium">Credits</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center mb-4">
            <ICONS.Image />
          </div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Creations</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black">{mockBackend.getHistory(user.id).length}</span>
            <span className="text-zinc-500 text-sm font-medium">Images</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-lg flex items-center justify-center mb-4">
            <ICONS.Shield />
          </div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Account Tier</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black uppercase">{user.isAdmin ? 'Admin' : 'Explorer'}</span>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ICONS.History />
            Recent Works
          </h2>
          <Link to="/history" className="text-sm font-bold text-indigo-400 hover:text-indigo-300">View All Archive →</Link>
        </div>
        
        {recentImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentImages.map(img => (
              <div key={img.id} className="group relative aspect-square bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-500 transition-all">
                <img src={img.imageUrl} alt={img.prompt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                  <p className="text-[10px] text-white line-clamp-2 italic mb-2">"{img.prompt}"</p>
                  <Link to="/studio" className="w-full py-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded flex items-center justify-center hover:bg-white/30">
                    REUSE PROMPT
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-3xl text-center space-y-4">
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-600">
               <ICONS.Image />
            </div>
            <p className="text-zinc-500 text-sm">You haven't generated any images yet.</p>
            <Link to="/studio" className="inline-block px-6 py-2 bg-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-500 transition-colors">Start Generating</Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
