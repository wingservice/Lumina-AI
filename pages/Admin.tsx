
import React, { useState, useEffect } from 'react';
import { User, AdminStats, CreditPlan } from '../types';
import { mockBackend } from '../services/apiService';
import { ICONS } from '../constants';

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<CreditPlan[]>([]);
  const [editingPlans, setEditingPlans] = useState<CreditPlan[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'stats' | 'settings' | 'plans'>('stats');
  const [search, setSearch] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = mockBackend.getAllUsers();
    const allStats = mockBackend.getAdminStats();
    const allPlans = mockBackend.getPlans();
    setUsers(allUsers);
    setStats(allStats);
    setPlans(allPlans);
    setEditingPlans(JSON.parse(JSON.stringify(allPlans))); // Deep copy for editing
  };

  const handleUpdateCredits = (userId: string, currentCredits: number) => {
    const newAmount = prompt("Enter new credit balance:", currentCredits.toString());
    if (newAmount !== null) {
      const amount = parseInt(newAmount);
      if (!isNaN(amount)) {
        mockBackend.updateAnyUserCredits(userId, amount);
        loadData();
      }
    }
  };

  const handleEditPlanField = (planId: string, field: keyof CreditPlan, value: any) => {
    setEditingPlans(prev => prev.map(p => p.id === planId ? { ...p, [field]: value } : p));
  };

  const handleSavePlan = (planId: string) => {
    const planToSave = editingPlans.find(p => p.id === planId);
    if (planToSave) {
      mockBackend.updatePlan(planToSave);
      setSaveStatus(planId);
      setTimeout(() => setSaveStatus(null), 2000);
      loadData();
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg">
              <ICONS.Shield />
            </div>
            Admin Control Center
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Manage global system state, users, and resources.</p>
        </div>

        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex-shrink-0 ${activeTab === 'stats' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            DASHBOARD
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex-shrink-0 ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            USERS
          </button>
          <button 
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex-shrink-0 ${activeTab === 'plans' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            CREDIT PLANS
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex-shrink-0 ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            SETTINGS
          </button>
        </div>
      </div>

      {activeTab === 'stats' && stats && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Users" value={stats.totalUsers} color="indigo" />
            <StatCard label="Circulating Credits" value={stats.totalCredits} color="amber" />
            <StatCard label="Generated Assets" value={stats.totalImages} color="purple" />
            <StatCard label="Daily Active Users" value={stats.activeToday} color="green" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Activity Overview</h3>
              <div className="h-48 flex items-end justify-between gap-2">
                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                  <div key={i} className="flex-1 bg-indigo-600/20 rounded-t-lg relative group transition-all hover:bg-indigo-600/40" style={{ height: `${h}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {h}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">System Health</h3>
              <div className="space-y-4">
                <HealthItem label="API Connectivity" status="online" />
                <HealthItem label="Database Latency" status="optimal" />
                <HealthItem label="Image Storage" status="92% capacity" />
                <HealthItem label="Payment Gateway" status="online" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search users..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 pl-10 text-xs w-64 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
            </div>
            <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold transition-all">EXPORT CSV</button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-950/50 text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Credits</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-zinc-950 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-indigo-400">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-zinc-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.isAdmin ? (
                      <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ring-1 ring-amber-500/20">Admin</span>
                    ) : (
                      <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ring-1 ring-indigo-500/20">Explorer</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-zinc-300">{user.credits}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleUpdateCredits(user.id, user.credits)}
                      className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-indigo-600/10 text-indigo-400 rounded hover:bg-indigo-600 hover:text-white text-[10px] font-bold transition-all"
                    >
                      EDIT CREDITS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <ICONS.CreditCard /> Manage Monetization Plans
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {editingPlans.map(plan => (
                <div key={plan.id} className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl space-y-4 shadow-xl">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Plan Name</label>
                    <input 
                      type="text" 
                      value={plan.name} 
                      onChange={(e) => handleEditPlanField(plan.id, 'name', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Price ($)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={plan.price} 
                        onChange={(e) => handleEditPlanField(plan.id, 'price', parseFloat(e.target.value))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Credits</label>
                      <input 
                        type="number" 
                        value={plan.credits} 
                        onChange={(e) => handleEditPlanField(plan.id, 'credits', parseInt(e.target.value))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">External Link (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="https://..."
                      value={plan.externalLink || ''} 
                      onChange={(e) => handleEditPlanField(plan.id, 'externalLink', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input 
                      type="checkbox" 
                      id={`pop-${plan.id}`}
                      checked={plan.popular} 
                      onChange={(e) => handleEditPlanField(plan.id, 'popular', e.target.checked)}
                      className="accent-indigo-500 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor={`pop-${plan.id}`} className="text-xs text-zinc-400 cursor-pointer">Mark as Popular</label>
                  </div>
                  
                  <button 
                    onClick={() => handleSavePlan(plan.id)}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      saveStatus === plan.id 
                      ? 'bg-green-600 text-white' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
                    }`}
                  >
                    {saveStatus === plan.id ? (
                      <>
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                        SAVED
                      </>
                    ) : (
                      'SAVE CHANGES'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <ICONS.CreditCard /> Transaction Settings
            </h3>
            <div className="space-y-6">
              <SettingToggle label="Enable Stripe Integration" checked={true} />
              <SettingToggle label="Auto-refund failed generations" checked={true} />
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Cost per Generation</label>
                <div className="flex items-center gap-2">
                  <input type="number" defaultValue="1" className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm w-full outline-none focus:ring-1 focus:ring-indigo-500" />
                  <span className="text-sm font-bold">Credits</span>
                </div>
              </div>
              <button className="w-full py-3 bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all">
                SAVE TRANSACTION SETTINGS
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
             <h3 className="font-bold mb-6 flex items-center gap-2">
              <ICONS.Settings /> System Policies
            </h3>
            <div className="space-y-6">
               <SettingToggle label="Maintenance Mode" checked={false} />
               <SettingToggle label="Allow New Signups" checked={true} />
               <SettingToggle label="Public History View" checked={true} />
               <button className="w-full py-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all">
                  PURGE SYSTEM CACHE
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color }: { label: string, value: string | number, color: string }) => (
  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-3xl font-black text-${color}-400 tabular-nums`}>{value}</p>
  </div>
);

const HealthItem = ({ label, status }: { label: string, status: string }) => (
  <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg border border-zinc-800">
    <span className="text-xs font-medium text-zinc-400">{label}</span>
    <span className="text-[10px] font-bold uppercase text-green-500 flex items-center gap-1.5">
       <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
       {status}
    </span>
  </div>
);

const SettingToggle = ({ label, checked }: { label: string, checked: boolean }) => {
  const [val, setVal] = useState(checked);
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <div 
        onClick={() => setVal(!val)}
        className={`w-10 h-5 rounded-full p-1 transition-colors cursor-pointer ${val ? 'bg-indigo-600' : 'bg-zinc-700'}`}
      >
        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${val ? 'translate-x-5' : 'translate-x-0'}`}></div>
      </div>
    </div>
  );
};

export default Admin;
