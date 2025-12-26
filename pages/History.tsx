
import React, { useState, useEffect } from 'react';
import { GeneratedImage, User } from '../types';
import { mockBackend } from '../services/apiService';
import { ICONS } from '../constants';

interface HistoryProps {
  user: User;
}

const History: React.FC<HistoryProps> = ({ user }) => {
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (user) {
      const data = mockBackend.getHistory(user.id);
      setHistory(data);
    }
  }, [user]);

  const filteredHistory = history.filter(img => 
    img.prompt.toLowerCase().includes(filter.toLowerCase())
  );

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Image Archive</h1>
          <p className="text-zinc-500 text-sm">Your visual journey, preserved in the cloud.</p>
        </div>
        
        <div className="relative">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search your prompts..."
            className="pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm w-full md:w-64 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>
      </div>

      {filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredHistory.map((img) => (
            <div key={img.id} className="group bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all flex flex-col">
              <div className="aspect-square relative overflow-hidden bg-zinc-800">
                <img 
                  src={img.imageUrl} 
                  alt={img.prompt} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <button 
                    onClick={() => downloadImage(img.imageUrl, `lumina-${img.id}.png`)}
                    className="w-full py-2 bg-white text-black text-xs font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-200"
                  >
                    <ICONS.Download /> DOWNLOAD
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-3 italic">"{img.prompt}"</p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                  <span>{new Date(img.timestamp).toLocaleDateString()}</span>
                  <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">{img.aspectRatio}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-700">
            <ICONS.History />
          </div>
          <h3 className="text-lg font-semibold text-zinc-400">Nothing here yet</h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-xs mx-auto">
            Your generated images will appear here as soon as you start creating in the studio.
          </p>
          <button className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold transition-colors">
            Back to Studio
          </button>
        </div>
      )}
    </div>
  );
};

export default History;
