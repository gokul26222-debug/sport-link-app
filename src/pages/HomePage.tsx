import { useApp } from "@/lib/appContext";
import { GameCard } from "@/components/GameCard";
import { BottomNav } from "@/components/BottomNav";
import { Sport } from "@/lib/mockData";
import { MapPin } from "lucide-react";

const filters: (Sport | "All")[] = ["All", "Football", "Cricket", "Badminton"];

const HomePage = () => {
  const { user, games, sportFilter, setSportFilter } = useApp();
  const filtered = sportFilter === "All" ? games : games.filter((g) => g.sport === sportFilter);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Hey, {user?.name?.split(" ")[0]} 👋</p>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Find a Game</h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-card px-3 py-1.5 rounded-full border border-border/50">
            <MapPin className="w-3 h-3" />
            Bangalore
          </div>
        </div>

        {/* Sport Filter Pills */}
        <div className="flex gap-2 mt-5 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setSportFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                sportFilter === f
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-card text-muted-foreground border border-border/50 hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Games List */}
      <div className="px-5 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-4xl mb-3">🏟️</p>
            <p className="font-medium text-foreground">No games found</p>
            <p className="text-sm mt-1">Try a different filter or create a game!</p>
          </div>
        ) : (
          filtered.map((game) => <GameCard key={game.id} game={game} />)
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default HomePage;
