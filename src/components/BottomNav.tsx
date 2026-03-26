import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { emoji: "🏠", label: "Home", path: "/" },
  { emoji: "🤝", label: "Match", path: "/match" },
  { emoji: "🏟️", label: "Book", path: "/book" },
  { emoji: "🏆", label: "Rank", path: "/leaderboard" },
  { emoji: "👤", label: "Me", path: "/profile" },
];

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50" style={{ background: "#0A0A0F", borderTop: "0.5px solid #222" }}>
      <div className="max-w-lg mx-auto flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5"
            >
              <span
                className={`text-lg w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                  isActive ? "bg-[#6C5CE722]" : ""
                }`}
              >
                {tab.emoji}
              </span>
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? "#6C5CE7" : "#666" }}
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
