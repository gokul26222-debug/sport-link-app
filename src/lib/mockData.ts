export type Sport = "Football" | "Cricket" | "Badminton";

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
}

export const mockGames: Game[] = [
  {
    id: "1",
    sport: "Football",
    location: "Koramangala Ground, Bangalore",
    distance: "1.2 km",
    date: "Today",
    time: "6:00 PM",
    currentPlayers: 7,
    maxPlayers: 10,
    host: "Arjun K.",
    description: "Friendly 5-a-side match. All skill levels welcome. Bring water!",
  },
  {
    id: "2",
    sport: "Cricket",
    location: "Indiranagar Park, Bangalore",
    distance: "2.5 km",
    date: "Today",
    time: "7:30 PM",
    currentPlayers: 8,
    maxPlayers: 12,
    host: "Priya S.",
    description: "Tennis ball cricket. Need 4 more players to complete the teams.",
  },
  {
    id: "3",
    sport: "Badminton",
    location: "HSR Sports Complex",
    distance: "3.1 km",
    date: "Tomorrow",
    time: "8:00 AM",
    currentPlayers: 2,
    maxPlayers: 4,
    host: "Rahul M.",
    description: "Doubles match at the indoor court. Intermediate level preferred.",
  },
  {
    id: "4",
    sport: "Football",
    location: "Cubbon Park, Bangalore",
    distance: "4.0 km",
    date: "Tomorrow",
    time: "5:30 PM",
    currentPlayers: 5,
    maxPlayers: 14,
    host: "Sneha R.",
    description: "7-a-side casual game. Beginners welcome!",
  },
  {
    id: "5",
    sport: "Badminton",
    location: "JP Nagar Sports Hub",
    distance: "1.8 km",
    date: "Today",
    time: "9:00 PM",
    currentPlayers: 1,
    maxPlayers: 2,
    host: "Vikram T.",
    description: "Looking for a singles partner. Competitive level.",
  },
  {
    id: "6",
    sport: "Cricket",
    location: "Whitefield Grounds",
    distance: "5.2 km",
    date: "Sat, Mar 22",
    time: "6:00 AM",
    currentPlayers: 11,
    maxPlayers: 22,
    host: "Amit D.",
    description: "Full format weekend match. Leather ball. Proper kits required.",
  },
];
