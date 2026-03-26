import { Sport, sportEmojis } from "@/lib/mockData";

const sportBgColors: Record<Sport, string> = {
  Football: "bg-primary/20",
  Basketball: "bg-warning/20",
  Tennis: "bg-success/20",
  Volleyball: "bg-destructive/20",
  Badminton: "bg-accent/20",
  Padel: "bg-success/20",
};

export const SportIcon = ({ sport, size = "md" }: { sport: Sport; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-base",
    md: "w-10 h-10 text-xl",
    lg: "w-14 h-14 text-3xl",
  };

  return (
    <div className={`${sportBgColors[sport]} ${sizeClasses[size]} rounded-xl flex items-center justify-center`}>
      {sportEmojis[sport]}
    </div>
  );
};
