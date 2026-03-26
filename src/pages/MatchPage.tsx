import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";

const mockPlayers = [
  { name: "Lucas M.", sport: "Football", level: "intermediate", zone: "Montmartre", age: 24, games: 18, rating: 4.9 },
  { name: "Sarah K.", sport: "Basketball", level: "beginner", zone: "Marais", age: 22, games: 7, rating: 4.7 },
  { name: "Rayan B.", sport: "Tennis", level: "advanced", zone: "Saint-Germain", age: 27, games: 41, rating: 4.8 },
  { name: "Emma L.", sport: "Football", level: "intermediate", zone: "Bastille", age: 25, games: 22, rating: 5.0 },
];

const levelStyles: Record<string, string> = {
  beginner: "bg-[#1a3a1a] text-[#4ade80]",
  intermediate: "bg-[#3a2a10] text-[#fb923c]",
  advanced: "bg-[#3a1a1a] text-[#f87171]",
};

const MatchPage = () => {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const player = mockPlayers[index];
  const initials = player.name.split(" ").map((w) => w[0]).join("");

  const next = () => {
    setAnimating(true);
    setTimeout(() => {
      setIndex((i) => (i + 1) % mockPlayers.length);
      setAnimating(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-background pb-24 flex flex-col">
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-foreground">Find a match</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Swipe to connect with players</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-5">
        <div className={`w-full max-w-sm bg-card rounded-2xl border border-border p-6 transition-all duration-200 ${animating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center mb-3">
              <span className="text-xl font-bold text-primary">{initials}</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">{player.name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{player.zone}, Paris • {player.age} yrs</p>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-[#1a1a2e] text-[#a29bfe]">
              {player.sport}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase ${levelStyles[player.level]}`}>
              {player.level}
            </span>
          </div>

          <div className="h-px bg-border my-5" />

          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{player.games}</p>
              <p className="text-xs text-muted-foreground">Games</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-lg font-bold text-warning">{player.rating} ★</p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="flex gap-3 max-w-sm mx-auto">
          <button onClick={next} className="flex-1 h-12 rounded-2xl border border-primary text-primary font-semibold text-sm">
            Skip
          </button>
          <button onClick={() => { toast.success(`Request sent to ${player.name}!`); next(); }} className="flex-1 h-12 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm">
            Join game
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default MatchPage;
