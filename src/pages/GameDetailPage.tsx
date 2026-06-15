import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/lib/appContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Clock, Users, User, Send, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import PaymentSheet from "@/components/PaymentSheet";
import PaymentConfirmation from "@/components/PaymentConfirmation";
import MVPVote from "@/components/MVPVote";

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
  Beginner: "bg-green-900/40 text-green-400",
  Intermediate: "bg-orange-900/40 text-orange-400",
  Advanced: "bg-red-900/40 text-red-400",
  "All Levels": "bg-gray-800/60 text-gray-400",
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

function isGameEnded(game: { scheduled_at?: string | null; date?: string; time?: string }): boolean {
  let gameDate: Date;
  if (game.scheduled_at) {
    gameDate = new Date(game.scheduled_at);
  } else if (game.date && game.time) {
    gameDate = new Date(`${game.date}T${game.time}`);
  } else {
    return false;
  }
  return Date.now() > gameDate.getTime() + 2 * 60 * 60 * 1000;
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
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showMVP, setShowMVP] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAll = async () => {
      if (!id) return;
      const { data: gameData } = await supabase.from("games").select("*").eq("id", id).maybeSingle();
      setGame(gameData);

      if (gameData?.host_id) {
        const { data: host } = await supabase.from("profiles").select("name, avatar_url").eq("id", gameData.host_id).maybeSingle();
        setHostProfile(host);
      }

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

  useEffect(() => {
    if (!game?.location_lat || !game?.location_lng || !mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current).setView([game.location_lat, game.location_lng], 15);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "© CARTO",
    }).addTo(map);

    const goldIcon = L.divIcon({
      html: `<div style="width:28px;height:28px;background:#d4a017;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 12px rgba(212,160,23,0.5)"></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      className: "",
    });
    L.marker([game.location_lat, game.location_lng], { icon: goldIcon }).addTo(map);
    mapInstance.current = map;

    return () => { map.remove(); mapInstance.current = null; };
  }, [game]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleJoin = () => {
    if (!user || !game) return;
    setShowPayment(true);
  };

  const handlePaymentConfirm = async () => {
    if (!user || !game) return;
    setShowPayment(false);
    const { error } = await supabase.from("game_participants").insert({ game_id: game.id, user_id: user.id });
    if (!error) {
      await supabase.from("games").update({ current_players: game.current_players + 1 }).eq("id", game.id);
      setGame({ ...game, current_players: game.current_players + 1 });
      const { data: prof } = await supabase.from("profiles").select("id, name, avatar_url").eq("id", user.id).maybeSingle();
      setParticipants(prev => [...prev, { id: crypto.randomUUID(), user_id: user.id, profile: prof || undefined }]);
      setIsJoined(true);
      toast.success("You joined the game! 🎉");
      setShowConfirmation(true);
    }
  };

  const handleLeave = async () => {
    if (!user || !game) return;
    setShowPayment(false);
    setShowConfirmation(false);
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

  const hasVotedMVP = id ? !!JSON.parse(localStorage.getItem("mvp_votes") || "{}")[id]?.[user?.id || ""] : false;
  const gameEnded = game ? isGameEnded(game) : false;

  if (loading) return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-bounce">🎮</div>
        <p className="text-gray-500 text-sm">Loading game...</p>
      </div>
    </div>
  );

  if (!game) return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center gap-4">
      <p className="text-4xl">😕</p>
      <p className="text-gray-400">Game not found</p>
      <button onClick={() => navigate("/")} className="text-[#d4a017] text-sm font-medium">Go home</button>
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
    <div className="min-h-screen bg-[#0A0A0F] pb-28">
      <div className="px-5 pt-6 pb-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-400 mb-4 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl ${config.bg} flex items-center justify-center text-2xl shrink-0`}>
            {config.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white truncate">{game.title || game.sport}</h1>
            <p className="text-sm mt-0.5 text-[#d4a017] font-medium">{game.sport}</p>
            <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full mt-1 inline-block ${skillStyles[skillLabel] || skillStyles["all"]}`}>
              {skillLabel === "all" ? "All Levels" : skillLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 py-2 space-y-4">
        {/* Game ended + MVP vote banner */}
        {gameEnded && isJoined && participants.length >= 2 && (
          <div className="bg-gradient-to-r from-[#d4a017]/20 to-[#6C5CE7]/20 rounded-2xl border border-[#d4a017]/30 p-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-[#d4a017]" />
              <div className="flex-1">
                <p className="text-sm font-bold text-white">Game Over!</p>
                <p className="text-xs text-gray-400">
                  {hasVotedMVP ? "You've voted for MVP" : "Vote for the MVP of this game"}
                </p>
              </div>
              {!hasVotedMVP && (
                <button
                  onClick={() => setShowMVP(true)}
                  className="px-4 py-2 rounded-xl bg-[#d4a017] text-black text-xs font-bold"
                >
                  Vote MVP
                </button>
              )}
            </div>
          </div>
        )}

        {/* Host */}
        {hostProfile && (
          <div className="bg-[#13131A] rounded-2xl p-4 border border-[#2a2a3a] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#6C5CE7]/20 flex items-center justify-center text-xs font-bold text-[#6C5CE7]">
              {(hostProfile.name || "H").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-white">Hosted by {hostProfile.name}</p>
            </div>
          </div>
        )}

        {/* Details */}
        <div className="bg-[#13131A] rounded-2xl p-4 border border-[#2a2a3a] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1a1a2e] rounded-xl flex items-center justify-center"><MapPin className="w-4 h-4 text-gray-500" /></div>
            <p className="text-sm font-medium text-white">{game.location}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1a1a2e] rounded-xl flex items-center justify-center"><Clock className="w-4 h-4 text-gray-500" /></div>
            <p className="text-sm font-medium text-white">{dateStr}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1a1a2e] rounded-xl flex items-center justify-center"><Users className="w-4 h-4 text-gray-500" /></div>
            <div>
              <p className="text-sm font-medium text-white">{game.current_players}/{game.max_players} players</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 rounded-full bg-[#1a1a2e] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all bg-[#d4a017]"
                    style={{ width: `${(game.current_players / game.max_players) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 shrink-0">
                  {isFull ? "Full" : `${spotsLeft} left`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {game.description && (
          <div className="bg-[#13131A] rounded-2xl p-4 border border-[#2a2a3a]">
            <h3 className="text-sm font-semibold text-white mb-1">About this game</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{game.description}</p>
          </div>
        )}

        {/* Map */}
        {game.location_lat && game.location_lng && (
          <div className="rounded-2xl overflow-hidden border border-[#2a2a3a]" style={{ height: 200 }}>
            <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
          </div>
        )}

        {/* Players */}
        <div className="bg-[#13131A] rounded-2xl p-4 border border-[#2a2a3a]">
          <h3 className="text-sm font-semibold text-white mb-3">
            Players <span className="text-gray-500">({participants.length})</span>
          </h3>
          {participants.length === 0 ? (
            <p className="text-xs text-gray-500">No players yet. Be the first!</p>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {participants.map(p => {
                const initials = (p.profile?.name || "P").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <div key={p.id} className="flex flex-col items-center gap-1.5">
                    <div className="w-11 h-11 rounded-full bg-[#6C5CE7]/20 border border-[#6C5CE7]/30 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#6C5CE7]">{initials}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 text-center truncate w-full">{p.profile?.name || "Player"}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat */}
        <div className="bg-[#13131A] rounded-2xl p-4 border border-[#2a2a3a]">
          <h3 className="text-sm font-semibold text-white mb-3">Group chat 💬</h3>
          {messages.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Be the first to say hi! 👋</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto mb-3 px-1">
              {messages.map(m => {
                const isMe = m.user_id === user?.id;
                return (
                  <div key={m.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                    <div className="w-7 h-7 rounded-full bg-[#1a1a2e] flex items-center justify-center shrink-0">
                      <User className="w-3 h-3 text-gray-500" />
                    </div>
                    <div className={`max-w-[75%] ${isMe ? "text-right" : ""}`}>
                      <p className="text-[10px] font-medium text-gray-500 mb-0.5">{m.profile?.name || "Player"}</p>
                      <div className={`px-3 py-2 rounded-2xl text-sm ${
                        isMe ? "bg-[#6C5CE7]/20 text-[#a29bfe] rounded-tr-sm" : "bg-[#1a1a2e] text-gray-300 rounded-tl-sm"
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
          )}
          {isJoined && (
            <div className="flex gap-2 mt-2">
              <input
                value={msgText}
                onChange={e => setMsgText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Say something..."
                className="flex-1 bg-[#0A0A0F] border border-[#2a2a3a] rounded-xl px-3 py-2 text-sm text-white placeholder:text-gray-600 outline-none focus:border-[#6C5CE7] transition-colors"
              />
              <button onClick={sendMessage} className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#d4a017] shrink-0">
                <Send className="w-4 h-4 text-black" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-[#0A0A0F]/90 backdrop-blur-xl border-t border-[#1a1a2e]">
        <div className="max-w-lg mx-auto">
          {isJoined ? (
            <div className="flex gap-3">
              <div className="flex-1 flex items-center justify-center bg-green-900/30 text-green-400 rounded-2xl text-sm font-semibold h-12">
                ✓ You're in!
              </div>
              <Button variant="outline" onClick={handleLeave} className="h-12 rounded-2xl px-6 border-[#2a2a3a] text-gray-400 hover:text-white bg-transparent">
                Leave
              </Button>
            </div>
          ) : (
            <button
              onClick={handleJoin}
              disabled={isFull}
              className="w-full h-12 rounded-2xl text-base font-semibold disabled:opacity-50 text-black transition-all active:scale-[0.98]"
              style={{ background: isFull ? "#333" : "#d4a017", color: isFull ? "#888" : "#000" }}
            >
              {isFull ? "Game is Full" : "Join Game"}
            </button>
          )}
        </div>
      </div>

      <PaymentSheet
        open={showPayment}
        onClose={() => setShowPayment(false)}
        onConfirm={handlePaymentConfirm}
        game={game}
      />
      <PaymentConfirmation
        open={showConfirmation}
        game={game}
        participants={participants}
        onClose={() => setShowConfirmation(false)}
      />
      {showMVP && user && (
        <MVPVote
          gameId={game.id}
          participants={participants.map(p => ({ user_id: p.user_id, name: p.profile?.name || "Player" }))}
          currentUserId={user.id}
          onClose={() => setShowMVP(false)}
        />
      )}
    </div>
  );
};

export default GameDetailPage;
