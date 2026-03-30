import { MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface GameCardGame {
  id: string;
  sport: string;
  location: string;
  time: string;
  currentPlayers: number;
  maxPlayers: number;
  level: string;
}

const sportEmojis: Record<string, string> = {
  Football: "⚽", Basketball: "🏀", Tennis: "🎾", Volleyball: "🏐", Badminton: "🏸", Padel: "🎾",
};

const levelColors: Record<string, string> = {
  Beginner: "bg-success/15 text-success",
  Intermediate: "bg-warning/15 text-warning",
  Advanced: "bg-destructive/15 text-destructive",
};

export const GameCard = ({ game }: { game: GameCardGame }) => {
  const navigate = useNavigate();
  const isFull = game.currentPlayers >= game.maxPlayers;

  return (
    <div
      className="bg-card rounded-2xl p-4 border border-border/50 animate-slide-up cursor-pointer hover:border-primary/30 transition-all duration-200"
      onClick={() => navigate(`/game/${game.id}`)}
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-xl shrink-0">
          {sportEmojis[game.sport] || "🎯"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-foreground truncate">{game.sport}</h3>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${levelColors[game.level] || ""}`}>
              {game.level}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{game.location}</span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{game.time}</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{game.currentPlayers}/{game.maxPlayers}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex -space-x-1.5">
          {Array.from({ length: Math.min(game.currentPlayers, 4) }).map((_, i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-secondary border-2 border-card flex items-center justify-center">
              <span className="text-[9px] text-muted-foreground font-medium">{String.fromCharCode(65 + i)}</span>
            </div>
          ))}
        </div>
        <Button size="sm" disabled={isFull} className="text-xs h-8 px-4 rounded-xl shadow-lg shadow-primary/20">
          {isFull ? "Full" : "Join"}
        </Button>
      </div>
    </div>
  );
};
