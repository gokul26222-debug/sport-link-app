import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";

const sportEmojis: Record<string, string> = {
  Football: "⚽", Tennis: "🎾", Basketball: "🏀",
  Badminton: "🏸", Running: "🏃", Padel: "🎾",
};

const mockLeaderboard = [
  { name: "Rayan B.", games: 41, pts: 820, sport: "Tennis", mvps: 12, streak: 8 },
  { name: "Emma L.", games: 22, pts: 610, sport: "Football", mvps: 8, streak: 5 },
  { name: "Lucas M.", games: 18, pts: 540, sport: "Football", mvps: 5, streak: 3 },
  { name: "Léa P.", games: 35, pts: 510, sport: "Running", mvps: 0, streak: 12 },
  { name: "Karim D.", games: 15, pts: 420, sport: "Padel", mvps: 3, streak: 2 },
  { name: "Sarah K.", games: 7, pts: 280, sport: "Basketball", mvps: 1, streak: 1 },
  { name: "Yuki T.", games: 12, pts: 260, sport: "Badminton", mvps: 2, streak: 0 },
  { name: "Omar S.", games: 4, pts: 120, sport: "Football", mvps: 0, streak: 1 },
];

const tabs = ["Points", "Games", "MVPs"];

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState("Points");

  const sorted = [...mockLeaderboard].sort((a, b) => {
    if (activeTab === "Points") return b.pts - a.pts;
    if (activeTab === "Games") return b.games - a.games;
    return b.mvps - a.mvps;
  });

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-24">
      {/* Header */}
      <div className="px-5 pt-8 pb-2">
        <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Paris · This month</p>
      </div>

      {/* Tabs */}
      <div className="px-5 mt-4 mb-6">
        <div className="flex gap-1 bg-[#13131A] rounded-xl p-1 border border-[#2a2a3a]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab ? "bg-[#d4a017] text-black" : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-4 px-5 mb-8">
        {[1, 0, 2].map((idx) => {
          const p = top3[idx];
          if (!p) return null;
          const rank = idx + 1;
          const medals = ["🥇", "🥈", "🥉"];
          const heights = [120, 160, 100];
          const sizes = ["w-14 h-14", "w-18 h-18", "w-14 h-14"];
          const initials = p.name.split(" ").map(w => w[0]).join("").slice(0, 2);
          const value = activeTab === "Points" ? `${p.pts} pts` : activeTab === "Games" ? `${p.games} games` : `${p.mvps} MVPs`;

          return (
            <div key={p.name} className="flex flex-col items-center" style={{ minWidth: 90 }}>
              <div className="relative mb-2">
                <div className={`${rank === 1 ? "w-16 h-16" : "w-14 h-14"} rounded-full flex items-center justify-center text-sm font-bold ${
                  rank === 1 ? "bg-[#d4a017] text-black ring-4 ring-[#d4a017]/30" : "bg-[#6C5CE7]/20 text-[#6C5CE7] ring-2 ring-[#6C5CE7]/20"
                }`}>
                  {initials}
                </div>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-lg">{medals[idx]}</span>
              </div>
              <p className="text-xs font-bold text-white text-center">{p.name}</p>
              <p className="text-[10px] text-gray-500">{sportEmojis[p.sport] || "🎯"} {p.sport}</p>
              <div
                className="w-full mt-2 rounded-t-xl flex items-end justify-center pb-2"
                style={{
                  height: heights[idx],
                  background: rank === 1
                    ? "linear-gradient(to top, #d4a01733, #d4a01710)"
                    : "linear-gradient(to top, #6C5CE722, #6C5CE710)",
                  borderTop: `2px solid ${rank === 1 ? "#d4a017" : "#6C5CE7"}`,
                }}
              >
                <span className={`text-sm font-bold ${rank === 1 ? "text-[#d4a017]" : "text-[#a29bfe]"}`}>{value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest of ranking */}
      <div className="px-5 space-y-2">
        {rest.map((p, i) => {
          const rank = i + 4;
          const initials = p.name.split(" ").map(w => w[0]).join("").slice(0, 2);
          const value = activeTab === "Points" ? p.pts : activeTab === "Games" ? p.games : p.mvps;
          const label = activeTab === "Points" ? "pts" : activeTab === "Games" ? "games" : "MVPs";

          return (
            <div key={p.name} className="flex items-center gap-3 bg-[#13131A] rounded-2xl border border-[#2a2a3a] p-4">
              <span className="w-7 text-center text-sm font-bold text-gray-600">{rank}</span>
              <div className="w-10 h-10 rounded-full bg-[#6C5CE7]/15 flex items-center justify-center text-xs font-bold text-[#6C5CE7]">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{p.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-500">{sportEmojis[p.sport] || "🎯"} {p.sport}</span>
                  {p.streak > 0 && (
                    <span className="text-[10px] text-orange-400">🔥 {p.streak}</span>
                  )}
                  {p.mvps > 0 && (
                    <span className="text-[10px] text-[#d4a017]">🏆 {p.mvps}</span>
                  )}
                </div>
              </div>
              <span className="text-sm font-bold text-[#d4a017]">{value} <span className="text-[10px] text-gray-500 font-normal">{label}</span></span>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default LeaderboardPage;
