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
  console.log('useGameState: Initializing with investigation', investigation);
  
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [narrativeHistory, setNarrativeHistory] = useState<string[]>([]);
  
  const getCurrentScene = useCallback((): Scene | undefined => {
    if (!investigation.scenes) {
      console.error('useGameState: No scenes in investigation');
      return undefined;
    }
    
    const scene = investigation.scenes.find(s => s.id === gameState.currentScene);
    console.log('useGameState: Current scene', scene);
    return scene;
  }, [investigation.scenes, gameState.currentScene]);
  
  const makeChoice = useCallback((choice: Choice) => {
    console.log('useGameState: Making choice', choice);
    
    setGameState(prev => {
      const newState = { ...prev };
      
      // Add choice to history
      newState.choicesMade = [...prev.choicesMade, choice.id];
      
      // Reveal clue if choice has one
      if (choice.revealsClue && !prev.discoveredClues.includes(choice.revealsClue)) {
        newState.discoveredClues = [...prev.discoveredClues, choice.revealsClue];
      }
      
      // Update scene
      newState.currentScene = choice.leadsTo || prev.currentScene;
      
      // Update game phase based on scene
      if (choice.leadsTo?.includes('ending')) {
        newState.gamePhase = 'ending';
        if (choice.leadsTo.includes('correct')) {
          newState.ending = 'correct';
        } else {
          newState.ending = 'incorrect';
        }
      } else if (choice.leadsTo?.includes('interrogation')) {
        newState.gamePhase = 'accusation';
      } else if (prev.gamePhase === 'intro') {
        newState.gamePhase = 'investigation';
      }
      
      console.log('useGameState: New state after choice', newState);
      return newState;
    });
    
    // Add to narrative history
    if (choice.leadsTo && investigation.scenes) {
      const scene = investigation.scenes.find(s => s.id === choice.leadsTo);
      if (scene) {
        setNarrativeHistory(prev => [...prev, scene.narrative]);
      }
    }
  }, [investigation.scenes]);
  
  const canMakeChoice = useCallback((choice: Choice): boolean => {
    if (!choice.requiresClue) return true;
    return gameState.discoveredClues.includes(choice.requiresClue);
  }, [gameState.discoveredClues]);
  
  const getDiscoveredClues = useCallback(() => {
    if (!investigation.clues) {
      console.warn('useGameState: No clues in investigation');
      return [];
    }
    
    return investigation.clues.filter(clue => 
      gameState.discoveredClues.includes(clue.id)
    );
  }, [investigation.clues, gameState.discoveredClues]);
  
  const resetGame = useCallback(() => {
    console.log('useGameState: Resetting game');
    setGameState(initialGameState);
    setNarrativeHistory([]);
  }, []);
  
  const getProgress = useCallback(() => {
    if (!investigation.clues) {
      console.warn('useGameState: No clues in investigation for progress calculation');
      return 0;
    }
    
    const totalClues = investigation.clues.filter(c => c.isReal).length;
    const foundClues = gameState.discoveredClues.length;
    
    if (totalClues === 0) return 0;
    
    return Math.round((foundClues / totalClues) * 100);
  }, [investigation.clues, gameState.discoveredClues]);
  
  // Set initial scene if it's the intro
  if (gameState.currentScene === 'scene-intro' && investigation.startingSceneId) {
    console.log('useGameState: Setting initial scene to', investigation.startingSceneId);
    setGameState(prev => ({
      ...prev,
      currentScene: investigation.startingSceneId || 'scene-intro'
    }));
  }
  
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