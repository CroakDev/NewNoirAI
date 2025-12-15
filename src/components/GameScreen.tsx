"use client";

import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { RainEffect } from './game/RainEffect';
import { NarrativeBox } from './game/NarrativeBox';
import { ChoiceButton } from './game/ChoiceButton';
import { ClueLog, ClueToggleButton } from './game/ClueLog';
import { CharacterPortrait } from './game/CharacterPortrait';
import { GameHeader } from './game/GameHeader';
import { EndingScreen } from './game/EndingScreen';
import { Investigation } from '@/types/game';
import { generateSFX } from '@/services/aiGeneration';

interface GameScreenProps {
  investigation: Investigation;
  characterImages: Map<string, string>;
  onMainMenu: () => void;
  onRestartGame: () => void;
}

export function GameScreen({ investigation, characterImages, onMainMenu, onRestartGame }: GameScreenProps) {
  console.log('GameScreen: Rendering with investigation', investigation);
  
  const [isClueLogOpen, setIsClueLogOpen] = useState(false);
  const [ambientAudio, setAmbientAudio] = useState<HTMLAudioElement | null>(null);
  
  const { 
    gameState, 
    getCurrentScene, 
    makeChoice, 
    canMakeChoice, 
    getDiscoveredClues, 
    resetGame, 
    getProgress,
  } = useGameState(investigation);
  
  const currentScene = getCurrentScene();
  const discoveredClues = getDiscoveredClues();
  const progress = getProgress();
  
  console.log('GameScreen: Current scene', currentScene);
  console.log('GameScreen: Game state', gameState);

  useEffect(() => {
    // Load ambient SFX
    const loadAmbientSFX = async () => {
      console.log('GameScreen: Loading ambient SFX');
      const audioUrl = await generateSFX('ambient');
      if (audioUrl) {
        console.log('GameScreen: Ambient SFX loaded');
        const audio = new Audio(audioUrl);
        audio.loop = true;
        audio.volume = 0.3; // Adjust volume as needed
        setAmbientAudio(audio);
      } else {
        console.log('GameScreen: No ambient SFX available');
      }
    };

    loadAmbientSFX();

    return () => {
      if (ambientAudio) {
        console.log('GameScreen: Cleaning up audio');
        ambientAudio.pause();
        ambientAudio.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    // Play ambient audio when component mounts and pause when unmount
    if (ambientAudio) {
      console.log('GameScreen: Playing ambient audio');
      ambientAudio.play().catch(e => console.error("Error playing audio:", e));
    }
  }, [ambientAudio]);

  if (!investigation) {
    console.error('GameScreen: No investigation provided');
    return (
      <div className="min-h-screen bg-red-500 flex items-center justify-center">
        <div className="text-white text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Erro: Dados da investigação não encontrados</h1>
          <p className="mb-4">Houve um problema com os dados do caso.</p>
          <button 
            onClick={onMainMenu} 
            className="px-4 py-2 bg-white text-red-500 rounded font-bold"
          >
            Voltar ao Menu
          </button>
        </div>
      </div>
    );
  }

  if (!currentScene) {
    console.error('GameScreen: No current scene found');
    return (
      <div className="min-h-screen bg-red-500 flex items-center justify-center">
        <div className="text-white text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Erro: Cena não encontrada</h1>
          <p className="mb-4">Houve um problema ao carregar a cena do jogo.</p>
          <button 
            onClick={onMainMenu} 
            className="px-4 py-2 bg-white text-red-500 rounded font-bold"
          >
            Voltar ao Menu
          </button>
        </div>
      </div>
    );
  }

  // Get characters in current scene
  const sceneCharacters = investigation.characters.filter(
    char => currentScene.characters.includes(char.id)
  );

  const handleRestart = () => {
    resetGame();
    onRestartGame();
  };

  if (gameState.gamePhase === 'ending') {
    return (
      <EndingScreen 
        gameState={gameState} 
        onRestart={handleRestart} 
        onMainMenu={onMainMenu} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-noir-deep relative">
      <RainEffect />
      
      {/* Vignette */}
      <div className="fixed inset-0 bg-gradient-vignette pointer-events-none z-10" />
      <div className="film-grain fixed inset-0 pointer-events-none z-10" />
      
      {/* Main content */}
      <div className="relative z-20 container mx-auto px-4 py-6 max-w-4xl">
        <GameHeader 
          crime={investigation.crime} 
          gameState={gameState} 
          progress={progress} 
        />
        
        {/* Character portraits */}
        {sceneCharacters.length > 0 && (
          <div className="flex justify-center gap-6 mb-6 flex-wrap">
            {sceneCharacters.map((char, index) => (
              <div 
                key={char.id} 
                className="fade-in" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CharacterPortrait 
                  character={char} 
                  characterImages={characterImages} 
                  size="md" 
                />
              </div>
            ))}
          </div>
        )}
        
        {/* Narrative */}
        <NarrativeBox scene={currentScene} />
        
        {/* Choices */}
        {currentScene.choices.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="font-display text-sm text-muted-foreground mb-4 flex items-center gap-2">
              <span className="w-8 h-px bg-noir-amber/50" />
              O que você faz?
              <span className="flex-1 h-px bg-noir-amber/50" />
            </h3>
            {currentScene.choices.map((choice, index) => (
              <ChoiceButton 
                key={choice.id} 
                choice={choice} 
                canChoose={canMakeChoice(choice)} 
                onClick={() => makeChoice(choice)} 
                index={index} 
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Clue log toggle */}
      <ClueToggleButton 
        count={discoveredClues.length} 
        onClick={() => setIsClueLogOpen(!isClueLogOpen)} 
      />
      
      {/* Clue log panel */}
      <ClueLog 
        clues={discoveredClues} 
        isOpen={isClueLogOpen} 
        onToggle={() => setIsClueLogOpen(false)} 
      />
      
      {/* Back button */}
      <button 
        onClick={onMainMenu} 
        className="fixed top-4 left-4 z-30 btn-noir px-4 py-2 rounded-lg font-typewriter text-sm"
      >
        ← Menu
      </button>
    </div>
  );
}