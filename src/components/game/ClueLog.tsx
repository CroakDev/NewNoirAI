import { Clue } from '@/types/game';
import { Search, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

interface ClueLogProps {
  clues: Clue[];
  isOpen: boolean;
  onToggle: () => void;
}

export function ClueLog({ clues, isOpen, onToggle }: ClueLogProps) {
  return (
    <div className={`
      fixed right-0 top-0 h-full w-80 bg-noir-deep/95 backdrop-blur-sm
      border-l border-border transition-transform duration-500 z-40
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
    `}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-primary flex items-center gap-2">
            <Search className="w-5 h-5" />
            Pistas Coletadas
          </h2>
          <button 
            onClick={onToggle}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>
        
        {clues.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-body">Nenhuma pista encontrada ainda.</p>
            <p className="text-sm mt-2">Investigue a cena do crime para encontrar evidências.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {clues.map((clue, index) => (
              <div
                key={clue.id}
                className="noir-card p-4 rounded-lg fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    ${clue.isReal ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}
                  `}>
                    {clue.isReal ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm text-foreground truncate">
                      {clue.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-body mt-1 line-clamp-2">
                      {clue.description}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-noir-amber">
                      <MapPin className="w-3 h-3" />
                      <span>{clue.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-noir-deep to-transparent pointer-events-none" />
    </div>
  );
}

export function ClueToggleButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-30 btn-noir p-3 rounded-full shadow-noir"
    >
      <Search className="w-5 h-5 text-noir-amber" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">
          {count}
        </span>
      )}
    </button>
  );
}
