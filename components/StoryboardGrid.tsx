import React from 'react';
import { StoryboardFrame } from '../types';
import { RefreshCw, Image as ImageIcon, Video, Mic, Clock, Clapperboard } from 'lucide-react';

interface StoryboardGridProps {
  frames: StoryboardFrame[];
  onRegenerateImage: (id: number, prompt: string) => void;
  isGeneratingImages: boolean;
}

export const StoryboardGrid: React.FC<StoryboardGridProps> = ({ frames, onRegenerateImage, isGeneratingImages }) => {
  
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {frames.map((frame) => (
          <div 
            key={frame.id} 
            className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col hover:border-zinc-700 transition-colors group shadow-lg"
          >
            {/* Header / Shot Type */}
            <div className="px-4 py-3 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                  {frame.id}
                </span>
                <span className="text-xs font-medium text-zinc-400">
                  {frame.shot_type}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-500 bg-zinc-900 px-2 py-1 rounded text-[10px] border border-zinc-800">
                <Clock className="w-3 h-3" />
                {frame.time}
              </div>
            </div>

            {/* Image Area */}
            <div className="relative aspect-video w-full bg-black group-hover:bg-zinc-950 transition-colors">
              {frame.status === 'success' && frame.imageData ? (
                <img 
                  src={frame.imageData} 
                  alt={frame.description}
                  className="w-full h-full object-cover"
                />
              ) : frame.status === 'loading' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                  <span className="text-xs text-zinc-400 animate-pulse">Rendering scene...</span>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700 gap-2">
                  <ImageIcon className="w-8 h-8 opacity-20" />
                  <span className="text-xs opacity-40">Waiting for generation</span>
                </div>
              )}

              {/* Regenerate Overlay Button */}
              {frame.status !== 'loading' && (
                <button
                  onClick={() => onRegenerateImage(frame.id, frame.visual_prompt)}
                  className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-indigo-600 text-white rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
                  title="Regenerate this frame"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Script Content */}
            <div className="p-5 flex-1 flex flex-col gap-4">
              {/* Action */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 flex items-center gap-1.5">
                  <Video className="w-3 h-3" /> Visual Action
                </h4>
                <p className="text-sm text-zinc-200 leading-relaxed font-light">
                  {frame.description}
                </p>
              </div>

              {/* Audio / VO */}
              <div className="space-y-1.5 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
                <h4 className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 flex items-center gap-1.5">
                  <Mic className="w-3 h-3" /> Audio / Voiceover
                </h4>
                <p className="text-sm text-indigo-200/90 leading-relaxed font-light italic">
                  "{frame.voiceover}"
                </p>
              </div>
              
              <div className="mt-auto pt-2 border-t border-zinc-800/50">
                <details className="text-xs text-zinc-500 cursor-pointer group/details">
                  <summary className="hover:text-zinc-300 transition-colors list-none flex items-center gap-1 select-none">
                     <Clapperboard className="w-3 h-3" />
                     <span className="font-medium">View Prompt</span>
                  </summary>
                  <p className="mt-2 p-2 bg-zinc-950 rounded border border-zinc-800 font-mono text-[10px] leading-relaxed opacity-70">
                    {frame.visual_prompt}
                  </p>
                </details>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper for loading icon
const Loader2 = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);