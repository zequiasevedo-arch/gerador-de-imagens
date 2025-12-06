
import React, { useRef } from 'react';
import { Button } from './Button';

interface ImageUploaderProps {
  label?: string;
  selectedImage: string | null;
  onImageSelect: (base64: string | null) => void;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label = "Visual Input", selectedImage, onImageSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageSelect(null);
  };

  return (
    <div className="relative group h-full">
       {/* Sci-fi border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green to-neon-blue rounded-lg blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
      
      <div className="relative bg-space-800 rounded-lg p-1 border border-space-700 h-full flex flex-col">
        <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-space-700">
            <span className="text-xs font-mono text-neon-green uppercase tracking-widest truncate max-w-[120px]">{label}</span>
            <span className="text-[10px] font-mono text-slate-500">IMG.DAT</span>
        </div>

        {!selectedImage ? (
          <div 
            className={`flex-1 min-h-[120px] border-2 border-dashed border-space-600 rounded flex flex-col items-center justify-center cursor-pointer transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-neon-green hover:bg-space-900/50'}`}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <div className="w-8 h-8 rounded-full bg-space-700 flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
            </div>
            <span className="text-[10px] font-mono text-slate-400 text-center px-2">UPLOAD SOURCE</span>
          </div>
        ) : (
          <div className="relative flex-1 min-h-[120px] bg-black rounded overflow-hidden flex items-center justify-center group/preview">
            <img src={selectedImage} alt="Reference" className="h-full w-full object-contain opacity-80" />
            <div className="absolute inset-0 bg-space-900/60 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                <Button variant="ghost" onClick={handleClear} disabled={disabled} className="!p-2 !text-xs">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    EJECT
                </Button>
            </div>
            {/* Scanning line animation */}
            <div className="absolute inset-0 border-b-2 border-neon-green/30 animate-[scan_2s_linear_infinite] pointer-events-none"></div>
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden"
        />
      </div>
    </div>
  );
};