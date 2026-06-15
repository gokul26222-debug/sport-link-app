import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/lib/appContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, MapPin, Calendar, Users, Zap } from "lucide-react";

const sports = [
  { name: "Football", emoji: "⚽" },
  { name: "Basketball", emoji: "🏀" },
  { name: "Tennis", emoji: "🎾" },
  { name: "Badminton", emoji: "🏸" },
  { name: "Running", emoji: "🏃" },
  { name: "Padel", emoji: "🎾" },
  { name: "Volleyball", emoji: "🏐" },
  { name: "Swimming", emoji: "🏊" },
  { name: "Boxing", emoji: "🥊" },
  { name: "Table Tennis", emoji: "🏓" },
];

const parisLocations = [
  { name: "Parc des Buttes-Chaumont", lat: 48.8809, lng: 2.3828 },
  { name: "Jardin du Luxembourg", lat: 48.8462, lng: 2.3372 },
  { name: "Champ de Mars", lat: 48.8556, lng: 2.2986 },
  { name: "Bois de Boulogne", lat: 48.8624, lng: 2.2497 },
  { name: "Parc de la Villette", lat: 48.8938, lng: 2.3900 },
  { name: "Canal Saint-Martin", lat: 48.8725, lng: 2.3653 },
  { name: "Place de la République", lat: 48.8675, lng: 2.3636 },
  { name: "Parc Monceau", lat: 48.8794, lng: 2.3089 },
];

const timeSlots = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
  "20:00", "21:00", "22:00",
];

const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"];

const CreateGamePage = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [step, setStep] = useState(1);
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const [locationLat, setLocationLat] = useState<number | null>(null);
  const [locationLng, setLocationLng] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(10);
  const [skillLevel, setSkillLevel] = useState("All Levels");
  const [price, setPrice] = useState("0");
  const [loading, setLoading] = useState(false);

  const totalSteps = 5;

  const canNext = () => {
    switch (step) {
      case 1: return sport !== "";
      case 2: return location !== "";
      case 3: return date !== "" && time !== "";
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  const handleLocationSelect = (loc: typeof parisLocations[0]) => {
    setLocation(loc.name);
    setLocationLat(loc.lat);
    setLocationLng(loc.lng);
  };

  const handlePublish = async () => {
    if (!user) return;
    setLoading(true);

    const scheduledAt = date && time ? new Date(`${date}T${time}:00`).toISOString() : null;

    const { data, error } = await supabase.from("games").insert({
      sport,
      title: title || `${sport} Game`,
      description: description || null,
      location,
      location_lat: locationLat,
      location_lng: locationLng,
      date,
      time,
      max_players: maxPlayers,
      current_players: 1,
      skill_level: skillLevel,
      host_id: user.id,
      status: "open",
      scheduled_at: scheduledAt,
    }).select("id").single();

    if (error) {
      toast.error("Failed to create game");
      setLoading(false);
      return;
    }

    if (data) {
      await supabase.from("game_participants").insert({
        game_id: data.id,
        user_id: user.id,
      });

      if ("Notification" in window && Notification.permission === "granted") {
        const gameTime = new Date(`${date}T${time}:00`);
        const reminderTime = gameTime.getTime() - Date.now() - 3600000;
        if (reminderTime > 0) {
          setTimeout(() => {
            new Notification("Game starting soon! 🎮", {
              body: `Your ${sport} game at ${location} starts in 1 hour`,
            });
          }, reminderTime);
        }
      }

      toast.success("Game created! 🎉");
      navigate(`/game/${data.id}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-8">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="flex items-center gap-1 text-gray-400 mb-4 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> {step > 1 ? "Back" : "Cancel"}
        </button>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-[#1a1a2e]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: i < step ? "100%" : i === step ? "50%" : "0%",
                  background: i < step ? "#d4a017" : i === step ? "#d4a017" : "transparent",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Sport */}
      {step === 1 && (
        <div className="px-5 animate-[slideUp_0.3s_ease-out]">
          <h1 className="text-2xl font-bold text-white mb-2">What are you playing?</h1>
          <p className="text-sm text-gray-500 mb-6">Choose your sport</p>
          <div className="grid grid-cols-2 gap-3">
            {sports.map((s) => (
              <button
                key={s.name}
                onClick={() => setSport(s.name)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  sport === s.name
                    ? "border-[#d4a017] bg-[#d4a017]/10 scale-[1.02]"
                    : "border-[#2a2a3e] bg-[#13131A] hover:border-[#3a3a4e]"
                }`}
              >
                <span className="text-3xl block mb-2">{s.emoji}</span>
                <span className={`text-sm font-medium ${sport === s.name ? "text-[#d4a017]" : "text-white"}`}>
                  {s.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Location */}
      {step === 2 && (
        <div className="px-5 animate-[slideUp_0.3s_ease-out]">
          <h1 className="text-2xl font-bold text-white mb-2">Where?</h1>
          <p className="text-sm text-gray-500 mb-6">Pick a location in Paris</p>

          <div className="relative mb-4">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={location}
              onChange={(e) => { setLocation(e.target.value); setLocationLat(null); setLocationLng(null); }}
              placeholder="Search or type location..."
              className="w-full h-12 rounded-2xl bg-[#13131A] border border-[#2a2a3e] pl-11 pr-4 text-white text-sm placeholder:text-gray-600 outline-none focus:border-[#6C5CE7] transition-colors"
            />
          </div>

          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Popular in Paris</p>
          <div className="space-y-2">
            {parisLocations.map((loc) => (
              <button
                key={loc.name}
                onClick={() => handleLocationSelect(loc)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                  location === loc.name
                    ? "border-[#d4a017] bg-[#d4a017]/10"
                    : "border-[#2a2a3e] bg-[#13131A] hover:border-[#3a3a4e]"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${location === loc.name ? "bg-[#d4a017]/20" : "bg-[#1a1a2e]"}`}>
                  <MapPin className="w-4 h-4" style={{ color: location === loc.name ? "#d4a017" : "#666" }} />
                </div>
                <span className={`text-sm font-medium ${location === loc.name ? "text-[#d4a017]" : "text-white"}`}>
                  {loc.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Date & Time */}
      {step === 3 && (
        <div className="px-5 animate-[slideUp_0.3s_ease-out]">
          <h1 className="text-2xl font-bold text-white mb-2">When?</h1>
          <p className="text-sm text-gray-500 mb-6">Pick date and time</p>

          <div className="mb-6">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full h-12 rounded-2xl bg-[#13131A] border border-[#2a2a3e] pl-11 pr-4 text-white text-sm outline-none focus:border-[#6C5CE7] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Time</label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((t) => (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    time === t
                      ? "bg-[#d4a017] text-black"
                      : "bg-[#13131A] border border-[#2a2a3e] text-gray-400 hover:border-[#3a3a4e]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Details */}
      {step === 4 && (
        <div className="px-5 animate-[slideUp_0.3s_ease-out]">
          <h1 className="text-2xl font-bold text-white mb-2">Details</h1>
          <p className="text-sm text-gray-500 mb-6">Customize your game</p>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Game title (optional)</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`${sport} at ${location || "the park"}`}
                className="w-full h-12 rounded-2xl bg-[#13131A] border border-[#2a2a3e] px-4 text-white text-sm placeholder:text-gray-600 outline-none focus:border-[#6C5CE7] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Any details players should know..."
                rows={3}
                className="w-full rounded-2xl bg-[#13131A] border border-[#2a2a3e] px-4 py-3 text-white text-sm placeholder:text-gray-600 outline-none focus:border-[#6C5CE7] transition-colors resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Max players: <span className="text-[#d4a017]">{maxPlayers}</span>
              </label>
              <input
                type="range"
                min="2"
                max="30"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                className="w-full accent-[#d4a017]"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>2</span><span>30</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Skill level</label>
              <div className="flex gap-2 flex-wrap">
                {levels.map((l) => (
                  <button
                    key={l}
                    onClick={() => setSkillLevel(l)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                      skillLevel === l
                        ? "bg-[#6C5CE7] text-white"
                        : "bg-[#13131A] border border-[#2a2a3e] text-gray-400"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Price per person (€)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-12 rounded-2xl bg-[#13131A] border border-[#2a2a3e] px-4 text-white text-sm outline-none focus:border-[#6C5CE7] transition-colors"
              />
              <p className="text-xs text-gray-600 mt-1">Set to 0 for free games</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Review */}
      {step === 5 && (
        <div className="px-5 animate-[slideUp_0.3s_ease-out]">
          <h1 className="text-2xl font-bold text-white mb-2">Review & Publish</h1>
          <p className="text-sm text-gray-500 mb-6">Everything look good?</p>

          <div className="bg-[#13131A] rounded-2xl border border-[#2a2a3e] p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1a1a2e] flex items-center justify-center text-2xl">
                {sports.find(s => s.name === sport)?.emoji || "🎯"}
              </div>
              <div>
                <p className="font-semibold text-white">{title || `${sport} Game`}</p>
                <p className="text-xs text-[#d4a017]">{sport}</p>
              </div>
            </div>

            <div className="h-px bg-[#2a2a3e]" />

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-300">{location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-300">{date} at {time}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-gray-300">Max {maxPlayers} players · {skillLevel}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Zap className="w-4 h-4 text-gray-500" />
                <span className="text-gray-300">{Number(price) > 0 ? `€${price} per person` : "Free"}</span>
              </div>
            </div>

            {description && (
              <>
                <div className="h-px bg-[#2a2a3e]" />
                <p className="text-sm text-gray-400">{description}</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-[#0A0A0F]/90 backdrop-blur-xl border-t border-[#1a1a2e]">
        {step < 5 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canNext()}
            className="w-full h-12 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition-all text-black"
            style={{ background: canNext() ? "#d4a017" : "#333" }}
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handlePublish}
            disabled={loading}
            className="w-full h-12 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70 transition-all bg-[#d4a017] text-black"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Publishing...
              </span>
            ) : (
              <><Check className="w-4 h-4" /> Publish Game</>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateGamePage;
