-- Extend games table with columns used by the new Create Game flow,
-- Home feed, and game lifecycle features.

ALTER TABLE public.games
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS location_lat DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS location_lng DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS skill_level TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'open';

-- Index to speed up the home feed (open games ordered by start time).
CREATE INDEX IF NOT EXISTS games_status_scheduled_idx
  ON public.games (status, scheduled_at);
