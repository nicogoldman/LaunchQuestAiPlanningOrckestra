import { Project } from '../../types';

const STORAGE_KEY = 'launch-quest-projects';

export const saveProject = (project: Project) => {
  const projects = getAllProjects();
  const index = projects.findIndex(p => p.id === project.id);
  
  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.push(project);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const getAllProjects = (): Project[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getProjectById = (id: string): Project | undefined => {
  return getAllProjects().find(p => p.id === id);
};
