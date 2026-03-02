import { Project } from '../../types';

export const generateProjectPlan = async (description: string, apiKey: string): Promise<Project> => {
  const response = await fetch('/api/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description, apiKey }),
  });
  
  if (!response.ok) throw new Error('Failed to generate plan');
  
  const data = await response.json();
  return data.project;
};
