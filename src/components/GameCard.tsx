import { Game } from "@/lib/mockData";
import { useApp } from "@/lib/appContext";
import { SportIcon } from "./SportIcon";
import { MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
      <div className="flex gap-3">
        <SportIcon sport={game.sport} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground truncate">{game.sport}</h3>
            <span className="text-xs text-muted-foreground">{game.distance}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{game.location}</span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {game.date}, {game.time}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {game.currentPlayers}/{game.maxPlayers}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Hosted by {game.host}</span>
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
