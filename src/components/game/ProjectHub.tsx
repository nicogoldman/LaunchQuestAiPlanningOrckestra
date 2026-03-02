import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { 
  BookOpen, 
  Award, 
  Wrench, 
  Table as TableIcon, 
  Save, 
  Plus, 
  CheckCircle2, 
  Circle,
  ExternalLink,
  Shield,
  Zap,
  Cpu
} from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';

export default function ProjectHub() {
  const { currentProject, updateContext, toggleTool, skills } = useGameStore();
  const [activeTab, setActiveTab] = useState<'summary' | 'context' | 'skills' | 'tools'>('summary');
  const [contextText, setContextText] = useState(currentProject?.context || '');

  if (!currentProject) return null;

  const handleSaveContext = () => {
    updateContext(contextText);
  };

  const defaultTools = [
    { id: 'github', name: 'GitHub', provider: 'Version Control', icon: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' },
    { id: 'slack', name: 'Slack', provider: 'Communication', icon: 'https://cdn.brandfolder.io/5H442S3W/at/pl546j-7le8zk-6v51sy/Slack_Mark.png' },
    { id: 'vercel', name: 'Vercel', provider: 'Deployment', icon: 'https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png' },
    { id: 'stripe', name: 'Stripe', provider: 'Payments', icon: 'https://images.ctfassets.net/fzn2n1nzq965/33u3Z0h6thO7J7m8p965/7a3e6e6e6e6e6e6e6e6e6e6e6e6e6e6e/Stripe_Logo_-_S.png' }
  ];

  const projectTools = currentProject.tools || defaultTools.map(t => ({ ...t, connected: false }));

  return (
    <div className="meli-card mt-8 overflow-hidden">
      <div className="flex border-b border-meli-border bg-gray-50">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'summary' ? 'border-meli-blue text-meli-blue bg-white' : 'border-transparent text-meli-muted hover:bg-gray-100'}`}
        >
          <TableIcon className="w-4 h-4" />
          Resumen
        </button>
        <button
          onClick={() => setActiveTab('context')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'context' ? 'border-meli-blue text-meli-blue bg-white' : 'border-transparent text-meli-muted hover:bg-gray-100'}`}
        >
          <BookOpen className="w-4 h-4" />
          Contexto
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'skills' ? 'border-meli-blue text-meli-blue bg-white' : 'border-transparent text-meli-muted hover:bg-gray-100'}`}
        >
          <Award className="w-4 h-4" />
          Skills
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'tools' ? 'border-meli-blue text-meli-blue bg-white' : 'border-transparent text-meli-muted hover:bg-gray-100'}`}
        >
          <Wrench className="w-4 h-4" />
          Herramientas
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'summary' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-meli-muted border-b border-meli-border">
                  <th className="pb-3 font-bold uppercase text-[10px]">Nivel</th>
                  <th className="pb-3 font-bold uppercase text-[10px]">Título</th>
                  <th className="pb-3 font-bold uppercase text-[10px]">Progreso</th>
                  <th className="pb-3 font-bold uppercase text-[10px]">Tareas</th>
                  <th className="pb-3 font-bold uppercase text-[10px]">XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-meli-border">
                {currentProject.levels.map((level) => {
                  const completed = level.tasks.filter(t => t.completed).length;
                  const total = level.tasks.length;
                  const progress = (completed / total) * 100;
                  return (
                    <tr key={level.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-bold text-meli-blue">#{level.id}</td>
                      <td className="py-4">
                        <div className="font-bold text-meli-text">{level.title}</div>
                        <div className="text-[10px] text-meli-muted line-clamp-1">{level.description}</div>
                      </td>
                      <td className="py-4 w-32">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-meli-green' : 'bg-meli-blue'}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-meli-muted">{Math.round(progress)}%</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1">
                          {progress === 100 ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-meli-green" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-meli-border" />
                          )}
                          <span className="text-xs font-medium">{completed}/{total}</span>
                        </div>
                      </td>
                      <td className="py-4 font-bold text-meli-green">+{level.xp}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'context' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-meli-text">Contexto del Proyecto</h3>
              <button 
                onClick={handleSaveContext}
                className="meli-button-primary py-1.5 px-4 text-xs flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                Guardar Contexto
              </button>
            </div>
            <p className="text-xs text-meli-muted">
              Define el contexto global, stack tecnológico, reglas de negocio y tono de voz. Este contexto será inyectado en cada prompt de los agentes IA.
            </p>
            <textarea
              className="w-full h-64 p-4 border border-meli-border rounded-lg focus:ring-2 focus:ring-meli-blue outline-none resize-none font-mono text-sm"
              placeholder="Ej: El proyecto es una DApp de finanzas descentralizadas. Stack: React, Solidity, Ethers.js. Tono: Profesional y técnico..."
              value={contextText}
              onChange={(e) => setContextText(e.target.value)}
            />
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <div key={skill.id} className="meli-card border-meli-border bg-gray-50/50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-sm text-meli-text">{skill.name}</div>
                    <div className="text-[10px] font-bold text-meli-blue bg-blue-50 px-1.5 py-0.5 rounded">Lvl {skill.level}</div>
                  </div>
                  <ProgressBar progress={(skill.xp % 1000) / 10} height="h-1.5" />
                  <div className="mt-2 text-[10px] text-meli-muted font-bold uppercase">
                    {skill.xp} XP Totales
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <Award className="w-12 h-12 text-meli-muted mx-auto mb-4 opacity-20" />
                <h4 className="font-bold text-meli-text mb-1">Aún no has desbloqueado skills</h4>
                <p className="text-xs text-meli-muted">Completa misiones para ganar experiencia en diferentes áreas.</p>
              </div>
            )}
            
            {/* Example Skills for visual reference if empty */}
            {skills.length === 0 && (
              <>
                <div className="meli-card border-meli-border bg-gray-50/50 opacity-40 grayscale">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-sm text-meli-text">Prompt Engineering</div>
                    <div className="text-[10px] font-bold text-meli-blue bg-blue-50 px-1.5 py-0.5 rounded">Lvl 0</div>
                  </div>
                  <ProgressBar progress={0} height="h-1.5" />
                </div>
                <div className="meli-card border-meli-border bg-gray-50/50 opacity-40 grayscale">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-sm text-meli-text">Frontend Architecture</div>
                    <div className="text-[10px] font-bold text-meli-blue bg-blue-50 px-1.5 py-0.5 rounded">Lvl 0</div>
                  </div>
                  <ProgressBar progress={0} height="h-1.5" />
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectTools.map((tool) => (
              <div key={tool.id} className="flex items-center justify-between p-4 border border-meli-border rounded-xl hover:shadow-sm transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-meli-border">
                    {tool.icon ? (
                      <img src={tool.icon} alt={tool.name} className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <Wrench className="w-6 h-6 text-meli-muted" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-meli-text">{tool.name}</h4>
                    <p className="text-[10px] text-meli-muted uppercase font-bold">{tool.provider}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleTool(tool.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tool.connected ? 'bg-meli-green text-white' : 'bg-meli-blue text-white hover:bg-meli-blue-hover'}`}
                >
                  {tool.connected ? 'Conectado' : 'Conectar'}
                </button>
              </div>
            ))}
            
            <button className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-meli-border rounded-xl text-meli-muted hover:text-meli-blue hover:border-meli-blue transition-all group">
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm">Añadir Herramienta Custom</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
