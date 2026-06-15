import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/lib/appContext";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft } from "lucide-react";
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
  scheduled_at: string | null;
  status: string | null;
}

const sportEmojis: Record<string, string> = {
  Football: "⚽", Basketball: "🏀", Tennis: "🎾", Badminton: "🏸",
  Running: "🏃", Padel: "🎾", Volleyball: "🏐", Swimming: "🏊",
  Boxing: "🥊", "Table Tennis": "🏓",
};

const MyGamesPage = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [tab, setTab] = useState<"hosting" | "joined">("hosting");
  const [hosting, setHosting] = useState<GameRow[]>([]);
  const [joined, setJoined] = useState<GameRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      const { data: hostGames } = await supabase
        .from("games")
        .select("*")
        .eq("host_id", user.id)
        .order("scheduled_at", { ascending: false });
      if (hostGames) setHosting(hostGames);

      const { data: parts } = await supabase
        .from("game_participants")
        .select("game_id")
        .eq("user_id", user.id);
      if (parts && parts.length > 0) {
        const ids = parts.map(p => p.game_id);
        const { data: joinedGames } = await supabase
          .from("games")
          .select("*")
          .in("id", ids)
          .neq("host_id", user.id)
          .order("scheduled_at", { ascending: false });
        if (joinedGames) setJoined(joinedGames);
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  const games = tab === "hosting" ? hosting : joined;

  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-24">
      <div className="px-5 pt-6 pb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-400 mb-4 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-2xl font-bold text-white">My Games</h1>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-5">
        <div className="flex gap-1 bg-[#13131A] rounded-2xl p-1 border border-[#2a2a3e]">
          <button
            onClick={() => setTab("hosting")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === "hosting" ? "bg-[#d4a017] text-black" : "text-gray-400"
            }`}
          >
            Hosting ({hosting.length})
          </button>
          <button
            onClick={() => setTab("joined")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === "joined" ? "bg-[#d4a017] text-black" : "text-gray-400"
            }`}
          >
            Joined ({joined.length})
          </button>
        </div>
      </div>

      {/* Games list */}
      <div className="px-5 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-[#13131A] rounded-2xl border border-[#2a2a3e] p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#1a1a2e]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#1a1a2e] rounded w-3/4" />
                  <div className="h-3 bg-[#1a1a2e] rounded w-1/2" />
                </div>
              </div>
            </div>
          ))
        ) : games.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">{tab === "hosting" ? "🎮" : "🏃"}</p>
            <p className="text-gray-400 text-sm">
              {tab === "hosting" ? "You haven't hosted any games yet" : "You haven't joined any games yet"}
            </p>
            <button
              onClick={() => navigate(tab === "hosting" ? "/create-game" : "/")}
              className="mt-4 px-6 py-2.5 rounded-xl bg-[#d4a017] text-black text-sm font-semibold"
            >
              {tab === "hosting" ? "Create a game" : "Find games"}
            </button>
          </div>
        ) : (
          games.map((game) => (
            <button
              key={game.id}
              onClick={() => navigate(`/game/${game.id}`)}
              className="w-full bg-[#13131A] rounded-2xl border border-[#2a2a3e] p-4 text-left hover:border-[#d4a017]/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#1a1a2e] flex items-center justify-center text-2xl">
                  {sportEmojis[game.sport] || "🎯"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{game.title || game.sport}</p>
                  <p className="text-xs text-gray-500 mt-0.5">📍 {game.location}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    🕐 {game.scheduled_at
                      ? format(new Date(game.scheduled_at), "EEE d MMM · HH:mm")
                      : `${game.date} · ${game.time}`
                    }
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    game.status === "open" ? "bg-green-900/40 text-green-400" : "bg-gray-800 text-gray-400"
                  }`}>
                    {game.status || "open"}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">{game.current_players}/{game.max_players}</p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default MyGamesPage;
