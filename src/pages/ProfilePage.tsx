import { useState, useEffect } from "react";
import { useApp } from "@/lib/appContext";
import { BottomNav } from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface GameHistory {
  id: string;
  sport: string;
  title: string | null;
  location: string;
  scheduled_at: string | null;
  date: string;
  time: string;
}

const sportConfig: Record<string, string> = {
  Football: "⚽",
  Tennis: "🎾",
  Basketball: "🏀",
  Badminton: "🏸",
  Running: "🏃",
  Padel: "🎾",
};

const requestNotifications = async () => {
  if ("Notification" in window) {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      toast.success("Notifications enabled!");
    }
  }
};

const ProfilePage = () => {
  const { profile, user, logout } = useApp();
  const navigate = useNavigate();

  const firstName = profile?.name || "Player";
  const initials = firstName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const mvpCount = parseInt(localStorage.getItem("mvpCount") || "0", 10);
  const streak = parseInt(localStorage.getItem("streak") || "0", 10);
  const crewsJoined = parseInt(localStorage.getItem("crewsJoined") || "0", 10);

  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [notifEnabled, setNotifEnabled] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      const { data } = await supabase
        .from("game_participants")
        .select("game_id, games(*)")
        .eq("user_id", user.id)
        .limit(5);

      if (data) {
        setGamesPlayed(data.length);
        const history: GameHistory[] = data
          .map((row: any) => row.games)
          .filter(Boolean);
        setGameHistory(history);
      }
    };

    fetchHistory();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    await logout();
    navigate("/");
  };

  const handleNotifToggle = async () => {
    if (!notifEnabled) {
      await requestNotifications();
      setNotifEnabled(true);
    } else {
      setNotifEnabled(false);
      toast("Notifications disabled");
    }
  };

  const badges = [
    {
      label: "First Game 🌟",
      earned: gamesPlayed > 0,
      description: "Play your first game",
    },
    {
      label: `MVP × ${mvpCount} 🏆`,
      earned: mvpCount > 0,
      description: "Earn MVP award",
    },
    {
      label: "5 Game Streak 🔥",
      earned: streak >= 5,
      description: "5 games in a row",
    },
    {
      label: "Social Butterfly 🦋",
      earned: crewsJoined > 2,
      description: "Join 3+ crews",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-24">
      {/* Header */}
      <div className="flex flex-col items-center pt-10 pb-6 px-5">
        <div className="w-24 h-24 rounded-full bg-[#d4a017] flex items-center justify-center text-3xl font-bold text-black mb-3 shadow-[0_0_24px_#d4a01740]">
          {initials}
        </div>
        <h2 className="text-xl font-bold text-white">{profile?.name || "Player"}</h2>
        <p className="text-sm text-white/40 mt-0.5">{profile?.area || "Paris"}</p>
        <p className="text-xs text-white/30 mt-0.5">{profile?.email}</p>
        {profile?.skill_level && (
          <span className="mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-[#3a2a10] text-[#fb923c] uppercase">
            {profile.skill_level}
          </span>
        )}
      </div>

      {/* Stats Row */}
      <div className="px-5 grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#13131A] rounded-2xl border border-white/5 p-4 text-center">
          <p className="text-2xl font-bold text-[#d4a017]">{gamesPlayed}</p>
          <p className="text-[11px] text-white/40 mt-0.5">Games Played</p>
        </div>
        <div className="bg-[#13131A] rounded-2xl border border-white/5 p-4 text-center">
          <p className="text-2xl font-bold text-[#d4a017]">{mvpCount}</p>
          <p className="text-[11px] text-white/40 mt-0.5">MVP Awards</p>
        </div>
        <div className="bg-[#13131A] rounded-2xl border border-white/5 p-4 text-center">
          <p className="text-2xl font-bold text-[#d4a017]">{streak}</p>
          <p className="text-[11px] text-white/40 mt-0.5">Current Streak</p>
        </div>
      </div>

      {/* Badges */}
      <div className="px-5 mb-6">
        <h3 className="text-sm font-semibold text-white/70 mb-3">Badges</h3>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.label}
              className={`bg-[#13131A] rounded-2xl border p-4 flex flex-col gap-1 ${
                badge.earned ? "border-[#d4a017]/30" : "border-white/5 opacity-40"
              }`}
            >
              <span className={`text-base font-bold ${badge.earned ? "text-white" : "text-white/40"}`}>
                {badge.label}
              </span>
              <span className="text-[10px] text-white/30">{badge.description}</span>
              {!badge.earned && (
                <span className="text-[10px] text-white/20 font-medium uppercase tracking-wide">Locked</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Game History */}
      <div className="px-5 mb-6">
        <h3 className="text-sm font-semibold text-white/70 mb-3">Recent Games</h3>
        {gameHistory.length > 0 ? (
          <div className="space-y-2">
            {gameHistory.map((game) => {
              const emoji = sportConfig[game.sport] || "🎯";
              let dateStr = `${game.date} · ${game.time}`;
              if (game.scheduled_at) {
                try {
                  dateStr = format(new Date(game.scheduled_at), "EEE d MMM · HH:mm");
                } catch { /* fallback */ }
              }
              return (
                <div
                  key={game.id}
                  className="bg-[#13131A] rounded-xl border border-white/5 px-4 py-3 flex items-center gap-3"
                >
                  <span className="text-xl">{emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{game.title || game.sport}</p>
                    <p className="text-[11px] text-white/40 truncate">📍 {game.location}</p>
                  </div>
                  <span className="text-[10px] text-white/30 shrink-0">{dateStr}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-white/30 italic">No games played yet</p>
        )}
      </div>

      {/* Settings */}
      <div className="px-5 space-y-3">
        <h3 className="text-sm font-semibold text-white/70 mb-3">Settings</h3>

        {/* Notification toggle */}
        <div className="bg-[#13131A] rounded-2xl border border-white/5 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Notifications</p>
            <p className="text-[11px] text-white/30">Get alerts for new games</p>
          </div>
          <button
            onClick={handleNotifToggle}
            className={`w-11 h-6 rounded-full transition-all relative ${
              notifEnabled ? "bg-[#d4a017]" : "bg-white/10"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                notifEnabled ? "left-5" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {/* Edit Profile */}
        <button className="w-full bg-[#13131A] rounded-2xl border border-white/5 px-4 py-3 text-left text-sm font-medium text-white hover:border-[#d4a017]/30 transition-all">
          Edit Profile
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-2xl border border-white/10 text-white/40 text-sm font-medium hover:text-white hover:border-white/20 transition-all"
        >
          Log out
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
