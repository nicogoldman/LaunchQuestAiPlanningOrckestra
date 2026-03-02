import { Level } from '../../types';
import { CheckCircle, Clock, Coins, Zap } from 'lucide-react';

interface StatsGridProps {
  totalTasks: number;
  completedTasks: number;
  levels: Level[];
}

export default function StatsGrid({ totalTasks, completedTasks, levels }: StatsGridProps) {
  const totalEstimatedCost = levels.reduce(
    (acc, level) => acc + level.tasks.reduce((tAcc, task) => tAcc + task.estimatedCostAI, 0),
    0
  );
  
  const totalEstimatedTokens = levels.reduce(
    (acc, level) => acc + level.tasks.reduce((tAcc, task) => tAcc + task.estimatedTokens, 0),
    0
  );

  const aiDelegation = Math.round(
    (levels.reduce(
      (acc, level) => acc + level.tasks.filter(t => t.aiType === 'ai' || t.aiType === 'hybrid').length,
      0
    ) / totalTasks) * 100
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="meli-card flex items-center gap-4">
        <div className="bg-green-100 p-3 rounded-full">
          <CheckCircle className="text-meli-green w-6 h-6" />
        </div>
        <div>
          <div className="text-xs text-meli-muted font-bold uppercase">Tareas</div>
          <div className="text-xl font-bold">{completedTasks} / {totalTasks}</div>
        </div>
      </div>

      <div className="meli-card flex items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <Zap className="text-meli-blue w-6 h-6" />
        </div>
        <div>
          <div className="text-xs text-meli-muted font-bold uppercase">Delegación IA</div>
          <div className="text-xl font-bold">{aiDelegation}%</div>
        </div>
      </div>

      <div className="meli-card flex items-center gap-4">
        <div className="bg-yellow-100 p-3 rounded-full">
          <Coins className="text-meli-yellow fill-meli-yellow w-6 h-6" />
        </div>
        <div>
          <div className="text-xs text-meli-muted font-bold uppercase">Costo Est.</div>
          <div className="text-xl font-bold">${totalEstimatedCost.toLocaleString()}</div>
        </div>
      </div>

      <div className="meli-card flex items-center gap-4">
        <div className="bg-purple-100 p-3 rounded-full">
          <Clock className="text-purple-600 w-6 h-6" />
        </div>
        <div>
          <div className="text-xs text-meli-muted font-bold uppercase">Tokens Est.</div>
          <div className="text-xl font-bold">{(totalEstimatedTokens / 1000).toFixed(1)}k</div>
        </div>
      </div>
    </div>
  );
}
