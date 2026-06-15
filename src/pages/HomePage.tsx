import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { useApp } from "@/lib/appContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { MapPin, Users, Clock } from "lucide-react";

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

const liveScores = [
  { home: "PSG", away: "Marseille", homeScore: 2, awayScore: 1, minute: "78'", league: "Ligue 1" },
  { home: "France", away: "Germany", homeScore: 1, awayScore: 1, minute: "45+2'", league: "UEFA" },
  { home: "Barcelona", away: "Real Madrid", homeScore: 3, awayScore: 2, minute: "90+1'", league: "La Liga" },
];

const sportConfig: Record<string, { emoji: string; bg: string }> = {
  Football: { emoji: "⚽", bg: "bg-green-100" },
  Tennis: { emoji: "🎾", bg: "bg-yellow-100" },
  Basketball: { emoji: "🏀", bg: "bg-orange-100" },
  Badminton: { emoji: "🏸", bg: "bg-purple-100" },
  Running: { emoji: "🏃", bg: "bg-blue-100" },
  Padel: { emoji: "🎾", bg: "bg-teal-100" },
};

const sportEmojis: Record<string, string> = {
  Football: "⚽",
  Tennis: "🎾",
  Basketball: "🏀",
  Badminton: "🏸",
  Running: "🏃",
  Padel: "🏓",
};

const skillStyles: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-orange-100 text-orange-700",
  advanced: "bg-red-100 text-red-700",
  all: "bg-gray-100 text-gray-700",
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-orange-100 text-orange-700",
  Advanced: "bg-red-100 text-red-700",
  "All Levels": "bg-gray-100 text-gray-700",
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
    } catch {
      // fallback
    }
  }
  return `${date} · ${time}`;
}

function isGameWithinTwoHours(scheduled_at: string | null, date: string, time: string): boolean {
  let gameDate: Date;
  if (scheduled_at) {
    try {
      gameDate = new Date(scheduled_at);
    } catch {
      return false;
    }
  } else {
    try {
      gameDate = new Date(`${date}T${time}`);
    } catch {
      return false;
    }
  }
  const now = new Date();
  const diff = gameDate.getTime() - now.getTime();
  return diff >= 0 && diff <= 2 * 60 * 60 * 1000;
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
    const { data } = await supabase
      .from("game_participants")
      .select("game_id")
      .eq("user_id", user.id);
    if (data) setJoinedIds(new Set(data.map((d) => d.game_id)));
  };

  useEffect(() => {
    fetchGames();
    fetchJoined();
  }, [user]);

  const handleJoin = async (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation();
    if (!user) {
      toast("Sign in to join games 👋", {
        action: { label: "Sign in", onClick: () => navigate("/") },
      });
      return;
    }
    setLoadingJoin(gameId);
    const { error } = await supabase
      .from("game_participants")
      .insert({ game_id: gameId, user_id: user.id });
    if (!error) {
      const game = games.find((g) => g.id === gameId);
      if (game) {
        await supabase
          .from("games")
          .update({ current_players: game.current_players + 1 })
          .eq("id", gameId);
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

  const filtered =
    activeFilter === "All" ? games : games.filter((g) => g.sport === activeFilter);

  const liveNowGames = games.filter((g) =>
    isGameWithinTwoHours(g.scheduled_at, g.date, g.time)
  );

  const firstName = profile?.name?.split(" ")[0] || "Player";

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-500 font-medium">{getGreeting()}</p>
          <h1 className="text-lg font-semibold text-gray-900 mt-0.5">Find a game near you</h1>
        </div>
        <button
          onClick={() => navigate("/profile")}
          className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0 active:scale-95 transition-transform"
        >
          {firstName.slice(0, 2).toUpperCase()}
        </button>
      </div>

      {/* Filter chips */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                activeFilter === f
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Game Feed */}
      <div className="px-5 py-5">
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No games found</p>
          </div>
        )}

        <div className="space-y-2">
          {filtered.slice(0, 10).map((game) => {
            const config = sportConfig[game.sport] || { emoji: "🎯", bg: "bg-gray-100" };
            const isFull = game.current_players >= game.max_players;
            const isJoined = joinedIds.has(game.id);
            const skillLabel = game.skill_level || game.level || "all";

            return (
              <button
                key={game.id}
                onClick={() => navigate(`/game/${game.id}`)}
                className="w-full text-left bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all active:scale-[0.98]"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg ${config.bg} flex items-center justify-center text-2xl shrink-0`}>
                    {config.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{game.title || game.sport}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      <p className="text-xs text-gray-600 truncate">{game.location}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <p className="text-xs text-gray-600">{formatScheduled(game.scheduled_at, game.date, game.time)}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-3 h-3 text-gray-500" />
                      <p className="text-xs text-gray-600">{game.current_players}/{game.max_players}</p>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded ${skillStyles[skillLabel] || skillStyles["all"]}`}>
                      {skillLabel === "all" ? "All" : skillLabel}
                    </span>
                    {isJoined ? (
                      <span className="text-[11px] font-semibold px-2 py-1 rounded bg-green-100 text-green-700">✓</span>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleJoin(e, game.id); }}
                        disabled={loadingJoin === game.id || isFull}
                        className={`text-[11px] font-bold px-3 py-1 rounded transition-all ${
                          isFull
                            ? "bg-gray-100 text-gray-400"
                            : "bg-blue-500 text-white active:scale-95"
                        }`}
                      >
                        {loadingJoin === game.id ? "..." : isFull ? "Full" : "Join"}
                      </button>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => user ? navigate("/create-game") : toast("Sign in to create a game 👋", { action: { label: "Sign in", onClick: () => navigate("/") } })}
        className="fixed bottom-20 right-5 z-40 w-14 h-14 rounded-full bg-blue-500 text-white text-2xl font-bold flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
        aria-label="Create game"
      >
        +
      </button>

      <BottomNav />
    </div>
  );
};

export default HomePage;
