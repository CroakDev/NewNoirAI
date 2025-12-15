export interface Character {
  id: string;
  name: string;
  role: 'suspect' | 'witness' | 'victim' | 'detective' | 'informant';
  description: string;
  personality: string;
  secret?: string;
  alibi?: string;
  imageUrl?: string;
  imagePrompt?: string;
  isGuilty?: boolean;
}

export interface Clue {
  id: string;
  name: string;
  description: string;
  type?: 'physical' | 'testimonial' | 'documentary' | 'circumstantial';
  isRedHerring?: boolean;
  relatedCharacterId?: string;
  importance?: 'critical' | 'important' | 'minor';
  location?: string;
  isReal?: boolean;
  discoveredAt?: string;
  imageUrl?: string;
}

export interface Choice {
  id: string;
  text: string;
  nextSceneId?: string;
  consequence?: string;
  leadsTo?: string;
  requiresClueId?: string;
  requiresClue?: string;
  revealsClueId?: string;
  revealsClue?: string;
}

export interface Scene {
  id: string;
  title: string;
  location: string;
  narrative: string;
  characters: string[];
  choices: Choice[];
  mood: 'neutral' | 'tense' | 'mysterious' | 'dramatic' | 'calm' | 'dangerous';
  imageUrl?: string;
  isEnding?: boolean;
  endingType?: 'correct' | 'incorrect' | 'incomplete' | 'partial';
}

export interface Crime {
  id: string;
  type: string;
  title: string;
  victim: string | Character;
  location: string;
  date?: string;
  motive?: string;
  synopsis: string;
}

export interface GameState {
  currentScene: string;
  discoveredClues: string[];
  interrogatedCharacters: string[];
  choicesMade: string[];
  suspicionLevels: Record<string, number>;
  gamePhase: 'intro' | 'investigation' | 'accusation' | 'ending';
  ending?: 'correct' | 'incorrect' | 'incomplete' | 'partial';
  startTime?: number; // Timestamp when the game started
}

export interface Investigation {
  id?: string;
  crime: Crime;
  characters: Character[];
  clues: Clue[];
  scenes: Scene[];
  startingSceneId?: string;
  correctSuspect?: string;
  culpritId?: string;
  requiredClues?: string[];
  motiveExplanation?: string;
}

export type GameTone = 'noir' | 'light' | 'dark';

// Novos tipos para o perfil do detetive
export interface DetectiveProfile {
  id: string;
  name: string;
  level: number;
  experience: number;
  money: number;
  casesSolved: number;
  casesFailed: number;
  totalEarnings: number;
  createdAt: number;
}

export interface CompletedCase {
  id: string;
  crimeTitle: string;
  crimeType: string;
  dateCompleted: number;
  timeTaken: number; // em segundos
  moneyEarned: number;
  wasSuccessful: boolean;
  cluesFound: number;
  totalClues: number;
}