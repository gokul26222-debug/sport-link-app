import { CheckCircle, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Player {
  id: string;
  user_id: string;
  profile?: { name: string | null; avatar_url: string | null };
}

interface PaymentConfirmationProps {
  open: boolean;
  game: { id: string; title?: string; sport: string; location: string; scheduled_at?: string; date?: string; time?: string };
  participants: Player[];
  onClose: () => void;
}

const PaymentConfirmation = ({ open, game, participants, onClose }: PaymentConfirmationProps) => {
  const navigate = useNavigate();
  if (!open) return null;

  const dateLabel = game.scheduled_at
    ? new Date(game.scheduled_at).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : `${game.date}, ${game.time}`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm bg-card border border-border rounded-3xl p-6 text-center animate-in zoom-in-95 duration-300">
        {/* Success icon */}
        <div className="w-16 h-16 rounded-full bg-green-900/40 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>

        <h2 className="text-lg font-bold text-foreground mb-1">Payment confirmed! 🎉</h2>
        <p className="text-sm text-muted-foreground mb-4">You're in the game</p>

        {/* Game info */}
        <div className="bg-secondary/50 rounded-2xl p-4 mb-4 text-left space-y-1">
          <p className="text-sm font-semibold text-foreground">{game.title || game.sport}</p>
          <p className="text-xs text-muted-foreground">📍 {game.location}</p>
          <p className="text-xs text-muted-foreground">🕐 {dateLabel}</p>
        </div>

        {/* Player list */}
        <div className="text-left mb-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Players in this game ({participants.length})
          </p>
          <div className="space-y-2 max-h-36 overflow-y-auto">
            {participants.map(p => (
              <div key={p.id} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <span className="text-sm text-foreground">{p.profile?.name || "Player"}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate(`/game/${game.id}`)}
          className="w-full h-11 rounded-2xl text-sm font-semibold text-black mb-2"
          style={{ background: "#d4a017" }}
        >
          View Game Chat
        </button>
        <button
          onClick={() => { onClose(); navigate("/"); }}
          className="w-full h-11 rounded-2xl text-sm font-medium text-muted-foreground bg-secondary"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
