export const calculateLevel = (xp: number) => {
  return Math.floor(xp / 1000) + 1;
};

export const getXPToNextLevel = (xp: number) => {
  const currentLevel = calculateLevel(xp);
  const nextLevelXP = currentLevel * 1000;
  return nextLevelXP - xp;
};

export const getProgressToNextLevel = (xp: number) => {
  const currentLevel = calculateLevel(xp);
  const currentLevelBaseXP = (currentLevel - 1) * 1000;
  const progressInLevel = xp - currentLevelBaseXP;
  return (progressInLevel / 1000) * 100;
};
