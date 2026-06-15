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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 h-16">
      <div className="max-w-lg mx-auto flex items-center justify-around h-full px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          if (tab.isCenter) {
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold -translate-y-4 shadow-[0_4px_20px_rgba(59,130,246,0.3)] transition-transform active:scale-95"
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
                className={`text-lg w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                  isActive ? "bg-blue-100" : ""
                }`}
              >
                {tab.icon}
              </span>
              <span
                className={`text-[10px] font-medium ${isActive ? "text-blue-600" : "text-gray-500"}`}
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
