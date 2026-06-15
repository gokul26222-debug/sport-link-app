-- Seed dummy games for today
INSERT INTO public.games (sport, title, location, location_lat, location_lng, date, time, skill_level, max_players, current_players, status, scheduled_at)
VALUES
  ('Football', 'Friendly Match', 'Parc des Buttes-Chaumont', 48.8814, 2.3814, '2026-06-15', '18:00', 'intermediate', 10, 4, 'open', '2026-06-15T18:00:00Z'),
  ('Tennis', 'Tennis Doubles', 'Jardin du Luxembourg', 48.8461, 2.3370, '2026-06-15', '19:00', 'advanced', 4, 2, 'open', '2026-06-15T19:00:00Z'),
  ('Basketball', 'Pickup Game', 'Champ de Mars', 48.8584, 2.2945, '2026-06-15', '20:00', 'beginner', 8, 5, 'open', '2026-06-15T20:00:00Z'),
  ('Running', 'Evening Run', 'Canal Saint-Martin', 48.8697, 2.3625, '2026-06-15', '17:30', 'all', 15, 8, 'open', '2026-06-15T17:30:00Z'),
  ('Badminton', 'Badminton Session', 'Marais District', 48.8599, 2.3628, '2026-06-15', '19:30', 'intermediate', 6, 3, 'open', '2026-06-15T19:30:00Z'),
  ('Football', 'Afternoon Football', 'Montmartre Park', 48.8867, 2.3431, '2026-06-15', '15:00', 'beginner', 12, 7, 'open', '2026-06-15T15:00:00Z'),
  ('Basketball', 'Street Hoops', 'Belleville Court', 48.8710, 2.3891, '2026-06-15', '17:00', 'intermediate', 10, 6, 'open', '2026-06-15T17:00:00Z'),
  ('Padel', 'Padel Tournament', 'Bois de Boulogne', 48.8476, 2.2496, '2026-06-15', '18:30', 'advanced', 8, 4, 'open', '2026-06-15T18:30:00Z')
ON CONFLICT DO NOTHING;
