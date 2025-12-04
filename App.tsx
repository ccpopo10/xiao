import React, { useState, useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { StoryboardGrid } from './components/StoryboardGrid';
import { generateStoryboardScript, generateImageFrame } from './services/geminiService';
import { StoryboardFrame } from './types';
import { AlertCircle, Film, Wand2 } from 'lucide-react';

const App: React.FC = () => {
  const [frames, setFrames] = useState<StoryboardFrame[]>([]);
  const [step, setStep] = useState<'input' | 'preview'>('input');
  const [isScriptLoading, setIsScriptLoading] = useState(false);
  const [isImagesLoading, setIsImagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle Script Generation
  const handleGenerateScript = async (name: string, desc: string, tone: string) => {
    setIsScriptLoading(true);
    setError(null);
    try {
      const scriptData = await generateStoryboardScript(name, desc, tone);
      
      const newFrames: StoryboardFrame[] = scriptData.storyboard.map((item, index) => ({
        id: index + 1,
        shot_type: item.shot_type,
        description: item.action_description,
        visual_prompt: item.visual_generation_prompt,
        voiceover: item.voiceover_script,
        time: item.estimated_duration,
        status: 'idle' // Images not generated yet
      }));

      setFrames(newFrames);
      setStep('preview');
      
      // Auto-start image generation
      generateAllImages(newFrames);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate script");
    } finally {
      setIsScriptLoading(false);
    }
  };

  // Trigger generation for all frames sequentially or in parallel
  const generateAllImages = async (currentFrames: StoryboardFrame[]) => {
    setIsImagesLoading(true);

    const updateFrameStatus = (id: number, status: StoryboardFrame['status'], imageData?: string) => {
      setFrames(prev => prev.map(f => f.id === id ? { ...f, status, imageData } : f));
    };

    // Set all to loading first
    setFrames(prev => prev.map(f => ({ ...f, status: 'loading' })));

    const promises = currentFrames.map(async (frame) => {
      try {
        const base64 = await generateImageFrame(frame.visual_prompt);
        updateFrameStatus(frame.id, 'success', base64);
      } catch (err) {
        console.error(`Failed frame ${frame.id}`, err);
        updateFrameStatus(frame.id, 'error');
      }
    });

    await Promise.all(promises);
    setIsImagesLoading(false);
  };

  // Regenerate single image
  const handleRegenerateImage = useCallback(async (id: number, prompt: string) => {
    setFrames(prev => prev.map(f => f.id === id ? { ...f, status: 'loading' } : f));
    try {
      const base64 = await generateImageFrame(prompt);
      setFrames(prev => prev.map(f => f.id === id ? { ...f, status: 'success', imageData: base64 } : f));
    } catch (err) {
       setFrames(prev => prev.map(f => f.id === id ? { ...f, status: 'error' } : f));
    }
  }, []);

  const reset = () => {
    setFrames([]);
    setStep('input');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-zinc-100 flex flex-col">
      {/* Navbar */}
      <header className="border-b border-zinc-800 bg-[#0f0f11]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Film className="text-white w-4 h-4" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">AdVision <span className="text-zinc-500 font-normal">Storyboarder</span></h1>
          </div>
          {step === 'preview' && (
            <button 
              onClick={reset}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              New Project
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start p-6 md:p-12">
        
        {error && (
          <div className="w-full max-w-2xl mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {step === 'input' ? (
          <div className="w-full flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center mb-10 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 mb-4">
                TVC Script & Storyboard <br/> Professional Generator
              </h2>
              <p className="text-lg text-zinc-400">
                Create commercial-grade 6-panel visuals with full video scripts, voiceovers, and shot logic.
              </p>
            </div>
            <InputForm onSubmit={handleGenerateScript} isLoading={isScriptLoading} />
          </div>
        ) : (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold text-white">Storyboard Sequence</h2>
                <p className="text-zinc-400 text-sm mt-1">
                   {isImagesLoading ? 'Rendering frames...' : 'Generation complete. Review your concept below.'}
                </p>
              </div>
              <button
                onClick={() => generateAllImages(frames)}
                disabled={isImagesLoading}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wand2 className="w-4 h-4" />
                Regenerate All Images
              </button>
            </div>

            <StoryboardGrid 
              frames={frames} 
              onRegenerateImage={handleRegenerateImage} 
              isGeneratingImages={isImagesLoading}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-zinc-600 text-sm">
          <p>© {new Date().getFullYear()} AdVision AI. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;