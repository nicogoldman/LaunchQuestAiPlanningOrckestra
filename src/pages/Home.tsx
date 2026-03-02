import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Sparkles, Target, Zap, ChevronRight } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';

export default function Home() {
  const [description, setDescription] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);
  const { setProject, settings, apiKeys, projects } = useGameStore();
  const navigate = useNavigate();

  const handleStartQuest = async () => {
    if (!description.trim()) return;
    
    setIsPlanning(true);
    
    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description,
          model: settings.preferredModel,
          apiKeys
        }),
      });
      
      const data = await response.json();
      
      // In a real app, the API would return the full project structure.
      // For now, we'll use a mock structure if the API isn't fully implemented.
      if (data.project) {
        setProject(data.project);
      } else {
        // Mock project for demonstration
        const mockProject = {
          id: Math.random().toString(36).substr(2, 9),
          name: "Nuevo Proyecto",
          description,
          createdAt: new Date().toISOString(),
          levels: Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            title: `Nivel ${i + 1}: ${getLevelTitle(i)}`,
            description: `Descripción del nivel ${i + 1}`,
            xp: 1000,
            tasks: Array.from({ length: 5 }, (_, j) => ({
              id: `${i + 1}.${j + 1}`,
              title: `Tarea ${i + 1}.${j + 1}`,
              detail: `Detalle de la tarea ${i + 1}.${j + 1}`,
              aiType: ['ai', 'human', 'hybrid'][Math.floor(Math.random() * 3)] as any,
              estimatedTokens: 5000,
              estimatedCostAI: 150,
              estimatedTimeAI: "10m",
              estimatedTimeHuman: "1h",
              costHuman: 0,
              xp: 100,
              completed: false
            }))
          }))
        };
        setProject(mockProject as any);
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Error planning project:", error);
    } finally {
      setIsPlanning(false);
    }
  };

  function getLevelTitle(index: number) {
    const titles = [
      "Fundación Legal & Compliance",
      "Core Transaccional",
      "Core Web3 (Smart Contracts)",
      "Oráculo Web2 ↔ Web3",
      "Frontend UI/UX Generativo",
      "B2B Onboarding",
      "Go-To-Market & Growth",
      "IA Cognitiva (Soporte)",
      "Growth Hacking Multi-Agente",
      "Ciberseguridad & DevOps",
      "Expansión Nacional",
      "Gobernanza DAO & Tokenomics"
    ];
    return titles[index] || `Fase ${index + 1}`;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block p-3 bg-meli-yellow rounded-2xl mb-6">
          <Rocket className="w-12 h-12 text-meli-blue" />
        </div>
        <h1 className="text-4xl font-bold text-meli-text mb-4">
          Lanza tu idea al siguiente nivel
        </h1>
        <p className="text-xl text-meli-muted max-w-2xl mx-auto">
          Transformamos tu visión en un roadmap ejecutable en niveles con agentes IA y gamificación.
        </p>
        {projects.length > 0 && (
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-6 text-meli-blue font-bold flex items-center gap-2 mx-auto hover:underline"
          >
            Ver mis misiones activas ({projects.length})
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="meli-card p-8 shadow-lg">
        <label className="block text-lg font-semibold mb-4">
          ¿Qué quieres construir hoy?
        </label>
        <textarea
          className="w-full h-40 p-4 border border-meli-border rounded-lg focus:ring-2 focus:ring-meli-blue focus:border-transparent outline-none resize-none text-lg"
          placeholder="Ej: Una plataforma de micro-préstamos basada en reputación social con integración Web3..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        
        <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-sm text-meli-muted">
              <Zap className="w-4 h-4 text-meli-yellow fill-meli-yellow" />
              <span>Niveles</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-meli-muted">
              <Sparkles className="w-4 h-4 text-meli-blue" />
              <span>Agentes IA</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-meli-muted">
              <Target className="w-4 h-4 text-meli-green" />
              <span>Gamificado</span>
            </div>
          </div>
          
          <button
            onClick={handleStartQuest}
            disabled={!description.trim() || isPlanning}
            className={`meli-button-primary text-lg px-8 py-3 flex items-center gap-2 ${isPlanning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isPlanning ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Orquestando...
              </>
            ) : (
              <>
                Iniciar Quest
                <Rocket className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        <div className="meli-card text-center">
          <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="text-meli-blue" />
          </div>
          <h3 className="font-bold mb-2">Roadmap Preciso</h3>
          <p className="text-sm text-meli-muted">Desglosamos tu proyecto en 60+ tareas técnicas y humanas.</p>
        </div>
        <div className="meli-card text-center">
          <div className="bg-yellow-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="text-meli-yellow fill-meli-yellow" />
          </div>
          <h3 className="font-bold mb-2">Delegación IA</h3>
          <p className="text-sm text-meli-muted">Prompts listos para que agentes autónomos ejecuten el 70% del trabajo.</p>
        </div>
        <div className="meli-card text-center">
          <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="text-meli-green" />
          </div>
          <h3 className="font-bold mb-2">Costo Real</h3>
          <p className="text-sm text-meli-muted">Estimación de tokens y tiempo humano con aprendizaje constante.</p>
        </div>
      </div>
    </div>
  );
}
