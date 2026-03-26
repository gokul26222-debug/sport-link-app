export type Sport = "Football" | "Basketball" | "Tennis" | "Volleyball" | "Badminton" | "Padel";

export type Level = "Beginner" | "Intermediate" | "Advanced";

export const sportEmojis: Record<Sport, string> = {
  Football: "⚽",
  Basketball: "🏀",
  Tennis: "🎾",
  Volleyball: "🏐",
  Badminton: "🏸",
  Padel: "🎾",
};

export const allSports: Sport[] = ["Football", "Basketball", "Tennis", "Volleyball", "Badminton", "Padel"];

export interface Game {
  id: string;
  sport: Sport;
  location: string;
  distance: string;
  date: string;
  time: string;
  currentPlayers: number;
  maxPlayers: number;
  host: string;
  description: string;
  level: Level;
}

export const mockGames: Game[] = [
  {
    id: "1",
    sport: "Football",
    location: "Buttes-Chaumont, 19e",
    distance: "1.2 km",
    date: "Today",
    time: "18:30",
    currentPlayers: 4,
    maxPlayers: 6,
    host: "Lucas M.",
    description: "Friendly match at the park. All levels welcome!",
    level: "Intermediate",
  },
  {
    id: "2",
    sport: "Basketball",
    location: "République, 10e",
    distance: "0.8 km",
    date: "Today",
    time: "19:00",
    currentPlayers: 2,
    maxPlayers: 5,
    host: "Amina D.",
    description: "Casual 3v3 game. Beginners welcome, come have fun!",
    level: "Beginner",
  },
  {
    id: "3",
    sport: "Tennis",
    location: "Bois de Boulogne, 16e",
    distance: "5.4 km",
    date: "Tomorrow",
    time: "10:00",
    currentPlayers: 1,
    maxPlayers: 2,
    host: "Pierre L.",
    description: "Looking for a competitive singles partner.",
    level: "Advanced",
  },
  {
    id: "4",
    sport: "Volleyball",
    location: "Champ de Mars, 7e",
    distance: "3.0 km",
    date: "Today",
    time: "17:00",
    currentPlayers: 5,
    maxPlayers: 8,
    host: "Sofia K.",
    description: "Beach volleyball vibes! Beginners encouraged.",
    level: "Beginner",
  },
  {
    id: "5",
    sport: "Badminton",
    location: "Nation, 12e",
    distance: "2.1 km",
    date: "Today",
    time: "20:00",
    currentPlayers: 2,
    maxPlayers: 4,
    host: "Yuki T.",
    description: "Doubles match at the indoor court.",
    level: "Intermediate",
  },
  {
    id: "6",
    sport: "Padel",
    location: "Boulogne-Billancourt",
    distance: "6.3 km",
    date: "Tomorrow",
    time: "09:30",
    currentPlayers: 3,
    maxPlayers: 4,
    host: "Marco R.",
    description: "Need one more for a padel doubles game!",
    level: "Intermediate",
  },
];
