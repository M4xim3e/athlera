import { supabase } from '../lib/supabase'

// ─── PROFIL ──────────────────────────────────────
export const getProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) return null
    return data
  } catch (e) {
    return null
  }
}

export const saveProfile = async (userId, profile) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id:            userId,
        name:          profile.name          || null,
        gender:        profile.gender        || null,
        dob:           profile.dob           || null,
        age:           profile.age           || null,
        height:        profile.height        ? parseFloat(profile.height) : null,
        weight:        profile.weight        ? parseFloat(profile.weight) : null,
        target_weight: profile.target_weight ? parseFloat(profile.target_weight) : null,
        injuries:      profile.injuries      || null,
        goal:          profile.goal          || null,
        level:         profile.level         || null,
        freq:          profile.freq          ? parseInt(profile.freq) : null,
        has_gym:       profile.has_gym       ?? false,
        gym_id:        profile.gym_id        || null,
        equipment:     profile.equipment     || [],
        email:         profile.email         || null,
        updated_at:    new Date().toISOString(),
      }, { onConflict: 'id' })
    if (error) {
      console.error('saveProfile error:', error)
      return false
    }
    return true
  } catch (e) {
    console.error('saveProfile exception:', e)
    return false
  }
}

// ─── POIDS ───────────────────────────────────────
export const getWeightHistory = async (userId) => {
  try {
    const { data } = await supabase
      .from('weight_history')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(90)
    return data || []
  } catch (e) { return [] }
}

export const addWeight = async (userId, value) => {
  try {
    const { error } = await supabase
      .from('weight_history')
      .insert({ user_id: userId, value: parseFloat(value) })
    return !error
  } catch (e) { return false }
}

// ─── SÉANCES ─────────────────────────────────────
export const getWorkouts = async (userId) => {
  try {
    const { data } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(60)
    return data || []
  } catch (e) { return [] }
}

export const saveWorkout = async (userId, workout) => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .insert({
        user_id:            userId,
        focus:              workout.focus,
        goal:               workout.goal,
        level:              workout.level,
        gym_id:             workout.gymId,
        exercise_count:     workout.exerciseCount,
        total_sets:         workout.totalSets,
        estimated_duration: workout.estimatedDuration,
        exercises:          workout.main,
        warmup:             workout.warmup,
        cooldown:           workout.cooldown,
        finisher:           workout.finisher,
      })
      .select()
      .single()
    if (error) { console.error('saveWorkout error:', error); return null }
    return data?.id || null
  } catch (e) { return null }
}

// ─── FAVORIS ─────────────────────────────────────
export const getFavorites = async (userId) => {
  try {
    const { data } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_favorite', true)
      .order('completed_at', { ascending: false })
    return data || []
  } catch (e) { return [] }
}

export const toggleFavorite = async (workoutId, current) => {
  try {
    const { error } = await supabase
      .from('workouts')
      .update({ is_favorite: !current })
      .eq('id', workoutId)
    return !error
  } catch (e) { return false }
}

// ─── POIDS PAR EXERCICE ───────────────────────────
export const getExerciseWeights = async (userId) => {
  try {
    const { data } = await supabase
      .from('exercise_weights')
      .select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false })
    return data || []
  } catch (e) { return [] }
}

export const saveExerciseWeight = async (userId, exerciseId, weight, reps, sets) => {
  try {
    const { error } = await supabase
      .from('exercise_weights')
      .insert({
        user_id:     userId,
        exercise_id: exerciseId,
        weight:      parseFloat(weight),
        reps,
        sets,
        logged_at:   new Date().toISOString(),
      })
    return !error
  } catch (e) { return false }
}

export const getLastExerciseWeight = async (userId, exerciseId) => {
  try {
    const { data } = await supabase
      .from('exercise_weights')
      .select('*')
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId)
      .order('logged_at', { ascending: false })
      .limit(1)
    return data?.[0] || null
  } catch (e) { return null }
}

// ─── STREAK ──────────────────────────────────────
export const getStreak = async (userId) => {
  try {
    const { data } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single()
    return data || { current: 0, longest: 0, last_date: null }
  } catch (e) {
    return { current: 0, longest: 0, last_date: null }
  }
}

export const updateStreak = async (userId) => {
  try {
    const streak = await getStreak(userId)
    const today  = new Date(); today.setHours(0,0,0,0)
    const last   = streak.last_date ? new Date(streak.last_date) : new Date(0)
    last.setHours(0,0,0,0)
    const diff    = Math.round((today - last) / 86400000)
    const current = diff === 1 ? streak.current + 1 : diff === 0 ? streak.current : 1
    const longest = Math.max(current, streak.longest || 0)
    await supabase.from('streaks').upsert({
      user_id:    userId,
      current,
      longest,
      last_date:  today.toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    return { current, longest }
  } catch (e) {
    return { current: 0, longest: 0 }
  }
}
