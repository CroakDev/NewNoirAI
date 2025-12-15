import { useState, useEffect, useRef } from 'react';

export function useAudio() {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('noir-detective-muted');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [currentTrack, setCurrentTrack] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const typingAudioRef = useRef<HTMLAudioElement | null>(null);
  const notifyAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Inicializar áudio
  useEffect(() => {
    // Criar contexto de áudio
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioContext();
    
    // Carregar trilha sonora de fundo
    backgroundAudioRef.current = new Audio(`/src/assets/trilhasonora${currentTrack}.mp3`);
    backgroundAudioRef.current.loop = true;
    backgroundAudioRef.current.volume = isMuted ? 0 : 0.3;
    
    // Carregar efeito sonoro de digitação
    typingAudioRef.current = new Audio('/src/assets/digitando.mp3');
    typingAudioRef.current.loop = true;
    typingAudioRef.current.volume = isMuted ? 0 : 0.2;
    
    // Carregar efeito sonoro de notificação
    notifyAudioRef.current = new Audio('/src/assets/notify.mp3');
    notifyAudioRef.current.volume = isMuted ? 0 : 0.5;
    
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
      notifyAudioRef.current?.pause();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [currentTrack]);

  // Atualizar volumes quando mute muda
  useEffect(() => {
    localStorage.setItem('noir-detective-muted', JSON.stringify(isMuted));
    
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = isMuted ? 0 : 0.3;
    }
    
    if (typingAudioRef.current) {
      typingAudioRef.current.volume = isMuted ? 0 : (isTyping ? 0.2 : 0);
    }
    
    if (notifyAudioRef.current) {
      notifyAudioRef.current.volume = isMuted ? 0 : 0.5;
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

  const nextTrack = () => {
    setCurrentTrack(prev => (prev % 5) + 1);
  };

  const playNotifySound = () => {
    if (notifyAudioRef.current && !isMuted) {
      notifyAudioRef.current.currentTime = 0;
      notifyAudioRef.current.play().catch(e => console.log("Error playing notify sound:", e));
    }
  };

  const startTypingSound = () => {
    setIsTyping(true);
  };

  const stopTypingSound = () => {
    setIsTyping(false);
  };

  return {
    isMuted,
    currentTrack,
    toggleMute,
    nextTrack,
    playNotifySound,
    startTypingSound,
    stopTypingSound
  };
}