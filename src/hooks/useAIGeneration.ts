import { useState, useCallback } from 'react';
import { Investigation, Character } from '@/types/game';
import { 
  generateCase, 
  generateCharacterImage, 
  clearImageCache,
  NarrativeTone,
  GenerationProgress 
} from '@/services/aiGeneration';

export function useAIGeneration() {
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [progress, setProgress] = useState<GenerationProgress>({
    stage: 'idle',
    message: '',
    progress: 0,
  });
  const [characterImages, setCharacterImages] = useState<Map<string, string>>(new Map());

  const generateNewCase = useCallback(async (tone: NarrativeTone = 'noir') => {
    setProgress({ stage: 'generating-case', message: 'Criando caso criminal...', progress: 10 });
    clearImageCache();
    setCharacterImages(new Map());

    try {
      // Generate the case
      setProgress({ stage: 'generating-case', message: 'A IA está criando seu caso...', progress: 30 });
      const newInvestigation = await generateCase(tone);
      
      setProgress({ stage: 'generating-case', message: 'Caso gerado com sucesso!', progress: 100 });
      setInvestigation(newInvestigation);
      
      setProgress({ stage: 'complete', message: 'Pronto para jogar!', progress: 100 });
      
      return newInvestigation;
    } catch (error) {
      console.error('Error generating case:', error);
      setProgress({ 
        stage: 'error', 
        message: error instanceof Error ? error.message : 'Erro ao gerar caso', 
        progress: 0 
      });
      throw error;
    }
  }, []);

  const loadCharacterImage = useCallback(async (character: Character) => {
    if (characterImages.has(character.id)) {
      return characterImages.get(character.id);
    }

    const imagePrompt = (character as any).imagePrompt || 
      `${character.name}, ${character.role}, ${character.description}`;
    
    const imageUrl = await generateCharacterImage(character.id, imagePrompt);
    
    if (imageUrl) {
      setCharacterImages(prev => new Map(prev).set(character.id, imageUrl));
    }
    
    return imageUrl;
  }, [characterImages]);

  const reset = useCallback(() => {
    setInvestigation(null);
    setProgress({ stage: 'idle', message: '', progress: 0 });
    setCharacterImages(new Map());
    clearImageCache();
  }, []);

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
