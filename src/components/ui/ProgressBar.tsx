interface ProgressBarProps {
  progress: number;
  height?: string;
  color?: string;
}

export default function ProgressBar({ progress, height = "h-3", color = "bg-meli-green" }: ProgressBarProps) {
  return (
    <div className={`w-full ${height} bg-gray-200 rounded-full overflow-hidden`}>
      <div 
        className={`h-full ${color} transition-all duration-1000 ease-out relative`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      >
        <div className="absolute inset-0 bg-white/20 animate-pulse" />
      </div>
    </div>
  );
}
