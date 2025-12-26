
import React, { useState, useEffect } from 'react';
import { CreditPlan, User } from '../types';
import { mockBackend } from '../services/apiService';

interface CreditsProps {
  onUpdateUser: (user: User) => void;
}

const Credits: React.FC<CreditsProps> = ({ onUpdateUser }) => {
  const [plans, setPlans] = useState<CreditPlan[]>([]);

  useEffect(() => {
    setPlans(mockBackend.getPlans());
  }, []);

  const handlePurchase = (plan: CreditPlan) => {
    if (plan.externalLink) {
      window.open(plan.externalLink, '_blank');
      return;
    }

    // In production, this would redirect to Stripe Checkout.
    // Here we simulate a successful transaction.
    const updatedUser = mockBackend.updateCredits(plan.credits);
    onUpdateUser(updatedUser);
    alert(`Successfully added ${plan.credits} credits to your account!`);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Power Your Creativity</h1>
        <p className="text-zinc-500 max-w-2xl mx-auto">
          Choose a plan that fits your production needs. Our high-performance GPU clusters 
          are ready to render your imagination in stunning detail.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`relative p-8 rounded-3xl border ${
              plan.popular 
                ? 'bg-zinc-900 border-indigo-500 shadow-2xl shadow-indigo-500/10' 
                : 'bg-zinc-950 border-zinc-800'
            } flex flex-col h-full`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
                Most Popular
              </span>
            )}
            
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black">${plan.price}</span>
                <span className="text-zinc-500 text-sm">one-time</span>
              </div>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg width="12" height="12" fill="none" stroke="#22c55e" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span className="text-zinc-300 text-sm font-medium">{plan.credits} Studio Credits</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg width="12" height="12" fill="none" stroke="#22c55e" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span className="text-zinc-300 text-sm font-medium">No Expiration Date</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg width="12" height="12" fill="none" stroke="#22c55e" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span className="text-zinc-300 text-sm font-medium">Commercial License</span>
              </div>
            </div>

            <button 
              onClick={() => handlePurchase(plan)}
              className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${
                plan.popular 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-[1.02]' 
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {plan.externalLink ? 'Go to Payment' : 'Get Credits'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800 text-center">
        <h3 className="text-xl font-bold mb-2">Need a Custom Enterprise Solution?</h3>
        <p className="text-zinc-500 text-sm mb-6 max-w-lg mx-auto">
          Contact our sales team for high-volume API access, custom fine-tuning, 
          and dedicated GPU instances.
        </p>
        <button className="px-8 py-3 border border-zinc-700 rounded-xl text-sm font-bold hover:bg-zinc-900 transition-colors">
          Talk to Sales
        </button>
      </div>
    </div>
  );
};

export default Credits;
