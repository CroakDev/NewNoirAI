import { Character } from '@/types/game';
import { User, Skull, Eye, Shield } from 'lucide-react';

interface CharacterPortraitProps {
  character: Character;
  size?: 'sm' | 'md' | 'lg';
}

export function CharacterPortrait({ character, size = 'md' }: CharacterPortraitProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
  };

  const getRoleIcon = () => {
    switch (character.role) {
      case 'detective':
        return <Shield className="w-4 h-4" />;
      case 'victim':
        return <Skull className="w-4 h-4" />;
      case 'witness':
        return <Eye className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = () => {
    switch (character.role) {
      case 'detective':
        return 'bg-primary/20 text-primary border-primary/50';
      case 'victim':
        return 'bg-destructive/20 text-destructive border-destructive/50';
      case 'suspect':
        return 'bg-noir-blood/20 text-noir-blood border-noir-blood/50';
      default:
        return 'bg-noir-amber/20 text-noir-amber border-noir-amber/50';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`portrait-frame rounded-lg ${sizeClasses[size]} bg-noir-shadow overflow-hidden relative`}>
        {character.imageUrl ? (
          <img 
            src={character.imageUrl} 
            alt={character.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-noir-shadow to-noir-deep">
            <User className="w-1/2 h-1/2 text-muted-foreground" />
          </div>
        )}
        
        {/* Role badge */}
        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border ${getRoleColor()} flex items-center justify-center`}>
          {getRoleIcon()}
        </div>
      </div>
      
      <div className="text-center">
        <p className="font-display text-sm text-foreground">{character.name}</p>
        <p className="text-xs text-muted-foreground capitalize">{character.role === 'suspect' ? 'Suspeito' : character.role === 'witness' ? 'Testemunha' : character.role === 'victim' ? 'Vítima' : 'Detetive'}</p>
      </div>
    </div>
  );
}
