import { NarrativeTone } from '@/services/aiGeneration';
import { Moon, Sun, Skull } from 'lucide-react';

interface ToneSelectorProps {
  selectedTone: NarrativeTone;
  onSelect: (tone: NarrativeTone) => void;
}

const tones: { id: NarrativeTone; label: string; description: string; icon: typeof Moon }[] = [
  {
    id: 'noir',
    label: 'Noir Clássico',
    description: 'Mistério sério e atmosférico no estilo detetive clássico.',
    icon: Moon,
  },
  {
    id: 'light',
    label: 'Leve',
    description: 'Investigação envolvente com toques sutis de humor.',
    icon: Sun,
  },
  {
    id: 'dark',
    label: 'Sombrio',
    description: 'Mistério pesado com finais moralmente ambíguos.',
    icon: Skull,
  },
];

export function ToneSelector({ selectedTone, onSelect }: ToneSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-display text-sm text-muted-foreground text-center mb-4">
        Escolha o tom narrativo
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tones.map((tone) => {
          const Icon = tone.icon;
          const isSelected = selectedTone === tone.id;
          
          return (
            <button
              key={tone.id}
              onClick={() => onSelect(tone.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                isSelected 
                  ? 'border-noir-amber bg-noir-amber/10' 
                  : 'border-border/50 bg-card/50 hover:border-noir-amber/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5 ${isSelected ? 'text-noir-amber' : 'text-muted-foreground'}`} />
                <span className={`font-display text-sm ${isSelected ? 'text-noir-amber' : 'text-foreground'}`}>
                  {tone.label}
                </span>
              </div>
              <p className="font-body text-xs text-muted-foreground">
                {tone.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
