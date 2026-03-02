import { useGameStore } from '../stores/gameStore';

export const useTokenTracking = () => {
  const { tokenHistory, addTokenRecord } = useGameStore();
  
  const averagePrecision = tokenHistory.length > 0
    ? tokenHistory.reduce((acc, r) => acc + r.precision, 0) / tokenHistory.length
    : 100;

  return {
    tokenHistory,
    addTokenRecord,
    averagePrecision
  };
};
