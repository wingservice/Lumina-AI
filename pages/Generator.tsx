
import React, { useState, useRef } from 'react';
import { AspectRatio, GeneratedImage, User } from '../types';
import { ASPECT_RATIOS, ICONS } from '../constants';
import { generateImage } from '../services/geminiService';
import { mockBackend } from '../services/apiService';

interface GeneratorProps {
  user: User | null;
  onUpdateUser: (user: User) => void;
}

const Generator: React.FC<GeneratorProps> = ({ user, onUpdateUser }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a creative prompt first.");
      return;
    }

    if (!user || user.credits <= 0) {
      setError("Insufficient credits. Please top up.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const imageUrl = await generateImage(prompt, aspectRatio, uploadedImage || undefined);
      
      const success = mockBackend.deductCredit();
      if (success) {
        const savedImg = mockBackend.saveImage(prompt, imageUrl, aspectRatio);
        setResultImage(savedImg);
        const updatedUser = mockBackend.getCurrentUser();
        if (updatedUser) onUpdateUser(updatedUser);
      } else {
        throw new Error("Failed to deduct credits.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ICONS.Sparkles /> Studio Tools
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A futuristic cybernetic city with floating neon gardens and rain-slicked streets..."
                  className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none transition-all placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Aspect Ratio</label>
                <div className="grid grid-cols-4 gap-2">
                  {ASPECT_RATIOS.map((ar) => (
                    <button
                      key={ar.value}
                      onClick={() => setAspectRatio(ar.value as AspectRatio)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-medium transition-all ${
                        aspectRatio === ar.value 
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-100' 
                        : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-lg mb-1">{ar.icon}</span>
                      {ar.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Reference Image (Optional)</label>
                <div className="flex gap-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 border-2 border-dashed border-zinc-800 rounded-xl h-24 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-700 hover:bg-zinc-950/50 transition-all group"
                  >
                    {uploadedImage ? (
                      <div className="relative w-full h-full p-2">
                        <img src={uploadedImage} alt="Reference" className="w-full h-full object-cover rounded-lg" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); setUploadedImage(null); }}
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-lg hover:bg-red-400"
                        >
                          <svg width="12" height="12" fill="white" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                        </button>
                      </div>
                    ) : (
                      <>
                        <ICONS.Plus />
                        <span className="text-[10px] mt-1 uppercase tracking-wider text-zinc-500 font-bold group-hover:text-zinc-300">Upload Base</span>
                      </>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-lg animate-pulse">
                  {error}
                </div>
              )}

              <button
                disabled={isGenerating}
                onClick={handleGenerate}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Artwork
                    <span className="text-white/50 group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>
              
              <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest font-bold">1 Generation = 1 Credit</p>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden min-h-[500px] flex flex-col">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <ICONS.Image /> Canvas Output
              </h3>
              {resultImage && (
                <button 
                  onClick={() => downloadImage(resultImage.imageUrl, `lumina-${resultImage.id}.png`)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors"
                >
                  <ICONS.Download /> Download
                </button>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950">
              {isGenerating ? (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto relative">
                    <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-indigo-100">Mixing Pixels...</p>
                    <p className="text-xs text-zinc-500 italic">Gemini is dreaming up your request</p>
                  </div>
                </div>
              ) : resultImage ? (
                <div className="relative group w-full h-full flex items-center justify-center">
                   <img 
                    src={resultImage.imageUrl} 
                    alt="Generated output" 
                    className="max-w-full max-h-full rounded-lg shadow-2xl object-contain animate-in fade-in zoom-in duration-700"
                  />
                  <div className="absolute bottom-4 left-4 right-4 p-4 bg-zinc-950/80 backdrop-blur-md rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                    <p className="text-xs text-white line-clamp-2 leading-relaxed">{resultImage.prompt}</p>
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-zinc-400 font-medium">
                       <span className="bg-zinc-800 px-2 py-0.5 rounded uppercase tracking-tighter">{resultImage.aspectRatio}</span>
                       <span>{new Date(resultImage.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center max-w-sm">
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-600">
                     <ICONS.Sparkles />
                  </div>
                  <h4 className="text-zinc-400 font-semibold mb-2">Ready for Inspiration</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Enter a prompt and click generate to see the magic happen. Your masterpiece will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Generator;
