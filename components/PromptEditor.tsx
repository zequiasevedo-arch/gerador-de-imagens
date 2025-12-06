import React from 'react';

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg blur opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-space-800 rounded-lg p-1">
            <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-space-700">
                <span className="text-xs font-mono text-neon-blue uppercase tracking-widest">Command Input</span>
                <span className="text-[10px] font-mono text-slate-500">SYSTEM.TXT.001</span>
            </div>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full h-32 bg-space-900/50 text-slate-200 p-3 rounded border border-transparent focus:border-neon-blue focus:ring-0 focus:outline-none resize-none font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-space-600 scrollbar-track-transparent"
                placeholder="Enter character description..."
            />
             <div className="flex justify-between items-center px-2 py-1 mt-1">
                 <div className="flex gap-1">
                     <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                     <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                     <div className="w-2 h-2 rounded-full bg-green-500"></div>
                 </div>
                 <span className="text-[10px] text-slate-600 uppercase">{value.length} CHARS</span>
             </div>
        </div>
    </div>
  );
};