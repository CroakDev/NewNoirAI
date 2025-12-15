import { supabase } from '@/integrations/supabase/client';
import { Investigation } from '@/types/game';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export type NarrativeTone = 'noir' | 'light' | 'dark';

export interface GenerationProgress {
  stage: 'idle' | 'generating-case' | 'generating-images' | 'complete' | 'error';
  message: string;
  progress: number;
}

// Cache for generated images
const imageCache = new Map<string, string>();

export async function generateCase(tone: NarrativeTone = 'noir'): Promise<Investigation> {
  console.log('aiGeneration: Generating case with tone:', tone);
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-case`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ tone }),
    });

    console.log('aiGeneration: Response received', response.status);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('aiGeneration: Response not OK', response.status, error);
      throw new Error(error.error || 'Failed to generate case');
    }

    const data = await response.json();
    console.log('aiGeneration: Data received', data);

    // Transform to Investigation format
    const investigation: Investigation = {
      crime: data.crime,
      characters: data.characters.map((char: any) => ({
        ...char,
        imageUrl: undefined,
      })),
      clues: data.clues,
      scenes: data.scenes,
      startingSceneId: data.scenes[0]?.id || '',
      culpritId: data.culpritId,
      motiveExplanation: data.motiveExplanation,
    };

    console.log('aiGeneration: Investigation transformed', investigation);
    return investigation;
  } catch (error) {
    console.error('aiGeneration: Error in generateCase', error);
    throw error;
  }
}

export async function generateCharacterImage(characterId: string, imagePrompt: string): Promise<string | null> {
  // Check cache first
  if (imageCache.has(characterId)) {
    return imageCache.get(characterId)!;
  }

  console.log('aiGeneration: Generating image for character:', characterId);
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ 
        prompt: imagePrompt,
        type: 'character'
      }),
    });

    if (!response.ok) {
      console.error('aiGeneration: Image generation failed', response.status);
      return null;
    }

    const data = await response.json();
    if (data.imageUrl) {
      imageCache.set(characterId, data.imageUrl);
      return data.imageUrl;
    }
    return null;
  } catch (error) {
    console.error('aiGeneration: Error generating image:', error);
    return null;
  }
}

export async function generateClueImage(clueId: string, description: string): Promise<string | null> {
  const cacheKey = `clue-${clueId}`;
  
  // Check cache first
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  console.log('aiGeneration: Generating image for clue:', clueId);
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ 
        prompt: `Detective noir clue: ${description}, evidence, mysterious, dramatic lighting`,
        type: 'clue'
      }),
    });

    if (!response.ok) {
      console.error('aiGeneration: Clue image generation failed', response.status);
      return null;
    }

    const data = await response.json();
    if (data.imageUrl) {
      imageCache.set(cacheKey, data.imageUrl);
      return data.imageUrl;
    }
    return null;
  } catch (error) {
    console.error('aiGeneration: Error generating clue image:', error);
    return null;
  }
}

export async function generateSceneImage(sceneId: string, location: string): Promise<string | null> {
  const cacheKey = `scene-${sceneId}`;
  
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  console.log('aiGeneration: Generating scene image:', location);
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ 
        prompt: `Noir detective scene at ${location}, dark atmosphere, rain, neon lights`,
        type: 'scene'
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.imageUrl) {
      imageCache.set(cacheKey, data.imageUrl);
      return data.imageUrl;
    }
    return null;
  } catch (error) {
    console.error('aiGeneration: Error generating scene image:', error);
    return null;
  }
}

export async function generateSFX(type: 'ambient' | 'rain' | 'footsteps' | 'door' | 'tension' | 'discovery'): Promise<string | null> {
  console.log('aiGeneration: Generating SFX:', type);
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-sfx`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ type }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.audioUrl || null;
  } catch (error) {
    console.error('aiGeneration: Error generating SFX:', error);
    return null;
  }
}

export function clearImageCache() {
  imageCache.clear();
}