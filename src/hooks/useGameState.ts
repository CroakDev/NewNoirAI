import { useState, useCallback } from 'react';
import { GameState, Scene, Choice, Investigation } from '@/types/game';

const initialGameState: GameState = {
  currentScene: 'scene-intro',
  discoveredClues: [],
  interrogatedCharacters: [],
  choicesMade: [],
  suspicionLevels: {},
  gamePhase: 'intro',
};

export function useGameState(investigation: Investigation) {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [narrativeHistory, setNarrativeHistory] = useState<string[]>([]);

  const getCurrentScene = useCallback((): Scene | undefined => {
    return investigation.scenes.find(s => s.id === gameState.currentScene);
  }, [investigation.scenes, gameState.currentScene]);

  const makeChoice = useCallback((choice: Choice) => {
    setGameState(prev => {
      const newState = { ...prev };
      
      // Add choice to history
      newState.choicesMade = [...prev.choicesMade, choice.id];
      
      // Reveal clue if choice has one
      if (choice.revealsClue && !prev.discoveredClues.includes(choice.revealsClue)) {
        newState.discoveredClues = [...prev.discoveredClues, choice.revealsClue];
      }
      
      // Update scene
      newState.currentScene = choice.leadsTo;
      
      // Update game phase based on scene
      if (choice.leadsTo.includes('ending')) {
        newState.gamePhase = 'ending';
        if (choice.leadsTo.includes('correct')) {
          newState.ending = 'correct';
        } else {
          newState.ending = 'incorrect';
        }
      } else if (choice.leadsTo.includes('interrogation')) {
        newState.gamePhase = 'accusation';
      } else if (prev.gamePhase === 'intro') {
        newState.gamePhase = 'investigation';
      }
      
      return newState;
    });

    // Add to narrative history
    const scene = investigation.scenes.find(s => s.id === choice.leadsTo);
    if (scene) {
      setNarrativeHistory(prev => [...prev, scene.narrative]);
    }
  }, [investigation.scenes]);

  const canMakeChoice = useCallback((choice: Choice): boolean => {
    if (!choice.requiresClue) return true;
    return gameState.discoveredClues.includes(choice.requiresClue);
  }, [gameState.discoveredClues]);

  const getDiscoveredClues = useCallback(() => {
    return investigation.clues.filter(clue => 
      gameState.discoveredClues.includes(clue.id)
    );
  }, [investigation.clues, gameState.discoveredClues]);

  const resetGame = useCallback(() => {
    setGameState(initialGameState);
    setNarrativeHistory([]);
  }, []);

  const getProgress = useCallback(() => {
    const totalClues = investigation.clues.filter(c => c.isReal).length;
    const foundClues = gameState.discoveredClues.length;
    return Math.round((foundClues / totalClues) * 100);
  }, [investigation.clues, gameState.discoveredClues]);

  return {
    gameState,
    narrativeHistory,
    getCurrentScene,
    makeChoice,
    canMakeChoice,
    getDiscoveredClues,
    resetGame,
    getProgress,
  };
}
