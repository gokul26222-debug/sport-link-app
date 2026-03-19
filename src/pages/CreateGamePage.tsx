import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/lib/appContext";
import { Sport } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const sports: Sport[] = ["Football", "Cricket", "Badminton"];
const sportEmojis: Record<Sport, string> = { Football: "⚽", Cricket: "🏏", Badminton: "🏸" };

const CreateGamePage = () => {
  const navigate = useNavigate();
  const { createGame, user } = useApp();
  const [sport, setSport] = useState<Sport>("Football");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("10");
  const [description, setDescription] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !date || !time) {
      toast.error("Please fill in all required fields");
      return;
    }
    createGame({
      sport,
      location,
      distance: "0 km",
      date,
      time,
      currentPlayers: 1,
      maxPlayers: parseInt(maxPlayers) || 10,
      host: user?.name || "You",
      description,
    });
    toast.success("Game created! 🎉");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-5 pt-6 pb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="font-heading text-2xl font-bold text-foreground">Create a Game</h1>
        <p className="text-sm text-muted-foreground mt-1">Set up a game and find players</p>
      </div>

      <form onSubmit={handleCreate} className="px-5 space-y-5">
        {/* Sport Selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Sport</label>
          <div className="flex gap-2">
            {sports.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSport(s)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                  sport === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {sportEmojis[s]} {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Location *</label>
          <Input
            placeholder="e.g., Koramangala Ground"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-12 rounded-xl bg-card"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Date *</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 rounded-xl bg-card"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Time *</label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-12 rounded-xl bg-card"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Max Players</label>
          <Input
            type="number"
            min="2"
            max="30"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(e.target.value)}
            className="h-12 rounded-xl bg-card"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Description</label>
          <Textarea
            placeholder="Add any details about the game..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-xl bg-card min-h-[80px]"
          />
        </div>

        <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold">
          Create Game
        </Button>
      </form>

      <BottomNav />
    </div>
  );
};

export default CreateGamePage;
