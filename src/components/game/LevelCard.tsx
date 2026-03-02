import { Level } from '../../types';
import TaskItem from './TaskItem';
import { ChevronRight, Star, Edit2, Save, X } from 'lucide-react';
import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';

interface LevelCardProps {
  level: Level;
}

export default function LevelCard({ level }: LevelCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLevel, setEditedLevel] = useState({ title: level.title, description: level.description });
  const updateLevel = useGameStore(state => state.updateLevel);

  const completedCount = level.tasks.filter(t => t.completed).length;
  const totalCount = level.tasks.length;
  const isCompleted = completedCount === totalCount;

  const handleSave = () => {
    updateLevel(level.id, editedLevel);
    setIsEditing(false);
  };

  return (
    <div className={`meli-card flex flex-col h-full transition-all hover:shadow-md ${isCompleted ? 'border-meli-green' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 flex-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${isCompleted ? 'bg-meli-green text-white' : 'bg-meli-blue text-white'}`}>
            {level.id}
          </div>
          {isEditing ? (
            <input 
              className="font-bold text-meli-text border-b border-meli-blue/30 outline-none w-full bg-transparent"
              value={editedLevel.title}
              onChange={(e) => setEditedLevel({ ...editedLevel, title: e.target.value })}
            />
          ) : (
            <h3 className="font-bold text-meli-text line-clamp-1">{level.title}</h3>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="text-meli-muted hover:text-meli-blue p-1"
          >
            {isEditing ? <X className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
          </button>
          <div className="flex items-center gap-1 text-meli-muted text-xs font-bold">
            <Star className="w-3 h-3 text-meli-yellow fill-meli-yellow" />
            {level.xp} XP
          </div>
        </div>
      </div>
      
      {isEditing ? (
        <textarea 
          className="text-sm text-meli-muted mb-4 h-20 border border-meli-border rounded p-2 outline-none resize-none"
          value={editedLevel.description}
          onChange={(e) => setEditedLevel({ ...editedLevel, description: e.target.value })}
        />
      ) : (
        <p className="text-sm text-meli-muted mb-4 line-clamp-2">{level.description}</p>
      )}

      {isEditing && (
        <button 
          onClick={handleSave}
          className="mb-4 meli-button-primary py-1.5 text-xs flex items-center justify-center gap-2"
        >
          <Save className="w-3.5 h-3.5" />
          Guardar Nivel
        </button>
      )}
      
      <div className="flex-1 space-y-2">
        {level.tasks.map(task => (
          <TaskItem key={task.id} task={task} levelId={level.id} />
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-meli-border flex justify-between items-center">
        <div className="text-xs font-bold text-meli-muted">
          {completedCount}/{totalCount} Tareas
        </div>
        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${isCompleted ? 'bg-meli-green' : 'bg-meli-blue'}`}
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
