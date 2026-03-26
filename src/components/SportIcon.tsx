import { Sport } from "@/lib/mockData";

const sportEmojis: Record<Sport, string> = {
  Football: "⚽",
  Cricket: "🏏",
  Badminton: "🏸",
};

const sportColors: Record<Sport, string> = {
  Football: "bg-primary/20 text-primary",
  Cricket: "bg-success/20 text-success",
  Badminton: "bg-warning/20 text-warning",
};

export const SportIcon = ({ sport, size = "md" }: { sport: Sport; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-base",
    md: "w-10 h-10 text-xl",
    lg: "w-14 h-14 text-3xl",
  };

  return (
    <div className={`${sportColors[sport]} ${sizeClasses[size]} rounded-xl flex items-center justify-center`}>
      {sportEmojis[sport]}
    </div>
  );
};
