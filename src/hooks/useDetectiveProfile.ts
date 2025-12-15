import { useState, useEffect } from 'react';
import { DetectiveProfile, CompletedCase } from '@/types/game';

const DETECTIVE_PROFILE_KEY = 'noir-detective-profile';
const COMPLETED_CASES_KEY = 'noir-completed-cases';

export function useDetectiveProfile() {
  const [profile, setProfile] = useState<DetectiveProfile | null>(null);
  const [completedCases, setCompletedCases] = useState<CompletedCase[]>([]);

  // Carregar perfil do localStorage
  useEffect(() => {
    const loadProfile = () => {
      try {
        const savedProfile = localStorage.getItem(DETECTIVE_PROFILE_KEY);
        const savedCases = localStorage.getItem(COMPLETED_CASES_KEY);
        
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        } else {
          // Criar novo perfil se não existir
          const newProfile: DetectiveProfile = {
            id: 'detective-' + Date.now(),
            name: 'Detetive Anônimo',
            level: 1,
            experience: 0,
            money: 0,
            casesSolved: 0,
            casesFailed: 0,
            totalEarnings: 0,
            createdAt: Date.now()
          };
          setProfile(newProfile);
          localStorage.setItem(DETECTIVE_PROFILE_KEY, JSON.stringify(newProfile));
        }
        
        if (savedCases) {
          setCompletedCases(JSON.parse(savedCases));
        }
      } catch (error) {
        console.error('Erro ao carregar perfil do detetive:', error);
      }
    };

    loadProfile();
  }, []);

  // Salvar perfil no localStorage quando ele muda
  useEffect(() => {
    if (profile) {
      try {
        localStorage.setItem(DETECTIVE_PROFILE_KEY, JSON.stringify(profile));
      } catch (error) {
        console.error('Erro ao salvar perfil do detetive:', error);
      }
    }
  }, [profile]);

  // Salvar casos completos no localStorage quando eles mudam
  useEffect(() => {
    try {
      localStorage.setItem(COMPLETED_CASES_KEY, JSON.stringify(completedCases));
    } catch (error) {
      console.error('Erro ao salvar casos completos:', error);
    }
  }, [completedCases]);

  const updateProfile = (updates: Partial<DetectiveProfile>) => {
    if (profile) {
      setProfile(prev => ({ ...prev!, ...updates }));
    }
  };

  const addCompletedCase = (caseData: Omit<CompletedCase, 'id'>) => {
    const newCase: CompletedCase = {
      id: 'case-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      ...caseData
    };
    
    setCompletedCases(prev => [newCase, ...prev]);
    return newCase;
  };

  const calculateEarnings = (timeTaken: number, wasSuccessful: boolean, totalClues: number, cluesFound: number): number => {
    if (!wasSuccessful) return 0;
    
    // Base reward
    let baseReward = 100;
    
    // Bonus for clue completion
    const cluePercentage = cluesFound / totalClues;
    const clueBonus = Math.floor(cluePercentage * 50);
    
    // Time bonus (faster = more money)
    let timeBonus = 0;
    if (timeTaken < 300) { // Less than 5 minutes
      timeBonus = 100;
    } else if (timeTaken < 600) { // Less than 10 minutes
      timeBonus = 50;
    } else if (timeTaken < 1200) { // Less than 20 minutes
      timeBonus = 25;
    }
    
    return baseReward + clueBonus + timeBonus;
  };

  const resetProfile = () => {
    const newProfile: DetectiveProfile = {
      id: 'detective-' + Date.now(),
      name: 'Detetive Anônimo',
      level: 1,
      experience: 0,
      money: 0,
      casesSolved: 0,
      casesFailed: 0,
      totalEarnings: 0,
      createdAt: Date.now()
    };
    
    setProfile(newProfile);
    setCompletedCases([]);
    
    localStorage.setItem(DETECTIVE_PROFILE_KEY, JSON.stringify(newProfile));
    localStorage.setItem(COMPLETED_CASES_KEY, JSON.stringify([]));
  };

  return {
    profile,
    completedCases,
    updateProfile,
    addCompletedCase,
    calculateEarnings,
    resetProfile
  };
}