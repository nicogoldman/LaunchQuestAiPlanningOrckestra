import { useGameStore } from '../stores/gameStore';
import { useTokenTracking } from '../hooks/useTokenTracking';
import LevelCard from '../components/game/LevelCard';
import StatsGrid from '../components/ui/StatsGrid';
import ProgressBar from '../components/ui/ProgressBar';
import PlanOrchestrator from '../components/planning/PlanOrchestrator';
import ProjectHub from '../components/game/ProjectHub';
import { Rocket, History, Activity, ExternalLink, Search, Brain, Copy } from 'lucide-react';

export default function Dashboard() {
  const { currentProject, userXP, userLevel, tokenHistory, skills } = useGameStore();
  const { averagePrecision } = useTokenTracking();

  if (!currentProject) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Rocket className="w-16 h-16 text-meli-muted mx-auto mb-6 opacity-20" />
        <h2 className="text-2xl font-bold text-meli-text mb-4">No hay misiones activas</h2>
        <p className="text-meli-muted mb-8">Comienza describiendo tu idea en la página de inicio.</p>
        <a href="/" className="meli-button-primary">Crear Proyecto</a>
      </div>
    );
  }

  const totalTasks = currentProject.levels.reduce((acc, level) => acc + level.tasks.length, 0);
  const completedTasks = currentProject.levels.reduce(
    (acc, level) => acc + level.tasks.filter((t) => t.completed).length,
    0
  );
  const progress = (completedTasks / totalTasks) * 100;

  const statsByType = currentProject.levels.reduce((acc, level) => {
    level.tasks.forEach(task => {
      const type = task.aiType as 'ai' | 'human' | 'hybrid';
      acc[type].total += 1;
      if (task.completed) {
        acc[type].completed += 1;
      }
    });
    return acc;
  }, { 
    ai: { completed: 0, total: 0 }, 
    human: { completed: 0, total: 0 }, 
    hybrid: { completed: 0, total: 0 } 
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-meli-text">{currentProject.name}</h1>
            <button 
              onClick={() => {
                const { cloneProject } = useGameStore.getState();
                cloneProject(currentProject.id);
              }}
              className="p-2 hover:bg-meli-blue/10 text-meli-blue rounded-lg transition-colors border border-meli-blue/20 flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
              title="Clonar esta misión"
            >
              <Copy className="w-3.5 h-3.5" />
              Clonar
            </button>
          </div>
          <p className="text-meli-muted mb-4">{currentProject.description.substring(0, 100)}...</p>
          
          {/* Completed Tasks Summary */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-meli-border shadow-sm">
              <div className="flex items-center gap-2 pr-3 border-r border-meli-border">
                <Activity className="w-4 h-4 text-meli-blue" />
                <span className="text-xs font-bold text-meli-text uppercase">Eficiencia por Tipo</span>
              </div>
              
              <div className="flex gap-4">
                <div className="flex items-center gap-2" title="AI Tasks">
                  <div className="bg-blue-50 p-1 rounded">
                    <Rocket className="w-3 h-3 text-meli-blue" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-meli-muted uppercase leading-none mb-1">AI</span>
                    <span className="text-sm font-bold text-meli-blue leading-none">
                      {statsByType.ai.total > 0 ? Math.round((statsByType.ai.completed / statsByType.ai.total) * 100) : 0}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2" title="Human Tasks">
                  <div className="bg-orange-50 p-1 rounded">
                    <Activity className="w-3 h-3 text-orange-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-meli-muted uppercase leading-none mb-1">Human</span>
                    <span className="text-sm font-bold text-orange-600 leading-none">
                      {statsByType.human.total > 0 ? Math.round((statsByType.human.completed / statsByType.human.total) * 100) : 0}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2" title="Hybrid Tasks">
                  <div className="bg-purple-50 p-1 rounded">
                    <Activity className="w-3 h-3 text-purple-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-meli-muted uppercase leading-none mb-1">Hybrid</span>
                    <span className="text-sm font-bold text-purple-600 leading-none">
                      {statsByType.hybrid.total > 0 ? Math.round((statsByType.hybrid.completed / statsByType.hybrid.total) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-meli-border shadow-sm flex items-center gap-4">
          <div className="text-center">
            <div className="text-xs text-meli-muted uppercase font-bold">Nivel</div>
            <div className="text-2xl font-bold text-meli-blue">{userLevel}</div>
          </div>
          <div className="w-px h-10 bg-meli-border"></div>
          <div>
            <div className="text-xs text-meli-muted uppercase font-bold">XP Total</div>
            <div className="text-2xl font-bold text-meli-green">{userXP.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <StatsGrid 
        totalTasks={totalTasks} 
        completedTasks={completedTasks} 
        levels={currentProject.levels}
      />

      {/* Skills Section */}
      {skills.length > 0 && (
        <div className="meli-card mb-8">
          <div className="flex items-center gap-2 mb-6 border-b border-meli-border pb-2">
            <Brain className="w-5 h-5 text-meli-blue" />
            <h2 className="font-bold text-meli-text">Habilidades Desarrolladas</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="bg-gray-50 p-4 rounded-xl border border-meli-border flex flex-col items-center text-center group hover:border-meli-blue transition-all">
                <div className="w-10 h-10 rounded-full bg-white border border-meli-border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-xs font-bold text-meli-blue">Lvl {skill.level}</span>
                </div>
                <h4 className="text-xs font-bold text-meli-text mb-1">{skill.name}</h4>
                <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden mt-2">
                  <div 
                    className="bg-meli-blue h-full transition-all duration-500" 
                    style={{ width: `${(skill.xp % 500) / 5}%` }}
                  />
                </div>
                <span className="text-[9px] text-meli-muted mt-1 uppercase font-bold">{skill.xp % 500} / 500 XP</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Token History Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 meli-card">
          <div className="flex items-center justify-between mb-4 border-b border-meli-border pb-2">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-meli-blue" />
              <h2 className="font-bold text-meli-text">Historial de Ejecución & Tokens</h2>
            </div>
            <div className="text-[10px] font-bold text-meli-muted uppercase">Últimos 50 registros</div>
          </div>
          
          {tokenHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-meli-muted border-b border-meli-border">
                    <th className="pb-2 font-bold uppercase text-[10px]">Fecha</th>
                    <th className="pb-2 font-bold uppercase text-[10px]">Tarea</th>
                    <th className="pb-2 font-bold uppercase text-[10px]">Estimado</th>
                    <th className="pb-2 font-bold uppercase text-[10px]">Real</th>
                    <th className="pb-2 font-bold uppercase text-[10px]">Precisión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-meli-border">
                  {tokenHistory.map((record, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 text-[11px] text-meli-muted">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="py-3">
                        <div className="font-bold text-meli-text line-clamp-1 max-w-[200px]">
                          {record.taskTitle || "Ejecución Directa"}
                        </div>
                        <div className="text-[9px] text-meli-muted uppercase font-bold">ID: {record.taskId || "N/A"}</div>
                      </td>
                      <td className="py-3 font-medium text-meli-muted">{record.estimated.toLocaleString()}</td>
                      <td className="py-3 font-bold text-meli-text">{record.actual.toLocaleString()}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${record.precision > 90 ? 'text-meli-green' : record.precision > 70 ? 'text-meli-blue' : 'text-orange-500'}`}>
                            {Math.round(record.precision)}%
                          </span>
                          <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${record.precision > 90 ? 'bg-meli-green' : record.precision > 70 ? 'bg-meli-blue' : 'bg-orange-500'}`}
                              style={{ width: `${record.precision}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-meli-muted italic">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-10" />
              No hay registros de tokens aún. Completa tareas de IA para ver datos.
            </div>
          )}
        </div>

        <div className="meli-card flex flex-col justify-center items-center text-center">
          <Activity className="w-10 h-10 text-meli-blue mb-2" />
          <div className="text-xs text-meli-muted font-bold uppercase mb-1">Precisión Promedio</div>
          <div className="text-4xl font-bold text-meli-text mb-2">{Math.round(averagePrecision)}%</div>
          <div className="w-full max-w-[150px]">
            <ProgressBar progress={averagePrecision} height="h-2" color={averagePrecision > 80 ? 'bg-meli-green' : 'bg-meli-blue'} />
          </div>
          <p className="text-[10px] text-meli-muted mt-4">
            El sistema aprende de tus ejecuciones reales para mejorar futuras estimaciones.
          </p>
          <div className="mt-6 pt-6 border-t border-meli-border w-full grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] text-meli-muted uppercase font-bold">Tokens Totales</div>
              <div className="text-sm font-bold text-meli-text">
                {tokenHistory.reduce((acc, r) => acc + r.actual, 0).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-meli-muted uppercase font-bold">Costo Total Est.</div>
              <div className="text-sm font-bold text-meli-green">
                ${Math.round(tokenHistory.reduce((acc, r) => acc + r.actual, 0) * 0.03)} ARS
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="my-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-bold text-meli-text">Progreso General de la Quest</span>
          <span className="text-sm font-bold text-meli-blue">{Math.round(progress)}%</span>
        </div>
        <ProgressBar progress={progress} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProject.levels.map((level) => (
          <LevelCard key={level.id} level={level} />
        ))}
      </div>

      <ProjectHub />
      <PlanOrchestrator />
    </div>
  );
}
