export type AIType = 'ai' | 'human' | 'hybrid';

export interface AIStep {
  tool: string;
  detail: string;
  prompt: string;
}

export interface HumanStep {
  title: string;
  detail: string;
  checklist: boolean;
}

export interface Task {
  id: string;
  title: string;
  detail: string;
  aiType: AIType;
  estimatedTokens: number;
  estimatedCostAI: number;
  estimatedTimeAI: string;
  estimatedTimeHuman: string;
  costHuman: number;
  xp: number;
  completed: boolean;
  actualTokens?: number;
  aiSteps?: AIStep[];
  humanSteps?: HumanStep[];
  subTasks?: Task[];
}

export interface Level {
  id: number;
  title: string;
  description: string;
  xp: number;
  tasks: Task[];
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  xp: number;
}

export interface Tool {
  id: string;
  name: string;
  provider: string;
  connected: boolean;
  icon?: string;
  description?: string;
  category: 'Communication' | 'Development' | 'Project Management' | 'Marketing' | 'Finance';
  authType: 'apiKey' | 'oauth2' | 'webhook';
  status?: 'active' | 'error' | 'disconnected';
  lastSync?: string;
  capabilities?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  context?: string;
  levels: Level[];
  createdAt: string;
  skills?: Skill[];
  tools?: Tool[];
}

export interface GameState {
  projects: Project[];
  currentProjectId: string | null;
  currentProject: Project | null; // Keep for backward compatibility or as a derived/cached value
  userXP: number;
  userLevel: number;
  skills: Skill[];
  apiKeys: {
    gemini?: string;
    openai?: string;
    anthropic?: string;
    openrouter?: string;
    deepseek?: string;
    alibaba?: string;
  };
  integrations: Tool[];
  settings: {
    preferredModel: string;
    currency: 'ARS' | 'USD';
  };
  tokenHistory: {
    date: string;
    estimated: number;
    actual: number;
    precision: number;
    taskId?: string;
    taskTitle?: string;
  }[];
}
