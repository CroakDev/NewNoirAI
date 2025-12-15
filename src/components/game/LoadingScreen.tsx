import { RainEffect } from './RainEffect';
import { GenerationProgress } from '@/services/aiGeneration';
import { Search, FileText, Users, Lightbulb } from 'lucide-react';

interface LoadingScreenProps {
  progress: GenerationProgress;
}

const loadingStages = [
  { icon: FileText, label: 'Criando crime...' },
  { icon: Users, label: 'Gerando personagens...' },
  { icon: Lightbulb, label: 'Plantando pistas...' },
  { icon: Search, label: 'Finalizando investigação...' },
];

export function LoadingScreen({ progress }: LoadingScreenProps) {
  const currentStage = Math.floor((progress.progress / 100) * loadingStages.length);

  return (
    <div className="min-h-screen bg-noir-deep relative flex items-center justify-center">
      <RainEffect />
      
      <div className="fixed inset-0 bg-gradient-vignette pointer-events-none z-10" />
      <div className="film-grain fixed inset-0 pointer-events-none z-10" />
      
      <div className="relative z-20 text-center px-4 max-w-md">
        {/* Magnifying glass animation */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-20 h-20 text-noir-amber animate-pulse" />
          </div>
          <div className="absolute inset-0 border-4 border-noir-amber/30 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-4 border-2 border-noir-amber/20 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-noir-charcoal rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-noir-amber to-primary transition-all duration-500 ease-out"
            style={{ width: `${progress.progress}%` }}
          />
        </div>
        
        {/* Status message */}
        <p className="font-typewriter text-lg text-foreground mb-6">
          {progress.message}
        </p>
        
        {/* Stage indicators */}
        <div className="flex justify-center gap-6 mb-8">
          {loadingStages.map((stage, index) => {
            const Icon = stage.icon;
            const isActive = index <= currentStage;
            const isCurrent = index === currentStage;
            
            return (
              <div 
                key={index}
                className={`flex flex-col items-center transition-all duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-30'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  isCurrent ? 'bg-noir-amber/20 animate-pulse' : ''
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isActive ? 'text-noir-amber' : 'text-muted-foreground'
                  }`} />
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Flavor text */}
        <p className="font-body text-sm text-muted-foreground italic">
          "Todo crime deixa rastros..."
        </p>
      </div>
    </div>
  );
}
