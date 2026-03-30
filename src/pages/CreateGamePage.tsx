import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/lib/appContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const sportOptions = ["Football", "Basketball", "Tennis", "Volleyball", "Badminton", "Padel"];
const sportEmojis: Record<string, string> = {
  Football: "⚽", Basketball: "🏀", Tennis: "🎾", Volleyball: "🏐", Badminton: "🏸", Padel: "🎾",
};

const CreateGamePage = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [sport, setSport] = useState("Football");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("10");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !date || !time || !user) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("games").insert({
      sport,
      location,
      distance: "0 km",
      date,
      time,
      current_players: 1,
      max_players: parseInt(maxPlayers) || 10,
      host_id: user.id,
      description,
      level: "Beginner",
    });
    if (error) {
      toast.error("Failed to create game");
    } else {
      toast.success("Game created! 🎉");
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-5 pt-6 pb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground mb-4 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Create a Game</h1>
        <p className="text-sm text-muted-foreground mt-1">Set up a game and find players</p>
      </div>

      <form onSubmit={handleCreate} className="px-5 space-y-5">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Sport</label>
          <div className="flex gap-2 flex-wrap">
            {sportOptions.map((s) => (
              <button key={s} type="button" onClick={() => setSport(s)} className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${sport === s ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "bg-card text-muted-foreground border border-border/50 hover:text-foreground"}`}>
                {sportEmojis[s]} {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Location *</label>
          <Input placeholder="e.g., Champ de Mars, 7e" value={location} onChange={(e) => setLocation(e.target.value)} className="h-12 rounded-2xl bg-card border-border/50 text-foreground placeholder:text-muted-foreground" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Date *</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-12 rounded-2xl bg-card border-border/50 text-foreground" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Time *</label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-12 rounded-2xl bg-card border-border/50 text-foreground" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Max Players</label>
          <Input type="number" min="2" max="30" value={maxPlayers} onChange={(e) => setMaxPlayers(e.target.value)} className="h-12 rounded-2xl bg-card border-border/50 text-foreground" />
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Description</label>
          <Textarea placeholder="Add any details about the game..." value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-2xl bg-card border-border/50 min-h-[80px] text-foreground placeholder:text-muted-foreground" />
        </div>

        <Button type="submit" disabled={loading} className="w-full h-12 rounded-2xl text-base font-semibold shadow-lg shadow-primary/25">
          {loading ? "Creating..." : "Create Game"}
        </Button>
      </form>

      <BottomNav />
    </div>
  );
};

export default CreateGamePage;
