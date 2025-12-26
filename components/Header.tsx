
import React from 'react';
import { User } from '../types';
import { ICONS } from '../constants';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="md:hidden flex items-center gap-2">
        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm italic">L</div>
        <span className="font-bold">Lumina AI</span>
      </div>
      
      <div className="hidden md:block">
        <h2 className="text-sm text-zinc-400">Welcome back, <span className="text-zinc-100 font-medium">{user?.name}</span></h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-full border border-zinc-800">
          <span className="text-amber-500 text-xs font-bold">●</span>
          <span className="text-xs font-semibold">{user?.credits || 0} Credits</span>
        </div>
        
        <div className="group relative">
          <button className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 overflow-hidden hover:border-zinc-500 transition-all">
            <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} alt="Avatar" className="w-full h-full object-cover" />
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
            <div className="px-4 py-2 border-b border-zinc-800 mb-2">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <ICONS.Logout />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
