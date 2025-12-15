import { useState } from 'react';
import { sampleInvestigation } from '@/data/sampleInvestigation';
import { useGameState } from '@/hooks/useGameState';
import { RainEffect } from './game/RainEffect';
import { NarrativeBox } from './game/NarrativeBox';
import { ChoiceButton } from './game/ChoiceButton';
import { ClueLog, ClueToggleButton } from './game/ClueLog';
import { CharacterPortrait } from './game/CharacterPortrait';
import { GameHeader } from './game/GameHeader';
import { EndingScreen } from './game/EndingScreen';

interface GameScreenProps {
  onMainMenu: () => void;
}

export function GameScreen({ onMainMenu }: GameScreenProps) {
  const [isClueLogOpen, setIsClueLogOpen] = useState(false);
  
  const {
    gameState,
    getCurrentScene,
    makeChoice,
    canMakeChoice,
    getDiscoveredClues,
    resetGame,
    getProgress,
  } = useGameState(sampleInvestigation);

  const currentScene = getCurrentScene();
  const discoveredClues = getDiscoveredClues();
  const progress = getProgress();

  if (!currentScene) return null;

  // Get characters in current scene
  const sceneCharacters = sampleInvestigation.characters.filter(
    char => currentScene.characters.includes(char.id)
  );

  const handleRestart = () => {
    resetGame();
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
          crime={sampleInvestigation.crime}
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
                <CharacterPortrait character={char} size="md" />
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
