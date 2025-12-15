import { Choice } from '@/types/game';
import { Lock, ChevronRight } from 'lucide-react';

interface ChoiceButtonProps {
  choice: Choice;
  canChoose: boolean;
  onClick: () => void;
  index: number;
}

export function ChoiceButton({ choice, canChoose, onClick, index }: ChoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={!canChoose}
      className={`group relative w-full text-left p-4 rounded-lg transition-all duration-300 ${
        canChoose 
          ? 'btn-noir hover:translate-x-2 cursor-pointer' 
          : 'bg-muted/30 cursor-not-allowed opacity-50'
      } fade-in`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-noir-amber/20 text-noir-amber flex items-center justify-center text-sm font-display">
          {index + 1}
        </span>
        <div className="flex-1">
          <p className="font-body text-foreground group-hover:text-primary transition-colors">
            {choice.text}
          </p>
          {!canChoose && choice.requiresClueId && (
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span>Requer pista específica</span>
            </div>
          )}
        </div>
        {canChoose && (
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-noir-amber transition-all group-hover:translate-x-1" />
        )}
      </div>
      {canChoose && (
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="absolute inset-0 rounded-lg border border-noir-amber/30" />
        </div>
      )}
    </button>
  );
}