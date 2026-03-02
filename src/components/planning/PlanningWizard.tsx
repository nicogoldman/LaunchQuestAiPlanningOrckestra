import { Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

interface PlanningWizardProps {
  step: number;
  totalSteps: number;
}

export default function PlanningWizard({ step, totalSteps }: PlanningWizardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
        
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isCompleted = i + 1 < step;
          const isActive = i + 1 === step;
          
          return (
            <div key={i} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                isCompleted ? 'bg-meli-green border-meli-green text-white' :
                isActive ? 'bg-white border-meli-blue text-meli-blue shadow-lg scale-110' :
                'bg-white border-gray-200 text-gray-400'
              }`}>
                {isCompleted ? <CheckCircle className="w-6 h-6" /> : i + 1}
              </div>
              <span className={`absolute -bottom-6 text-[10px] font-bold uppercase whitespace-nowrap ${
                isActive ? 'text-meli-blue' : 'text-meli-muted'
              }`}>
                {getStepLabel(i + 1)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getStepLabel(step: number) {
  switch (step) {
    case 1: return "Visión";
    case 2: return "Análisis";
    case 3: return "Roadmap";
    case 4: return "Agentes";
    default: return "";
  }
}
