import { Game, Level, sportEmojis } from "@/lib/mockData";
import { useApp } from "@/lib/appContext";
import { MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const levelColors: Record<Level, string> = {
  Beginner: "bg-success/15 text-success",
  Intermediate: "bg-warning/15 text-warning",
  Advanced: "bg-destructive/15 text-destructive",
};

export const GameCard = ({ game }: { game: Game }) => {
  const { joinedGameIds, joinGame } = useApp();
  const navigate = useNavigate();
  const isJoined = joinedGameIds.includes(game.id);
  const isFull = game.currentPlayers >= game.maxPlayers;

  return (
    <div
      className="bg-card rounded-2xl p-4 border border-border/50 animate-slide-up cursor-pointer hover:border-primary/30 transition-all duration-200"
      onClick={() => navigate(`/game/${game.id}`)}
    >
      <div className="flex items-start gap-3">
        {/* Sport emoji */}
        <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-xl shrink-0">
          {sportEmojis[game.sport]}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-foreground truncate">{game.sport}</h3>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${levelColors[game.level]}`}>
              {game.level}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{game.location}</span>
          </div>

          {/* Time + players */}
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {game.time}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {game.currentPlayers}/{game.maxPlayers}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom row: avatars + join */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex -space-x-1.5">
          {Array.from({ length: Math.min(game.currentPlayers, 4) }).map((_, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full bg-secondary border-2 border-card flex items-center justify-center"
            >
              <span className="text-[9px] text-muted-foreground font-medium">
                {String.fromCharCode(65 + i)}
              </span>
            </div>
          ))}
          {game.currentPlayers > 4 && (
            <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[9px] font-medium text-muted-foreground">
              +{game.currentPlayers - 4}
            </div>
          )}
        </div>
        <Button
          size="sm"
          variant={isJoined ? "secondary" : "default"}
          disabled={isFull && !isJoined}
          onClick={(e) => {
            e.stopPropagation();
            if (!isJoined) joinGame(game.id);
          }}
          className={`text-xs h-8 px-4 rounded-xl ${!isJoined && !isFull ? "shadow-lg shadow-primary/20" : ""}`}
        >
          {isJoined ? "Joined ✓" : isFull ? "Full" : "Join"}
        </Button>
      </div>
    </div>
  );
};
