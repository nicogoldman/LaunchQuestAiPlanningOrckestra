import { useGameStore } from '../stores/gameStore';

export const useGameState = () => {
  const { currentProject, userXP, userLevel, completeTask } = useGameStore();
  
  const totalXP = currentProject?.levels.reduce((acc, l) => acc + l.xp, 0) || 0;
  const progress = currentProject 
    ? (currentProject.levels.reduce((acc, l) => acc + l.tasks.filter(t => t.completed).length, 0) / 
       currentProject.levels.reduce((acc, l) => acc + l.tasks.length, 0)) * 100
    : 0;

  return {
    currentProject,
    userXP,
    userLevel,
    totalXP,
    progress,
    completeTask
  };
};
