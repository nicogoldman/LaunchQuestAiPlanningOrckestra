import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Project, Task, Skill, Tool } from '../types';

interface GameStore extends GameState {
  setProject: (project: Project) => void;
  createProject: (project: Project) => void;
  switchProject: (projectId: string) => void;
  deleteProject: (projectId: string) => void;
  cloneProject: (projectId: string) => void;
  updateContext: (context: string) => void;
  completeTask: (levelId: number, taskId: string, actualTokens?: number) => void;
  updateTask: (levelId: number, taskId: string, updates: Partial<Task>) => void;
  updateLevel: (levelId: number, updates: Partial<Project['levels'][0]>) => void;
  updateXP: (amount: number) => void;
  breakDownTask: (levelId: number, taskId: string, subTasks: Task[]) => void;
  setApiKey: (provider: keyof GameState['apiKeys'], key: string) => void;
  updateSettings: (settings: Partial<GameState['settings']>) => void;
  addTokenRecord: (estimated: number, actual: number, taskId?: string, taskTitle?: string) => void;
  addSkill: (skill: Skill) => void;
  toggleTool: (toolId: string) => void;
  updateIntegration: (toolId: string, updates: Partial<Tool>) => void;
}

const inferSkillFromTask = (task: Task): string => {
  const title = task.title.toLowerCase();
  if (title.includes('ui') || title.includes('ux') || title.includes('diseño')) return 'UI/UX Design';
  if (title.includes('api') || title.includes('backend') || title.includes('servidor')) return 'Backend Dev';
  if (title.includes('frontend') || title.includes('react') || title.includes('web')) return 'Frontend Dev';
  if (title.includes('legal') || title.includes('compliance')) return 'Legal & Compliance';
  if (title.includes('marketing') || title.includes('growth')) return 'Marketing';
  if (title.includes('finance') || title.includes('pago')) return 'Finance';
  return 'General Engineering';
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      projects: [],
      currentProjectId: null,
      currentProject: null,
      userXP: 0,
      userLevel: 1,
      skills: [],
      apiKeys: {},
      integrations: [
        { id: 'slack', name: 'Slack', provider: 'Slack', connected: false, category: 'Communication', authType: 'oauth2', description: 'Envía notificaciones y reportes a canales.', capabilities: ['Notificaciones', 'Reportes'] },
        { id: 'github', name: 'GitHub', provider: 'GitHub', connected: false, category: 'Development', authType: 'oauth2', description: 'Crea repositorios y gestiona issues.', capabilities: ['Repo Management', 'Issue Tracking'] },
        { id: 'linear', name: 'Linear', provider: 'Linear', connected: false, category: 'Project Management', authType: 'oauth2', description: 'Sincroniza tareas y sprints.', capabilities: ['Task Sync', 'Sprint Management'] },
        { id: 'stripe', name: 'Stripe', provider: 'Stripe', connected: false, category: 'Finance', authType: 'apiKey', description: 'Monitorea ingresos y pagos.', capabilities: ['Revenue Tracking', 'Payment Alerts'] },
        { id: 'mailchimp', name: 'Mailchimp', provider: 'Mailchimp', connected: false, category: 'Marketing', authType: 'apiKey', description: 'Automatiza campañas de email.', capabilities: ['Email Automation', 'Audience Sync'] },
      ],
      settings: {
        preferredModel: 'gemini-3-flash-preview',
        currency: 'ARS',
      },
      tokenHistory: [],

      setProject: (project) => set((state) => {
        const existingIndex = state.projects.findIndex(p => p.id === project.id);
        let newProjects = [...state.projects];
        if (existingIndex !== -1) {
          newProjects[existingIndex] = project;
        } else {
          newProjects.push(project);
        }
        return { 
          projects: newProjects,
          currentProjectId: project.id,
          currentProject: project 
        };
      }),

      createProject: (project) => set((state) => ({
        projects: [...state.projects, project],
        currentProjectId: project.id,
        currentProject: project
      })),

      switchProject: (projectId) => set((state) => {
        const project = state.projects.find(p => p.id === projectId) || null;
        return { 
          currentProjectId: projectId,
          currentProject: project
        };
      }),

      deleteProject: (projectId) => set((state) => {
        const newProjects = state.projects.filter(p => p.id !== projectId);
        const isCurrent = state.currentProjectId === projectId;
        return {
          projects: newProjects,
          currentProjectId: isCurrent ? (newProjects[0]?.id || null) : state.currentProjectId,
          currentProject: isCurrent ? (newProjects[0] || null) : state.currentProject
        };
      }),

      cloneProject: (projectId) => set((state) => {
        const projectToClone = state.projects.find(p => p.id === projectId);
        if (!projectToClone) return state;

        const clonedProject: Project = {
          ...projectToClone,
          id: Math.random().toString(36).substr(2, 9),
          name: `${projectToClone.name} (Copia)`,
          createdAt: new Date().toISOString()
        };

        return {
          projects: [...state.projects, clonedProject],
          currentProjectId: clonedProject.id,
          currentProject: clonedProject
        };
      }),

      updateContext: (context) => set((state) => ({
        currentProject: state.currentProject ? { ...state.currentProject, context } : null
      })),

      completeTask: (levelId, taskId, actualTokens) =>
        set((state) => {
          if (!state.currentProject) return state;

          const newLevels = state.currentProject.levels.map((level) => {
            if (level.id !== levelId) return level;

            const newTasks = level.tasks.map((task) => {
              if (task.id !== taskId) return task;
              if (task.completed) return task;

              return { ...task, completed: true, actualTokens };
            });

            return { ...level, tasks: newTasks };
          });

          const task = state.currentProject.levels
            .find((l) => l.id === levelId)
            ?.tasks.find((t) => t.id === taskId);

          const xpGain = task?.xp || 0;
          const newUserXP = state.userXP + xpGain;
          const newUserLevel = Math.floor(newUserXP / 1000) + 1;

          // Skill gain logic
          let newSkills = [...state.skills];
          if (task) {
            const skillName = inferSkillFromTask(task);
            const existingSkillIndex = newSkills.findIndex(s => s.name === skillName);
            if (existingSkillIndex !== -1) {
              const updatedSkill = { ...newSkills[existingSkillIndex] };
              updatedSkill.xp += xpGain;
              updatedSkill.level = Math.floor(updatedSkill.xp / 500) + 1;
              newSkills[existingSkillIndex] = updatedSkill;
            } else {
              newSkills.push({
                id: Math.random().toString(36).substr(2, 9),
                name: skillName,
                xp: xpGain,
                level: 1
              });
            }
          }

          return {
            currentProject: { ...state.currentProject, levels: newLevels },
            userXP: newUserXP,
            userLevel: newUserLevel,
            skills: newSkills,
          };
        }),

      updateTask: (levelId, taskId, updates) =>
        set((state) => {
          if (!state.currentProject) return state;

          const newLevels = state.currentProject.levels.map((level) => {
            if (level.id !== levelId) return level;

            const newTasks = level.tasks.map((task) => {
              if (task.id !== taskId) return task;
              return { ...task, ...updates };
            });

            return { ...level, tasks: newTasks };
          });

          return {
            currentProject: { ...state.currentProject, levels: newLevels },
          };
        }),

      updateLevel: (levelId, updates) =>
        set((state) => {
          if (!state.currentProject) return state;

          const newLevels = state.currentProject.levels.map((level) => {
            if (level.id !== levelId) return level;
            return { ...level, ...updates };
          });

          return {
            currentProject: { ...state.currentProject, levels: newLevels },
          };
        }),

      breakDownTask: (levelId, taskId, subTasks) =>
        set((state) => {
          if (!state.currentProject) return state;

          const updateTaskRecursively = (tasks: Task[]): Task[] => {
            return tasks.map(task => {
              if (task.id === taskId) {
                return { ...task, subTasks };
              }
              if (task.subTasks) {
                return { ...task, subTasks: updateTaskRecursively(task.subTasks) };
              }
              return task;
            });
          };

          const newLevels = state.currentProject.levels.map((level) => {
            if (level.id !== levelId) return level;
            return { ...level, tasks: updateTaskRecursively(level.tasks) };
          });

          return {
            currentProject: { ...state.currentProject, levels: newLevels },
          };
        }),

      updateXP: (amount) =>
        set((state) => {
          const newUserXP = state.userXP + amount;
          const newUserLevel = Math.floor(newUserXP / 1000) + 1;
          return { userXP: newUserXP, userLevel: newUserLevel };
        }),

      setApiKey: (provider, key) =>
        set((state) => ({
          apiKeys: { ...state.apiKeys, [provider]: key },
        })),

      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),

      addTokenRecord: (estimated, actual, taskId, taskTitle) =>
        set((state) => {
          const precision = estimated > 0 ? (1 - Math.abs(estimated - actual) / estimated) * 100 : 100;
          const newRecord = {
            date: new Date().toISOString(),
            estimated,
            actual,
            precision: Math.max(0, precision),
            taskId,
            taskTitle,
          };
          return {
            tokenHistory: [newRecord, ...state.tokenHistory].slice(0, 50),
          };
        }),

      addSkill: (skill) => set((state) => ({
        skills: [...state.skills, skill]
      })),

      toggleTool: (toolId) => set((state) => {
        if (!state.currentProject) return state;
        const tools = state.currentProject.tools || [];
        const newTools = tools.map(t => t.id === toolId ? { ...t, connected: !t.connected } : t);
        return {
          currentProject: { ...state.currentProject, tools: newTools }
        };
      }),

      updateIntegration: (toolId, updates) => set((state) => ({
        integrations: state.integrations.map(t => t.id === toolId ? { ...t, ...updates } : t)
      })),
    }),
    {
      name: 'launch-quest-storage',
    }
  )
);
