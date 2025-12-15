import { GameState } from '@/types/game';
import { Trophy, XCircle, RotateCcw, Home, User, Coins, Clock, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';

interface EndingScreenProps {
  gameState: GameState;
  onRestart: () => void;
  onMainMenu: () => void;
  onProfile: () => void;
}

export function EndingScreen({ gameState, onRestart, onMainMenu, onProfile }: EndingScreenProps) {
  const isCorrect = gameState.ending === 'correct';
  const { isMuted, toggleMute } = useAudio();
  
  // Calcular tempo de jogo (se startTime estiver disponível)
  const timeTaken = gameState.startTime 
    ? Math.floor((Date.now() - gameState.startTime) / 1000) 
    : 0;
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-noir-deep/95 backdrop-blur-sm">
      {/* Audio control */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleMute}
          className="btn-noir p-3 rounded-full"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-noir-amber" />
          ) : (
            <Volume2 className="w-5 h-5 text-noir-amber" />
          )}
        </button>
      </div>
      
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
        
        {/* Stats */}
        <div className="bg-card/30 rounded-lg p-6 mb-8">
          <h3 className="font-display text-sm text-muted-foreground mb-4">Estatísticas do Caso</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 noir-card rounded-lg">
              <div className="flex items-center justify-center gap-2 text-noir-amber mb-1">
                <Coins className="w-4 h-4" />
                <span className="font-display text-lg">${isCorrect ? '100-250' : '0'}</span>
              </div>
              <p className="text-xs text-muted-foreground">Recompensa</p>
            </div>
            
            <div className="text-center p-3 noir-card rounded-lg">
              <div className="flex items-center justify-center gap-2 text-foreground mb-1">
                <Clock className="w-4 h-4" />
                <span className="font-display text-lg">{timeTaken > 0 ? formatTime(timeTaken) : '--'}</span>
              </div>
              <p className="text-xs text-muted-foreground">Tempo</p>
            </div>
            
            <div className="text-center p-3 noir-card rounded-lg">
              <p className="font-display text-lg text-foreground">{gameState.discoveredClues.length}</p>
              <p className="text-xs text-muted-foreground">Pistas Encontradas</p>
            </div>
            
            <div className="text-center p-3 noir-card rounded-lg">
              <p className="font-display text-lg text-foreground">{gameState.choicesMade.length}</p>
              <p className="text-xs text-muted-foreground">Escolhas Feitas</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className="btn-amber px-6 py-3 rounded-lg font-display flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Jogar Novamente
          </button>
          <button
            onClick={onProfile}
            className="btn-noir px-6 py-3 rounded-lg font-display flex items-center justify-center gap-2"
          >
            <User className="w-5 h-5" />
            Meu Perfil
          </button>
          <button
            onClick={onMainMenu}
            className="btn-noir px-6 py-3 rounded-lg font-display flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Menu Principal
          </button>
        </div>
      </div>
    </div>
  );
}