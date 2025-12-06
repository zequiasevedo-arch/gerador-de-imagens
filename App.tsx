

import React, { useState, useEffect } from 'react';
import { GeneratedImage } from './components/GeneratedImage';
import { PromptEditor } from './components/PromptEditor';
import { ImageUploader } from './components/ImageUploader';
import { Button } from './components/Button';
import { generateCharacterImage } from './services/geminiService';
import { DEFAULT_PROMPT, IMAGE_TO_IMAGE_PROMPT, MERGE_IMAGES_PROMPT, LOADING_MESSAGES } from './constants';
import { GenerationState } from './types';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [image3, setImage3] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    imageData: null
  });

  // Cycle loading messages
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (state.isLoading) {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[i]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [state.isLoading]);

  // Smart prompt switching logic based on number of images
  useEffect(() => {
    const imgCount = (image1 ? 1 : 0) + (image2 ? 1 : 0) + (image3 ? 1 : 0);

    if (imgCount >= 2) {
      if (prompt === DEFAULT_PROMPT || prompt === IMAGE_TO_IMAGE_PROMPT) {
        setPrompt(MERGE_IMAGES_PROMPT);
      }
    } else if (imgCount === 1) {
      if (prompt === DEFAULT_PROMPT || prompt === MERGE_IMAGES_PROMPT) {
        setPrompt(IMAGE_TO_IMAGE_PROMPT);
      }
    } else {
      if (prompt === IMAGE_TO_IMAGE_PROMPT || prompt === MERGE_IMAGES_PROMPT) {
        setPrompt(DEFAULT_PROMPT);
      }
    }
  }, [image1, image2, image3]); // Removed 'prompt' from dependency to avoid loop when user edits manually

  const handleGenerate = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Create array of valid images
      const referenceImages = [image1, image2, image3].filter((img): img is string => !!img);
      
      const base64Image = await generateCharacterImage(prompt, referenceImages);
      setState({
        isLoading: false,
        error: null,
        imageData: base64Image
      });
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "An unexpected error occurred during generation."
      }));
    }
  };

  const handleReset = () => {
      setPrompt(DEFAULT_PROMPT);
      setImage1(null);
      setImage2(null);
      setImage3(null);
      setState({
          isLoading: false,
          error: null,
          imageData: null
      });
  };

  const hasImages = !!(image1 || image2 || image3);
  const imageCount = (image1 ? 1 : 0) + (image2 ? 1 : 0) + (image3 ? 1 : 0);

  return (
    <div className="min-h-screen bg-space-900 text-slate-100 selection:bg-neon-green selection:text-space-900 overflow-x-hidden stars">
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-space-900/80 backdrop-blur-md border-b border-space-700">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-gradient-to-tr from-neon-green to-neon-blue flex items-center justify-center shadow-lg shadow-neon-green/20">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h1 className="text-xl font-display font-bold tracking-wider">
                    <span className="text-white">COSMIC</span>
                    <span className="text-neon-green">HERO</span>
                </h1>
            </div>
            <div className="text-xs font-mono text-slate-500 hidden sm:block">
                POWERED BY GEMINI 2.5
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Column: Controls */}
            <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
                <div className="space-y-4">
                    <h2 className="text-4xl font-display font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
                        Create Your Own <br/>
                        <span className="text-neon-blue">Space Ranger</span>
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Generate high-fidelity, Pixar-style 3D characters. 
                        Describe your hero, upload a photo to transform, or <span className="text-neon-green">merge up to 3 images</span> for a unique fusion!
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 h-40">
                      <ImageUploader 
                          label="Subject A"
                          selectedImage={image1}
                          onImageSelect={setImage1}
                          disabled={state.isLoading}
                      />
                      <ImageUploader 
                          label="Subject B"
                          selectedImage={image2}
                          onImageSelect={setImage2}
                          disabled={state.isLoading}
                      />
                      <ImageUploader 
                          label="Subject C"
                          selectedImage={image3}
                          onImageSelect={setImage3}
                          disabled={state.isLoading}
                      />
                    </div>

                    <PromptEditor 
                        value={prompt} 
                        onChange={setPrompt} 
                        disabled={state.isLoading}
                    />
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <Button 
                            onClick={handleGenerate} 
                            isLoading={state.isLoading}
                            className="flex-1"
                        >
                            {hasImages ? (imageCount > 1 ? 'Fusion Merge' : 'Transform Image') : 'Generate Hero'}
                        </Button>
                        <Button 
                            variant="secondary"
                            onClick={handleReset}
                            disabled={state.isLoading}
                        >
                            Reset System
                        </Button>
                    </div>
                </div>

                {state.error && (
                    <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-start gap-3">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="font-bold">System Error</p>
                            <p>{state.error}</p>
                        </div>
                    </div>
                )}
                
                {/* Feature Tags */}
                <div className="grid grid-cols-2 gap-4 pt-8 border-t border-space-700">
                    {[
                        { title: "Pixar Style", desc: "Cinematic lighting & texture" },
                        { title: "Image Fusion", desc: "Merge inputs seamlessly" },
                        { title: "Gemini 2.5", desc: "Next-gen image synthesis" },
                        { title: "Hyper-Real", desc: "4K detailed rendering" },
                    ].map((feature, i) => (
                        <div key={i} className="flex gap-3 items-center opacity-70 hover:opacity-100 transition-opacity">
                            <div className="w-1 h-8 bg-neon-purple rounded-full"></div>
                            <div>
                                <div className="font-display font-bold text-sm text-white">{feature.title}</div>
                                <div className="text-xs text-slate-500">{feature.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column: Visualization */}
            <div className="lg:sticky lg:top-28 animate-[fadeIn_0.8s_ease-out]">
                <GeneratedImage 
                    imageData={state.imageData} 
                    isLoading={state.isLoading} 
                    loadingMessage={loadingMessage}
                />
            </div>
        </div>
      </main>

    </div>
  );
};

export default App;