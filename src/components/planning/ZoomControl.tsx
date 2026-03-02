import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface ZoomControlProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export default function ZoomControl({ onZoomIn, onZoomOut, onReset }: ZoomControlProps) {
  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-2 z-40">
      <button 
        onClick={onZoomIn}
        className="meli-card p-3 hover:bg-gray-50 shadow-lg transition-transform active:scale-95"
        title="Acercar"
      >
        <ZoomIn className="w-5 h-5 text-meli-text" />
      </button>
      <button 
        onClick={onZoomOut}
        className="meli-card p-3 hover:bg-gray-50 shadow-lg transition-transform active:scale-95"
        title="Alejar"
      >
        <ZoomOut className="w-5 h-5 text-meli-text" />
      </button>
      <button 
        onClick={onReset}
        className="meli-card p-3 hover:bg-gray-50 shadow-lg transition-transform active:scale-95"
        title="Restablecer"
      >
        <Maximize className="w-5 h-5 text-meli-text" />
      </button>
    </div>
  );
}
