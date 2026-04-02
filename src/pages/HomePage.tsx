import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { useApp } from "@/lib/appContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface GameRow {
  id: string;
  sport: string;
  title: string | null;
  location: string;
  date: string;
  time: string;
  current_players: number;
  max_players: number;
  level: string | null;
  skill_level: string | null;
  scheduled_at: string | null;
  status: string | null;
  description: string | null;
  host_id: string | null;
  location_lat: number | null;
  location_lng: number | null;
}

const sportConfig: Record<string, { emoji: string; bg: string }> = {
  Football: { emoji: "⚽", bg: "bg-green-900/60" },
  Tennis: { emoji: "🎾", bg: "bg-yellow-900/60" },
  Basketball: { emoji: "🏀", bg: "bg-orange-900/60" },
  Badminton: { emoji: "🏸", bg: "bg-purple-900/60" },
  Running: { emoji: "🏃", bg: "bg-blue-900/60" },
  Padel: { emoji: "🎾", bg: "bg-teal-900/60" },
};

const skillStyles: Record<string, string> = {
  beginner: "bg-green-900/40 text-green-400",
  intermediate: "bg-orange-900/40 text-orange-400",
  advanced: "bg-red-900/40 text-red-400",
  all: "bg-gray-800/60 text-gray-400",
  Beginner: "bg-green-900/40 text-green-400",
  Intermediate: "bg-orange-900/40 text-orange-400",
  Advanced: "bg-red-900/40 text-red-400",
  "All Levels": "bg-gray-800/60 text-gray-400",
};

const filters = ["All", "Football", "Basketball", "Tennis", "Padel", "Running", "Badminton"];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatScheduled(scheduled_at: string | null, date: string, time: string) {
  if (scheduled_at) {
    try {
      return format(new Date(scheduled_at), "EEE d MMM · HH:mm");
    } catch { /* fallback */ }
  }
  return `${date} · ${time}`;
}

const HomePage = () => {
  const { profile, user } = useApp();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [games, setGames] = useState<GameRow[]>([]);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());
  const [loadingJoin, setLoadingJoin] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGames = async () => {
    const { data } = await supabase
      .from("games")
      .select("*")
      .eq("status", "open")
      .order("scheduled_at", { ascending: true });
    if (data) setGames(data);
    setLoading(false);
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

  const handleJoin = async (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation();
    if (!user) return;
    setLoadingJoin(gameId);
    const { error } = await supabase.from("game_participants").insert({ game_id: gameId, user_id: user.id });
    if (!error) {
      const game = games.find(g => g.id === gameId);
      if (game) {
        await supabase.from("games").update({ current_players: game.current_players + 1 }).eq("id", gameId);
      }
      toast.success("You joined the game! 🎉");
      fetchGames();
      fetchJoined();
      navigate(`/game/${gameId}`);
    } else {
      toast.error("Failed to join");
    }
    setLoadingJoin(null);
  };

  const filtered = activeFilter === "All" ? games : games.filter((g) => g.sport === activeFilter);
  const firstName = profile?.name?.split(" ")[0] || "Player";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{getGreeting()}</p>
          <h1 className="text-xl font-bold text-foreground">Hey, {firstName} 👋</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Find your next game in Paris 🎯</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
          {firstName.slice(0, 2).toUpperCase()}
        </div>
      </div>

      {/* Game count */}
      <div className="px-5 mt-1">
        <p className="text-xs font-medium" style={{ color: "#d4a017" }}>
          {games.length} game{games.length !== 1 ? "s" : ""} happening near you
        </p>
      </div>

      {/* Filters */}
      <div className="px-5 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeFilter === f
                  ? "text-black"
                  : "bg-transparent text-muted-foreground border border-border"
              }`}
              style={activeFilter === f ? { background: "#d4a017" } : {}}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Game list */}
      <div className="px-5 mt-5">
        <h2 className="text-base font-semibold text-foreground mb-3">
          {loading ? "Loading games..." : filtered.length > 0 ? "Live games near you" : "No games found"}
        </h2>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card rounded-2xl border border-border p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {filtered.map((game) => {
            const config = sportConfig[game.sport] || { emoji: "🎯", bg: "bg-gray-800" };
            const isFull = game.current_players >= game.max_players;
            const isJoined = joinedIds.has(game.id);
            const skillLabel = game.skill_level || game.level || "all";

            return (
              <div
                key={game.id}
                className="bg-card rounded-2xl border border-border p-4 cursor-pointer hover:border-[#d4a017]/30 transition-all"
                onClick={() => navigate(`/game/${game.id}`)}
              >
                <div className="flex items-start gap-3">
                  {/* Sport emoji circle */}
                  <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center text-2xl shrink-0`}>
                    {config.emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{game.title || game.sport}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#d4a017" }}>{game.sport}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      📍 {game.location}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      🕐 {formatScheduled(game.scheduled_at, game.date, game.time)}
                    </p>
                  </div>

                  {/* Join button */}
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${skillStyles[skillLabel] || skillStyles["all"]}`}>
                      {skillLabel === "all" ? "All Levels" : skillLabel}
                    </span>
                    {isJoined ? (
                      <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-green-900/40 text-green-400">
                        You're in ✓
                      </span>
                    ) : (
                      <button
                        onClick={(e) => handleJoin(e, game.id)}
                        disabled={loadingJoin === game.id || isFull}
                        className="text-[11px] font-semibold px-4 py-1.5 rounded-full disabled:opacity-50 text-black"
                        style={{ background: isFull ? "#555" : "#d4a017", color: isFull ? "#999" : "#000" }}
                      >
                        {loadingJoin === game.id ? "..." : isFull ? "Full" : "Join"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom row: avatars + player count */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      {Array.from({ length: Math.min(game.current_players, 3) }).map((_, j) => (
                        <div key={j} className="w-6 h-6 rounded-full bg-muted border-2 border-card" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {game.current_players}/{game.max_players} players
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default HomePage;
