import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/lib/appContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Clock, Users, User, Send } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const sportConfig: Record<string, { emoji: string; bg: string }> = {
  Football: { emoji: "⚽", bg: "bg-green-900/60" },
  Tennis: { emoji: "🎾", bg: "bg-yellow-900/60" },
  Basketball: { emoji: "🏀", bg: "bg-orange-900/60" },
  Badminton: { emoji: "🏸", bg: "bg-purple-900/60" },
  Running: { emoji: "🏃", bg: "bg-blue-900/60" },
  Padel: { emoji: "🎾", bg: "bg-teal-900/60" },
};

const skillStyles: Record<string, string> = {
  beginner: "bg-green-900/40 text-green-400",
  intermediate: "bg-orange-900/40 text-orange-400",
  advanced: "bg-red-900/40 text-red-400",
  all: "bg-gray-800/60 text-gray-400",
};

interface Participant {
  id: string;
  user_id: string;
  profile?: { name: string | null; avatar_url: string | null };
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profile?: { name: string | null };
}

const GameDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useApp();
  const [game, setGame] = useState<any>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgText, setMsgText] = useState("");
  const [hostProfile, setHostProfile] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      if (!id) return;
      const { data: gameData } = await supabase.from("games").select("*").eq("id", id).maybeSingle();
      setGame(gameData);

      if (gameData?.host_id) {
        const { data: host } = await supabase.from("profiles").select("name, avatar_url").eq("id", gameData.host_id).maybeSingle();
        setHostProfile(host);
      }

      // Participants
      const { data: parts } = await supabase.from("game_participants").select("id, user_id").eq("game_id", id);
      if (parts) {
        const profileIds = parts.map(p => p.user_id);
        const { data: profiles } = await supabase.from("profiles").select("id, name, avatar_url").in("id", profileIds);
        const enriched = parts.map(p => ({
          ...p,
          profile: profiles?.find(pr => pr.id === p.user_id) || undefined,
        }));
        setParticipants(enriched);
      }

      if (user) {
        const { data: part } = await supabase.from("game_participants").select("id").eq("game_id", id).eq("user_id", user.id).maybeSingle();
        setIsJoined(!!part);
      }

      // Messages
      const { data: msgs } = await supabase.from("messages").select("*").eq("game_id", id).order("created_at", { ascending: true });
      if (msgs) {
        const userIds = [...new Set(msgs.map(m => m.user_id))];
        const { data: profiles } = await supabase.from("profiles").select("id, name").in("id", userIds);
        setMessages(msgs.map(m => ({ ...m, profile: profiles?.find(p => p.id === m.user_id) })));
      }

      setLoading(false);
    };
    fetchAll();
  }, [id, user]);

  // Leaflet map
  useEffect(() => {
    if (!game?.location_lat || !game?.location_lng || !mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current).setView([game.location_lat, game.location_lng], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    const goldIcon = L.divIcon({
      html: `<div style="width:24px;height:24px;background:#d4a017;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      className: "",
    });
    L.marker([game.location_lat, game.location_lng], { icon: goldIcon }).addTo(map);
    mapInstance.current = map;

    return () => { map.remove(); mapInstance.current = null; };
  }, [game]);

  const handleJoin = async () => {
    if (!user || !game) return;
    const { error } = await supabase.from("game_participants").insert({ game_id: game.id, user_id: user.id });
    if (!error) {
      await supabase.from("games").update({ current_players: game.current_players + 1 }).eq("id", game.id);
      setGame({ ...game, current_players: game.current_players + 1 });
      setIsJoined(true);
      toast.success("You joined the game! 🎉");
    }
  };

  const handleLeave = async () => {
    if (!user || !game) return;
    await supabase.from("game_participants").delete().eq("game_id", game.id).eq("user_id", user.id);
    await supabase.from("games").update({ current_players: game.current_players - 1 }).eq("id", game.id);
    setGame({ ...game, current_players: game.current_players - 1 });
    setIsJoined(false);
    setParticipants(prev => prev.filter(p => p.user_id !== user.id));
    toast("Left the game");
  };

  const sendMessage = async () => {
    if (!user || !msgText.trim() || !id) return;
    const { data, error } = await supabase.from("messages").insert({ game_id: id, user_id: user.id, content: msgText.trim() }).select().single();
    if (!error && data) {
      setMessages(prev => [...prev, { ...data, profile: { name: user.user_metadata?.name || "You" } }]);
      setMsgText("");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );

  if (!game) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Game not found</p>
    </div>
  );

  const isFull = game.current_players >= game.max_players;
  const spotsLeft = game.max_players - game.current_players;
  const config = sportConfig[game.sport] || { emoji: "🎯", bg: "bg-gray-800" };
  const skillLabel = game.skill_level || game.level || "all";
  const dateStr = game.scheduled_at
    ? format(new Date(game.scheduled_at), "EEE d MMM · HH:mm")
    : `${game.date}, ${game.time}`;

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="px-5 pt-6 pb-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground mb-4 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl ${config.bg} flex items-center justify-center text-2xl`}>
            {config.emoji}
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{game.title || game.sport}</h1>
            <p className="text-sm mt-0.5" style={{ color: "#d4a017" }}>{game.sport}</p>
            <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full mt-1 inline-block ${skillStyles[skillLabel] || skillStyles["all"]}`}>
              {skillLabel === "all" ? "All Levels" : skillLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 py-2 space-y-4">
        {/* Host */}
        {hostProfile && (
          <div className="bg-card rounded-2xl p-4 border border-border/50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {(hostProfile.name || "H").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Hosted by {hostProfile.name}</p>
            </div>
          </div>
        )}

        {/* Details */}
        <div className="bg-card rounded-2xl p-4 border border-border/50 space-y-3">
          <div className="flex items-center gap-3 text-foreground">
            <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center"><MapPin className="w-4 h-4 text-muted-foreground" /></div>
            <p className="text-sm font-medium">{game.location}</p>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center"><Clock className="w-4 h-4 text-muted-foreground" /></div>
            <p className="text-sm font-medium">{dateStr}</p>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center"><Users className="w-4 h-4 text-muted-foreground" /></div>
            <div>
              <p className="text-sm font-medium">{game.current_players}/{game.max_players} players</p>
              <p className="text-xs" style={{ color: isFull ? "#999" : "#ff6b6b" }}>
                {isFull ? "Game is full" : `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} remaining`}
              </p>
            </div>
          </div>
        </div>

        {game.description && (
          <div className="bg-card rounded-2xl p-4 border border-border/50">
            <h3 className="text-sm font-semibold text-foreground mb-1">About this game</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{game.description}</p>
          </div>
        )}

        {/* Map */}
        {game.location_lat && game.location_lng && (
          <div className="rounded-2xl overflow-hidden border border-border/50" style={{ height: 200 }}>
            <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
          </div>
        )}

        {/* Players */}
        <div className="bg-card rounded-2xl p-4 border border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-3">Players joined</h3>
          {participants.length === 0 ? (
            <p className="text-xs text-muted-foreground">No players yet. Be the first!</p>
          ) : (
            <div className="space-y-2">
              {participants.map(p => (
                <div key={p.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary border-2 border-card flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <span className="text-sm text-foreground">{p.profile?.name || "Player"}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat */}
        <div className="bg-card rounded-2xl p-4 border border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-3">Group chat</h3>
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Be the first to say hi! 👋</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
              {messages.map(m => (
                <div key={m.id} className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <User className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{m.profile?.name || "Player"}</p>
                    <p className="text-xs text-muted-foreground">{m.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {isJoined && (
            <div className="flex gap-2 mt-2">
              <input
                value={msgText}
                onChange={e => setMsgText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Say something..."
                className="flex-1 bg-secondary rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button onClick={sendMessage} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#d4a017" }}>
                <Send className="w-4 h-4 text-black" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-card/80 backdrop-blur-xl border-t border-border/50">
        <div className="max-w-lg mx-auto">
          {isJoined ? (
            <div className="flex gap-3">
              <div className="flex-1 flex items-center justify-center bg-green-900/30 text-green-400 rounded-2xl text-sm font-medium">✓ You're in!</div>
              <Button variant="outline" onClick={handleLeave} className="h-12 rounded-2xl px-6 border-border/50 text-muted-foreground hover:text-foreground">Leave</Button>
            </div>
          ) : (
            <button
              onClick={handleJoin}
              disabled={isFull}
              className="w-full h-12 rounded-2xl text-base font-semibold disabled:opacity-50 text-black"
              style={{ background: isFull ? "#555" : "#d4a017", color: isFull ? "#999" : "#000" }}
            >
              {isFull ? "Game is Full" : "Join Game"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDetailPage;
