import { useState } from 'react';
import { Task } from '../../types';
import { useGameStore } from '../../stores/gameStore';
import { Bot, User, Zap, CheckCircle2, Circle } from 'lucide-react';
import TaskModal from './TaskModal';

interface TaskItemProps {
  task: Task;
  levelId: number;
}

export default function TaskItem({ task, levelId }: TaskItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const completeTask = useGameStore(state => state.completeTask);

  const getTypeIcon = () => {
    switch (task.aiType) {
      case 'ai': return <Bot className="w-3 h-3 text-meli-blue" />;
      case 'human': return <User className="w-3 h-3 text-orange-500" />;
      case 'hybrid': return <Zap className="w-3 h-3 text-purple-500" />;
    }
  };

  const getTypeLabel = () => {
    switch (task.aiType) {
      case 'ai': return 'AI';
      case 'human': return 'HUMAN';
      case 'hybrid': return 'HYBRID';
    }
  };

  const getTypeColor = () => {
    switch (task.aiType) {
      case 'ai': return 'bg-blue-50 text-meli-blue border-blue-100';
      case 'human': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'hybrid': return 'bg-purple-50 text-purple-600 border-purple-100';
    }
  };

  return (
    <>
      <div 
        className={`flex items-center gap-3 p-2 rounded-md border transition-all cursor-pointer hover:bg-gray-50 ${task.completed ? 'bg-green-50/30 border-meli-green/20' : 'bg-white border-meli-border'}`}
        onClick={() => setIsModalOpen(true)}
      >
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (!task.completed) completeTask(levelId, task.id);
          }}
          className="flex-shrink-0 relative"
        >
          {task.completed ? (
            <div className="relative">
              <CheckCircle2 className="w-5 h-5 text-meli-green" />
              <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-meli-border">
                {getTypeIcon()}
              </div>
            </div>
          ) : (
            <Circle className="w-5 h-5 text-meli-border hover:text-meli-blue" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getTypeColor()}`}>
              {getTypeLabel()}
            </span>
            <span className="text-[10px] font-bold text-meli-muted">
              {task.xp} XP
            </span>
          </div>
          <h4 className={`text-sm font-medium truncate ${task.completed ? 'text-meli-muted line-through' : 'text-meli-text'}`}>
            {task.title}
          </h4>
        </div>
      </div>

      {isModalOpen && (
        <TaskModal 
          task={task} 
          levelId={levelId} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}
