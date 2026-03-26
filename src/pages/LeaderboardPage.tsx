import { BottomNav } from "@/components/BottomNav";

const mockLeaderboard = [
  { name: "Rayan B.", games: 41, pts: 820, sport: "🎾", medal: "🥇" },
  { name: "Emma L.", games: 22, pts: 610, sport: "⚽", medal: "🥈" },
  { name: "Lucas M.", games: 18, pts: 540, sport: "⚽", medal: "🥉" },
  { name: "Gokul", games: 14, pts: 420, sport: "⚽", medal: "" },
  { name: "Sarah K.", games: 7, pts: 280, sport: "🏀", medal: "" },
];

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Paris — this month</p>
      </div>

      {/* Stat boxes */}
      <div className="px-5 mt-4 grid grid-cols-3 gap-3">
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <p className="text-xl font-bold text-primary">248</p>
          <p className="text-xs text-muted-foreground mt-0.5">Players</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <p className="text-xl font-bold text-success">94</p>
          <p className="text-xs text-muted-foreground mt-0.5">Games</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <p className="text-xl font-bold text-warning">12</p>
          <p className="text-xs text-muted-foreground mt-0.5">Courts</p>
        </div>
      </div>

      {/* Rankings */}
      <div className="px-5 mt-5 space-y-2">
        {mockLeaderboard.map((p, i) => {
          const isMe = p.name === "Gokul";
          const initials = p.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
          return (
            <div
              key={i}
              className={`flex items-center gap-3 bg-card rounded-2xl border p-4 ${
                isMe ? "border-primary" : "border-border"
              }`}
            >
              <span className="w-7 text-center text-sm font-bold text-muted-foreground">
                {p.medal || `${i + 1}`}
              </span>
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.games} games</p>
              </div>
              <span className="text-lg mr-2">{p.sport}</span>
              <span className="text-sm font-bold text-warning">{p.pts} pts</span>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default LeaderboardPage;
