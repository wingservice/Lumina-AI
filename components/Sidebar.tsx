
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ICONS } from '../constants';
import { User } from '../types';

interface SidebarProps {
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const menuItems = [
    { icon: <ICONS.Dashboard />, label: 'Dashboard', path: '/dashboard' },
    { icon: <ICONS.Sparkles />, label: 'Studio', path: '/studio' },
    { icon: <ICONS.History />, label: 'History', path: '/history' },
    { icon: <ICONS.CreditCard />, label: 'Credits', path: '/credits' },
    { icon: <ICONS.Settings />, label: 'Settings', path: '/settings' },
  ];

  if (user?.isAdmin) {
    menuItems.push({ icon: <ICONS.Shield />, label: 'Admin', path: '/admin' });
  }

  return (
    <aside className="w-64 border-r border-zinc-800 h-screen hidden md:flex flex-col sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-40">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold italic shadow-lg shadow-indigo-600/20">L</div>
          <span className="text-xl font-bold tracking-tight">Lumina AI</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/10' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`
              }
            >
              <div className="opacity-70">{item.icon}</div>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-zinc-800">
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 backdrop-blur-sm">
          <p className="text-xs text-zinc-500 mb-1">Current Plan</p>
          <p className="text-sm font-semibold mb-3">{user?.isAdmin ? 'Enterprise Admin' : 'Free Explorer'}</p>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mb-3">
            <div className={`h-full rounded-full transition-all duration-500 ${user?.isAdmin ? 'bg-amber-500 w-full' : 'bg-indigo-500 w-1/4'}`}></div>
          </div>
          {!user?.isAdmin && (
            <button className="w-full py-1.5 bg-zinc-100 text-zinc-950 text-xs font-bold rounded-lg hover:bg-white transition-colors active:scale-95">
              UPGRADE PRO
            </button>
          )}
          {user?.isAdmin && (
            <div className="text-[10px] text-zinc-500 text-center uppercase font-bold tracking-widest">System Privileged</div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
