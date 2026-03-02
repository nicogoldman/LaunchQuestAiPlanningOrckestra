import { ReactNode } from 'react';
import { BrowserRouter, Link, useLocation } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { Plus, ChevronDown, Copy, Trash2, BookOpen } from 'lucide-react';
import { useState } from 'react';

function Header() {
  const { currentProject, projects, switchProject, cloneProject, deleteProject } = useGameStore();
  const [showProjects, setShowProjects] = useState(false);
  const location = useLocation();

  return (
    <header className="bg-meli-yellow py-3 px-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="bg-meli-blue p-1.5 rounded-lg">
            <span className="text-white font-bold text-xl">LQ</span>
          </div>
          <h1 className="text-meli-text font-bold text-xl hidden sm:block">Launch Quest AI</h1>
        </Link>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-meli-text font-medium hover:opacity-80 ${location.pathname === '/' ? 'underline underline-offset-4 decoration-meli-blue decoration-2' : ''}`}>Inicio</Link>
            <Link to="/dashboard" className={`text-meli-text font-medium hover:opacity-80 ${location.pathname === '/dashboard' ? 'underline underline-offset-4 decoration-meli-blue decoration-2' : ''}`}>Dashboard</Link>
            <Link to="/instructions" className={`text-meli-text font-medium hover:opacity-80 ${location.pathname === '/instructions' ? 'underline underline-offset-4 decoration-meli-blue decoration-2' : ''}`}>Instrucciones</Link>
            <Link to="/settings" className={`text-meli-text font-medium hover:opacity-80 ${location.pathname === '/settings' ? 'underline underline-offset-4 decoration-meli-blue decoration-2' : ''}`}>Ajustes</Link>
          </nav>

          {projects.length > 0 && (
            <div className="relative">
              <button 
                onClick={() => setShowProjects(!showProjects)}
                className="flex items-center gap-2 bg-white/50 hover:bg-white/80 px-3 py-1.5 rounded-lg border border-meli-border transition-all text-sm font-bold text-meli-text"
              >
                <span className="max-w-[100px] truncate">{currentProject?.name || 'Proyectos'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showProjects ? 'rotate-180' : ''}`} />
              </button>

              {showProjects && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-meli-border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2 border-b border-meli-border bg-gray-50 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-meli-muted uppercase px-2">Mis Misiones</span>
                    <Link 
                      to="/" 
                      onClick={() => setShowProjects(false)}
                      className="p-1 hover:bg-meli-blue/10 text-meli-blue rounded transition-colors"
                      title="Nueva Misión"
                    >
                      <Plus className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {projects.map((p) => (
                      <div key={p.id} className={`group flex items-center justify-between p-2 hover:bg-gray-50 transition-colors ${currentProject?.id === p.id ? 'bg-blue-50' : ''}`}>
                        <button 
                          onClick={() => {
                            switchProject(p.id);
                            setShowProjects(false);
                          }}
                          className="flex-1 text-left px-2 py-1"
                        >
                          <p className="text-sm font-bold text-meli-text truncate">{p.name}</p>
                          <p className="text-[10px] text-meli-muted">{new Date(p.createdAt).toLocaleDateString()}</p>
                        </button>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              cloneProject(p.id);
                            }}
                            className="p-1 hover:bg-gray-200 text-meli-muted rounded"
                            title="Clonar"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('¿Borrar este proyecto?')) deleteProject(p.id);
                            }}
                            className="p-1 hover:bg-red-100 text-red-500 rounded"
                            title="Borrar"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-white border-t border-meli-border py-6 px-4 mt-auto">
          <div className="max-w-7xl mx-auto text-center text-meli-muted text-sm">
            &copy; 2026 Launch Quest AI - Orquestador de Agentes Gamificado
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
