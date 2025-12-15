import { useEffect, useState } from 'react';
import { Scene } from '@/types/game';

interface NarrativeBoxProps {
  scene: Scene;
}

export function NarrativeBox({ scene }: NarrativeBoxProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    
    let index = 0;
    const text = scene.narrative;
    
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 20);

    return () => clearInterval(typeInterval);
  }, [scene.narrative]);

  const skipTyping = () => {
    setDisplayedText(scene.narrative);
    setIsTyping(false);
  };

  const getMoodStyles = () => {
    switch (scene.mood) {
      case 'tense':
        return 'border-l-noir-blood';
      case 'mysterious':
        return 'border-l-noir-amber';
      case 'dramatic':
        return 'border-l-primary';
      case 'dangerous':
        return 'border-l-destructive';
      default:
        return 'border-l-noir-smoke';
    }
  };

  return (
    <div 
      className={`noir-card rounded-lg p-6 border-l-4 ${getMoodStyles()} cursor-pointer transition-all duration-300`}
      onClick={isTyping ? skipTyping : undefined}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 rounded-full bg-noir-amber animate-pulse" />
        <h3 className="font-display text-lg text-primary">{scene.title}</h3>
        <span className="text-xs text-muted-foreground font-typewriter ml-auto">
          {scene.location}
        </span>
      </div>
      
      <div className="font-body text-foreground/90 leading-relaxed whitespace-pre-line min-h-[200px]">
        {displayedText}
        {isTyping && (
          <span className="inline-block w-2 h-4 bg-noir-amber ml-1 animate-pulse" />
        )}
      </div>
      
      {isTyping && (
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Clique para pular...
        </p>
      )}
    </div>
  );
}
