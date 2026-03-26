import { useApp } from "@/lib/appContext";
import { GameCard } from "@/components/GameCard";
import { BottomNav } from "@/components/BottomNav";
import { Sport, sportEmojis } from "@/lib/mockData";
import { MapPin, ChevronRight, Calendar, Clock, Users } from "lucide-react";

const filters: (Sport | "All")[] = ["All", "Football", "Basketball", "Tennis", "Padel"];

const HomePage = () => {
  const { user, games, sportFilter, setSportFilter, joinedGameIds } = useApp();
  const filtered = sportFilter === "All" ? games : games.filter((g) => g.sport === sportFilter);

  // Find next booked game
  const nextGame = games.find((g) => joinedGameIds.includes(g.id));

  const firstName = user?.name?.split(" ")[0] || "Player";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Good evening</p>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Hey, {firstName} 👋</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-semibold text-primary">
            {firstName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Next Game Banner */}
      <div className="px-5 mt-4">
        {nextGame ? (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 p-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/5 rounded-full -translate-y-10 translate-x-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-foreground/5 rounded-full translate-y-8 -translate-x-8" />
            <p className="text-xs font-medium text-primary-foreground/70 uppercase tracking-wider">Your next game</p>
            <h3 className="text-lg font-bold text-primary-foreground mt-1">
              {sportEmojis[nextGame.sport]} {nextGame.sport}
            </h3>
            <div className="flex items-center gap-4 mt-3 text-sm text-primary-foreground/80">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {nextGame.location}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1.5 text-sm text-primary-foreground/80">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {nextGame.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {nextGame.time}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {nextGame.currentPlayers}/{nextGame.maxPlayers}
              </span>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 p-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/5 rounded-full -translate-y-10 translate-x-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-foreground/5 rounded-full translate-y-8 -translate-x-8" />
            <p className="text-xs font-medium text-primary-foreground/70 uppercase tracking-wider">Your next game</p>
            <h3 className="text-lg font-bold text-primary-foreground mt-1">No upcoming games</h3>
            <p className="text-sm text-primary-foreground/70 mt-1">Join a game below to get started!</p>
          </div>
        )}
      </div>

      {/* Sport Filter Tabs */}
      <div className="px-5 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
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
              {f === "All" ? "All" : `${sportEmojis[f]} ${f}`}
            </button>
          ))}
        </div>
      </div>

      {/* Live Games Feed */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-foreground">Live games near you</h2>
          <span className="text-xs text-muted-foreground flex items-center gap-0.5">
            <MapPin className="w-3 h-3" /> Paris
          </span>
        </div>
        <div className="space-y-3">
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
      </div>

      <BottomNav />
    </div>
  );
};

export default HomePage;
