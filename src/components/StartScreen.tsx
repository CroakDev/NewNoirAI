"use client";

import { useState, useEffect } from 'react';
import { Play, BookOpen, Settings, Sparkles, User, Volume2, VolumeX, SkipForward } from 'lucide-react';
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
            className="btn-noir p-3 rounded-full"
            title="Próxima trilha"
          >
            <SkipForward className="w-5 h-5 text-noir-amber" />
          </button>
          <button
            onClick={toggleMute}
            className="btn-noir p-3 rounded-full"
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
          <div className="bg-noir-deep/80 backdrop-blur-sm px-3 py-1 rounded-full border border-border">
            <span className="font-typewriter text-xs text-muted-foreground">
              Trilha {currentTrack}/5
            </span>
          </div>
        </div>
        
        {/* Logo/Title */}
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-4">
            <Sparkles className="w-8 h-8 text-noir-amber mx-auto animate-pulse" />
          </div>
          <h1 className="font-display text-5xl md:text-7xl tracking-wider mb-2">
            <span className="text-gradient-amber">NOIR</span>
          </h1>
          <h2 className="font-display text-2xl md:text-3xl text-foreground tracking-widest"> DETECTIVE </h2>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-noir-amber/50" />
            <p className="font-typewriter text-sm text-muted-foreground tracking-wider"> MISTÉRIO • INVESTIGAÇÃO • SUSPENSE </p>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-noir-amber/50" />
          </div>
        </div>
        
        {/* Tagline */}
        <p className={` font-body text-lg md:text-xl text-muted-foreground text-center max-w-md mt-8 mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} `}>
          Resolva crimes. Encontre pistas. Desvende a verdade.
        </p>
        
        {/* Detective Info */}
        {profile && (
          <div className={`mb-6 noir-card rounded-lg p-4 w-full max-w-md transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-amber flex items-center justify-center">
                  <User className="w-5 h-5 text-noir-deep" />
                </div>
                <div>
                  <p className="font-display text-foreground text-sm">{profile.name}</p>
                  <p className="font-typewriter text-xs text-muted-foreground">
                    Nível {profile.level} • ${profile.money}
                  </p>
                </div>
              </div>
              <button 
                onClick={onProfile}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        {/* Tone Selector */}
        <div className={` mb-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} `}>
          <ToneSelector selectedTone={selectedTone} onSelect={setSelectedTone} />
        </div>
        
        {/* Buttons */}
        <div className={` flex flex-col gap-4 w-full max-w-xs transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} `}>
          <button
            onClick={() => onStartGame(selectedTone)}
            className="btn-amber px-8 py-4 rounded-lg font-display text-lg tracking-wide flex items-center justify-center gap-3 shadow-glow"
          >
            <Play className="w-5 h-5" />
            Novo Caso
          </button>
          
          <button
            onClick={onProfile}
            className="btn-noir px-8 py-4 rounded-lg font-display tracking-wide flex items-center justify-center gap-3"
          >
            <User className="w-5 h-5" />
            Meu Perfil
          </button>
          
          <button
            className="btn-noir px-8 py-4 rounded-lg font-display tracking-wide flex items-center justify-center gap-3"
            disabled
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-muted-foreground">Continuar</span>
          </button>
        </div>
        
        {/* Footer */}
        <div className={` absolute bottom-8 left-0 right-0 text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'} `}>
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