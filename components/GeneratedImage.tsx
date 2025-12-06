import React, { useState } from 'react';
import { Button } from './Button';

interface GeneratedImageProps {
  imageData: string | null;
  isLoading: boolean;
  loadingMessage: string;
}

export const GeneratedImage: React.FC<GeneratedImageProps> = ({ imageData, isLoading, loadingMessage }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = () => {
    if (!imageData) return;
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `cosmic-hero-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="w-full aspect-square max-w-lg mx-auto rounded-2xl bg-space-800 border-2 border-space-700 flex flex-col items-center justify-center p-8 relative overflow-hidden shadow-[0_0_50px_rgba(4,217,255,0.1)]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        {/* Radar Scan Effect */}
        <div className="absolute inset-0 z-0">
             <div className="w-full h-1 bg-neon-green/30 absolute top-0 animate-[scan_2s_linear_infinite] shadow-[0_0_15px_#39FF14]"></div>
        </div>

        <div className="z-10 text-center space-y-4">
            <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-display text-neon-blue animate-pulse">Processing...</h3>
            <p className="text-slate-400 font-mono text-sm">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (!imageData) {
    return (
      <div className="w-full aspect-square max-w-lg mx-auto rounded-2xl bg-space-800 border-2 border-dashed border-space-600 flex flex-col items-center justify-center p-8 text-center group">
         <div className="w-20 h-20 bg-space-700 rounded-full flex items-center justify-center mb-4 group-hover:bg-space-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
         </div>
         <p className="text-slate-400 font-medium">Ready to initialize visualization</p>
         <p className="text-slate-500 text-sm mt-2">Enter prompt and engage engines</p>
      </div>
    );
  }

  return (
    <div 
      className="w-full max-w-lg mx-auto relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative rounded-2xl overflow-hidden border-2 border-space-700 shadow-[0_0_60px_rgba(57,255,20,0.15)] bg-black transition-transform duration-500 hover:scale-[1.02]">
        <img 
          src={imageData} 
          alt="Generated Space Hero" 
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Actions */}
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Button onClick={handleDownload} variant="primary" icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          }>
            Download
          </Button>
        </div>
      </div>
      
      {/* Decorative Frame Elements */}
      <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-neon-green rounded-tl-lg pointer-events-none"></div>
      <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-neon-green rounded-tr-lg pointer-events-none"></div>
      <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-neon-green rounded-bl-lg pointer-events-none"></div>
      <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-neon-green rounded-br-lg pointer-events-none"></div>
    </div>
  );
};