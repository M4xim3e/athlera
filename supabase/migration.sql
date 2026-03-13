-- ═══════════════════════════════════════════════════════════
-- ATHLERA — Migration complète
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ═══════════════════════════════════════════════════════════

-- ─── PROFILES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id             uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email          text,
  name           text,
  gender         text CHECK (gender IN ('MALE','FEMALE','OTHER')),
  sexe           text CHECK (sexe IN ('homme','femme','neutre')),
  age            integer,
  dob            date,
  height         numeric,
  weight         numeric,
  goal           text CHECK (goal IN ('MUSCLE_GAIN','FAT_LOSS','STRENGTH','MAINTENANCE','PERFORMANCE')),
  level          text CHECK (level IN ('BEGINNER','INTERMEDIATE','ADVANCED')),
  freq           integer CHECK (freq >= 2 AND freq <= 6),
  injuries       text,
  has_gym        boolean DEFAULT true,
  gym_id         text,
  equipment      text[],
  target_weight  numeric,
  lang           text,
  theme          text,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

-- ─── SUBSCRIPTIONS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status                text DEFAULT 'free',
  plan                  text DEFAULT 'free',
  stripe_customer_id    text,
  stripe_subscription_id text,
  current_period_start  timestamptz,
  current_period_end    timestamptz,
  cancelled_at          timestamptz,
  cancel_at_period_end  boolean DEFAULT false,
  era_plus_welcomed     boolean DEFAULT false,
  referral_code         text,
  referral_count        integer DEFAULT 0,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

-- ─── WEIGHT_HISTORY ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS weight_history (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  value       numeric NOT NULL,
  recorded_at timestamptz DEFAULT now()
);

-- ─── WORKOUTS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workouts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  focus           text,
  custom_name     text,
  exercise_count  integer DEFAULT 0,
  total_sets      integer DEFAULT 0,
  is_favorite     boolean DEFAULT false,
  completed_at    timestamptz DEFAULT now()
);

-- ─── EXERCISE_HISTORY ────────────────────────────────────
CREATE TABLE IF NOT EXISTS exercise_history (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id   text NOT NULL,
  exercise_name text,
  workout_id    uuid REFERENCES workouts(id) ON DELETE SET NULL,
  sets          integer,
  reps          text,
  weight_kg     numeric,
  is_pr         boolean DEFAULT false,
  performed_at  timestamptz DEFAULT now()
);

-- ─── EXERCISE_WEIGHTS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS exercise_weights (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id text NOT NULL,
  weight      numeric,
  reps        text,
  sets        integer,
  logged_at   timestamptz DEFAULT now(),
  UNIQUE(user_id, exercise_id)
);

-- ─── STREAKS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS streaks (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current    integer DEFAULT 0,
  longest    integer DEFAULT 0,
  last_workout_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- ─── WEEKLY_STATS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS weekly_stats (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start     date NOT NULL,
  total_volume   numeric DEFAULT 0,
  total_sessions integer DEFAULT 0,
  total_sets     integer DEFAULT 0,
  total_reps     integer DEFAULT 0,
  prs_count      integer DEFAULT 0,
  updated_at     timestamptz DEFAULT now(),
  UNIQUE(user_id, week_start)
);

-- ─── PROGRESSIVE_OVERLOAD ────────────────────────────────
CREATE TABLE IF NOT EXISTS progressive_overload (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id         text NOT NULL,
  current_weight_kg   numeric,
  current_reps        text,
  current_sets        integer,
  next_target_weight  numeric,
  next_target_reps    text,
  consecutive_success integer DEFAULT 0,
  progression_type    text,
  last_progression_at timestamptz,
  updated_at          timestamptz DEFAULT now(),
  UNIQUE(user_id, exercise_id)
);

-- ─── PROGRAMS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS programs (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  description    text,
  goal           text,
  level          text,
  duration_weeks integer,
  sessions_week  integer,
  is_active      boolean DEFAULT true,
  created_at     timestamptz DEFAULT now()
);

-- ─── USER_PROGRAMS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_programs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id uuid REFERENCES programs(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  is_active  boolean DEFAULT true
);

-- ═══════════════════════════════════════════════════════════
-- RLS (Row Level Security)
-- ═══════════════════════════════════════════════════════════

ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_history     ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_history   ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_weights   ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_stats       ENABLE ROW LEVEL SECURITY;
ALTER TABLE progressive_overload ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_programs      ENABLE ROW LEVEL SECURITY;

-- Policies profiles
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Policies subscriptions
CREATE POLICY "subscriptions_select" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_insert" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "subscriptions_update" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Policies weight_history
CREATE POLICY "weight_history_select" ON weight_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "weight_history_insert" ON weight_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies workouts
CREATE POLICY "workouts_select" ON workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "workouts_insert" ON workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "workouts_update" ON workouts FOR UPDATE USING (auth.uid() = user_id);

-- Policies exercise_history
CREATE POLICY "exercise_history_select" ON exercise_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "exercise_history_insert" ON exercise_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies exercise_weights
CREATE POLICY "exercise_weights_select" ON exercise_weights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "exercise_weights_insert" ON exercise_weights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "exercise_weights_update" ON exercise_weights FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "exercise_weights_upsert" ON exercise_weights FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies streaks
CREATE POLICY "streaks_select" ON streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "streaks_insert" ON streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "streaks_update" ON streaks FOR UPDATE USING (auth.uid() = user_id);

-- Policies weekly_stats
CREATE POLICY "weekly_stats_select" ON weekly_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "weekly_stats_insert" ON weekly_stats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "weekly_stats_update" ON weekly_stats FOR UPDATE USING (auth.uid() = user_id);

-- Policies progressive_overload
CREATE POLICY "progressive_overload_select" ON progressive_overload FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "progressive_overload_insert" ON progressive_overload FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "progressive_overload_update" ON progressive_overload FOR UPDATE USING (auth.uid() = user_id);

-- Policies programs (lecture publique pour les connectés)
CREATE POLICY "programs_select" ON programs FOR SELECT USING (auth.role() = 'authenticated');

-- Policies user_programs
CREATE POLICY "user_programs_select" ON user_programs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_programs_insert" ON user_programs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_programs_update" ON user_programs FOR UPDATE USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════
-- INDEX pour les performances
-- ═══════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_weight_history_user ON weight_history(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_workouts_user ON workouts(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_exercise_history_user ON exercise_history(user_id, performed_at DESC);
CREATE INDEX IF NOT EXISTS idx_exercise_weights_user ON exercise_weights(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_stats_user ON weekly_stats(user_id, week_start DESC);
CREATE INDEX IF NOT EXISTS idx_progressive_overload_user ON progressive_overload(user_id);
