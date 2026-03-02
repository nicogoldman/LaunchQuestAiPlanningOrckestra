import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { 
  Key, 
  Settings as SettingsIcon, 
  Database, 
  Shield, 
  Globe, 
  Zap, 
  Sparkles, 
  Brain, 
  Cpu, 
  CheckCircle2,
  ChevronRight,
  Coins,
  Puzzle,
  Github,
  Slack,
  CreditCard,
  Mail,
  Layers,
  ExternalLink,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MODELS = [
  // Google
  { id: 'gemini-flash-lite-latest', name: 'Gemini Flash Lite', provider: 'google', tag: 'Gratis', icon: Zap, color: 'text-emerald-600', desc: 'Ultra rápido y ligero' },
  { id: 'gemini-flash-latest', name: 'Gemini Flash', provider: 'google', tag: 'Estándar', icon: Cpu, color: 'text-blue-600', desc: 'Equilibrio ideal' },
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', provider: 'google', tag: 'Nuevo', icon: Sparkles, color: 'text-purple-600', desc: 'Última generación' },
  { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', provider: 'google', tag: 'Potente', icon: Brain, color: 'text-indigo-600', desc: 'Razonamiento avanzado' },
  
  // OpenAI
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', tag: 'Económico', icon: Zap, color: 'text-orange-600', desc: 'Pequeño pero matón' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', tag: 'Premium', icon: Brain, color: 'text-slate-700', desc: 'El estándar de la industria' },
  { id: 'o1-preview', name: 'OpenAI o1-preview', provider: 'openai', tag: 'Nuevo', icon: Brain, color: 'text-emerald-700', desc: 'Pensamiento profundo' },
  { id: 'o1-mini', name: 'OpenAI o1-mini', provider: 'openai', tag: 'Nuevo', icon: Zap, color: 'text-emerald-500', desc: 'Razonamiento optimizado' },
  
  // Anthropic
  { id: 'claude-3-5-sonnet-latest', name: 'Claude 3.5 Sonnet', provider: 'anthropic', tag: 'Nuevo', icon: Sparkles, color: 'text-amber-700', desc: 'Escritura humana' },
  { id: 'claude-3-5-haiku-latest', name: 'Claude 3.5 Haiku', provider: 'anthropic', tag: 'Nuevo', icon: Zap, color: 'text-amber-500', desc: 'Respuesta instantánea' },
  { id: 'claude-3-opus-latest', name: 'Claude 3 Opus', provider: 'anthropic', tag: 'Máximo', icon: Brain, color: 'text-amber-900', desc: 'Capacidad extrema' },

  // Chinese / Open Models
  { id: 'deepseek-chat', name: 'DeepSeek V3', provider: 'deepseek', tag: 'Nuevo', icon: Cpu, color: 'text-blue-500', desc: 'Gran performance/costo' },
  { id: 'deepseek-reasoner', name: 'DeepSeek R1', provider: 'deepseek', tag: 'Nuevo', icon: Brain, color: 'text-blue-800', desc: 'Pensamiento profundo' },
  { id: 'qwen-2.5-72b-instruct', name: 'Qwen 2.5 72B', provider: 'alibaba', tag: 'Versátil', icon: Globe, color: 'text-purple-500', desc: 'Líder en benchmarks' },
];

const PROVIDERS = [
  { id: 'google', name: 'Google Gemini', icon: Sparkles, color: 'text-blue-600' },
  { id: 'openai', name: 'OpenAI', icon: Brain, color: 'text-emerald-600' },
  { id: 'anthropic', name: 'Anthropic', icon: Shield, color: 'text-amber-600' },
  { id: 'deepseek', name: 'DeepSeek', icon: Cpu, color: 'text-blue-800' },
  { id: 'alibaba', name: 'Alibaba Qwen', icon: Globe, color: 'text-purple-600' },
];

const INTEGRATION_ICONS: Record<string, any> = {
  slack: Slack,
  github: Github,
  linear: Layers,
  stripe: CreditCard,
  mailchimp: Mail,
};

export default function Settings() {
  const { apiKeys, setApiKey, settings, updateSettings, integrations, updateIntegration } = useGameStore();
  const [activeTab, setActiveTab] = useState<'ia' | 'integrations'>('ia');
  const [activeProvider, setActiveProvider] = useState(MODELS.find(m => m.id === settings.preferredModel)?.provider || 'google');

  const selectedModel = MODELS.find(m => m.id === settings.preferredModel) || MODELS[0];
  const providerKey = activeProvider as keyof typeof apiKeys;
  const filteredModels = MODELS.filter(m => m.provider === activeProvider);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-meli-blue rounded-2xl flex items-center justify-center shadow-lg shadow-meli-blue/20">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-meli-text tracking-tight">Configuración</h1>
            <p className="text-meli-muted font-medium">Control total sobre los motores e integraciones</p>
          </div>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl border border-meli-border self-start">
          <button
            onClick={() => setActiveTab('ia')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'ia' ? 'bg-white text-meli-blue shadow-sm' : 'text-meli-muted hover:text-meli-text'
            }`}
          >
            Motores IA
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'integrations' ? 'bg-white text-meli-blue shadow-sm' : 'text-meli-muted hover:text-meli-text'
            }`}
          >
            Integraciones
            <span className="bg-meli-blue/10 text-meli-blue text-[10px] px-1.5 py-0.5 rounded-full">Beta</span>
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'ia' ? (
          <motion.div
            key="ia-tab"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Main Configuration Bento */}
            <div className="lg:col-span-8">
              <div className="meli-card !p-0 overflow-hidden flex flex-col md:flex-row h-full min-h-[500px]">
                {/* Sidebar Providers */}
                <div className="w-full md:w-64 bg-gray-50 border-r border-meli-border p-4 space-y-2">
                  <p className="text-[10px] font-bold text-meli-muted uppercase tracking-widest px-2 mb-4">Proveedores</p>
                  {PROVIDERS.map((p) => {
                    const isActive = activeProvider === p.id;
                    const hasKey = !!apiKeys[p.id as keyof typeof apiKeys];
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setActiveProvider(p.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                          isActive 
                            ? 'bg-white shadow-sm border border-meli-border text-meli-blue' 
                            : 'text-meli-muted hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-meli-blue' : 'text-gray-400'}`} />
                          <span className="text-sm font-bold">{p.name}</span>
                        </div>
                        {hasKey && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                      </button>
                    );
                  })}
                </div>

                {/* Models Grid */}
                <div className="flex-1 p-6 flex flex-col">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-meli-text mb-1">Selecciona un Modelo</h2>
                    <p className="text-sm text-meli-muted">Modelos disponibles para {PROVIDERS.find(p => p.id === activeProvider)?.name}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {filteredModels.map((model) => {
                      const isSelected = settings.preferredModel === model.id;
                      const Icon = model.icon;
                      return (
                        <button
                          key={model.id}
                          onClick={() => updateSettings({ preferredModel: model.id })}
                          className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                            isSelected 
                              ? 'border-meli-blue bg-blue-50/30 ring-4 ring-meli-blue/10' 
                              : 'border-meli-border bg-white hover:border-meli-blue/20'
                          }`}
                        >
                          <div className={`p-2.5 rounded-xl bg-white border border-meli-border shadow-sm ${model.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-bold text-sm truncate">{model.name}</span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-meli-blue" />}
                            </div>
                            <p className="text-[10px] text-meli-muted line-clamp-1 mb-1">{model.desc}</p>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 uppercase tracking-tighter">
                              {model.tag}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* API Key Input for active provider */}
                  <div className="mt-auto pt-6 border-t border-meli-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Key className="w-4 h-4 text-meli-blue" />
                      <h3 className="text-sm font-bold text-meli-text uppercase tracking-wider">Credenciales de {PROVIDERS.find(p => p.id === activeProvider)?.name}</h3>
                    </div>
                    <div className="relative group">
                      <input
                        type="password"
                        className="w-full p-4 pl-5 border-2 border-meli-border rounded-2xl focus:ring-4 focus:ring-meli-blue/10 focus:border-meli-blue outline-none transition-all bg-gray-50/50 group-hover:bg-white"
                        placeholder={`Ingresa tu API Key aquí...`}
                        value={apiKeys[providerKey] || ''}
                        onChange={(e) => setApiKey(providerKey, e.target.value)}
                      />
                      {apiKeys[providerKey] && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">KEY ACTIVA</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-meli-muted">
                      <Shield className="w-3 h-3" />
                      <span>Tus claves se cifran localmente. Nunca se envían a nuestros servidores.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar: Preferences & Data */}
            <div className="lg:col-span-4 space-y-6">
              {/* Currency Card */}
              <div className="meli-card">
                <div className="flex items-center gap-2 mb-6">
                  <Coins className="w-5 h-5 text-meli-blue" />
                  <h2 className="font-bold">Economía del Proyecto</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['ARS', 'USD'].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => updateSettings({ currency: curr as 'ARS' | 'USD' })}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        settings.currency === curr 
                          ? 'border-meli-blue bg-blue-50 text-meli-blue shadow-sm' 
                          : 'border-meli-border bg-white text-meli-muted hover:border-meli-blue/30'
                      }`}
                    >
                      <span className="text-lg font-bold">{curr}</span>
                      <span className="text-[10px] font-medium uppercase tracking-widest opacity-60">
                        {curr === 'ARS' ? 'Pesos Arg' : 'Dólares US'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Model Summary */}
              <div className="meli-card bg-meli-blue text-white border-none shadow-xl shadow-meli-blue/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Brain className="w-5 h-5" />
                  </div>
                  <h2 className="font-bold">Cerebro Activo</h2>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{selectedModel.name}</p>
                  <p className="text-white/70 text-sm font-medium uppercase tracking-wider">{selectedModel.provider}</p>
                </div>
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-white/60 uppercase">Estado</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold">Listo para Despegue</span>
                  </div>
                </div>
              </div>

              {/* Data Management */}
              <div className="meli-card border-dashed border-red-200 bg-red-50/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-red-500" />
                    <h2 className="text-sm font-bold text-red-700 uppercase tracking-wider">Zona de Peligro</h2>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (confirm('¿Estás COMPLETAMENTE seguro? Esta acción no se puede deshacer.')) {
                      localStorage.removeItem('launch-quest-storage');
                      window.location.reload();
                    }
                  }}
                  className="w-full py-3 rounded-xl bg-white border border-red-200 text-red-600 text-xs font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm"
                >
                  BORRAR TODO EL PROGRESO
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="integrations-tab"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.map((tool) => {
                const Icon = INTEGRATION_ICONS[tool.id] || Puzzle;
                return (
                  <div key={tool.id} className="meli-card group hover:border-meli-blue/50 transition-all flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl border border-meli-border flex items-center justify-center group-hover:bg-meli-blue/5 transition-colors">
                        <Icon className="w-6 h-6 text-meli-text" />
                      </div>
                      <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        tool.connected ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {tool.connected ? 'Conectado' : 'Desconectado'}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-meli-text mb-1">{tool.name}</h3>
                      <p className="text-xs text-meli-muted leading-relaxed">{tool.description}</p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <p className="text-[10px] font-bold text-meli-muted uppercase tracking-widest">Capacidades del Agente</p>
                      <div className="flex flex-wrap gap-2">
                        {tool.capabilities?.map((cap) => (
                          <span key={cap} className="flex items-center gap-1 text-[10px] font-medium bg-gray-50 text-meli-text px-2 py-1 rounded-lg border border-meli-border">
                            <Activity className="w-3 h-3 text-meli-blue" />
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-meli-border flex items-center justify-between">
                      <span className="text-[10px] font-bold text-meli-muted uppercase">{tool.category}</span>
                      <button
                        onClick={() => {
                          if (tool.connected) {
                            updateIntegration(tool.id, { connected: false });
                          } else {
                            if (tool.authType === 'apiKey') {
                              const key = prompt(`Ingresa tu API Key para ${tool.name}:`);
                              if (key) {
                                updateIntegration(tool.id, { connected: true, status: 'active' });
                              }
                            } else {
                              // Simulate OAuth popup
                              const win = window.open('', 'oauth', 'width=500,height=600');
                              if (win) {
                                win.document.write(`
                                  <div style="font-family: sans-serif; text-align: center; padding: 40px;">
                                    <h2>Conectando con ${tool.name}...</h2>
                                    <p>Por favor, autoriza a Launch Quest para acceder a tu cuenta.</p>
                                    <div style="margin-top: 20px; padding: 20px; background: #f0f0f0; border-radius: 10px;">
                                      [ Simulación de OAuth ]
                                    </div>
                                    <button onclick="window.close()" style="margin-top: 40px; padding: 10px 20px; background: #0089ff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                                      Autorizar y Cerrar
                                    </button>
                                  </div>
                                `);
                                const timer = setInterval(() => {
                                  if (win.closed) {
                                    clearInterval(timer);
                                    updateIntegration(tool.id, { connected: true, status: 'active' });
                                  }
                                }, 500);
                              }
                            }
                          }
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                          tool.connected 
                            ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                            : 'bg-meli-blue text-white hover:bg-meli-blue/90 shadow-lg shadow-meli-blue/20'
                        }`}
                      >
                        {tool.connected ? 'Desconectar' : 'Conectar'}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add Custom Integration Placeholder */}
              <div className="meli-card border-dashed border-2 border-meli-border bg-gray-50/30 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 bg-white rounded-full border border-meli-border flex items-center justify-center mb-4">
                  <Puzzle className="w-6 h-6 text-meli-muted" />
                </div>
                <h3 className="font-bold text-meli-text mb-1">Nueva Integración</h3>
                <p className="text-xs text-meli-muted mb-6">¿Necesitas conectar otra herramienta? Solicítala o usa nuestra API.</p>
                <button className="text-meli-blue text-xs font-bold hover:underline flex items-center gap-1">
                  Ver Documentación API <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="meli-card bg-gray-900 text-white border-none p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-meli-blue" />
                    <span className="text-xs font-bold text-meli-blue uppercase tracking-widest">Próximamente</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Flujos Autónomos de Agente</h2>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    Estamos trabajando en la capacidad de que la IA no solo planifique, sino que **ejecute** tareas directamente en tus herramientas. 
                    Desde crear repositorios en GitHub hasta programar reuniones en Slack.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-meli-blue" />
                      <span className="text-xs font-medium">Auto-ejecución</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-meli-blue" />
                      <span className="text-xs font-medium">Webhooks en tiempo real</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-meli-blue" />
                      <span className="text-xs font-medium">Seguridad de nivel bancario</span>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-64 aspect-square bg-gradient-to-br from-meli-blue/20 to-purple-500/20 rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-meli-blue/20 via-transparent to-transparent animate-pulse" />
                  <Brain className="w-24 h-24 text-meli-blue opacity-50" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
