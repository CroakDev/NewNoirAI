"use client";

import { useState, useEffect } from 'react';
import { Play, BookOpen, Settings, Sparkles, User, Volume2, VolumeX, SkipForward, Trophy, Coins, FileText } from 'lucide-react';
import { RainEffect } from './game/RainEffect';
import { ToneSelector } from './game/ToneSelector';
import { NarrativeTone } from '@/services/aiGeneration';
import { useAudio } from '@/hooks/useAudio';

interface StartScreenProps {
  onStartGame: (tone: NarrativeTone) => void;
  onProfile: () => void;
  profile: any;
}

export function StartScreen({ onStartGame, onProfile, profile }: StartScreenProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTone, setSelectedTone] = useState<NarrativeTone>('noir');
  const { isMuted, toggleMute, nextTrack, currentTrack } = useAudio();

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-noir-deep relative overflow-hidden">
      <RainEffect />
      
      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-gradient-vignette pointer-events-none z-20" />
      
      {/* Film grain */}
      <div className="film-grain absolute inset-0 pointer-events-none z-20" />
      
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-noir-amber/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-30 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Audio controls */}
        <div className="absolute top-4 right-4 z-40 flex gap-2">
          <button
            onClick={nextTrack}
            className="btn-noir p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            title="Próxima trilha"
          >
            <SkipForward className="w-5 h-5 text-noir-amber" />
          </button>
          <button
            onClick={toggleMute}
            className="btn-noir p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            title={isMuted ? "Ativar som" : "Desativar som"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-noir-amber" />
            ) : (
              <Volume2 className="w-5 h-5 text-noir-amber" />
            )}
          </button>
        </div>
        
        {/* Track indicator */}
        <div className="absolute top-4 left-4 z-40">
          <div className="bg-noir-deep/80 backdrop-blur-sm px-3 py-1 rounded-full border border-border shadow-md">
            <span className="font-typewriter text-xs text-muted-foreground">
              Trilha {currentTrack}/5
            </span>
          </div>
        </div>
        
        {/* Logo/Title */}
        <div className={`text-center mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-4">
            <Sparkles className="w-8 h-8 text-noir-amber mx-auto animate-pulse" />
          </div>
          <h1 className="font-display text-5xl md:text-7xl tracking-wider mb-2 text-shadow-lg">
            <span className="text-gradient-amber">NOIR</span>
          </h1>
          <h2 className="font-display text-2xl md:text-3xl text-foreground tracking-widest"> DETECTIVE </h2>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-noir-amber/50" />
            <p className="font-typewriter text-sm text-muted-foreground tracking-wider"> MISTÉRIO • INVESTIGAÇÃO • SUSPENSE </p>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-noir-amber/50" />
          </div>
        </div>
        
        {/* Detective Info Card - Estilo de papel rasgado */}
        {profile && (
          <div className={`mb-8 w-full max-w-md transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative">
              {/* Efeito de papel rasgado */}
              <div className="absolute inset-0 bg-gradient-to-b from-noir-shadow to-noir-deep rounded-lg transform rotate-1"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-noir-deep to-noir-shadow rounded-lg transform -rotate-1"></div>
              
              {/* Conteúdo do card */}
              <div className="relative noir-card rounded-lg p-6 border-2 border-noir-amber/30 shadow-2xl transform transition-all duration-500 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-amber flex items-center justify-center shadow-md">
                      <User className="w-6 h-6 text-noir-deep" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl text-foreground">{profile.name}</h3>
                      <p className="font-typewriter text-sm text-muted-foreground">
                        Detetive Nível {profile.level}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={onProfile}
                    className="btn-noir p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110"
                  >
                    <Settings className="w-4 h-4 text-noir-amber" />
                  </button>
                </div>
                
                {/* Estatísticas do detetive */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-noir-shadow/50 rounded-lg p-3 text-center border border-noir-amber/20">
                    <Coins className="w-6 h-6 text-noir-amber mx-auto mb-1" />
                    <p className="font-display text-lg text-foreground">${profile.money}</p>
                    <p className="font-typewriter text-xs text-muted-foreground">Moedas</p>
                  </div>
                  
                  <div className="bg-noir-shadow/50 rounded-lg p-3 text-center border border-noir-amber/20">
                    <FileText className="w-6 h-6 text-primary mx-auto mb-1" />
                    <p className="font-display text-lg text-foreground">{profile.casesSolved}</p>
                    <p className="font-typewriter text-xs text-muted-foreground">Casos</p>
                  </div>
                  
                  <div className="bg-noir-shadow/50 rounded-lg p-3 text-center border border-noir-amber/20">
                    <Trophy className="w-6 h-6 text-noir-blood mx-auto mb-1" />
                    <p className="font-display text-lg text-foreground">{profile.level}</p>
                    <p className="font-typewriter text-xs text-muted-foreground">Troféus</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-noir-amber/20">
                  <div className="flex justify-between text-sm">
                    <span className="font-typewriter text-muted-foreground">Total Ganho:</span>
                    <span className="font-display text-noir-amber">${profile.totalEarnings}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="font-typewriter text-muted-foreground">Taxa de Sucesso:</span>
                    <span className="font-display text-foreground">
                      {profile.casesSolved > 0 
                        ? Math.round((profile.casesSolved / (profile.casesSolved + profile.casesFailed)) * 100) 
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Tone Selector - Estilo de papel rasgado */}
        <div className={`mb-8 w-full max-w-md transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative">
            {/* Efeito de papel rasgado */}
            <div className="absolute inset-0 bg-gradient-to-r from-noir-shadow to-noir-deep rounded-lg transform rotate-1"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-noir-deep to-noir-shadow rounded-lg transform -rotate-1"></div>
            
            {/* Conteúdo */}
            <div className="relative noir-card rounded-lg p-5 border-2 border-noir-amber/30 shadow-2xl">
              <ToneSelector selectedTone={selectedTone} onSelect={setSelectedTone} />
            </div>
          </div>
        </div>
        
        {/* Buttons - Estilo de papel rasgado */}
        <div className={`flex flex-col gap-4 w-full max-w-xs transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Botão Novo Caso */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-noir-blood to-noir-shadow rounded-lg transform rotate-2 group-hover:rotate-3 transition-transform duration-300"></div>
            <button
              onClick={() => onStartGame(selectedTone)}
              className="relative w-full btn-amber px-8 py-5 rounded-lg font-display text-xl tracking-wide flex items-center justify-center gap-3 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 border-2 border-noir-amber/50"
            >
              <Play className="w-6 h-6" />
              Novo Caso
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-noir-amber rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-noir-deep">!</span>
              </div>
            </button>
          </div>
          
          {/* Botão Meu Perfil */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-noir-shadow to-noir-deep rounded-lg transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
            <button
              onClick={onProfile}
              className="relative w-full btn-noir px-8 py-5 rounded-lg font-display text-lg tracking-wide flex items-center justify-center gap-3 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 border border-border"
            >
              <User className="w-5 h-5" />
              Meu Perfil
            </button>
          </div>
          
          {/* Botão Continuar (Desativado) */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-noir-deep to-noir-shadow rounded-lg transform rotate-1"></div>
            <button
              className="relative w-full noir-card px-8 py-5 rounded-lg font-display text-lg tracking-wide flex items-center justify-center gap-3 shadow-lg opacity-50 cursor-not-allowed border border-border"
              disabled
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-muted-foreground">Continuar</span>
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className={`absolute bottom-8 left-0 right-0 text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="font-typewriter text-xs text-muted-foreground/50"> Um jogo de investigação gerado por IA </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-noir-amber animate-pulse" />
            <span className="font-typewriter text-xs text-noir-amber/70"> Histórias únicas a cada partida </span>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-noir-deep to-transparent pointer-events-none z-20" />
      
      {/* Animated light streaks */}
      <div className="absolute top-20 left-10 w-px h-32 bg-gradient-to-b from-noir-amber/20 to-transparent animate-pulse opacity-50" />
      <div className="absolute top-40 right-20 w-px h-24 bg-gradient-to-b from-noir-amber/20 to-transparent animate-pulse opacity-30 delay-100" />
    </div>
  );
}