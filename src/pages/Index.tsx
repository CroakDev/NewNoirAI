"use client";
import { useState, useEffect } from 'react';
import { StartScreen } from '@/components/StartScreen';
import { GameScreen } from '@/components/GameScreen';
import { LoadingScreen } from '@/components/game/LoadingScreen';
import { useAIGeneration } from '@/hooks/useAIGeneration';
import { NarrativeTone } from '@/services/aiGeneration';
import { toast } from 'sonner';

type GameView = 'start' | 'loading' | 'game';

const Index = () => {
  const [currentView, setCurrentView] = useState<GameView>('start');
  const { investigation, progress, characterImages, generateNewCase, reset, isLoading, hasError } = useAIGeneration();

  useEffect(() => {
    if (hasError) {
      toast.error("Erro na Geração da IA", {
        description: progress.message || "Não foi possível gerar o caso. Tente novamente.",
      });
      setCurrentView('start'); // Go back to start screen on error
    }
  }, [hasError, progress.message]);

  useEffect(() => {
    // When generation is complete and we have an investigation, transition to game view
    if (investigation && currentView === 'loading') {
      setCurrentView('game');
    }
  }, [investigation, currentView]);

  const handleStartGame = async (tone: NarrativeTone) => {
    setCurrentView('loading');
    try {
      await generateNewCase(tone);
    } catch (error) {
      console.error("Failed to generate new case:", error);
      // Error toast is handled by useEffect
    }
  };

  const handleRestartGame = async () => {
    setCurrentView('loading');
    try {
      reset(); // Clear previous state
      await generateNewCase('noir'); // Default to noir for restart, or add tone selection
    } catch (error) {
      console.error("Failed to restart game:", error);
    }
  };

  const handleMainMenu = () => {
    reset();
    setCurrentView('start');
  };

  if (currentView === 'loading' || isLoading) {
    return <LoadingScreen progress={progress} />;
  }

  return (
    <>
      {currentView === 'start' && (
        <StartScreen onStartGame={handleStartGame} />
      )}
      {currentView === 'game' && investigation && (
        <GameScreen 
          investigation={investigation} 
          characterImages={characterImages}
          onMainMenu={handleMainMenu} 
          onRestartGame={handleRestartGame} 
        />
      )}
    </>
  );
};

export default Index;