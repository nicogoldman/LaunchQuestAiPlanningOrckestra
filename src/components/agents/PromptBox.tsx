import { Terminal, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface PromptBoxProps {
  prompt: string;
  title?: string;
}

export default function PromptBox({ prompt, title = "Prompt del Agente" }: PromptBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="meli-card bg-meli-text text-gray-300 p-0 overflow-hidden border-none">
      <div className="bg-white/10 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-meli-blue" />
          <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
        </div>
        <button 
          onClick={handleCopy}
          className="hover:text-white transition-colors flex items-center gap-1 text-xs font-bold"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <div className="p-4 font-mono text-sm whitespace-pre-wrap leading-relaxed">
        {prompt}
      </div>
    </div>
  );
}
