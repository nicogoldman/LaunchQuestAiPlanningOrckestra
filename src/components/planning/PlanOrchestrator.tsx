import { useState } from 'react';
import { MessageSquare, Send, Sparkles, X, Loader2, RefreshCw } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { GoogleGenAI } from '@google/genai';

export default function PlanOrchestrator() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentProject, setProject, settings, apiKeys } = useGameStore();

  const handleRevision = async () => {
    if (!message.trim() || !currentProject) return;
    
    setIsProcessing(true);
    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description: `REVISIÓN DEL PROYECTO ACTUAL: "${currentProject.name}". 
          CONTEXTO ACTUAL: ${currentProject.description}. 
          PEDIDO DE CAMBIO: ${message}`,
          model: settings.preferredModel,
          apiKeys
        }),
      });
      
      const data = await response.json();
      if (data.project) {
        setProject(data.project);
        setMessage('');
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error revising project:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!currentProject) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 md:w-96 rounded-xl shadow-2xl border border-meli-border overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-200">
          <div className="bg-meli-blue p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold text-sm">Orquestador General</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 bg-blue-50/50">
            <p className="text-xs text-meli-text leading-relaxed">
              ¿Quieres ajustar el roadmap? Pídeme revisiones, añade niveles o cambia el enfoque técnico.
            </p>
          </div>

          <div className="p-4 space-y-4">
            <textarea
              className="w-full h-32 p-3 text-sm border border-meli-border rounded-lg focus:ring-2 focus:ring-meli-blue outline-none resize-none"
              placeholder="Ej: Añade un nivel de marketing digital o cambia el stack a Next.js..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            
            <button
              onClick={handleRevision}
              disabled={!message.trim() || isProcessing}
              className="w-full meli-button-primary flex items-center justify-center gap-2 py-2.5"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Procesando Revisión...
                </>
              ) : (
                <>
                  Solicitar Cambios
                  <RefreshCw className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-meli-blue hover:bg-meli-blue-hover text-white p-4 rounded-full shadow-xl flex items-center gap-2 transition-all hover:scale-105 group"
        >
          <Sparkles className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold text-sm whitespace-nowrap">
            Orquestador General
          </span>
        </button>
      )}
    </div>
  );
}
