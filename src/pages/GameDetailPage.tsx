import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/lib/appContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Clock, Users, User } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const levelColors: Record<string, string> = {
  Beginner: "bg-success/15 text-success",
  Intermediate: "bg-warning/15 text-warning",
  Advanced: "bg-destructive/15 text-destructive",
};

const GameDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useApp();
  const [game, setGame] = useState<any>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      const { data } = await supabase.from("games").select("*").eq("id", id).single();
      setGame(data);
      if (user) {
        const { data: part } = await supabase.from("game_participants").select("id").eq("game_id", id).eq("user_id", user.id).maybeSingle();
        setIsJoined(!!part);
      }
      setLoading(false);
    };
    fetch();
  }, [id, user]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!game) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Game not found</p></div>;

  const isFull = game.current_players >= game.max_players;
  const spotsLeft = game.max_players - game.current_players;

  const handleJoin = async () => {
    if (!user) return;
    const { error } = await supabase.from("game_participants").insert({ game_id: game.id, user_id: user.id });
    if (!error) {
      await supabase.from("games").update({ current_players: game.current_players + 1 }).eq("id", game.id);
      setGame({ ...game, current_players: game.current_players + 1 });
      setIsJoined(true);
      toast.success("You've joined the game! 🎉");
    }
  };

  const handleLeave = async () => {
    if (!user) return;
    await supabase.from("game_participants").delete().eq("game_id", game.id).eq("user_id", user.id);
    await supabase.from("games").update({ current_players: game.current_players - 1 }).eq("id", game.id);
    setGame({ ...game, current_players: game.current_players - 1 });
    setIsJoined(false);
    toast("Left the game");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-5 pt-6 pb-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground mb-4 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-2xl">🎯</div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">{game.sport}</h1>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${levelColors[game.level] || ""}`}>{game.level}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        <div className="bg-card rounded-2xl p-4 border border-border/50 space-y-3">
          <div className="flex items-center gap-3 text-foreground">
            <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center"><MapPin className="w-4 h-4 text-muted-foreground" /></div>
            <div><p className="text-sm font-medium">{game.location}</p><p className="text-xs text-muted-foreground">{game.distance || ""}</p></div>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center"><Clock className="w-4 h-4 text-muted-foreground" /></div>
            <p className="text-sm font-medium">{game.date}, {game.time}</p>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center"><Users className="w-4 h-4 text-muted-foreground" /></div>
            <div>
              <p className="text-sm font-medium">{game.current_players}/{game.max_players} players</p>
              <p className="text-xs text-muted-foreground">{isFull ? "Game is full" : `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left`}</p>
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
            {Array.from({ length: Math.min(game.current_players, 6) }).map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-secondary border-2 border-card flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-card/80 backdrop-blur-xl border-t border-border/50">
        <div className="max-w-lg mx-auto">
          {isJoined ? (
            <div className="flex gap-3">
              <div className="flex-1 flex items-center justify-center bg-success/15 text-success rounded-2xl text-sm font-medium">✓ You're in!</div>
              <Button variant="outline" onClick={handleLeave} className="h-12 rounded-2xl px-6 border-border/50 text-muted-foreground hover:text-foreground">Leave</Button>
            </div>
          ) : (
            <Button onClick={handleJoin} disabled={isFull} className="w-full h-12 rounded-2xl text-base font-semibold shadow-lg shadow-primary/25">
              {isFull ? "Game is Full" : "Join Game"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDetailPage;
