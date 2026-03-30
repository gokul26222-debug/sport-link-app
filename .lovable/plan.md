

## Plan: Connect PlayPal to a Full Backend with Lovable Cloud

### What You Get
- **Real authentication** — email/password, Google, and Apple sign-in
- **Database** — persistent storage for games, bookings, and user data
- **User profiles** — name, avatar, sports preferences, skill level, area
- **Data survives refresh** — no more losing everything on page reload

### Step 1: Enable Lovable Cloud
Set up Lovable Cloud (Supabase-powered backend) for the project. This gives us a database, auth, and storage automatically.

### Step 2: Create Database Tables

**profiles** table (auto-created on signup):
- `id` (uuid, FK to auth.users)
- `name`, `email`, `avatar_url`
- `preferred_sports` (text array)
- `skill_level` (text)
- `area` (text)
- `created_at`

**games** table:
- `id`, `sport`, `location`, `distance`, `date`, `time`
- `current_players`, `max_players`, `host_id` (FK to profiles)
- `description`, `level`, `created_at`

**game_participants** table:
- `game_id` (FK to games), `user_id` (FK to profiles)
- `joined_at`

**bookings** table:
- `court_name`, `sport`, `slot_time`, `date`
- `user_id` (FK to profiles), `booked_at`

All tables get Row-Level Security (RLS) policies so users can only modify their own data.

### Step 3: Set Up Authentication
- Replace the fake `login()` in `appContext` with real Supabase auth
- Add `supabase.auth.signUp()`, `signInWithPassword()`, and `signInWithOAuth()` for Google/Apple
- Add `onAuthStateChange` listener to track session state
- Update `OnboardingPage.tsx` to use real auth calls
- Update `Index.tsx` to check real session instead of local state

### Step 4: Create Supabase Client
- Add `src/integrations/supabase/client.ts` with project URL and anon key
- Add typed database helpers

### Step 5: Update App Logic
- **appContext.tsx** — replace `useState` mock data with Supabase queries
- **HomePage.tsx** — fetch games from database, real join/leave with `game_participants`
- **CreateGamePage.tsx** — insert games into database
- **BookPage.tsx** — save bookings to `bookings` table
- **ProfilePage.tsx** — read/update profile from `profiles` table
- **OnboardingPage.tsx** — real signup flow that creates profile on completion

### Step 6: Auto-Create Profile on Signup
Database trigger that automatically creates a `profiles` row when a new user signs up, using their name and email from auth metadata.

### Technical Details
- Uses Lovable Cloud (managed Supabase) — no external account needed
- RLS policies ensure data security
- Profile creation uses a database trigger (`handle_new_user` function)
- Auth state managed via `onAuthStateChange` listener set up before `getSession()`
- All existing UI/styling preserved — only the data layer changes

