import React, { useState } from 'react';
import { Loader2, Clapperboard, Sparkles } from 'lucide-react';

interface InputFormProps {
  onSubmit: (name: string, desc: string, tone: string) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState('Cinematic, Professional, High-End');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productName && description) {
      onSubmit(productName, description, tone);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <Clapperboard className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Project Brief</h2>
          <p className="text-sm text-zinc-400">Define the core concept for your TVC storyboard</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Product / Brand Name</label>
          <input
            type="text"
            required
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. AeroSynth Synthetic Oil"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Product Description & Key Selling Points</label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. High-performance di-ester base engine oil. Increases engine longevity, reduces friction. For luxury and racing cars."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Visual Tone & Style</label>
          <input
            type="text"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            placeholder="e.g. Minimalist, High Energy, Emotional, Luxury"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !productName || !description}
            className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg text-sm font-medium transition-all ${
              isLoading || !productName || !description
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Concept...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Script & Scenes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
