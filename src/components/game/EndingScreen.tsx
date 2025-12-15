import { GameState } from '@/types/game';
import { Trophy, XCircle, RotateCcw, Home } from 'lucide-react';

interface EndingScreenProps {
  gameState: GameState;
  onRestart: () => void;
  onMainMenu: () => void;
}

export function EndingScreen({ gameState, onRestart, onMainMenu }: EndingScreenProps) {
  const isCorrect = gameState.ending === 'correct';
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-noir-deep/95 backdrop-blur-sm">
      <div className="max-w-lg mx-auto text-center p-8">
        <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
          isCorrect 
            ? 'bg-primary/20 text-primary animate-pulse-glow' 
            : 'bg-destructive/20 text-destructive'
        }`}>
          {isCorrect ? (
            <Trophy className="w-12 h-12" />
          ) : (
            <XCircle className="w-12 h-12" />
          )}
        </div>
        
        <h1 className="font-display text-3xl md:text-4xl mb-4">
          {isCorrect ? (
            <span className="text-gradient-amber">Caso Resolvido!</span>
          ) : (
            <span className="text-destructive">Caso Não Resolvido</span>
          )}
        </h1>
        
        <p className="font-body text-lg text-muted-foreground mb-8">
          {isCorrect 
            ? 'Parabéns, detetive! Sua investigação meticulosa levou à captura do verdadeiro culpado. Justiça foi feita.'
            : 'Infelizmente, as evidências não eram suficientes ou a conclusão estava errada. O verdadeiro culpado escapou.'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className="btn-amber px-6 py-3 rounded-lg font-display flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Jogar Novamente
          </button>
          <button
            onClick={onMainMenu}
            className="btn-noir px-6 py-3 rounded-lg font-display flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Menu Principal
          </button>
        </div>
        
        {/* Stats */}
        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="font-display text-sm text-muted-foreground mb-4">Estatísticas</h3>
          <div className="flex justify-center gap-8">
            <div>
              <p className="text-2xl font-display text-noir-amber">{gameState.discoveredClues.length}</p>
              <p className="text-xs text-muted-foreground">Pistas Encontradas</p>
            </div>
            <div>
              <p className="text-2xl font-display text-noir-amber">{gameState.choicesMade.length}</p>
              <p className="text-xs text-muted-foreground">Escolhas Feitas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}