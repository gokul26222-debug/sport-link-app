// Sample games shown when the database has no open games yet.
// Times are generated relative to "now" so they always look current.

export interface SampleGame {
  id: string;
  sport: string;
  title: string;
  location: string;
  date: string;
  time: string;
  current_players: number;
  max_players: number;
  level: string | null;
  skill_level: string | null;
  scheduled_at: string;
  status: string;
  description: string | null;
  host_id: string | null;
  location_lat: number;
  location_lng: number;
}

function atHour(hour: number, min = 0): { scheduled_at: string; time: string; date: string } {
  const d = new Date();
  d.setHours(hour, min, 0, 0);
  const hh = String(hour).padStart(2, "0");
  const mm = String(min).padStart(2, "0");
  return {
    scheduled_at: d.toISOString(),
    time: `${hh}:${mm}`,
    date: d.toISOString().split("T")[0],
  };
}

const seeds = [
  { sport: "Football", title: "Friendly Match", location: "Parc des Buttes-Chaumont", lat: 48.8814, lng: 2.3814, h: 18, m: 0, skill: "intermediate", max: 10, cur: 4 },
  { sport: "Tennis", title: "Tennis Doubles", location: "Jardin du Luxembourg", lat: 48.8461, lng: 2.337, h: 19, m: 0, skill: "advanced", max: 4, cur: 2 },
  { sport: "Basketball", title: "Pickup Game", location: "Champ de Mars", lat: 48.8584, lng: 2.2945, h: 20, m: 0, skill: "beginner", max: 8, cur: 5 },
  { sport: "Running", title: "Evening Run", location: "Canal Saint-Martin", lat: 48.8697, lng: 2.3625, h: 17, m: 30, skill: "all", max: 15, cur: 8 },
  { sport: "Badminton", title: "Badminton Session", location: "Marais District", lat: 48.8599, lng: 2.3628, h: 19, m: 30, skill: "intermediate", max: 6, cur: 3 },
  { sport: "Football", title: "Afternoon Football", location: "Montmartre Park", lat: 48.8867, lng: 2.3431, h: 15, m: 0, skill: "beginner", max: 12, cur: 7 },
  { sport: "Basketball", title: "Street Hoops", location: "Belleville Court", lat: 48.871, lng: 2.3891, h: 17, m: 0, skill: "intermediate", max: 10, cur: 6 },
  { sport: "Padel", title: "Padel Tournament", location: "Bois de Boulogne", lat: 48.8476, lng: 2.2496, h: 18, m: 30, skill: "advanced", max: 8, cur: 4 },
];

export const sampleGames: SampleGame[] = seeds.map((s, i) => {
  const t = atHour(s.h, s.m);
  return {
    id: `sample-${i}`,
    sport: s.sport,
    title: s.title,
    location: s.location,
    date: t.date,
    time: t.time,
    current_players: s.cur,
    max_players: s.max,
    level: s.skill,
    skill_level: s.skill,
    scheduled_at: t.scheduled_at,
    status: "open",
    description: null,
    host_id: null,
    location_lat: s.lat,
    location_lng: s.lng,
  };
});
