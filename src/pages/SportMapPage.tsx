import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BottomNav } from "@/components/BottomNav";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface Court {
  id: number;
  lat: number;
  lon: number;
  name: string;
  sport: string;
  leisure: string;
  tags: Record<string, string>;
  checkIns: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PARIS_CENTER: [number, number] = [48.8566, 2.3522];
const GOLD = "#d4a017";

const SPORT_COLORS: Record<string, string> = {
  football: "#22c55e",
  soccer: "#22c55e",
  tennis: "#facc15",
  basketball: "#f97316",
  padel: "#2dd4bf",
  volleyball: "#a78bfa",
  running: "#60a5fa",
  fitness: "#f43f5e",
  default: GOLD,
};

const SPORT_EMOJIS: Record<string, string> = {
  football: "⚽",
  soccer: "⚽",
  tennis: "🎾",
  basketball: "🏀",
  padel: "🏓",
  volleyball: "🏐",
  running: "🏃",
  fitness: "💪",
  default: "🏟️",
};

const FILTERS = ["All", "Football", "Tennis", "Basketball", "Padel"];

const OVERPASS_QUERY = `[out:json][timeout:25];(node["leisure"="pitch"](48.82,2.25,48.90,2.42);node["leisure"="sports_centre"](48.82,2.25,48.90,2.42);way["leisure"="pitch"](48.82,2.25,48.90,2.42););out center 100;`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSportFromTags(tags: Record<string, string>): string {
  const sport = (tags.sport || "").toLowerCase();
  if (sport.includes("football") || sport.includes("soccer")) return "football";
  if (sport.includes("tennis")) return "tennis";
  if (sport.includes("basketball")) return "basketball";
  if (sport.includes("padel")) return "padel";
  if (sport.includes("volleyball")) return "volleyball";
  if (sport.includes("running") || sport.includes("athletics")) return "running";
  if (sport.includes("fitness") || sport.includes("gym")) return "fitness";
  return sport || "default";
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  if (d < 1000) return `${Math.round(d)}m`;
  return `${(d / 1000).toFixed(1)}km`;
}

function createMarkerIcon(color: string, checkIns: number): L.DivIcon {
  const hasCheckIns = checkIns > 0;
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative; display:flex; flex-direction:column; align-items:center;">
        <div style="
          width:32px; height:32px;
          background:${color};
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:2px solid rgba(255,255,255,0.3);
          box-shadow:0 2px 8px rgba(0,0,0,0.6);
        "></div>
        ${hasCheckIns ? `
        <div style="
          position:absolute;
          top:-10px; right:-14px;
          background:#22c55e;
          color:#fff;
          font-size:9px;
          font-weight:700;
          padding:1px 5px;
          border-radius:99px;
          white-space:nowrap;
          box-shadow:0 1px 4px rgba(0,0,0,0.5);
        ">🟢 ${checkIns}</div>` : ""}
      </div>
    `,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
  });
}

function parseCheckIns(): Record<number, number> {
  try {
    return JSON.parse(localStorage.getItem("playpal_checkins") || "{}");
  } catch {
    return {};
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

const SportMapPage = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<number, L.Marker>>({});

  const [courts, setCourts] = useState<Court[]>([]);
  const [filteredCourts, setFilteredCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [checkIns, setCheckIns] = useState<Record<number, number>>(parseCheckIns());
  const [checkedInIds, setCheckedInIds] = useState<Set<number>>(new Set());

  // ── Init map ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: PARIS_CENTER,
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    // Move zoom control to bottom-right to avoid BottomNav
    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapRef.current = map;

    // Close sheet on map click
    map.on("click", () => {
      setSheetOpen(false);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Geolocation ─────────────────────────────────────────────────────────────
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const latlng: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(latlng);
        if (mapRef.current) {
          L.circleMarker(latlng, {
            radius: 8,
            fillColor: "#6C5CE7",
            color: "#fff",
            weight: 2,
            fillOpacity: 1,
          })
            .addTo(mapRef.current)
            .bindPopup("You are here");
        }
      },
      () => {
        // Geolocation denied or unavailable — silently ignore
      }
    );
  }, []);

  // ── Fetch courts ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(OVERPASS_QUERY)}`
        );
        const data = await response.json();
        const storedCheckIns = parseCheckIns();

        const parsed: Court[] = (data.elements as OverpassElement[])
          .filter((el) => el.lat != null || el.center != null)
          .map((el) => {
            const lat = el.lat ?? el.center!.lat;
            const lon = el.lon ?? el.center!.lon;
            const tags = el.tags || {};
            const sport = getSportFromTags(tags);
            return {
              id: el.id,
              lat,
              lon,
              name: tags.name || "Sports Facility",
              sport,
              leisure: tags.leisure || "pitch",
              tags,
              checkIns: storedCheckIns[el.id] || 0,
            };
          });

        setCourts(parsed);
        setFilteredCourts(parsed);
      } catch (err) {
        console.error("Failed to fetch courts:", err);
        toast.error("Couldn't load courts. Check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

  // ── Render markers ──────────────────────────────────────────────────────────
  const renderMarkers = useCallback(
    (courtsToRender: Court[]) => {
      if (!mapRef.current) return;

      // Remove old markers
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};

      courtsToRender.forEach((court) => {
        const sportKey = court.sport in SPORT_COLORS ? court.sport : "default";
        const color = SPORT_COLORS[sportKey];
        const currentCheckIns = checkIns[court.id] || 0;
        const marker = L.marker([court.lat, court.lon], {
          icon: createMarkerIcon(color, currentCheckIns),
        }).addTo(mapRef.current!);

        marker.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          setSelectedCourt({ ...court, checkIns: currentCheckIns });
          setSheetOpen(true);
        });

        markersRef.current[court.id] = marker;
      });
    },
    [checkIns]
  );

  useEffect(() => {
    renderMarkers(filteredCourts);
  }, [filteredCourts, renderMarkers]);

  // ── Filter + search ─────────────────────────────────────────────────────────
  useEffect(() => {
    let result = courts;

    if (activeFilter !== "All") {
      const filterKey = activeFilter.toLowerCase();
      result = result.filter((c) => {
        if (filterKey === "football") return c.sport === "football" || c.sport === "soccer";
        return c.sport === filterKey;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.sport.toLowerCase().includes(q) ||
          (c.tags.leisure || "").toLowerCase().includes(q)
      );
    }

    setFilteredCourts(result);
  }, [activeFilter, searchQuery, courts]);

  // ── Check-in ────────────────────────────────────────────────────────────────
  const handleCheckIn = (court: Court) => {
    if (checkedInIds.has(court.id)) {
      toast.info("You're already checked in here!");
      return;
    }
    const updated = { ...checkIns, [court.id]: (checkIns[court.id] || 0) + 1 };
    setCheckIns(updated);
    setCheckedInIds((prev) => new Set(prev).add(court.id));
    localStorage.setItem("playpal_checkins", JSON.stringify(updated));
    setSelectedCourt((prev) => (prev ? { ...prev, checkIns: updated[court.id] } : null));
    toast.success(`Checked in at ${court.name}! 🎉`);
  };

  // ─── Fly to court on tap ────────────────────────────────────────────────────
  useEffect(() => {
    if (selectedCourt && mapRef.current) {
      mapRef.current.flyTo([selectedCourt.lat, selectedCourt.lon], 16, { duration: 0.8 });
    }
  }, [selectedCourt]);

  const sportEmoji = selectedCourt
    ? SPORT_EMOJIS[selectedCourt.sport] || SPORT_EMOJIS.default
    : "";

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0A0A0F]">
      {/* ── Map ── */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />

      {/* ── Search bar ── */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col gap-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">🔍</span>
          <input
            type="text"
            placeholder="Search courts, sports…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl text-sm font-medium outline-none bg-[#13131A]/90 backdrop-blur-sm border border-[#2a2a3a] text-white placeholder-gray-500"
          />
        </div>

        {/* ── Filter chips ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0"
              style={{
                background: activeFilter === f ? GOLD : "rgba(19,19,26,0.85)",
                color: activeFilter === f ? "#000" : "#aaa",
                border: activeFilter === f ? "none" : "1px solid #2a2a3a",
                backdropFilter: "blur(4px)",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading overlay ── */}
      {loading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-[#0A0A0F]/80 backdrop-blur-sm">
          <div className="text-4xl animate-bounce">🏟️</div>
          <p className="text-sm text-gray-400 font-medium">Loading Paris courts…</p>
          <div className="space-y-2 w-64">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-4 rounded-lg bg-[#1a1a2e]" />
            ))}
          </div>
        </div>
      )}

      {/* ── Court count badge ── */}
      {!loading && (
        <div
          className="absolute top-32 right-4 z-20 px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{ background: "rgba(19,19,26,0.9)", color: GOLD, border: "1px solid #2a2a3a", backdropFilter: "blur(4px)" }}
        >
          {filteredCourts.length} courts
        </div>
      )}

      {/* ── Bottom sheet ── */}
      <div
        className={`absolute left-0 right-0 bottom-16 z-30 transition-transform duration-300 ease-out ${
          sheetOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "55vh" }}
      >
        <div className="bg-[#0A0A0F] rounded-t-3xl border-t border-x border-[#2a2a3a] overflow-hidden">
          {/* Sheet handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-[#333]" />
          </div>

          {selectedCourt && (
            <div className="px-5 pb-6 overflow-y-auto" style={{ maxHeight: "calc(55vh - 32px)" }}>
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: `${SPORT_COLORS[selectedCourt.sport] || GOLD}22` }}
                >
                  {sportEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-base leading-tight">{selectedCourt.name}</h3>
                  <p className="text-xs font-medium capitalize mt-0.5" style={{ color: GOLD }}>
                    {selectedCourt.leisure === "sports_centre" ? "Sports Centre" : "Court"} · {selectedCourt.tags.sport || "Multi-sport"}
                  </p>
                  {userLocation && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      📍 {getDistance(userLocation[0], userLocation[1], selectedCourt.lat, selectedCourt.lon)} away
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="text-gray-500 text-lg shrink-0 mt-0.5"
                >
                  ✕
                </button>
              </div>

              {/* Sport tags */}
              {selectedCourt.tags.sport && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {selectedCourt.tags.sport.split(";").map((s) => (
                    <span
                      key={s}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize"
                      style={{ background: "#1a1a2e", color: "#a29bfe" }}
                    >
                      {s.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Check-in info */}
              {(checkIns[selectedCourt.id] || 0) > 0 && (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4 text-sm font-medium"
                  style={{ background: "#0d2a1a" }}
                >
                  <span>🟢</span>
                  <span className="text-green-400">
                    {checkIns[selectedCourt.id]} {checkIns[selectedCourt.id] === 1 ? "person" : "people"} here now
                  </span>
                </div>
              )}

              {/* Check-in button */}
              <button
                onClick={() => handleCheckIn(selectedCourt)}
                disabled={checkedInIds.has(selectedCourt.id)}
                className="w-full py-3 rounded-2xl font-bold text-sm transition-all disabled:opacity-60"
                style={{
                  background: checkedInIds.has(selectedCourt.id) ? "#1a1a2e" : GOLD,
                  color: checkedInIds.has(selectedCourt.id) ? "#888" : "#000",
                }}
              >
                {checkedInIds.has(selectedCourt.id) ? "✓ Checked In" : "Check In Here"}
              </button>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default SportMapPage;
