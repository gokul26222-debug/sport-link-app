import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";

interface Player {
  name: string;
  sport: string;
  level: string;
  zone: string;
  games: number;
  rating: number;
  mvps: number;
}

const mockPlayers: Player[] = [
  { name: "Lucas M.", sport: "Football", level: "intermediate", zone: "Montmartre", games: 18, rating: 4.9, mvps: 5 },
  { name: "Sarah K.", sport: "Basketball", level: "beginner", zone: "Marais", games: 2, rating: 4.7, mvps: 0 },
  { name: "Rayan B.", sport: "Tennis", level: "advanced", zone: "Saint-Germain", games: 41, rating: 4.8, mvps: 12 },
  { name: "Emma L.", sport: "Football", level: "intermediate", zone: "Bastille", games: 22, rating: 5.0, mvps: 8 },
  { name: "Karim D.", sport: "Padel", level: "intermediate", zone: "Oberkampf", games: 15, rating: 4.6, mvps: 3 },
  { name: "Léa P.", sport: "Running", level: "advanced", zone: "République", games: 35, rating: 4.9, mvps: 0 },
  { name: "Yuki T.", sport: "Badminton", level: "intermediate", zone: "Nation", games: 12, rating: 4.5, mvps: 2 },
  { name: "Omar S.", sport: "Football", level: "beginner", zone: "Belleville", games: 1, rating: 0, mvps: 0 },
];

const sportEmojis: Record<string, string> = {
  Football: "⚽",
  Basketball: "🏀",
  Tennis: "🎾",
  Padel: "🎾",
  Running: "🏃",
  Badminton: "🏸",
};

const levelStyles: Record<string, string> = {
  beginner: "bg-green-900/40 text-green-400",
  intermediate: "bg-orange-900/40 text-orange-400",
  advanced: "bg-red-900/40 text-red-400",
};

const sportFilters = ["All", "Football", "Basketball", "Tennis", "Padel", "Running", "Badminton"];
const sortTabs = ["Most Active", "Nearest", "Best Rated"];

const MatchPage = () => {
  const [activeSport, setActiveSport] = useState("All");
  const [activeSort, setActiveSort] = useState("Most Active");

  const filtered = mockPlayers
    .filter((p) => activeSport === "All" || p.sport === activeSport)
    .sort((a, b) => {
      if (activeSort === "Most Active") return b.games - a.games;
      if (activeSort === "Best Rated") return b.rating - a.rating;
      return 0; // "Nearest" — no real location data, keep order
    });

  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-3">
        <h1 className="text-2xl font-bold text-white">Players Near You</h1>
        <p className="text-sm text-white/40 mt-0.5">Connect with athletes in Paris</p>
      </div>

      {/* Sport filter chips */}
      <div className="px-5 mb-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {sportFilters.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSport(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeSport === s
                  ? "bg-[#d4a017] text-black"
                  : "bg-transparent text-white/50 border border-white/10"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Sort tabs */}
      <div className="px-5 mb-4">
        <div className="flex gap-1 bg-[#13131A] rounded-xl p-1">
          {sortTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSort(tab)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSort === tab
                  ? "bg-[#d4a017] text-black"
                  : "text-white/40"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Player grid */}
      <div className="px-5 grid grid-cols-2 gap-3">
        {filtered.map((player) => {
          const initials = player.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          const emoji = sportEmojis[player.sport] || "🎯";
          const isFirstTimer = player.games < 3;

          return (
            <div
              key={player.name}
              className="bg-[#13131A] rounded-2xl border border-white/5 p-4 flex flex-col gap-2"
            >
              {/* First Timer badge */}
              {isFirstTimer && (
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-[#d4a017]/15 text-[#d4a017] self-start">
                  First Timer 🌟
                </span>
              )}

              {/* Avatar */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-14 h-14 rounded-full bg-[#6C5CE7]/20 border-2 border-[#6C5CE7]/40 flex items-center justify-center">
                  <span className="text-base font-bold text-[#6C5CE7]">{initials}</span>
                </div>
                <p className="text-sm font-bold text-white text-center">{player.name}</p>
                <p className="text-[10px] text-white/40 text-center">{player.zone}</p>
              </div>

              {/* Sport + level */}
              <div className="flex flex-wrap gap-1 justify-center">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#6C5CE7]/15 text-[#6C5CE7]">
                  {emoji} {player.sport}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${levelStyles[player.level] || ""}`}>
                  {player.level}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between px-1">
                <div className="text-center">
                  <p className="text-sm font-bold text-white">{player.games}</p>
                  <p className="text-[9px] text-white/30">Games</p>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="text-center">
                  <p className="text-sm font-bold text-[#d4a017]">
                    {player.rating > 0 ? `${"⭐".repeat(Math.round(player.rating))}` : "New"}
                  </p>
                  <p className="text-[9px] text-white/30">Rating</p>
                </div>
              </div>

              {/* Connect button */}
              <button
                onClick={() => toast.success("Connection request sent!")}
                className="w-full py-2 rounded-xl bg-[#d4a017] text-black text-xs font-bold transition-all active:scale-95"
              >
                Connect
              </button>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default MatchPage;
