import { useState, useEffect, useRef } from 'react';

export function useAudio() {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('noir-detective-muted');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [isTyping, setIsTyping] = useState(false);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const typingAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Inicializar áudio
  useEffect(() => {
    // Criar contexto de áudio
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioContext();
    
    // Carregar trilha sonora de fundo
    backgroundAudioRef.current = new Audio('@/assets/');
    backgroundAudioRef.current.loop = true;
    backgroundAudioRef.current.volume = isMuted ? 0 : 0.3;
    
    // Carregar efeito sonoro de digitação
    typingAudioRef.current = new Audio('/digitando.mp3');
    typingAudioRef.current.loop = true;
    typingAudioRef.current.volume = isMuted ? 0 : 0.2;
    
    // Iniciar trilha sonora
    const playBackgroundAudio = async () => {
      try {
        if (!isMuted) {
          await backgroundAudioRef.current?.play();
        }
      } catch (error) {
        console.log('Autoplay prevented, will play on user interaction');
      }
    };
    
    playBackgroundAudio();
    
    return () => {
      backgroundAudioRef.current?.pause();
      typingAudioRef.current?.pause();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Atualizar volumes quando mute muda
  useEffect(() => {
    localStorage.setItem('noir-detective-muted', JSON.stringify(isMuted));
    
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = isMuted ? 0 : 0.3;
    }
    
    if (typingAudioRef.current) {
      typingAudioRef.current.volume = isMuted ? 0 : (isTyping ? 0.2 : 0);
    }
  }, [isMuted, isTyping]);

  // Atualizar volumes quando digitação muda
  useEffect(() => {
    if (typingAudioRef.current) {
      if (isMuted) {
        typingAudioRef.current.volume = 0;
      } else {
        typingAudioRef.current.volume = isTyping ? 0.2 : 0;
        
        if (isTyping) {
          typingAudioRef.current.play().catch(e => console.log("Error playing typing sound:", e));
        } else {
          typingAudioRef.current.pause();
          typingAudioRef.current.currentTime = 0;
        }
      }
    }
    
    // Ajustar volume da trilha de fundo durante digitação
    if (backgroundAudioRef.current) {
      if (isMuted) {
        backgroundAudioRef.current.volume = 0;
      } else {
        backgroundAudioRef.current.volume = isTyping ? 0.1 : 0.3;
      }
    }
  }, [isTyping, isMuted]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const startTypingSound = () => {
    setIsTyping(true);
  };

  const stopTypingSound = () => {
    setIsTyping(false);
  };

  return {
    isMuted,
    toggleMute,
    startTypingSound,
    stopTypingSound
  };
}