import { useState } from "react";
import { X, CreditCard, Apple, Smartphone } from "lucide-react";

interface PaymentSheetProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (method: string) => void;
  game: { title?: string; sport: string; scheduled_at?: string; date?: string; time?: string };
  price?: string;
}

const sportEmoji: Record<string, string> = {
  Football: "⚽", Tennis: "🎾", Basketball: "🏀",
  Badminton: "🏸", Running: "🏃", Padel: "🎾",
};

const methods = [
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "apple", label: "Apple Pay", icon: Apple },
  { id: "google", label: "Google Pay", icon: Smartphone },
] as const;

const PaymentSheet = ({ open, onClose, onConfirm, game, price = "€5.00" }: PaymentSheetProps) => {
  const [selected, setSelected] = useState("card");
  const [processing, setProcessing] = useState(false);

  if (!open) return null;

  const handleConfirm = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onConfirm(selected);
    }, 1200);
  };

  const dateLabel = game.scheduled_at
    ? new Date(game.scheduled_at).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : `${game.date}, ${game.time}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card border-t border-border rounded-t-3xl p-6 pb-8 animate-in slide-in-from-bottom duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Game summary */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-2xl">
            {sportEmoji[game.sport] || "🎯"}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{game.title || game.sport}</p>
            <p className="text-xs text-muted-foreground">{dateLabel}</p>
          </div>
          <p className="text-lg font-bold" style={{ color: "#d4a017" }}>{price}</p>
        </div>

        <div className="h-px bg-border mb-5" />

        {/* Payment methods */}
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Payment method</p>
        <div className="space-y-2 mb-5">
          {methods.map(m => {
            const Icon = m.icon;
            const active = selected === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelected(m.id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                  active ? "border-[#d4a017] bg-[#d4a017]/10" : "border-border bg-secondary/50"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${active ? "bg-[#d4a017]/20" : "bg-secondary"}`}>
                  <Icon className="w-4 h-4" style={{ color: active ? "#d4a017" : undefined }} />
                </div>
                <span className={`text-sm font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>{m.label}</span>
                <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? "border-[#d4a017]" : "border-muted-foreground/30"}`}>
                  {active && <div className="w-2.5 h-2.5 rounded-full bg-[#d4a017]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Mock card fields */}
        {selected === "card" && (
          <div className="space-y-3 mb-5">
            <input placeholder="Card number" className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border" />
            <div className="flex gap-3">
              <input placeholder="MM/YY" className="flex-1 bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border" />
              <input placeholder="CVC" className="w-24 bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border" />
            </div>
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={processing}
          className="w-full h-12 rounded-2xl text-base font-semibold text-black disabled:opacity-70 transition-all"
          style={{ background: "#d4a017" }}
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Processing…
            </span>
          ) : (
            `Confirm & Pay ${price}`
          )}
        </button>

        <p className="text-[10px] text-muted-foreground text-center mt-3">This is a demo wireframe — no real charge will be made.</p>
      </div>
    </div>
  );
};

export default PaymentSheet;
