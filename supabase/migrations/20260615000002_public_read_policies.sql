-- Allow unauthenticated (anon) users to READ games, profiles, participants
-- so the home feed and game detail work without login.

DROP POLICY IF EXISTS "Anyone can view games" ON public.games;
CREATE POLICY "Anyone can view games" ON public.games
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view participants" ON public.game_participants;
CREATE POLICY "Anyone can view participants" ON public.game_participants
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Participants can view messages" ON public.messages;
CREATE POLICY "Participants can view messages" ON public.messages
  FOR SELECT USING (true);
