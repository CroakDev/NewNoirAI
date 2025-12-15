"use client";

import { useState, useEffect } from 'react';
import { StartScreen } from '@/components/StartScreen';
import { GameScreen } from '@/components/GameScreen';
import { LoadingScreen } from '@/components/game/LoadingScreen';
import { DetectiveProfile } from '@/components/DetectiveProfile';
import { useAIGeneration } from '@/hooks/useAIGeneration';
import { useDetectiveProfile } from '@/hooks/useDetectiveProfile';
import { NarrativeTone } from '@/services/aiGeneration';
import { toast } from 'sonner';

type GameView = 'start' | 'loading' | 'game' | 'profile';

const Index = () => {
  const [currentView, setCurrentView] = useState<GameView>('start');
  const { 
    investigation, 
    progress, 
    characterImages, 
    generateNewCase, 
    reset, 
    isLoading, 
    hasError 
  } = useAIGeneration();
  
  const { 
    profile, 
    completedCases, 
    updateProfile, 
    resetProfile 
  } = useDetectiveProfile();

  useEffect(() => {
    console.log('Index: useEffect hasError triggered', { hasError, progress });
    if (hasError) {
      console.error("Index: Error in AI generation", progress.message);
      toast.error("Erro na Geração da IA", {
        description: progress.message || "Não foi possível gerar o caso. Tente novamente.",
      });
      setCurrentView('start'); // Go back to start screen on error
    }
  }, [hasError, progress.message]);

  useEffect(() => {
    console.log('Index: useEffect investigation triggered', { investigation, currentView });
    // When generation is complete and we have an investigation, transition to game view
    if (investigation && currentView === 'loading') {
      console.log('Index: Transitioning to game view');
      setCurrentView('game');
    }
  }, [investigation, currentView]);

  const handleStartGame = async (tone: NarrativeTone) => {
    console.log('Index: Starting game with tone', tone);
    setCurrentView('loading');
    try {
      await generateNewCase(tone);
    } catch (error) {
      console.error("Index: Failed to generate new case:", error);
      // Error toast is handled by useEffect
    }
  };

  const handleRestartGame = async () => {
    console.log('Index: Restarting game');
    setCurrentView('loading');
    try {
      reset(); // Clear previous state
      await generateNewCase('noir'); // Default to noir for restart, or add tone selection
    } catch (error) {
      console.error("Index: Failed to restart game:", error);
    }
  };

  const handleMainMenu = () => {
    console.log('Index: Returning to main menu');
    reset();
    setCurrentView('start');
  };

  const handleProfile = () => {
    setCurrentView('profile');
  };

  const handleBackToMenu = () => {
    setCurrentView('start');
  };

  const handleResetProfile = () => {
    resetProfile();
    toast.success("Perfil Resetado", {
      description: "Seu perfil foi resetado com sucesso."
    });
  };

  console.log('Index: Rendering', { currentView, isLoading, investigation });

  if (currentView === 'loading' || isLoading) {
    console.log('Index: Showing loading screen');
    return <LoadingScreen progress={progress} />;
  }

  return (
    <>
      {currentView === 'start' && (
        <StartScreen 
          onStartGame={handleStartGame} 
          onProfile={handleProfile}
          profile={profile}
        />
      )}
      
      {currentView === 'game' && investigation && (
        <div key="game-screen">
          <GameScreen 
            investigation={investigation} 
            characterImages={characterImages} 
            onMainMenu={handleMainMenu} 
            onRestartGame={handleRestartGame}
            onProfile={handleProfile}
          />
        </div>
      )}
      
      {currentView === 'game' && !investigation && (
        <div className="min-h-screen bg-red-500 flex items-center justify-center">
          <div className="text-white text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Erro: Investigação não encontrada</h1>
            <p className="mb-4">Houve um problema ao carregar o caso. Retornando ao menu principal.</p>
            <button 
              onClick={handleMainMenu} 
              className="px-4 py-2 bg-white text-red-500 rounded font-bold"
            >
              Voltar ao Menu
            </button>
          </div>
        </div>
      )}
      
      {currentView === 'profile' && profile && (
        <DetectiveProfile
          profile={profile}
          completedCases={completedCases}
          onUpdateProfile={updateProfile}
          onResetProfile={handleResetProfile}
          onBack={handleBackToMenu}
        />
      )}
    </>
  );
};

export default Index;