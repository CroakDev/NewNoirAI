import { useState, useCallback, useEffect } from 'react';
import { Investigation, Character } from '@/types/game';
import { generateCase, generateCharacterImage, clearImageCache, NarrativeTone, GenerationProgress } from '@/services/aiGeneration';

export function useAIGeneration() {
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [progress, setProgress] = useState<GenerationProgress>({
    stage: 'idle',
    message: '',
    progress: 0,
  });
  const [characterImages, setCharacterImages] = useState<Map<string, string>>(new Map());

  const generateNewCase = useCallback(async (tone: NarrativeTone = 'noir') => {
    console.log('useAIGeneration: Starting case generation with tone', tone);
    
    setProgress({
      stage: 'generating-case',
      message: 'Preparando investigação...',
      progress: 0,
    });
    
    clearImageCache();
    setCharacterImages(new Map());

    try {
      // Generate the case
      setProgress({
        stage: 'generating-case',
        message: 'Criando crime misterioso...',
        progress: 10,
      });
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProgress({
        stage: 'generating-case',
        message: 'Desenvolvendo enredo...',
        progress: 20,
      });
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('useAIGeneration: Calling generateCase');
      const newInvestigation = await generateCase(tone);
      console.log('useAIGeneration: Case generated', newInvestigation);
      
      if (!newInvestigation) {
        throw new Error('Failed to generate investigation - no data returned');
      }
      
      setProgress({
        stage: 'generating-case',
        message: 'Criando personagens suspeitos...',
        progress: 40,
      });
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProgress({
        stage: 'generating-case',
        message: 'Plantando pistas e evidências...',
        progress: 60,
      });
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProgress({
        stage: 'generating-case',
        message: 'Montando cenas interativas...',
        progress: 80,
      });
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProgress({
        stage: 'generating-case',
        message: 'Finalizando caso...',
        progress: 90,
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProgress({
        stage: 'generating-case',
        message: 'Caso gerado com sucesso!',
        progress: 100,
      });
      
      // Small delay to show completion message
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('useAIGeneration: Setting investigation state');
      setInvestigation(newInvestigation);
      
      setProgress({
        stage: 'complete',
        message: 'Pronto para jogar!',
        progress: 100,
      });
      
      console.log('useAIGeneration: Case generation complete');
      return newInvestigation;
    } catch (error) {
      console.error('useAIGeneration: Error generating case:', error);
      setProgress({
        stage: 'error',
        message: error instanceof Error ? error.message : 'Erro ao gerar caso',
        progress: 0,
      });
      throw error;
    }
  }, []);

  const loadCharacterImage = useCallback(async (character: Character) => {
    if (characterImages.has(character.id)) {
      return characterImages.get(character.id);
    }

    const imagePrompt = (character as any).imagePrompt || `${character.name}, ${character.role}, ${character.description}`;
    const imageUrl = await generateCharacterImage(character.id, imagePrompt);
    
    if (imageUrl) {
      setCharacterImages(prev => new Map(prev).set(character.id, imageUrl));
    }
    
    return imageUrl;
  }, [characterImages]);

  const reset = useCallback(() => {
    console.log('useAIGeneration: Resetting state');
    setInvestigation(null);
    setProgress({
      stage: 'idle',
      message: '',
      progress: 0,
    });
    setCharacterImages(new Map());
    clearImageCache();
  }, []);

  console.log('useAIGeneration: Current state', { investigation, progress });

  return {
    investigation,
    progress,
    characterImages,
    generateNewCase,
    loadCharacterImage,
    reset,
    isLoading: progress.stage === 'generating-case' || progress.stage === 'generating-images',
    hasError: progress.stage === 'error',
  };
}