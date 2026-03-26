import { useState, useMemo } from "react";
import { BottomNav } from "@/components/BottomNav";

const mockCourts = [
  { name: "Stade Bertrand Dauvin", zone: "18e Arrondissement", sports: "Football, Rugby", price: "€12/hr", slots: ["10:00", "14:00", "18:00"] },
  { name: "Court Municipal Roquette", zone: "11e Arrondissement", sports: "Tennis, Padel", price: "€18/hr", slots: ["09:00", "11:00", "20:00"] },
  { name: "Gymnase République", zone: "10e Arrondissement", sports: "Basketball, Volleyball", price: "€8/hr", slots: ["12:00", "17:00", "19:30"] },
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getNext9Days() {
  const today = new Date();
  return Array.from({ length: 9 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return { date: d.getDate(), day: dayNames[d.getDay()], isToday: i === 0, key: i };
  });
}

const BookPage = () => {
  const dates = useMemo(() => getNext9Days(), []);
  const [activeDate, setActiveDate] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookedCourt, setBookedCourt] = useState<typeof mockCourts[0] | null>(null);
  const [bookedSlot, setBookedSlot] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Record<string, string>>({});

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-foreground">Book a court</h1>
      </div>

      <div className="px-5 mt-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2">
          {dates.map((d) => (
            <button
              key={d.key}
              onClick={() => setActiveDate(d.key)}
              className="flex flex-col items-center justify-center flex-shrink-0 transition-all"
              style={{
                width: 40,
                height: 52,
                borderRadius: 12,
                background: activeDate === d.key ? "#6C5CE7" : "#13131A",
                border: activeDate === d.key ? "none" : "0.5px solid #2a2a3a",
              }}
            >
              <span className="text-sm font-semibold" style={{ color: activeDate === d.key ? "#fff" : "#888" }}>
                {d.date}
              </span>
              <span className="text-[10px]" style={{ color: activeDate === d.key ? "rgba(255,255,255,0.7)" : "#888" }}>
                {d.day}
              </span>
              {d.isToday && (
                <span className="block w-1.5 h-1.5 rounded-full mt-0.5" style={{ background: "#00b894" }} />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-5 space-y-3">
        {mockCourts.map((court, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground">{court.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{court.zone} • {court.sports}</p>

            <div className="flex gap-2 mt-3 flex-wrap">
              {court.slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(prev => ({ ...prev, [court.name]: slot }))}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                  style={{
                    background: selectedSlot[court.name] === slot ? "#6C5CE7" : "#1a1a2e",
                    color: selectedSlot[court.name] === slot ? "white" : "#a29bfe",
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-bold text-success">{court.price}</span>
              <button
                onClick={() => {
                  setBookedCourt(court);
                  setBookedSlot(selectedSlot[court.name] || court.slots[0]);
                  setShowConfirmation(true);
                }}
                className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-2 rounded-full cursor-pointer"
              >
                Book now
              </button>
            </div>
          </div>
        ))}
      </div>

      {showConfirmation && (
        <div
          onClick={() => setShowConfirmation(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#13131A', borderRadius: '24px', padding: '28px 24px', border: '1px solid #6C5CE7', boxShadow: '0 0 40px rgba(108,92,231,0.5)', width: '100%', maxWidth: '300px', textAlign: 'center', animation: 'bounceIn 0.4s ease' }}
          >
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#00b894', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', animation: 'pulse 1.5s infinite', fontSize: 24, color: 'white', fontWeight: 700 }}>
              ✓
            </div>

            <p style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>You're in! 🎉</p>
            <p style={{ color: '#a29bfe', fontSize: 14, fontWeight: 600 }}>{bookedCourt?.name}</p>
            <p style={{ color: '#888', fontSize: 12, marginTop: 4 }}>{bookedSlot}</p>
            <p style={{ color: '#888', fontSize: 12 }}>{bookedCourt?.zone}</p>

            <div style={{ background: '#1a1a2e', borderRadius: 12, padding: '12px', marginTop: 16, marginBottom: 16 }}>
              <p style={{ color: '#a29bfe', fontSize: 11, fontWeight: 600 }}>Split with teammates</p>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 700, marginTop: 4 }}>
                Your share: €{bookedCourt ? (parseInt(bookedCourt.price.replace('€', '')) / 4).toFixed(2) : '0.00'}
              </p>
              <p style={{ color: '#888', fontSize: 11, marginTop: 2 }}>Total {bookedCourt?.price} ÷ 4 players</p>
            </div>

            <button
              onClick={() => setShowConfirmation(false)}
              style={{ background: '#6C5CE7', color: 'white', border: 'none', borderRadius: 12, padding: 11, fontSize: 13, fontWeight: 500, cursor: 'pointer', width: '100%', marginBottom: 8 }}
            >
              View game chat 💬
            </button>
            <button
              onClick={() => setShowConfirmation(false)}
              style={{ background: 'transparent', color: '#6C5CE7', border: '1px solid #6C5CE7', borderRadius: 12, padding: 11, fontSize: 13, fontWeight: 500, cursor: 'pointer', width: '100%' }}
            >
              Back to home
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default BookPage;
