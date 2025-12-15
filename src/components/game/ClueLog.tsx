import { useState, useEffect } from 'react';
import { Clue } from '@/types/game';
import { Search, MapPin, AlertCircle, CheckCircle, Eye, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { generateClueImage } from '@/services/aiGeneration';
import { useToast } from '@/hooks/use-toast';

interface ClueLogProps {
  clues: Clue[];
  isOpen: boolean;
  onToggle: () => void;
}

interface ClueDetailModalProps {
  clue: Clue | null;
  isOpen: boolean;
  onClose: () => void;
  clueImages: Map<string, string>;
  setClueImages: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  loadingImages: Set<string>;
  setLoadingImages: React.Dispatch<React.SetStateAction<Set<string>>>;
}

function ClueDetailModal({ 
  clue, 
  isOpen, 
  onClose, 
  clueImages, 
  setClueImages, 
  loadingImages, 
  setLoadingImages 
}: ClueDetailModalProps) {
  const { toast } = useToast();
  
  // Sempre renderizar os mesmos hooks na mesma ordem
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!clue) {
      setImageUrl(undefined);
      setIsLoading(false);
      return;
    }
    
    const currentImageUrl = clueImages.get(clue.id);
    if (currentImageUrl) {
      setImageUrl(currentImageUrl);
      setIsLoading(false);
      return;
    }
    
    setImageUrl(undefined);
    setIsLoading(loadingImages.has(clue.id));
  }, [clue, clueImages, loadingImages]);

  const loadImage = async () => {
    if (!clue) return;
    
    if (clueImages.has(clue.id) || loadingImages.has(clue.id)) return;
    
    setLoadingImages(prev => new Set(prev).add(clue.id));
    setIsLoading(true);
    
    try {
      const imageUrl = await generateClueImage(clue.id, clue.description);
      if (imageUrl) {
        setClueImages(prev => new Map(prev).set(clue.id, imageUrl));
        setImageUrl(imageUrl);
      } else {
        toast({
          title: "Erro ao gerar imagem",
          description: "Não foi possível gerar a imagem da pista. Tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading clue image:', error);
      toast({
        title: "Erro ao gerar imagem",
        description: "Ocorreu um erro ao gerar a imagem da pista.",
        variant: "destructive"
      });
    } finally {
      setLoadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(clue.id);
        return newSet;
      });
      setIsLoading(false);
    }
  };

  if (!clue) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            {clue.isReal ? (
              <CheckCircle className="w-5 h-5 text-primary" />
            ) : (
              <AlertCircle className="w-5 h-5 text-destructive" />
            )}
            {clue.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={clue.name} 
                  className="w-full h-48 object-cover"
                />
              ) : isLoading ? (
                <div className="w-full h-48 bg-muted flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-noir-amber mb-2" />
                  <p className="font-body text-sm text-muted-foreground">
                    Equipe forense analisando evidência...
                  </p>
                </div>
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={loadImage}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Gerando...' : 'Gerar Imagem'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="space-y-3">
            <div>
              <h3 className="font-display text-sm text-muted-foreground mb-1">Descrição</h3>
              <p className="font-body text-foreground text-sm">{clue.description}</p>
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="w-4 h-4 text-noir-amber" />
              <span className="font-body">{clue.location}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <span className={`px-2 py-1 rounded-full ${
                clue.isReal ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'
              }`}>
                {clue.isReal ? 'Pista Real' : 'Red Herring'}
              </span>
              <span className={`px-2 py-1 rounded-full ${
                clue.importance === 'critical' ? 'bg-destructive/20 text-destructive' :
                clue.importance === 'important' ? 'bg-warning/20 text-warning' :
                'bg-muted/20 text-muted-foreground'
              }`}>
                {clue.importance === 'critical' ? 'Crítica' : 
                 clue.importance === 'important' ? 'Importante' : 'Menor'}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ClueLog({ clues, isOpen, onToggle }: ClueLogProps) {
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null);
  const [clueImages, setClueImages] = useState<Map<string, string>>(new Map());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  
  const handleClueClick = (clue: Clue) => {
    setSelectedClue(clue);
  };

  const closeDetailModal = () => {
    setSelectedClue(null);
  };

  return (
    <>
      <div className={`fixed right-0 top-0 h-full w-80 bg-noir-deep/95 backdrop-blur-sm border-l border-border transition-transform duration-500 z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-primary flex items-center gap-2">
              <Search className="w-5 h-5" />
              Pistas Coletadas
            </h2>
            <button 
              onClick={onToggle} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
          
          {clues.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-body">Nenhuma pista encontrada ainda.</p>
              <p className="text-sm mt-2">Investigue a cena do crime para encontrar evidências.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {clues.map((clue, index) => (
                <button
                  key={clue.id}
                  onClick={() => handleClueClick(clue)}
                  className="w-full noir-card p-4 rounded-lg fade-in text-left hover:border-noir-amber/50 transition-colors"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      clue.isReal ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'
                    }`}>
                      {clue.isReal ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-sm text-foreground truncate">
                        {clue.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-body mt-1 line-clamp-2">
                        {clue.description}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-noir-amber">
                        <MapPin className="w-3 h-3" />
                        <span>{clue.location}</span>
                      </div>
                    </div>
                    <Eye className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-noir-deep to-transparent pointer-events-none" />
      </div>
      
      <ClueDetailModal 
        clue={selectedClue} 
        isOpen={!!selectedClue} 
        onClose={closeDetailModal}
        clueImages={clueImages}
        setClueImages={setClueImages}
        loadingImages={loadingImages}
        setLoadingImages={setLoadingImages}
      />
    </>
  );
}

export function ClueToggleButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-30 btn-noir p-3 rounded-full shadow-noir"
    >
      <Search className="w-5 h-5 text-noir-amber" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">
          {count}
        </span>
      )}
    </button>
  );
}