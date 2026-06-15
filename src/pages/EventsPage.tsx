import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockEvents = [
  { id: "1", title: "Paris Night Run 5K", emoji: "🌙", date: "Jun 21", time: "21:00", location: "Seine River", attendees: 142, maxAttendees: 200, type: "Running", host: "Canal Runners Crew", gradient: "from-indigo-900/60 to-purple-900/60" },
  { id: "2", title: "Beach Volleyball Tournament", emoji: "🏐", date: "Jun 28", time: "14:00", location: "Paris Plages", attendees: 48, maxAttendees: 64, type: "Tournament", host: "PlayPal Paris", gradient: "from-orange-900/60 to-yellow-900/60" },
  { id: "3", title: "Football World Cup Watch Party", emoji: "📺", date: "Jul 1", time: "20:00", location: "Parc de la Villette", attendees: 89, maxAttendees: 500, type: "Social", host: "Sunday Football Paris", gradient: "from-green-900/60 to-teal-900/60" },
  { id: "4", title: "Sunrise Yoga — Trocadéro", emoji: "🧘", date: "Jul 5", time: "06:30", location: "Trocadéro Gardens", attendees: 35, maxAttendees: 50, type: "Wellness", host: "Yoga in the Park", gradient: "from-pink-900/60 to-rose-900/60" },
];

const typeColors: Record<string, string> = {
  Running: "bg-blue-900/40 text-blue-400",
  Tournament: "bg-orange-900/40 text-orange-400",
  Social: "bg-green-900/40 text-green-400",
  Wellness: "bg-pink-900/40 text-pink-400",
};

const EventsPage = () => {
  const navigate = useNavigate();
  const [rsvpIds, setRsvpIds] = useState<Set<string>>(new Set());

  const handleRsvp = (id: string, title: string) => {
    const next = new Set(rsvpIds);
    if (next.has(id)) {
      next.delete(id);
      toast("RSVP cancelled");
    } else {
      next.add(id);
      toast.success(`RSVP'd to ${title}! 🎉`);
    }
    setRsvpIds(next);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-24">
      <div className="px-5 pt-6 pb-2">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-400 mb-4 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-2xl font-bold text-white">Events</h1>
        <p className="text-sm text-gray-500 mt-0.5">Community happenings in Paris</p>
      </div>

      <div className="px-5 mt-4 space-y-4">
        {mockEvents.map((event) => {
          const isRsvp = rsvpIds.has(event.id);
          const progress = (event.attendees / event.maxAttendees) * 100;

          return (
            <div key={event.id} className={`rounded-2xl border border-[#2a2a3e] overflow-hidden bg-gradient-to-br ${event.gradient}`}>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{event.emoji}</span>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${typeColors[event.type] || "bg-gray-800 text-gray-400"}`}>
                    {event.type}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
                <p className="text-xs text-gray-400 mb-3">Hosted by {event.host}</p>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Users className="w-3.5 h-3.5 text-gray-500" />
                    <span>{event.attendees}/{event.maxAttendees} going</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-black/30 mb-4">
                  <div
                    className="h-full rounded-full bg-[#d4a017] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <button
                  onClick={() => handleRsvp(event.id, event.title)}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                    isRsvp
                      ? "bg-green-900/30 text-green-400 border border-green-800/50"
                      : "bg-[#d4a017] text-black"
                  }`}
                >
                  {isRsvp ? "You're going ✓" : "RSVP"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default EventsPage;
