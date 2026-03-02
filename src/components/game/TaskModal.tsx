import { Task } from '../../types';
import { useGameStore } from '../../stores/gameStore';
import { X, Bot, User, Zap, Copy, Check, Clock, Coins, Brain, Edit2, Save, ChevronRight, ArrowLeft, Loader2, Target, Plus } from 'lucide-react';
import { useState } from 'react';
import AgentSteps from '../agents/AgentSteps';

interface TaskModalProps {
  task: Task;
  levelId: number;
  onClose: () => void;
}

export default function TaskModal({ task: initialTask, levelId, onClose }: TaskModalProps) {
  const { completeTask, updateTask, addTokenRecord, breakDownTask, currentProject, settings, apiKeys } = useGameStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isBreakingDown, setIsBreakingDown] = useState(false);
  const [taskHistory, setTaskHistory] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task>({ ...initialTask });
  const [editedTask, setEditedTask] = useState<Task>({ ...initialTask });

  const handleComplete = () => {
    if (currentTask.aiType === 'ai' || currentTask.aiType === 'hybrid') {
      const variance = 0.8 + Math.random() * 0.4;
      const actualTokens = Math.round(currentTask.estimatedTokens * variance);
      addTokenRecord(currentTask.estimatedTokens, actualTokens, currentTask.id, currentTask.title);
      completeTask(levelId, currentTask.id, actualTokens);
    } else {
      completeTask(levelId, currentTask.id);
    }
    onClose();
  };

  const handleSave = () => {
    updateTask(levelId, currentTask.id, editedTask);
    setCurrentTask(editedTask);
    setIsEditing(false);
  };

  const handleBreakDown = async () => {
    setIsBreakingDown(true);
    try {
      const response = await fetch('/api/task/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: currentTask.title,
          taskDetail: currentTask.detail,
          projectContext: currentProject?.context,
          model: settings.preferredModel,
          apiKeys
        })
      });
      
      if (!response.ok) throw new Error('Failed to break down task');
      
      const subTasks = await response.json();
      breakDownTask(levelId, currentTask.id, subTasks);
      
      const updatedTask = { ...currentTask, subTasks };
      setCurrentTask(updatedTask);
      setEditedTask(updatedTask);
    } catch (error) {
      console.error('Error breaking down task:', error);
      alert('Error al desglosar la tarea. Intenta de nuevo.');
    } finally {
      setIsBreakingDown(false);
    }
  };

  const navigateToSubTask = (subTask: Task) => {
    setTaskHistory([...taskHistory, currentTask]);
    setCurrentTask(subTask);
    setEditedTask(subTask);
    setIsEditing(false);
  };

  const goBack = () => {
    const newHistory = [...taskHistory];
    const previousTask = newHistory.pop();
    if (previousTask) {
      setTaskHistory(newHistory);
      setCurrentTask(previousTask);
      setEditedTask(previousTask);
      setIsEditing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-meli-yellow p-6 flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {taskHistory.length > 0 && (
                <button 
                  onClick={goBack}
                  className="mr-2 p-1 hover:bg-black/10 rounded-full transition-colors"
                  title="Volver"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <span className="bg-meli-blue text-white text-xs font-bold px-2 py-1 rounded">
                TAREA {currentTask.id}
              </span>
              <span className="bg-white/50 text-meli-text text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                <Brain className="w-3 h-3" />
                {currentTask.xp} XP
              </span>
            </div>
            {isEditing ? (
              <input 
                type="text"
                className="text-2xl font-bold text-meli-text bg-white/50 border-none rounded px-2 w-full focus:ring-2 focus:ring-meli-blue outline-none"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              />
            ) : (
              <h2 className="text-2xl font-bold text-meli-text">{currentTask.title}</h2>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!currentTask.completed && (
              <button 
                onClick={() => setIsEditing(!isEditing)} 
                className={`p-2 hover:bg-black/5 rounded-full transition-colors ${isEditing ? 'text-meli-blue' : 'text-meli-text'}`}
                title={isEditing ? "Cancelar" : "Editar Tarea"}
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="meli-card bg-blue-50/30 border-blue-100">
              <div className="flex items-center gap-2 text-meli-blue mb-1">
                <Bot className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Esfuerzo IA</span>
              </div>
              {isEditing ? (
                <input 
                  type="text"
                  className="text-lg font-bold bg-transparent border-b border-meli-blue/30 w-full outline-none"
                  value={editedTask.estimatedTimeAI}
                  onChange={(e) => setEditedTask({ ...editedTask, estimatedTimeAI: e.target.value })}
                />
              ) : (
                <div className="text-lg font-bold">{currentTask.estimatedTimeAI}</div>
              )}
              <div className="text-[10px] text-meli-muted">{currentTask.estimatedTokens.toLocaleString()} Tokens est.</div>
            </div>
            <div className="meli-card bg-orange-50/30 border-orange-100">
              <div className="flex items-center gap-2 text-orange-600 mb-1">
                <User className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Esfuerzo Humano</span>
              </div>
              {isEditing ? (
                <input 
                  type="text"
                  className="text-lg font-bold bg-transparent border-b border-orange-600/30 w-full outline-none"
                  value={editedTask.estimatedTimeHuman}
                  onChange={(e) => setEditedTask({ ...editedTask, estimatedTimeHuman: e.target.value })}
                />
              ) : (
                <div className="text-lg font-bold">{currentTask.estimatedTimeHuman}</div>
              )}
              <div className="text-[10px] text-meli-muted">Checklist de pasos</div>
            </div>
            <div className="meli-card bg-green-50/30 border-green-100">
              <div className="flex items-center gap-2 text-meli-green mb-1">
                <Coins className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Costo Est.</span>
              </div>
              {isEditing ? (
                <input 
                  type="number"
                  className="text-lg font-bold bg-transparent border-b border-meli-green/30 w-full outline-none"
                  value={editedTask.estimatedCostAI}
                  onChange={(e) => setEditedTask({ ...editedTask, estimatedCostAI: Number(e.target.value) })}
                />
              ) : (
                <div className="text-lg font-bold">${currentTask.estimatedCostAI} ARS</div>
              )}
              <div className="text-[10px] text-meli-muted">Basado en tokens</div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-meli-yellow fill-meli-yellow" />
              Descripción de la Tarea
            </h3>
            {isEditing ? (
              <textarea 
                className="w-full h-32 p-3 border border-meli-border rounded-lg focus:ring-2 focus:ring-meli-blue outline-none resize-none"
                value={editedTask.detail}
                onChange={(e) => setEditedTask({ ...editedTask, detail: e.target.value })}
              />
            ) : (
              <p className="text-meli-muted leading-relaxed">
                {currentTask.detail}
              </p>
            )}
          </div>

          {/* Sub-tasks Section */}
          <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-meli-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-meli-muted flex items-center gap-2">
                <Target className="w-4 h-4" />
                Capas de Detalle (Infinito)
              </h3>
              {!currentTask.subTasks && !isBreakingDown && !currentTask.completed && (
                <button 
                  onClick={handleBreakDown}
                  className="text-xs font-bold text-meli-blue hover:text-meli-blue-hover flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Desglosar en 7 sub-tareas
                </button>
              )}
            </div>

            {isBreakingDown ? (
              <div className="py-8 text-center">
                <Loader2 className="w-8 h-8 text-meli-blue animate-spin mx-auto mb-2" />
                <p className="text-xs text-meli-muted font-medium">Orquestando agentes para profundizar...</p>
              </div>
            ) : currentTask.subTasks ? (
              <div className="space-y-2">
                {currentTask.subTasks.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => navigateToSubTask(sub)}
                    className="w-full flex items-center justify-between p-3 bg-white border border-meli-border rounded-lg hover:border-meli-blue hover:shadow-sm transition-all group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${sub.completed ? 'bg-meli-green' : 'bg-meli-blue'}`} />
                      <div>
                        <div className="text-sm font-bold text-meli-text group-hover:text-meli-blue transition-colors">{sub.title}</div>
                        <div className="text-[10px] text-meli-muted">{sub.aiType.toUpperCase()} • {sub.xp} XP</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-meli-muted group-hover:text-meli-blue group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-meli-muted italic text-center py-4">
                Esta tarea aún no ha sido desglosada. Haz clic en "Desglosar" para entrar en el siguiente nivel de detalle.
              </p>
            )}
          </div>

          {!isEditing && !currentTask.subTasks && <AgentSteps task={currentTask} levelId={levelId} />}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-meli-border bg-gray-50 flex justify-between items-center">
          <button 
            onClick={onClose}
            className="meli-button-secondary"
          >
            Cerrar
          </button>
          <div className="flex gap-3">
            {isEditing ? (
              <button 
                onClick={handleSave}
                className="meli-button-primary flex items-center gap-2 bg-meli-green border-meli-green"
              >
                Guardar Cambios
                <Save className="w-5 h-5" />
              </button>
            ) : (
              !currentTask.completed && (
                <button 
                  onClick={handleComplete}
                  className="meli-button-primary flex items-center gap-2"
                >
                  Marcar como Completada
                  <Check className="w-5 h-5" />
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
