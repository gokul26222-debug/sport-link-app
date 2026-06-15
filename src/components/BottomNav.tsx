import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { icon: "🏠", label: "Home", path: "/", isCenter: false },
  { icon: "🗺️", label: "Map", path: "/map", isCenter: false },
  { icon: "➕", label: "", path: "/create-game", isCenter: true },
  { icon: "👥", label: "Crews", path: "/crews", isCenter: false },
  { icon: "👤", label: "Profile", path: "/profile", isCenter: false },
];

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0F] border-t border-white/10 h-16">
      <div className="max-w-lg mx-auto flex items-center justify-around h-full px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          if (tab.isCenter) {
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="w-14 h-14 rounded-full bg-[#d4a017] flex items-center justify-center text-black text-2xl font-bold -translate-y-4 shadow-[0_4px_20px_#d4a01760] transition-transform active:scale-95"
              >
                {tab.icon}
              </button>
            );
          }

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 flex-1"
            >
              <span
                className={`text-lg w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                  isActive ? "bg-[#d4a017]/20" : ""
                }`}
              >
                {tab.icon}
              </span>
              <span
                className={`text-[10px] font-medium ${isActive ? "text-[#d4a017]" : "text-[#666666]"}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
