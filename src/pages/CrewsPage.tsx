import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";
import { Plus, X, Users } from "lucide-react";

const mockCrews = [
  { id: "1", name: "Sunday Football Paris", sport: "Football", members: 14, vibe: "Chill", area: "Buttes-Chaumont", emoji: "⚽", schedule: "Every Sunday 10am", description: "Friendly football every Sunday. All levels welcome!" },
  { id: "2", name: "Canal Runners", sport: "Running", members: 28, vibe: "Social", area: "Canal Saint-Martin", emoji: "🏃", schedule: "Tue & Thu 7am", description: "Morning runs along the canal. Great for making friends!" },
  { id: "3", name: "Marais Basketball", sport: "Basketball", members: 9, vibe: "Competitive", area: "Le Marais", emoji: "🏀", schedule: "Wed & Sat 6pm", description: "3v3 games, bring your A-game." },
  { id: "4", name: "Tennis Doubles Club", sport: "Tennis", members: 12, vibe: "Social", area: "Bois de Boulogne", emoji: "🎾", schedule: "Sat 9am", description: "Doubles matches followed by coffee." },
  { id: "5", name: "Yoga in the Park", sport: "Yoga", members: 20, vibe: "Chill", area: "Champ de Mars", emoji: "🧘", schedule: "Daily 7am", description: "Free outdoor yoga with Eiffel Tower views." },
  { id: "6", name: "Padel Addicts", sport: "Padel", members: 16, vibe: "Competitive", area: "Boulogne", emoji: "🎾", schedule: "Fri 7pm", description: "Weekly padel sessions. Intermediate+." },
];

const vibeColors: Record<string, string> = {
  Chill: "bg-green-900/40 text-green-400",
  Social: "bg-blue-900/40 text-blue-400",
  Competitive: "bg-red-900/40 text-red-400",
};

const CrewsPage = () => {
  const [tab, setTab] = useState<"discover" | "my">("discover");
  const [joinedIds, setJoinedIds] = useState<Set<string>>(() => {
    const stored = localStorage.getItem("joined_crews");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });
  const [showCreate, setShowCreate] = useState(false);
  const [newCrew, setNewCrew] = useState({ name: "", sport: "Football", vibe: "Social", description: "", schedule: "" });

  const handleJoin = (id: string, name: string) => {
    const next = new Set(joinedIds);
    if (next.has(id)) {
      next.delete(id);
      toast("Left crew");
    } else {
      next.add(id);
      toast.success(`Joined ${name}! 🎉`);
    }
    setJoinedIds(next);
    localStorage.setItem("joined_crews", JSON.stringify([...next]));
  };

  const handleCreate = () => {
    if (!newCrew.name) { toast.error("Enter a crew name"); return; }
    toast.success("Crew created! 🚀");
    setShowCreate(false);
    setNewCrew({ name: "", sport: "Football", vibe: "Social", description: "", schedule: "" });
  };

  const myCrews = mockCrews.filter(c => joinedIds.has(c.id));
  const displayCrews = tab === "discover" ? mockCrews : myCrews;

  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Crews</h1>
          <p className="text-sm text-gray-500 mt-0.5">Join a community, play regularly</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="w-10 h-10 rounded-full bg-[#d4a017] flex items-center justify-center"
        >
          <Plus className="w-5 h-5 text-black" />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-5 mt-4 mb-5">
        <div className="flex gap-1 bg-[#13131A] rounded-2xl p-1 border border-[#2a2a3e]">
          <button
            onClick={() => setTab("discover")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === "discover" ? "bg-[#6C5CE7] text-white" : "text-gray-400"
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setTab("my")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === "my" ? "bg-[#6C5CE7] text-white" : "text-gray-400"
            }`}
          >
            My Crews ({myCrews.length})
          </button>
        </div>
      </div>

      {/* Crew list */}
      <div className="px-5 space-y-3">
        {displayCrews.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-gray-400 text-sm">No crews yet</p>
            <p className="text-gray-600 text-xs mt-1">Join a crew from Discover or create your own</p>
          </div>
        ) : (
          displayCrews.map((crew) => {
            const isMember = joinedIds.has(crew.id);
            return (
              <div key={crew.id} className="bg-[#13131A] rounded-2xl border border-[#2a2a3e] p-4 hover:border-[#3a3a4e] transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1a1a2e] flex items-center justify-center text-2xl shrink-0">
                    {crew.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white text-sm truncate">{crew.name}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${vibeColors[crew.vibe]}`}>
                        {crew.vibe}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">📍 {crew.area}</p>
                    <p className="text-xs text-gray-500 mt-0.5">🗓️ {crew.schedule}</p>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">{crew.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1a1a2e]">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Users className="w-3.5 h-3.5" />
                    <span>{crew.members} members</span>
                  </div>
                  <button
                    onClick={() => handleJoin(crew.id, crew.name)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isMember
                        ? "bg-green-900/30 text-green-400"
                        : "bg-[#d4a017] text-black"
                    }`}
                  >
                    {isMember ? "Joined ✓" : "Join"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Crew Sheet */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative w-full max-w-lg bg-[#13131A] rounded-t-3xl border-t border-[#2a2a3e] p-6 pb-8 animate-[slideUp_0.3s_ease-out]">
            <button onClick={() => setShowCreate(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1a1a2e] flex items-center justify-center">
              <X className="w-4 h-4 text-gray-400" />
            </button>

            <h2 className="text-lg font-bold text-white mb-1">Create a Crew</h2>
            <p className="text-xs text-gray-500 mb-5">Build your regular playing group</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Crew name</label>
                <input
                  value={newCrew.name}
                  onChange={(e) => setNewCrew({ ...newCrew, name: e.target.value })}
                  placeholder="e.g., Sunday Football Crew"
                  className="w-full h-11 rounded-xl bg-[#0A0A0F] border border-[#2a2a3e] px-4 text-white text-sm placeholder:text-gray-600 outline-none focus:border-[#6C5CE7]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Sport</label>
                <div className="flex gap-2 flex-wrap">
                  {["Football", "Running", "Basketball", "Tennis", "Padel", "Yoga"].map(s => (
                    <button
                      key={s}
                      onClick={() => setNewCrew({ ...newCrew, sport: s })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                        newCrew.sport === s ? "bg-[#6C5CE7] text-white" : "bg-[#0A0A0F] border border-[#2a2a3e] text-gray-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Vibe</label>
                <div className="flex gap-2">
                  {["Chill", "Social", "Competitive"].map(v => (
                    <button
                      key={v}
                      onClick={() => setNewCrew({ ...newCrew, vibe: v })}
                      className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                        newCrew.vibe === v ? "bg-[#d4a017] text-black" : "bg-[#0A0A0F] border border-[#2a2a3e] text-gray-400"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Schedule</label>
                <input
                  value={newCrew.schedule}
                  onChange={(e) => setNewCrew({ ...newCrew, schedule: e.target.value })}
                  placeholder="e.g., Every Sunday 10am"
                  className="w-full h-11 rounded-xl bg-[#0A0A0F] border border-[#2a2a3e] px-4 text-white text-sm placeholder:text-gray-600 outline-none focus:border-[#6C5CE7]"
                />
              </div>

              <button onClick={handleCreate} className="w-full h-12 rounded-2xl bg-[#d4a017] text-black font-semibold text-sm mt-2">
                Create Crew
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default CrewsPage;
