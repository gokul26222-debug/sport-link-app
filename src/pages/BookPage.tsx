import { useState, useMemo } from "react";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";

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
                <span key={slot} className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#1a1a2e] text-[#a29bfe]">
                  {slot}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-bold text-success">{court.price}</span>
              <button
                onClick={() => toast.success(`Booked ${court.name}!`)}
                className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-2 rounded-full"
              >
                Book now
              </button>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default BookPage;
