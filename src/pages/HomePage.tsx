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

const liveScores = [
  { home: "PSG", away: "Marseille", homeScore: 2, awayScore: 1, minute: "78'", league: "Ligue 1" },
  { home: "France", away: "Germany", homeScore: 1, awayScore: 1, minute: "45+2'", league: "UEFA" },
  { home: "Barcelona", away: "Real Madrid", homeScore: 3, awayScore: 2, minute: "90+1'", league: "La Liga" },
];

const sportConfig: Record<string, { emoji: string; bg: string }> = {
  Football: { emoji: "⚽", bg: "bg-green-900/60" },
  Tennis: { emoji: "🎾", bg: "bg-yellow-900/60" },
  Basketball: { emoji: "🏀", bg: "bg-orange-900/60" },
  Badminton: { emoji: "🏸", bg: "bg-purple-900/60" },
  Running: { emoji: "🏃", bg: "bg-blue-900/60" },
  Padel: { emoji: "🎾", bg: "bg-teal-900/60" },
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
    if (!user) return;
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
    <div className="min-h-screen bg-[#0A0A0F] pb-24">
      {/* Header */}
      <div className="px-5 pt-8 pb-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium">{getGreeting()}</p>
          <h1 className="text-xl font-bold text-white mt-0.5">Hey, {firstName} 👋</h1>
          <p className="text-xs text-gray-500 mt-0.5">Find your next game in Paris 🎯</p>
        </div>
        <button
          onClick={() => navigate("/profile")}
          className="w-11 h-11 rounded-full bg-[#6C5CE7] flex items-center justify-center text-sm font-bold text-white shrink-0 active:scale-95 transition-transform"
        >
          {firstName.slice(0, 2).toUpperCase()}
        </button>
      </div>

      {/* Live Scores Carousel */}
      <div className="mt-2">
        <p className="text-[11px] font-semibold text-[#d4a017] uppercase tracking-widest mb-2 px-5">
          Live Scores
        </p>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none px-5">
          {liveScores.map((match, i) => (
            <div
              key={i}
              className="shrink-0 bg-[#13131A] border border-[#2a2a3a] rounded-2xl px-4 py-3 min-w-[165px]"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                <span className="text-[10px] font-bold text-red-400 uppercase">{match.minute}</span>
                <span className="text-[10px] text-gray-500 ml-auto shrink-0">{match.league}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white truncate flex-1">{match.home}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-base font-black text-white">{match.homeScore}</span>
                  <span className="text-gray-600 text-xs">–</span>
                  <span className="text-base font-black text-white">{match.awayScore}</span>
                </div>
                <span className="text-xs font-bold text-white truncate flex-1 text-right">{match.away}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Now Stories */}
      <div className="mt-5">
        <p className="text-[11px] font-semibold text-[#d4a017] uppercase tracking-widest mb-3 px-5">
          Live Now
        </p>
        {liveNowGames.length === 0 ? (
          <div className="flex items-center gap-3 px-5 text-gray-500 text-xs">
            <div className="w-14 h-14 rounded-full bg-[#13131A] border border-[#2a2a3a] flex items-center justify-center text-xl shrink-0">
              😴
            </div>
            <span>No live games right now</span>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none px-5">
            {liveNowGames.map((game) => {
              const emoji = sportEmojis[game.sport] || "🎯";
              return (
                <button
                  key={game.id}
                  onClick={() => navigate(`/game/${game.id}`)}
                  className="shrink-0 flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <div className="w-14 h-14 rounded-full bg-[#13131A] flex items-center justify-center text-2xl ring-2 ring-[#d4a017] ring-offset-2 ring-offset-[#0A0A0F]">
                    {emoji}
                  </div>
                  <span className="text-[10px] text-gray-400 max-w-[56px] text-center truncate">
                    {game.title || game.sport}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="mt-5 px-5">
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {[
            { label: "My Games", emoji: "🎮", path: "/my-games" },
            { label: "Crews", emoji: "👥", path: "/crews" },
            { label: "Events", emoji: "🎪", path: "/events" },
            { label: "Book Court", emoji: "🏟️", path: "/book" },
          ].map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#13131A] border border-[#2a2a3a] hover:border-[#d4a017]/30 transition-all active:scale-95"
            >
              <span className="text-base">{link.emoji}</span>
              <span className="text-xs font-medium text-gray-300">{link.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter chips */}
      <div className="mt-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none px-5">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                activeFilter === f
                  ? "bg-[#d4a017] text-black"
                  : "bg-[#13131A] text-gray-400 border border-[#2a2a3a]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Game Feed */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">
            {loading
              ? "Loading games..."
              : filtered.length > 0
              ? `${filtered.length} game${filtered.length !== 1 ? "s" : ""} near you`
              : "No games found"}
          </h2>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#13131A] rounded-2xl border border-[#2a2a3a] p-4 animate-pulse"
              >
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#2a2a3a]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#2a2a3a] rounded w-3/4" />
                    <div className="h-3 bg-[#2a2a3a] rounded w-1/2" />
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
            const isFirstTimer = game.current_players < 2;

            return (
              <div
                key={game.id}
                className="bg-[#13131A] rounded-2xl border border-[#2a2a3a] p-4 cursor-pointer hover:border-[#d4a017]/40 transition-all active:scale-[0.99]"
                onClick={() => navigate(`/game/${game.id}`)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center text-2xl shrink-0`}
                  >
                    {config.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-semibold text-white text-sm truncate">
                        {game.title || game.sport}
                      </p>
                      {isFirstTimer && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-900/40 text-yellow-400 whitespace-nowrap shrink-0">
                          First Timer 🌟
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] mt-0.5 text-[#d4a017] font-medium">{game.sport}</p>
                    <p className="text-xs text-gray-500 mt-1">📍 {game.location}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      🕐 {formatScheduled(game.scheduled_at, game.date, game.time)}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        skillStyles[skillLabel] || skillStyles["all"]
                      }`}
                    >
                      {skillLabel === "all" ? "All" : skillLabel}
                    </span>
                    {isJoined ? (
                      <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-green-900/40 text-green-400">
                        You're in ✓
                      </span>
                    ) : (
                      <button
                        onClick={(e) => handleJoin(e, game.id)}
                        disabled={loadingJoin === game.id || isFull}
                        className={`text-[11px] font-bold px-4 py-1.5 rounded-full transition-all disabled:opacity-50 ${
                          isFull
                            ? "bg-[#2a2a3a] text-gray-500"
                            : "bg-[#d4a017] text-black active:scale-95"
                        }`}
                      >
                        {loadingJoin === game.id ? "..." : isFull ? "Full" : "Join"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2a2a3a]">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      {Array.from({ length: Math.min(game.current_players, 3) }).map((_, j) => (
                        <div
                          key={j}
                          className="w-5 h-5 rounded-full bg-[#2a2a3a] border border-[#13131A]"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {game.current_players}/{game.max_players} players
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-600 font-medium">2 from your area</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate("/create-game")}
        className="fixed bottom-20 right-5 z-40 w-14 h-14 rounded-full bg-[#d4a017] text-black text-2xl font-bold flex items-center justify-center shadow-lg shadow-[#d4a017]/30 active:scale-95 transition-all"
        aria-label="Create game"
      >
        +
      </button>

      <BottomNav />
    </div>
  );
};

export default HomePage;
