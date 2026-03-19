import { useApp } from "@/lib/appContext";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Sport } from "@/lib/mockData";
import { User, LogOut, Trophy } from "lucide-react";

const sports: Sport[] = ["Football", "Cricket", "Badminton"];
const sportEmojis: Record<Sport, string> = { Football: "⚽", Cricket: "🏏", Badminton: "🏸" };

const ProfilePage = () => {
  const { user, logout, updateProfile, joinedGameIds, games } = useApp();

  const joinedGames = games.filter((g) => joinedGameIds.includes(g.id));

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-5 pt-6 pb-4">
        <h1 className="font-heading text-2xl font-bold text-foreground">Profile</h1>
      </div>

      <div className="px-5 space-y-5">
        {/* Avatar & Info */}
        <div className="bg-card rounded-xl p-5 border border-border flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-semibold text-lg text-foreground">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        {/* Preferred Sport */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Preferred Sport</h3>
          <div className="flex gap-2">
            {sports.map((s) => (
              <button
                key={s}
                onClick={() => updateProfile({ preferredSport: s })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  user?.preferredSport === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {sportEmojis[s]} {s}
              </button>
            ))}
          </div>
        </div>

        {/* Joined Games */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Your Games ({joinedGames.length})</h3>
          </div>
          {joinedGames.length === 0 ? (
            <p className="text-sm text-muted-foreground">No games joined yet. Go find one!</p>
          ) : (
            <div className="space-y-2">
              {joinedGames.map((g) => (
                <div key={g.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
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

        <Button variant="outline" onClick={logout} className="w-full h-12 rounded-xl text-muted-foreground">
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
