import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Star, Trophy, MapPin, X, UserPlus } from "lucide-react";
import { Sport, Level, sportEmojis } from "@/lib/mockData";
import { toast } from "sonner";

interface Player {
  id: string;
  name: string;
  initials: string;
  age: number;
  neighborhood: string;
  sport: Sport;
  level: Level;
  gamesPlayed: number;
  rating: number;
}

const dummyPlayers: Player[] = [
  { id: "p1", name: "Lucas M.", initials: "LM", age: 24, neighborhood: "Montmartre", sport: "Football", level: "Intermediate", gamesPlayed: 18, rating: 4.9 },
  { id: "p2", name: "Sarah K.", initials: "SK", age: 22, neighborhood: "Marais", sport: "Basketball", level: "Beginner", gamesPlayed: 7, rating: 4.7 },
  { id: "p3", name: "Rayan B.", initials: "RB", age: 27, neighborhood: "Saint-Germain", sport: "Tennis", level: "Advanced", gamesPlayed: 41, rating: 4.8 },
  { id: "p4", name: "Emma L.", initials: "EL", age: 25, neighborhood: "Bastille", sport: "Football", level: "Intermediate", gamesPlayed: 22, rating: 5.0 },
];

const levelColors: Record<Level, string> = {
  Beginner: "bg-success/15 text-success",
  Intermediate: "bg-warning/15 text-warning",
  Advanced: "bg-destructive/15 text-destructive",
};

const MatchPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const player = dummyPlayers[currentIndex];

  const handleSkip = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % dummyPlayers.length);
      setAnimating(false);
    }, 250);
  };

  const handleJoin = () => {
    toast.success(`Request sent to ${player.name}! 🎉`);
    handleSkip();
  };

  return (
    <div className="min-h-screen bg-background pb-24 flex flex-col">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Find a match</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Connect with players near you</p>
      </div>

      {/* Player Card */}
      <div className="flex-1 flex items-center justify-center px-5 py-6">
        <div
          className={`w-full max-w-sm bg-card rounded-3xl border border-border/50 p-6 transition-all duration-250 ${
            animating ? "opacity-0 scale-95 translate-x-8" : "opacity-100 scale-100 translate-x-0"
          }`}
        >
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">{player.initials}</span>
            </div>

            {/* Name & location */}
            <h2 className="text-xl font-bold text-foreground">{player.name}</h2>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span>{player.neighborhood}, Paris</span>
              <span className="text-border">·</span>
              <span>{player.age} yrs</span>
            </div>
          </div>

          {/* Sport + Level badges */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <span className="flex items-center gap-1.5 bg-secondary text-secondary-foreground text-sm font-medium px-3 py-1.5 rounded-full">
              {sportEmojis[player.sport]} {player.sport}
            </span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${levelColors[player.level]}`}>
              {player.level}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-border/50 my-5" />

          {/* Stats */}
          <div className="flex items-center justify-center gap-8">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-foreground">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-lg font-bold">{player.gamesPlayed}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-0.5">Games</span>
            </div>
            <div className="w-px h-8 bg-border/50" />
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-foreground">
                <Star className="w-4 h-4 text-warning fill-warning" />
                <span className="text-lg font-bold">{player.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-0.5">Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 pb-4">
        <div className="flex gap-3 max-w-sm mx-auto">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="flex-1 h-13 rounded-2xl border-border/50 text-muted-foreground hover:text-foreground hover:bg-card text-base font-semibold"
          >
            <X className="w-5 h-5 mr-1.5" />
            Skip
          </Button>
          <Button
            onClick={handleJoin}
            className="flex-1 h-13 rounded-2xl text-base font-semibold shadow-lg shadow-primary/25"
          >
            <UserPlus className="w-5 h-5 mr-1.5" />
            Join game
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default MatchPage;
