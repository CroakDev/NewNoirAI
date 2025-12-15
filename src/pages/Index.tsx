import { useState } from 'react';
import { StartScreen } from '@/components/StartScreen';
import { GameScreen } from '@/components/GameScreen';

type GameView = 'start' | 'game';

const Index = () => {
  const [currentView, setCurrentView] = useState<GameView>('start');

  return (
    <>
      {currentView === 'start' && (
        <StartScreen onStartGame={() => setCurrentView('game')} />
      )}
      {currentView === 'game' && (
        <GameScreen onMainMenu={() => setCurrentView('start')} />
      )}
    </>
  );
};

export default Index;
