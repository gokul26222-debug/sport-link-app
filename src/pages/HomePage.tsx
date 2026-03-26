import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";

const mockGames = [
  { sport: "⚽", name: "Football", zone: "Buttes-Chaumont, 19e", time: "18:30", level: "intermediate", players: 4, max: 6, type: "football" },
  { sport: "🏀", name: "Basketball", zone: "République, 10e", time: "19:00", level: "beginner", players: 2, max: 5, type: "basketball" },
  { sport: "🎾", name: "Tennis", zone: "Bois de Boulogne, 16e", time: "10:00", level: "advanced", players: 1, max: 2, type: "tennis" },
  { sport: "🏐", name: "Volleyball", zone: "Champ de Mars, 7e", time: "17:00", level: "beginner", players: 5, max: 8, type: "volleyball" },
  { sport: "🏸", name: "Badminton", zone: "Nation, 12e", time: "20:00", level: "intermediate", players: 2, max: 4, type: "badminton" },
  { sport: "🎾", name: "Padel", zone: "Boulogne-Billancourt", time: "09:30", level: "intermediate", players: 3, max: 4, type: "padel" },
];

const filters = ["All sports", "Football", "Basketball", "Tennis", "Padel"];

const levelStyles: Record<string, string> = {
  beginner: "bg-[#1a3a1a] text-[#4ade80]",
  intermediate: "bg-[#3a2a10] text-[#fb923c]",
  advanced: "bg-[#3a1a1a] text-[#f87171]",
};

const HomePage = () => {
  const [activeFilter, setActiveFilter] = useState("All sports");
  const filtered = activeFilter === "All sports" ? mockGames : mockGames.filter((g) => g.name === activeFilter);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Good morning</p>
          <h1 className="text-xl font-bold text-foreground">Hey, Gokul 👋</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
          GK
        </div>
      </div>

      {/* Next Game Banner */}
      <div className="px-5 mt-4">
        <div className="relative overflow-hidden rounded-2xl p-5" style={{ background: "linear-gradient(135deg, #6C5CE7, #a29bfe)" }}>
          <p className="text-xs font-medium text-white/70 uppercase tracking-wider">Your next game</p>
          <h3 className="text-lg font-bold text-white mt-1">⚽ Football</h3>
          <p className="text-sm text-white/80 mt-1">Buttes-Chaumont, 19e • 18:30</p>
          <p className="text-sm text-white/70 mt-0.5">4/6 players</p>
          <span className="absolute top-4 right-5 text-4xl opacity-30">⚽</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-muted-foreground border border-[#333]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Live Games */}
      <div className="px-5 mt-5">
        <h2 className="text-base font-semibold text-foreground mb-3">Live games near you</h2>
        <div className="space-y-3">
          {filtered.map((game, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#1a1a2e] flex items-center justify-center text-2xl shrink-0">
                  {game.sport}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{game.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{game.zone}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-foreground">{game.time}</p>
                  <p className="text-xs text-muted-foreground">{game.players}/{game.max} players</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${levelStyles[game.level]}`}>
                  {game.level}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {Array.from({ length: Math.min(game.players, 3) }).map((_, j) => (
                      <div key={j} className="w-6 h-6 rounded-full bg-[#2a2a3a] border-2 border-card" />
                    ))}
                  </div>
                  <button className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full">
                    Join
                  </button>
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
