import { BottomNav } from "@/components/BottomNav";

const mockProfileGames = [
  { sport: "⚽", name: "Football", zone: "Buttes-Chaumont", date: "Mar 20", result: "Won" },
  { sport: "🏀", name: "Basketball", zone: "République", date: "Mar 15", result: "Played" },
  { sport: "⚽", name: "Football", zone: "Nation", date: "Mar 10", result: "Won" },
];

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Avatar & Info */}
      <div className="flex flex-col items-center pt-10 pb-4">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
          GK
        </div>
        <h2 className="text-xl font-bold text-foreground mt-3">Gokul</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Paris, France • Member since 2025</p>

        <div className="flex gap-2 mt-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#3a2a10] text-[#fb923c] uppercase">Intermediate</span>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#1a1a2e] text-[#a29bfe]">Football</span>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#1a1a2e] text-[#a29bfe]">Basketball</span>
        </div>
      </div>

      {/* Stat boxes */}
      <div className="px-5 grid grid-cols-3 gap-3">
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <p className="text-xl font-bold text-primary">14</p>
          <p className="text-xs text-muted-foreground mt-0.5">Games</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <p className="text-xl font-bold text-success">32</p>
          <p className="text-xs text-muted-foreground mt-0.5">Friends</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <p className="text-xl font-bold text-warning">4.8</p>
          <p className="text-xs text-muted-foreground mt-0.5">Rating</p>
        </div>
      </div>

      {/* Recent Games */}
      <div className="px-5 mt-6">
        <h3 className="text-base font-semibold text-foreground mb-3">Recent games</h3>
        <div className="space-y-2">
          {mockProfileGames.map((g, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1a1a2e] flex items-center justify-center text-xl shrink-0">
                {g.sport}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{g.name}</p>
                <p className="text-xs text-muted-foreground">{g.zone} • {g.date}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                g.result === "Won" ? "bg-[#1a3a1a] text-[#4ade80]" : "bg-primary/15 text-primary"
              }`}>
                {g.result}
              </span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
