import { GameState, Crime } from '@/types/game';
import { Briefcase, Target, MapPin } from 'lucide-react';

interface GameHeaderProps {
  crime: Crime;
  gameState: GameState;
  progress: number;
}

export function GameHeader({ crime, gameState, progress }: GameHeaderProps) {
  const getPhaseLabel = () => {
    switch (gameState.gamePhase) {
      case 'intro': return 'Introdução';
      case 'investigation': return 'Investigação';
      case 'accusation': return 'Acusação';
      case 'ending': 
        return gameState.ending === 'correct' 
          ? 'Caso Resolvido' 
          : gameState.ending === 'incorrect'
          ? 'Caso Falhou'
          : 'Investigação Finalizada';
      default: return 'Em andamento';
    }
  };

  const getPhaseColor = () => {
    switch (gameState.gamePhase) {
      case 'ending':
        return gameState.ending === 'correct' 
          ? 'text-green-400' 
          : 'text-destructive';
      default:
        return 'text-noir-amber';
    }
  };

  return (
    <header className="noir-card rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-noir-amber mb-1">
            <Briefcase className="w-4 h-4" />
            <span className="text-xs font-typewriter uppercase tracking-wider">
              {crime.type}
            </span>
          </div>
          <h1 className="font-display text-xl md:text-2xl text-foreground">
            {crime.title}
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
              <MapPin className="w-3 h-3" />
              <span>Local</span>
            </div>
            <p className="font-typewriter text-sm text-foreground">{crime.location}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
              <Target className="w-3 h-3" />
              <span>Fase</span>
            </div>
            <p className={`font-typewriter text-sm ${getPhaseColor()}`}>
              {getPhaseLabel()}
            </p>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Progresso da Investigação</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1 bg-noir-shadow rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-amber transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </header>
  );
}