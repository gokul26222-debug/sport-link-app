import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/lib/appContext";
import { SportIcon } from "@/components/SportIcon";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Clock, Users, User } from "lucide-react";
import { toast } from "sonner";
import { Level } from "@/lib/mockData";

const levelColors: Record<Level, string> = {
  Beginner: "bg-success/15 text-success",
  Intermediate: "bg-warning/15 text-warning",
  Advanced: "bg-destructive/15 text-destructive",
};

const GameDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { games, joinedGameIds, joinGame, leaveGame } = useApp();
  const game = games.find((g) => g.id === id);
  const isJoined = id ? joinedGameIds.includes(id) : false;

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Game not found</p>
      </div>
    );
  }

  const isFull = game.currentPlayers >= game.maxPlayers;
  const spotsLeft = game.maxPlayers - game.currentPlayers;

  const handleJoin = () => {
    joinGame(game.id);
    toast.success("You've joined the game! 🎉", {
      description: `${game.sport} at ${game.location}`,
    });
  };

  const handleLeave = () => {
    leaveGame(game.id);
    toast("Left the game", { description: "You can rejoin anytime" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-5 pt-6 pb-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground mb-4 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-start gap-4">
          <SportIcon sport={game.sport} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">{game.sport}</h1>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${levelColors[game.level]}`}>
                {game.level}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">Hosted by {game.host}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-5 py-4 space-y-4">
        <div className="bg-card rounded-2xl p-4 border border-border/50 space-y-3">
          <div className="flex items-center gap-3 text-foreground">
            <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center">
              <MapPin className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">{game.location}</p>
              <p className="text-xs text-muted-foreground">{game.distance} away</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center">
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">{game.date}, {game.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center">
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">{game.currentPlayers}/{game.maxPlayers} players</p>
              <p className="text-xs text-muted-foreground">
                {isFull ? "Game is full" : `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left`}
              </p>
            </div>
          </div>
        </div>

        {game.description && (
          <div className="bg-card rounded-2xl p-4 border border-border/50">
            <h3 className="text-sm font-semibold text-foreground mb-1">About this game</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{game.description}</p>
          </div>
        )}

        <div className="bg-card rounded-2xl p-4 border border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-3">Players joined</h3>
          <div className="flex -space-x-2">
            {Array.from({ length: Math.min(game.currentPlayers, 6) }).map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-secondary border-2 border-card flex items-center justify-center"
              >
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            ))}
            {game.currentPlayers > 6 && (
              <div className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium text-muted-foreground">
                +{game.currentPlayers - 6}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-card/80 backdrop-blur-xl border-t border-border/50">
        <div className="max-w-lg mx-auto">
          {isJoined ? (
            <div className="flex gap-3">
              <div className="flex-1 flex items-center justify-center bg-success/15 text-success rounded-2xl text-sm font-medium">
                ✓ You're in!
              </div>
              <Button variant="outline" onClick={handleLeave} className="h-12 rounded-2xl px-6 border-border/50 text-muted-foreground hover:text-foreground">
                Leave
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleJoin}
              disabled={isFull}
              className="w-full h-12 rounded-2xl text-base font-semibold shadow-lg shadow-primary/25"
            >
              {isFull ? "Game is Full" : "Join Game"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDetailPage;
