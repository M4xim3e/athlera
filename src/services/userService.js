// src/services/userService.js
import { supabase } from '../lib/supabase'

// ─── PROFIL ──────────────────────────────────────
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles').select('*').eq('id', userId).single()
  if (error) return null
  return data
}

export const saveProfile = async (userId, profile) => {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...profile, updated_at: new Date().toISOString() })
  return !error
}

// ─── POIDS ───────────────────────────────────────
export const getWeightHistory = async (userId) => {
  const { data } = await supabase
    .from('weight_history').select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(90)
  return data || []
}

export const addWeight = async (userId, value) => {
  const { error } = await supabase
    .from('weight_history')
    .insert({ user_id: userId, value: parseFloat(value) })
  return !error
}

// ─── SÉANCES ─────────────────────────────────────
export const getWorkouts = async (userId) => {
  const { data } = await supabase
    .from('workouts').select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(60)
  return data || []
}

export const saveWorkout = async (userId, workout) => {
  const { error } = await supabase
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
  return !error
}

// ─── FAVORIS ─────────────────────────────────────
export const getFavorites = async (userId) => {
  const { data } = await supabase
    .from('workouts').select('*')
    .eq('user_id', userId)
    .eq('is_favorite', true)
    .order('completed_at', { ascending: false })
  return data || []
}

export const toggleFavorite = async (workoutId, current) => {
  const { error } = await supabase
    .from('workouts')
    .update({ is_favorite: !current })
    .eq('id', workoutId)
  return !error
}

// ─── POIDS PAR EXERCICE ───────────────────────────
export const getExerciseWeights = async (userId) => {
  const { data } = await supabase
    .from('exercise_weights').select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false })
  return data || []
}

export const saveExerciseWeight = async (userId, exerciseId, weight, reps, sets) => {
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
}

export const getLastExerciseWeight = async (userId, exerciseId) => {
  const { data } = await supabase
    .from('exercise_weights').select('*')
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .order('logged_at', { ascending: false })
    .limit(1)
  return data?.[0] || null
}

// ─── STREAK ──────────────────────────────────────
export const getStreak = async (userId) => {
  const { data } = await supabase
    .from('streaks').select('*').eq('user_id', userId).single()
  return data || { current: 0, longest: 0, last_date: null }
}

export const updateStreak = async (userId) => {
  const streak = await getStreak(userId)
  const today  = new Date(); today.setHours(0,0,0,0)
  const last   = streak.last_date ? new Date(streak.last_date) : new Date(0)
  last.setHours(0,0,0,0)
  const diff    = Math.round((today - last) / 86400000)
  const current = diff === 1 ? streak.current + 1 : diff === 0 ? streak.current : 1
  const longest = Math.max(current, streak.longest || 0)
  await supabase.from('streaks').upsert({
    user_id: userId, current, longest,
    last_date: today.toISOString().split('T')[0],
    updated_at: new Date().toISOString(),
  })
  return { current, longest }
}