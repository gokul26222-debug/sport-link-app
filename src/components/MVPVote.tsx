import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

interface Participant {
  user_id: string;
  name: string;
}

interface MVPVoteProps {
  gameId: string;
  participants: Participant[];
  currentUserId: string;
  onClose: () => void;
}

const MVPVote = ({ gameId, participants, currentUserId, onClose }: MVPVoteProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [mvpName, setMvpName] = useState("");

  const votablePlayers = participants.filter(p => p.user_id !== currentUserId);

  const handleSubmit = () => {
    if (!selectedId) return;

    const votes = JSON.parse(localStorage.getItem("mvp_votes") || "{}");
    if (!votes[gameId]) votes[gameId] = {};
    votes[gameId][currentUserId] = selectedId;

    const allVotes = Object.values(votes[gameId]) as string[];
    const counts: Record<string, number> = {};
    allVotes.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
    const winnerId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];

    const mvpCounts = JSON.parse(localStorage.getItem("mvp_counts") || "{}");
    if (winnerId) {
      mvpCounts[winnerId] = (mvpCounts[winnerId] || 0) + 1;
      localStorage.setItem("mvp_counts", JSON.stringify(mvpCounts));
    }

    localStorage.setItem("mvp_votes", JSON.stringify(votes));

    const winner = participants.find(p => p.user_id === winnerId);
    setMvpName(winner?.name || "Player");
    setSubmitted(true);
    toast.success("Vote submitted! 🏆");
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-sm bg-[#13131A] rounded-3xl border border-[#2a2a3e] p-8 text-center animate-[bounceIn_0.5s_ease-out]">
          <div className="w-20 h-20 rounded-full bg-[#d4a017]/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🏆</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">MVP Revealed!</h2>
          <p className="text-[#d4a017] font-semibold text-lg mb-2">{mvpName}</p>
          <p className="text-sm text-gray-500 mb-6">was voted Most Valuable Player</p>

          <div className="flex justify-center gap-1 mb-6">
            {["🎉", "⭐", "🔥", "⭐", "🎉"].map((e, i) => (
              <span key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 100}ms` }}>{e}</span>
            ))}
          </div>

          <button onClick={onClose} className="w-full py-3 rounded-2xl bg-[#d4a017] text-black font-semibold text-sm">
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#13131A] rounded-t-3xl border-t border-[#2a2a3e] p-6 pb-8 animate-[slideUp_0.3s_ease-out]">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1a1a2e] flex items-center justify-center">
          <X className="w-4 h-4 text-gray-400" />
        </button>

        <div className="text-center mb-6">
          <span className="text-3xl mb-2 block">🏆</span>
          <h2 className="text-lg font-bold text-white">Who was the MVP?</h2>
          <p className="text-xs text-gray-500 mt-1">Vote for the best player this game</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {votablePlayers.map((p) => {
            const initials = p.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
            const isSelected = selectedId === p.user_id;
            return (
              <button
                key={p.user_id}
                onClick={() => setSelectedId(p.user_id)}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? "border-[#d4a017] bg-[#d4a017]/10 scale-[1.03]"
                    : "border-[#2a2a3e] bg-[#0A0A0F] hover:border-[#3a3a4e]"
                }`}
              >
                <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold ${
                  isSelected ? "bg-[#d4a017] text-black" : "bg-[#6C5CE7]/20 text-[#6C5CE7]"
                }`}>
                  {initials}
                </div>
                <p className={`text-sm font-medium ${isSelected ? "text-[#d4a017]" : "text-white"}`}>
                  {p.name}
                </p>
                {isSelected && <span className="text-xs text-[#d4a017] mt-1 block">Selected ✓</span>}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedId}
          className="w-full h-12 rounded-2xl text-sm font-semibold disabled:opacity-40 transition-all bg-[#d4a017] text-black"
        >
          Submit Vote
        </button>
      </div>
    </div>
  );
};

export default MVPVote;
