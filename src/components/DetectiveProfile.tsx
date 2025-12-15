import { useState } from 'react';
import { DetectiveProfile, CompletedCase } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Award, 
  Wallet, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Calendar,
  Trophy,
  Coins
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DetectiveProfileProps {
  profile: DetectiveProfile;
  completedCases: CompletedCase[];
  onUpdateProfile: (updates: Partial<DetectiveProfile>) => void;
  onResetProfile: () => void;
  onBack: () => void;
}

export function DetectiveProfile({ 
  profile, 
  completedCases, 
  onUpdateProfile, 
  onResetProfile,
  onBack 
}: DetectiveProfileProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(profile.name);

  const handleSaveName = () => {
    if (newName.trim() && newName !== profile.name) {
      onUpdateProfile({ name: newName.trim() });
    }
    setIsEditingName(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const totalCases = profile.casesSolved + profile.casesFailed;
  const successRate = totalCases > 0 ? Math.round((profile.casesSolved / totalCases) * 100) : 0;

  return (
    <div className="min-h-screen bg-noir-deep relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="btn-noir px-4 py-2 rounded-lg font-typewriter text-sm"
          >
            ← Voltar
          </button>
          
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={onResetProfile}
            className="font-typewriter"
          >
            Resetar Perfil
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="noir-card mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-amber flex items-center justify-center">
                <User className="w-8 h-8 text-noir-deep" />
              </div>
              
              <div className="flex-1">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="max-w-xs"
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    />
                    <Button size="sm" onClick={handleSaveName}>Salvar</Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setIsEditingName(false);
                        setNewName(profile.name);
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="font-display text-2xl text-foreground">{profile.name}</h1>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsEditingName(true)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Editar
                      </Button>
                    </div>
                    <p className="font-typewriter text-sm text-muted-foreground">
                      Detetive Nível {profile.level}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 text-noir-amber mb-1">
                  <Coins className="w-5 h-5" />
                  <span className="font-display text-2xl">${profile.money}</span>
                </div>
                <p className="font-typewriter text-xs text-muted-foreground">
                  Total ganho: ${profile.totalEarnings}
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 noir-card rounded-lg">
                <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="font-display text-xl text-foreground">{profile.casesSolved}</p>
                <p className="font-typewriter text-xs text-muted-foreground">Casos Resolvidos</p>
              </div>
              
              <div className="text-center p-4 noir-card rounded-lg">
                <XCircle className="w-6 h-6 text-destructive mx-auto mb-2" />
                <p className="font-display text-xl text-foreground">{profile.casesFailed}</p>
                <p className="font-typewriter text-xs text-muted-foreground">Casos Não Resolvidos</p>
              </div>
              
              <div className="text-center p-4 noir-card rounded-lg">
                <TrendingUp className="w-6 h-6 text-noir-amber mx-auto mb-2" />
                <p className="font-display text-xl text-foreground">{successRate}%</p>
                <p className="font-typewriter text-xs text-muted-foreground">Taxa de Sucesso</p>
              </div>
              
              <div className="text-center p-4 noir-card rounded-lg">
                <Award className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="font-display text-xl text-foreground">{profile.level}</p>
                <p className="font-typewriter text-xs text-muted-foreground">Nível</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completed Cases */}
        <Card className="noir-card">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Casos Completos ({completedCases.length})
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {completedCases.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-body">Nenhum caso completo ainda.</p>
                <p className="text-sm mt-2">Comece um novo caso para ganhar dinheiro e experiência!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedCases.map((caseItem) => (
                  <div 
                    key={caseItem.id} 
                    className="noir-card p-4 rounded-lg border-l-4 border-l-primary"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-display text-lg text-foreground">{caseItem.crimeTitle}</h3>
                        <p className="font-typewriter text-sm text-muted-foreground capitalize">
                          {caseItem.crimeType}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-noir-amber mb-1">
                            <Coins className="w-4 h-4" />
                            <span className="font-display">${caseItem.moneyEarned}</span>
                          </div>
                          <p className="font-typewriter text-xs text-muted-foreground">Ganho</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-foreground mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="font-display">{formatTime(caseItem.timeTaken)}</span>
                          </div>
                          <p className="font-typewriter text-xs text-muted-foreground">Tempo</p>
                        </div>
                        
                        <div className="text-center">
                          <div className={`flex items-center gap-1 mb-1 ${
                            caseItem.wasSuccessful ? 'text-primary' : 'text-destructive'
                          }`}>
                            {caseItem.wasSuccessful ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            <span className="font-display text-sm">
                              {caseItem.wasSuccessful ? 'Sucesso' : 'Falha'}
                            </span>
                          </div>
                          <p className="font-typewriter text-xs text-muted-foreground">
                            {caseItem.cluesFound}/{caseItem.totalClues} pistas
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(caseItem.dateCompleted)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}