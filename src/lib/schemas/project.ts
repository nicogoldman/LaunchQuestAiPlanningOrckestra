import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  detail: z.string(),
  aiType: z.enum(['ai', 'human', 'hybrid']),
  estimatedTokens: z.number(),
  estimatedCostAI: z.number(),
  estimatedTimeAI: z.string(),
  estimatedTimeHuman: z.string(),
  costHuman: z.number(),
  xp: z.number(),
  completed: z.boolean(),
});

export const LevelSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  xp: z.number(),
  tasks: z.array(TaskSchema),
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  levels: z.array(LevelSchema),
  createdAt: z.string(),
});
