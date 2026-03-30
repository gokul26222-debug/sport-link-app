import { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { useApp } from "@/lib/appContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GameRow {
  id: string;
  sport: string;
  location: string;
  distance: string | null;
  date: string;
  time: string;
  current_players: number;
  max_players: number;
  level: string | null;
  description: string | null;
  host_id: string | null;
}

const sportEmojis: Record<string, string> = {
  Football: "⚽", Basketball: "🏀", Tennis: "🎾", Volleyball: "🏐", Badminton: "🏸", Padel: "🎾",
};

const filters = ["All sports", "Football", "Basketball", "Tennis", "Padel"];

const levelStyles: Record<string, string> = {
  Beginner: "bg-[#1a3a1a] text-[#4ade80]",
  Intermediate: "bg-[#3a2a10] text-[#fb923c]",
  Advanced: "bg-[#3a1a1a] text-[#f87171]",
  beginner: "bg-[#1a3a1a] text-[#4ade80]",
  intermediate: "bg-[#3a2a10] text-[#fb923c]",
  advanced: "bg-[#3a1a1a] text-[#f87171]",
};

const HomePage = () => {
  const { profile, user } = useApp();
  const [activeFilter, setActiveFilter] = useState("All sports");
  const [games, setGames] = useState<GameRow[]>([]);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());
  const [loadingJoin, setLoadingJoin] = useState<string | null>(null);

  const fetchGames = async () => {
    const { data } = await supabase.from("games").select("*").order("created_at", { ascending: false });
    if (data) setGames(data);
  };

  const fetchJoined = async () => {
    if (!user) return;
    const { data } = await supabase.from("game_participants").select("game_id").eq("user_id", user.id);
    if (data) setJoinedIds(new Set(data.map((d) => d.game_id)));
  };

  useEffect(() => {
    fetchGames();
    fetchJoined();
  }, [user]);

  const handleJoin = async (gameId: string) => {
    if (!user) return;
    setLoadingJoin(gameId);
    const { error } = await supabase.from("game_participants").insert({ game_id: gameId, user_id: user.id });
    if (!error) {
      await supabase.from("games").update({ current_players: games.find(g => g.id === gameId)!.current_players + 1 }).eq("id", gameId);
      toast.success("You've joined the game! 🎉");
      fetchGames();
      fetchJoined();
    } else {
      toast.error("Failed to join");
    }
    setLoadingJoin(null);
  };

  const filtered = activeFilter === "All sports" ? games : games.filter((g) => g.sport === activeFilter);
  const firstName = profile?.name?.split(" ")[0] || "Player";

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Good morning</p>
          <h1 className="text-xl font-bold text-foreground">Hey, {firstName} 👋</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
          {firstName.slice(0, 2).toUpperCase()}
        </div>
      </div>

      {games.length > 0 && (
        <div className="px-5 mt-4">
          <div className="relative overflow-hidden rounded-2xl p-5" style={{ background: "linear-gradient(135deg, #6C5CE7, #a29bfe)" }}>
            <p className="text-xs font-medium text-white/70 uppercase tracking-wider">Next available game</p>
            <h3 className="text-lg font-bold text-white mt-1">{sportEmojis[games[0].sport] || "🎯"} {games[0].sport}</h3>
            <p className="text-sm text-white/80 mt-1">{games[0].location} • {games[0].time}</p>
            <p className="text-sm text-white/70 mt-0.5">{games[0].current_players}/{games[0].max_players} players</p>
          </div>
        </div>
      )}

      <div className="px-5 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filters.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeFilter === f ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground border border-[#333]"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-5">
        <h2 className="text-base font-semibold text-foreground mb-3">
          {games.length > 0 ? "Live games near you" : "No games yet"}
        </h2>
        {games.length === 0 && (
          <p className="text-sm text-muted-foreground">Create a game to get started!</p>
        )}
        <div className="space-y-3">
          {filtered.map((game) => (
            <div key={game.id} className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#1a1a2e] flex items-center justify-center text-2xl shrink-0">
                  {sportEmojis[game.sport] || "🎯"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{game.sport}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{game.location}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-foreground">{game.time}</p>
                  <p className="text-xs text-muted-foreground">{game.current_players}/{game.max_players} players</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${levelStyles[game.level || "Beginner"] || ""}`}>
                  {game.level || "Open"}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {Array.from({ length: Math.min(game.current_players, 3) }).map((_, j) => (
                      <div key={j} className="w-6 h-6 rounded-full bg-[#2a2a3a] border-2 border-card" />
                    ))}
                  </div>
                  {joinedIds.has(game.id) ? (
                    <span className="text-xs font-semibold px-4 py-1.5 rounded-full bg-[#1a3a1a] text-[#4ade80]">Joined ✓</span>
                  ) : (
                    <button
                      onClick={() => handleJoin(game.id)}
                      disabled={loadingJoin === game.id || game.current_players >= game.max_players}
                      className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full disabled:opacity-50"
                    >
                      {loadingJoin === game.id ? "..." : game.current_players >= game.max_players ? "Full" : "Join"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default HomePage;
