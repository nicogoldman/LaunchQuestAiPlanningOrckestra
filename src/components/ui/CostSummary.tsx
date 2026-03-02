import { Coins, TrendingUp, AlertCircle } from 'lucide-react';

interface CostSummaryProps {
  estimated: number;
  actual?: number;
  currency: string;
}

export default function CostSummary({ estimated, actual, currency }: CostSummaryProps) {
  const diff = actual ? actual - estimated : 0;
  const isOver = diff > 0;

  return (
    <div className="meli-card bg-gray-50 border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Coins className="text-meli-blue w-5 h-5" />
        <h3 className="font-bold">Resumen de Costos</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-meli-muted">Estimado:</span>
          <span className="font-bold">{currency} {estimated.toLocaleString()}</span>
        </div>
        
        {actual !== undefined && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-meli-muted">Real:</span>
              <span className="font-bold">{currency} {actual.toLocaleString()}</span>
            </div>
            
            <div className="pt-2 border-t border-meli-border flex justify-between items-center">
              <span className="text-xs font-bold uppercase">Desviación</span>
              <div className={`flex items-center gap-1 text-sm font-bold ${isOver ? 'text-red-500' : 'text-meli-green'}`}>
                {isOver ? <AlertCircle className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                {isOver ? '+' : ''}{diff.toLocaleString()} {currency}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
