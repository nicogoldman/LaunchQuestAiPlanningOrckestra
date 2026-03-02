import { motion } from 'motion/react';
import { 
  BookOpen, 
  Sparkles, 
  Play, 
  Zap, 
  Brain, 
  Puzzle, 
  Target, 
  Rocket,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

const SECTIONS = [
  {
    id: 'planning',
    title: 'Planificación Inteligente',
    icon: Target,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    content: 'Todo comienza con una visión. Describe tu idea y nuestro Orquestador de Agentes desglosará el proyecto en niveles gamificados. Cada nivel contiene tareas específicas con estimaciones de tokens, tiempo y XP.'
  },
  {
    id: 'execution',
    title: 'Ejecución Autónoma',
    icon: Play,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    content: 'No solo planificamos. Al conectar tus API Keys, puedes ejecutar tareas de IA directamente. El agente generará código, esquemas o planes técnicos basados en el contexto de tu proyecto.'
  },
  {
    id: 'tokens',
    title: 'Economía de Tokens',
    icon: Zap,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    content: 'Monitorea el consumo real de tokens frente a las estimaciones. El sistema aprende de cada ejecución para mejorar la precisión de los presupuestos futuros.'
  },
  {
    id: 'skills',
    title: 'Desarrollo de Habilidades',
    icon: Brain,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    content: 'A medida que completas tareas, ganas XP y subes de nivel en habilidades específicas como Backend, UI/UX o Marketing. Tu perfil evoluciona con el proyecto.'
  },
  {
    id: 'integrations',
    title: 'Ecosistema de Herramientas',
    icon: Puzzle,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    content: 'Conecta Slack, GitHub, Linear y más. Los agentes utilizarán estas herramientas para ejecutar acciones reales en tu flujo de trabajo profesional.'
  }
];

export default function Instructions() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="text-center mb-16">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 bg-meli-blue/10 text-meli-blue px-4 py-2 rounded-full mb-6"
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Manual del Explorador</span>
        </motion.div>
        <h1 className="text-4xl font-bold text-meli-text mb-4 tracking-tight">Cómo usar Launch Quest</h1>
        <p className="text-meli-muted text-lg max-w-2xl mx-auto">
          Transforma tus ideas en roadmaps ejecutables con agentes de IA autónomos.
        </p>
      </header>

      <div className="space-y-12">
        {SECTIONS.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.section 
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col md:flex-row gap-8 items-start"
            >
              <div className={`w-16 h-16 rounded-2xl ${section.bg} ${section.color} flex items-center justify-center shrink-0 shadow-sm border border-black/5`}>
                <Icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-meli-text mb-3 flex items-center gap-2">
                  {section.title}
                  <ChevronRight className="w-5 h-5 opacity-20" />
                </h2>
                <p className="text-meli-muted leading-relaxed text-lg">
                  {section.content}
                </p>
              </div>
            </motion.section>
          );
        })}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-20 p-8 bg-gray-900 rounded-3xl text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Rocket className="w-32 h-32 rotate-45" />
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-meli-blue" />
            ¿Listo para el éxito?
          </h3>
          
          <div className="mb-8">
            <p className="text-gray-300 font-bold mb-4">La clave está en la descripción. Para que Launch Quest orqueste el mejor roadmap, intenta incluir:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-meli-blue/20 flex items-center justify-center shrink-0 text-meli-blue font-bold text-xs">1</div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 text-white">El "Qué" y el "Para Quién"</h4>
                    <p className="text-xs text-gray-400">Define claramente el problema y tu público objetivo.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-meli-blue/20 flex items-center justify-center shrink-0 text-meli-blue font-bold text-xs">2</div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 text-white">Base o Herramientas</h4>
                    <p className="text-xs text-gray-400">Define tecnologías, metodologías o herramientas clave (ej: React, Python, Excel, Agile).</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-meli-blue/20 flex items-center justify-center shrink-0 text-meli-blue font-bold text-xs">3</div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 text-white">Entregables Core</h4>
                    <p className="text-xs text-gray-400">Lista los 3 resultados vitales que definen el éxito del proyecto.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-meli-blue/20 flex items-center justify-center shrink-0 text-meli-blue font-bold text-xs">4</div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 text-white">Conexiones</h4>
                    <p className="text-xs text-gray-400">Nombra servicios o plataformas externas (ej: Stripe, GitHub, Slack, RRSS).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-8">
            <p className="text-xs text-gray-400 italic">
              "Ejemplo: Quiero lanzar una campaña de marketing digital para una marca de ropa orgánica, usando Meta Ads y Shopify, con el objetivo de aumentar las ventas en un 20% este trimestre."
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Roadmap generado en segundos',
              'Agentes listos para ejecutar',
              'Control total de costos',
              'Evolución de carrera real'
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-meli-blue" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <footer className="mt-20 text-center border-t border-meli-border pt-10">
        <p className="text-meli-muted text-sm italic">
          "Este manual evoluciona con nosotros. A medida que Launch Quest gane nuevas capacidades, verás nuevas secciones aquí."
        </p>
      </footer>
    </div>
  );
}
