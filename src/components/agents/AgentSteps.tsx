import { Task, AIStep, HumanStep } from '../../types';
import { Bot, User, Clipboard, Check, Terminal, Edit2, Plus, Trash2, Play, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import ReactMarkdown from 'react-markdown';

interface AgentStepsProps {
  task: Task;
  levelId: number;
}

export default function AgentSteps({ task, levelId }: AgentStepsProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'human'>(task.aiType === 'ai' ? 'ai' : 'human');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const { updateTask, settings, apiKeys, integrations, addTokenRecord } = useGameStore();

  const aiSteps = task.aiSteps || [
    { tool: "System Architect", detail: "Define la estructura de datos para el módulo", prompt: "Como arquitecto de sistemas, genera un esquema JSON para..." },
    { tool: "Code Engineer", detail: "Implementa la lógica de validación", prompt: "Escribe una función en TypeScript que valide..." }
  ];

  const humanSteps = task.humanSteps || [
    { title: "Definición de Requerimientos", detail: "Validar con stakeholders los objetivos clave", checklist: true },
    { title: "Revisión de Diseño", detail: "Asegurar que la UI cumple con los estándares", checklist: true }
  ];

  const handleExecute = async () => {
    setIsExecuting(true);
    setExecutionResult(null);
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task,
          model: settings.preferredModel,
          apiKeys,
          integrations
        })
      });

      if (!response.ok) throw new Error('Execution failed');
      const result = await response.json();
      setExecutionResult(result);
      
      // Update task with result
      addTokenRecord(task.estimatedTokens, result.tokensUsed || 2500, task.id, task.title);
      updateTask(levelId, task.id, { completed: true, actualTokens: result.tokensUsed });
    } catch (error) {
      console.error('Execution error:', error);
      alert('Error al ejecutar la tarea.');
    } finally {
      setIsExecuting(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleUpdateAIStep = (index: number, updates: Partial<AIStep>) => {
    const newSteps = [...aiSteps];
    newSteps[index] = { ...newSteps[index], ...updates };
    updateTask(levelId, task.id, { aiSteps: newSteps });
  };

  const handleAddAIStep = () => {
    const newSteps = [...aiSteps, { tool: "Nuevo Agente", detail: "Descripción del paso", prompt: "Prompt para el agente..." }];
    updateTask(levelId, task.id, { aiSteps: newSteps });
  };

  const handleRemoveAIStep = (index: number) => {
    const newSteps = aiSteps.filter((_, i) => i !== index);
    updateTask(levelId, task.id, { aiSteps: newSteps });
  };

  const handleUpdateHumanStep = (index: number, updates: Partial<HumanStep>) => {
    const newSteps = [...humanSteps];
    newSteps[index] = { ...newSteps[index], ...updates };
    updateTask(levelId, task.id, { humanSteps: newSteps });
  };

  const handleAddHumanStep = () => {
    const newSteps = [...humanSteps, { title: "Nuevo Paso", detail: "Descripción de la acción", checklist: true }];
    updateTask(levelId, task.id, { humanSteps: newSteps });
  };

  const handleRemoveHumanStep = (index: number) => {
    const newSteps = humanSteps.filter((_, i) => i !== index);
    updateTask(levelId, task.id, { humanSteps: newSteps });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-meli-border">
        <div className="flex">
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'ai' ? 'border-meli-blue text-meli-blue' : 'border-transparent text-meli-muted'}`}
          >
            <Bot className="w-4 h-4" />
            Pasos de Agente IA
          </button>
          <button
            onClick={() => setActiveTab('human')}
            className={`px-4 py-2 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'human' ? 'border-meli-blue text-meli-blue' : 'border-transparent text-meli-muted'}`}
          >
            <User className="w-4 h-4" />
            Pasos Humanos
          </button>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`p-1.5 rounded-md transition-colors ${isEditing ? 'bg-meli-blue text-white' : 'text-meli-muted hover:bg-gray-100'}`}
          title="Editar Pasos"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 py-2">
        {activeTab === 'ai' ? (
          <>
            {executionResult ? (
              <div className="meli-card bg-meli-blue/5 border-meli-blue/30 p-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-meli-blue">
                    <Sparkles className="w-5 h-5" />
                    <h3 className="font-bold">Resultado de la Ejecución</h3>
                  </div>
                  <div className="text-[10px] font-bold text-meli-muted uppercase">
                    {executionResult.tokensUsed} Tokens • ${executionResult.cost} ARS
                  </div>
                </div>
                <div className="prose prose-sm max-w-none text-meli-text mb-6">
                  <ReactMarkdown>{executionResult.output}</ReactMarkdown>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-meli-muted uppercase tracking-widest">Próximos Pasos Sugeridos</p>
                  <div className="flex flex-wrap gap-2">
                    {executionResult.nextSteps?.map((step: string, i: number) => (
                      <span key={i} className="text-[10px] font-medium bg-white border border-meli-border px-2 py-1 rounded-lg">
                        {step}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {!task.completed && (
                  <button 
                    onClick={handleExecute}
                    disabled={isExecuting}
                    className="w-full py-4 bg-meli-blue text-white rounded-xl font-bold shadow-lg shadow-meli-blue/20 hover:bg-meli-blue-hover transition-all flex items-center justify-center gap-3 mb-6 group overflow-hidden relative"
                  >
                    {isExecuting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Agente Orquestando...</span>
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <Play className="w-5 h-5 fill-white" />
                        <span>Ejecutar con Agente Autónomo</span>
                      </>
                    )}
                  </button>
                )}
                
                {aiSteps.map((step, i) => (
                  <div key={i} className="meli-card bg-gray-50 border-gray-200 p-0 overflow-hidden group">
                    <div className="bg-gray-100 px-4 py-2 flex justify-between items-center border-b border-gray-200">
                      <div className="flex items-center gap-2 flex-1">
                        <Terminal className="w-4 h-4 text-meli-blue" />
                        {isEditing ? (
                          <input 
                            className="text-xs font-bold text-meli-text uppercase bg-transparent border-b border-meli-blue/30 outline-none w-full"
                            value={step.tool}
                            onChange={(e) => handleUpdateAIStep(i, { tool: e.target.value })}
                          />
                        ) : (
                          <span className="text-xs font-bold text-meli-text uppercase">{step.tool}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {isEditing ? (
                          <button 
                            onClick={() => handleRemoveAIStep(i)}
                            className="text-red-500 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => copyToClipboard(step.prompt, i)}
                            className="text-meli-blue hover:text-meli-blue-hover flex items-center gap-1 text-xs font-bold"
                          >
                            {copiedIndex === i ? <Check className="w-3 h-3" /> : <Clipboard className="w-3 h-3" />}
                            {copiedIndex === i ? 'Copiado' : 'Copiar Prompt'}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input 
                            className="text-sm font-bold w-full bg-transparent border-b border-gray-300 outline-none"
                            value={step.detail}
                            onChange={(e) => handleUpdateAIStep(i, { detail: e.target.value })}
                          />
                          <textarea 
                            className="w-full h-24 bg-meli-text text-gray-300 p-3 rounded font-mono text-xs outline-none resize-none"
                            value={step.prompt}
                            onChange={(e) => handleUpdateAIStep(i, { prompt: e.target.value })}
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-bold mb-1">{step.detail}</p>
                          <div className="bg-meli-text text-gray-300 p-3 rounded font-mono text-xs overflow-x-auto">
                            {step.prompt}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {isEditing && (
                  <button 
                    onClick={handleAddAIStep}
                    className="w-full py-3 border-2 border-dashed border-meli-border rounded-lg text-meli-muted hover:text-meli-blue hover:border-meli-blue transition-all flex items-center justify-center gap-2 font-bold text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Añadir Paso de Agente
                  </button>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {humanSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-4 p-3 border-b border-meli-border last:border-0 group">
                <div className="w-6 h-6 rounded-full bg-meli-blue/10 text-meli-blue flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-1">
                      <input 
                        className="font-bold text-sm w-full bg-transparent border-b border-gray-300 outline-none"
                        value={step.title}
                        onChange={(e) => handleUpdateHumanStep(i, { title: e.target.value })}
                      />
                      <input 
                        className="text-xs text-meli-muted w-full bg-transparent border-b border-gray-200 outline-none"
                        value={step.detail}
                        onChange={(e) => handleUpdateHumanStep(i, { detail: e.target.value })}
                      />
                    </div>
                  ) : (
                    <>
                      <h4 className="font-bold text-sm">{step.title}</h4>
                      <p className="text-xs text-meli-muted">{step.detail}</p>
                    </>
                  )}
                </div>
                {isEditing && (
                  <button 
                    onClick={() => handleRemoveHumanStep(i)}
                    className="text-red-500 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <button 
                onClick={handleAddHumanStep}
                className="w-full py-3 border-2 border-dashed border-meli-border rounded-lg text-meli-muted hover:text-meli-blue hover:border-meli-blue transition-all flex items-center justify-center gap-2 font-bold text-sm"
              >
                <Plus className="w-4 h-4" />
                Añadir Paso Humano
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
