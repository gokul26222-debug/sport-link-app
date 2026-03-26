import { useApp } from "@/lib/appContext";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Sport, allSports, sportEmojis } from "@/lib/mockData";
import { User, LogOut, Trophy } from "lucide-react";

const ProfilePage = () => {
  const { user, logout, updateProfile, joinedGameIds, games } = useApp();
  const joinedGames = games.filter((g) => joinedGameIds.includes(g.id));

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Profile</h1>
      </div>

      <div className="px-5 space-y-4">
        {/* Avatar & Info */}
        <div className="bg-card rounded-2xl p-5 border border-border/50 flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/15 rounded-full flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-foreground">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        {/* Preferred Sport */}
        <div className="bg-card rounded-2xl p-5 border border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-3">Preferred Sport</h3>
          <div className="flex gap-2 flex-wrap">
            {allSports.slice(0, 4).map((s) => (
              <button
                key={s}
                onClick={() => updateProfile({ preferredSport: s })}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  user?.preferredSport === s
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {sportEmojis[s]} {s}
              </button>
            ))}
          </div>
        </div>

        {/* Joined Games */}
        <div className="bg-card rounded-2xl p-5 border border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Your Games ({joinedGames.length})</h3>
          </div>
          {joinedGames.length === 0 ? (
            <p className="text-sm text-muted-foreground">No games joined yet. Go find one!</p>
          ) : (
            <div className="space-y-2">
              {joinedGames.map((g) => (
                <div key={g.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div className="flex items-center gap-2">
                    <span>{sportEmojis[g.sport]}</span>
                    <span className="text-sm text-foreground">{g.sport}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{g.date}, {g.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button variant="outline" onClick={logout} className="w-full h-12 rounded-2xl text-muted-foreground border-border/50 hover:bg-card hover:text-foreground">
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
