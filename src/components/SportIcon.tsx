import { Sport } from "@/lib/mockData";

const sportEmojis: Record<Sport, string> = {
  Football: "⚽",
  Cricket: "🏏",
  Badminton: "🏸",
};

const sportColors: Record<Sport, string> = {
  Football: "bg-sport-football",
  Cricket: "bg-sport-cricket",
  Badminton: "bg-sport-badminton",
};

export const SportIcon = ({ sport, size = "md" }: { sport: Sport; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-base",
    md: "w-10 h-10 text-xl",
    lg: "w-14 h-14 text-3xl",
  };

  return (
    <div className={`${sportColors[sport]} ${sizeClasses[size]} rounded-xl flex items-center justify-center text-primary-foreground`}>
      {sportEmojis[sport]}
    </div>
  );
};
