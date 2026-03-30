import { useApp } from "@/lib/appContext";
import { BottomNav } from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { profile, logout } = useApp();
  const navigate = useNavigate();
  const firstName = profile?.name || "Player";
  const initials = firstName.slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="flex flex-col items-center pt-10 pb-4">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
          {initials}
        </div>
        <h2 className="text-xl font-bold text-foreground mt-3">{profile?.name || "Player"}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{profile?.area || "Paris"} • {profile?.email}</p>

        <div className="flex gap-2 mt-3">
          {profile?.skill_level && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#3a2a10] text-[#fb923c] uppercase">
              {profile.skill_level}
            </span>
          )}
          {profile?.preferred_sports?.map((s) => (
            <span key={s} className="text-xs font-medium px-3 py-1 rounded-full bg-[#1a1a2e] text-[#a29bfe]">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="px-5 grid grid-cols-3 gap-3">
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <p className="text-xl font-bold text-primary">0</p>
          <p className="text-xs text-muted-foreground mt-0.5">Games</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <p className="text-xl font-bold text-success">0</p>
          <p className="text-xs text-muted-foreground mt-0.5">Friends</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <p className="text-xl font-bold text-warning">—</p>
          <p className="text-xs text-muted-foreground mt-0.5">Rating</p>
        </div>
      </div>

      <div className="px-5 mt-8">
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-2xl border border-border text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
        >
          Log out
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
