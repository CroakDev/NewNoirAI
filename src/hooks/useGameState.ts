import { useState, useCallback, useMemo } from 'react';
import { GameState, Scene, Choice, Investigation } from '@/types/game';

const initialGameState: GameState = {
  currentScene: '',
  discoveredClues: [],
  interrogatedCharacters: [],
  choicesMade: [],
  suspicionLevels: {},
  gamePhase: 'intro',
};

export function useGameState(investigation: Investigation) {
  console.log('useGameState: Initializing with investigation', investigation);
  
  // Usar useMemo para garantir que o estado inicial seja definido apenas uma vez
  const initialSceneId = useMemo(() => {
    return investigation.startingSceneId || (investigation.scenes?.[0]?.id || 'scene-intro');
  }, [investigation]);
  
  const [gameState, setGameState] = useState<GameState>(() => ({
    ...initialGameState,
    currentScene: initialSceneId
  }));
  
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
      if (choice.revealsClueId && !prev.discoveredClues.includes(choice.revealsClueId)) {
        newState.discoveredClues = [...prev.discoveredClues, choice.revealsClueId];
        console.log('useGameState: Revealing clue', choice.revealsClueId);
      }
      
      // Update scene - corrigido para usar nextSceneId
      if (choice.nextSceneId) {
        newState.currentScene = choice.nextSceneId;
        console.log('useGameState: Changing scene to', choice.nextSceneId);
      }
      
      // Update game phase based on scene
      if (choice.nextSceneId?.includes('ending')) {
        newState.gamePhase = 'ending';
        if (choice.nextSceneId.includes('correct')) {
          newState.ending = 'correct';
        } else {
          newState.ending = 'incorrect';
        }
      } else if (choice.nextSceneId?.includes('interrogation')) {
        newState.gamePhase = 'accusation';
      } else if (prev.gamePhase === 'intro') {
        newState.gamePhase = 'investigation';
      }
      
      console.log('useGameState: New state after choice', newState);
      return newState;
    });
    
    // Add to narrative history
    if (choice.nextSceneId && investigation.scenes) {
      const scene = investigation.scenes.find(s => s.id === choice.nextSceneId);
      if (scene) {
        setNarrativeHistory(prev => [...prev, scene.narrative]);
      }
    }
  }, [investigation.scenes]);
  
  const canMakeChoice = useCallback((choice: Choice): boolean => {
    if (!choice.requiresClueId) return true;
    return gameState.discoveredClues.includes(choice.requiresClueId);
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
    setGameState({
      ...initialGameState,
      currentScene: initialSceneId
    });
    setNarrativeHistory([]);
  }, [initialSceneId]);
  
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
  
  console.log('useGameState: Returning state', { gameState, narrativeHistory });
  
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