import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";
import { MapPin, Search, Clock, Star } from "lucide-react";

interface Court {
  id: number;
  name: string;
  sport: string;
  zone: string;
  lat: number;
  lon: number;
  price: string;
  slots: string[];
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getNext9Days() {
  const today = new Date();
  return Array.from({ length: 9 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return { date: d.getDate(), day: dayNames[d.getDay()], isToday: i === 0, key: i, full: d.toISOString().split("T")[0] };
  });
}

const sportEmojis: Record<string, string> = {
  soccer: "⚽", football: "⚽", tennis: "🎾", basketball: "🏀",
  padel: "🏓", volleyball: "🏐", running: "🏃", fitness: "💪",
  swimming: "🏊", multi: "🏟️",
};

const sportFilters = ["All", "Football", "Tennis", "Basketball", "Padel"];

const OVERPASS_QUERY = `[out:json][timeout:20];(node["leisure"="sports_centre"](48.82,2.25,48.90,2.42);way["leisure"="pitch"](48.82,2.25,48.90,2.42););out center 60;`;

const defaultSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "17:00", "18:00", "19:00", "20:00"];

function getRandomSlots(): string[] {
  const count = 3 + Math.floor(Math.random() * 4);
  const shuffled = [...defaultSlots].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).sort();
}

function getRandomPrice(): string {
  const prices = ["Free", "€5/hr", "€8/hr", "€10/hr", "€12/hr", "€15/hr"];
  return prices[Math.floor(Math.random() * prices.length)];
}

function getSportFromTags(tags: Record<string, string>): string {
  const sport = (tags.sport || "").toLowerCase();
  if (sport.includes("football") || sport.includes("soccer")) return "football";
  if (sport.includes("tennis")) return "tennis";
  if (sport.includes("basketball")) return "basketball";
  if (sport.includes("padel")) return "padel";
  return sport || "multi";
}

const BookPage = () => {
  const navigate = useNavigate();
  const dates = useMemo(() => getNext9Days(), []);
  const [activeDate, setActiveDate] = useState(0);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSport, setActiveSport] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<Record<number, string>>({});
  const [showConfirm, setShowConfirm] = useState<Court | null>(null);

  useEffect(() => {
    const fetchCourts = async () => {
      const cached = localStorage.getItem("courts_cache");
      if (cached) {
        const { data, time } = JSON.parse(cached);
        if (Date.now() - time < 3600000) { // 1 hour cache
          setCourts(data);
          setLoading(false);
          return;
        }
      }

      try {
        const response = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(OVERPASS_QUERY)}`,
          { signal: AbortSignal.timeout(10000) }
        );
        const data = await response.json();

        const parsed: Court[] = (data.elements || [])
          .filter((el: any) => el.lat != null || el.center != null)
          .slice(0, 20)
          .map((el: any) => {
            const lat = el.lat ?? el.center?.lat;
            const lon = el.lon ?? el.center?.lon;
            const tags = el.tags || {};
            const sport = getSportFromTags(tags);
            return {
              id: el.id,
              name: tags.name || "Sports Facility",
              sport,
              zone: tags["addr:city"] || tags["addr:district"] || "Paris",
              lat,
              lon,
              price: getRandomPrice(),
              slots: getRandomSlots(),
            };
          });

        localStorage.setItem("courts_cache", JSON.stringify({ data: parsed, time: Date.now() }));
        setCourts(parsed);
      } catch (err) {
        const cached = localStorage.getItem("courts_cache");
        if (cached) {
          setCourts(JSON.parse(cached).data);
        }
        toast.error("Couldn't load venues");
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

  const filtered = courts
    .filter((c) => {
      if (activeSport !== "All") {
        const filterKey = activeSport.toLowerCase();
        if (filterKey === "football") return c.sport === "football" || c.sport === "soccer";
        return c.sport === filterKey;
      }
      return true;
    })
    .filter((c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.sport.includes(q) || c.zone.toLowerCase().includes(q);
    });

  const handleBook = (court: Court) => {
    const slot = selectedSlots[court.id] || court.slots[0];
    setShowConfirm(court);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-24">
      {/* Header */}
      <div className="px-5 pt-8 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Book a Court</h1>
          <p className="text-sm text-gray-500 mt-0.5">Real venues in Paris</p>
        </div>
        <button
          onClick={() => navigate("/map")}
          className="w-10 h-10 rounded-full bg-[#13131A] border border-[#2a2a3a] flex items-center justify-center"
        >
          <MapPin className="w-4 h-4 text-[#d4a017]" />
        </button>
      </div>

      {/* Search */}
      <div className="px-5 mt-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search venues..."
            className="w-full h-11 rounded-2xl bg-[#13131A] border border-[#2a2a3a] pl-10 pr-4 text-white text-sm placeholder:text-gray-600 outline-none focus:border-[#6C5CE7] transition-colors"
          />
        </div>
      </div>

      {/* Sport filter */}
      <div className="px-5 mt-3 mb-1">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {sportFilters.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSport(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeSport === s ? "bg-[#d4a017] text-black" : "bg-transparent text-gray-500 border border-[#2a2a3a]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Date picker */}
      <div className="px-5 mt-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {dates.map((d) => (
            <button
              key={d.key}
              onClick={() => setActiveDate(d.key)}
              className="flex flex-col items-center justify-center shrink-0 transition-all"
              style={{
                width: 44,
                height: 56,
                borderRadius: 14,
                background: activeDate === d.key ? "#d4a017" : "#13131A",
                border: activeDate === d.key ? "none" : "1px solid #2a2a3a",
              }}
            >
              <span className="text-sm font-bold" style={{ color: activeDate === d.key ? "#000" : "#aaa" }}>
                {d.date}
              </span>
              <span className="text-[10px] font-medium" style={{ color: activeDate === d.key ? "rgba(0,0,0,0.6)" : "#666" }}>
                {d.day}
              </span>
              {d.isToday && (
                <span className="block w-1.5 h-1.5 rounded-full mt-0.5" style={{ background: activeDate === d.key ? "#000" : "#00b894" }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Courts */}
      <div className="px-5 mt-5 space-y-3">
        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">
          {loading ? "Loading venues..." : `${filtered.length} venues available`}
        </p>

        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-[#13131A] rounded-2xl border border-[#2a2a3a] p-5 animate-pulse">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#2a2a3a]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#2a2a3a] rounded w-3/4" />
                  <div className="h-3 bg-[#2a2a3a] rounded w-1/2" />
                </div>
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-gray-500 text-sm">No venues found</p>
          </div>
        ) : (
          filtered.map((court) => {
            const emoji = sportEmojis[court.sport] || "🏟️";

            return (
              <div key={court.id} className="bg-[#13131A] rounded-2xl border border-[#2a2a3a] p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1a1a2e] flex items-center justify-center text-2xl shrink-0">
                    {emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{court.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{court.zone} · {court.sport}</p>
                  </div>
                  <span className="text-sm font-bold text-[#00b894] shrink-0">{court.price}</span>
                </div>

                {/* Time slots */}
                <div className="flex gap-2 flex-wrap mb-4">
                  {court.slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlots(prev => ({ ...prev, [court.id]: slot }))}
                      className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        background: selectedSlots[court.id] === slot ? "#d4a017" : "#1a1a2e",
                        color: selectedSlots[court.id] === slot ? "#000" : "#888",
                        border: selectedSlots[court.id] === slot ? "none" : "1px solid #2a2a3a",
                      }}
                    >
                      <Clock className="w-3 h-3" />
                      {slot}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleBook(court)}
                  className="w-full py-2.5 rounded-xl bg-[#d4a017] text-black text-sm font-bold transition-all active:scale-[0.98]"
                >
                  Book Now
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5" onClick={() => setShowConfirm(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm bg-[#13131A] rounded-3xl border border-[#d4a017]/30 p-7 text-center animate-[bounceIn_0.4s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-[#00b894]/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>

            <p className="text-white text-lg font-bold mb-1">You're in! 🎉</p>
            <p className="text-[#d4a017] text-sm font-semibold">{showConfirm.name}</p>
            <p className="text-gray-500 text-xs mt-1">
              {dates[activeDate]?.day} {dates[activeDate]?.date} · {selectedSlots[showConfirm.id] || showConfirm.slots[0]}
            </p>
            <p className="text-gray-500 text-xs">{showConfirm.zone}</p>

            <div className="bg-[#0A0A0F] rounded-xl p-4 mt-4 mb-4">
              <p className="text-[#d4a017] text-xs font-semibold">Split with teammates</p>
              <p className="text-white text-xl font-bold mt-1">
                {showConfirm.price === "Free" ? "Free" : `Your share: ${showConfirm.price.replace("/hr", "")}`}
              </p>
              <p className="text-gray-600 text-[10px] mt-0.5">÷ 4 players</p>
            </div>

            <button
              onClick={() => { setShowConfirm(null); toast.success("Booking confirmed!"); }}
              className="w-full py-3 rounded-xl bg-[#d4a017] text-black font-bold text-sm mb-2"
            >
              View Game Chat 💬
            </button>
            <button
              onClick={() => setShowConfirm(null)}
              className="w-full py-3 rounded-xl border border-[#2a2a3a] text-gray-400 text-sm font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default BookPage;
