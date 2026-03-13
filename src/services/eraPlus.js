import { supabase } from '../lib/supabase'

// ─── ABONNEMENT ──────────────────────────────────
export const getSubscription = async (userId) => {
  try {
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()
    return data || { plan: 'free', status: 'free' }
  } catch (e) {
    return { plan: 'free', status: 'free' }
  }
}

export const createCheckoutSession = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return null

    const priceId = import.meta.env.VITE_STRIPE_PRICE_ID

    const res = await fetch(
      '${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id:    priceId,
          success_url: `${window.location.origin}?era_plus=success`,
          cancel_url:  `${window.location.origin}?era_plus=cancel`,
        }),
      }
    )

    const data = await res.json()
    return data?.url || null
  } catch (e) {
    console.error('createCheckoutSession error:', e)
    return null
  }
}

export const cancelEraPlus = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return false

    const res = await fetch(
      '${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cancel-subscription',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      }
    )

    return res.ok
  } catch (e) {
    console.error('cancelEraPlus error:', e)
    return false
  }
}

export const markWelcomed = async (userId) => {
  try {
    await supabase
      .from('subscriptions')
      .update({ era_plus_welcomed: true })
      .eq('user_id', userId)
  } catch (e) {}
}

export const getReferralCode = async (userId) => {
  try {
    const { data } = await supabase
      .from('subscriptions')
      .select('referral_code, referral_count')
      .eq('user_id', userId)
      .single()
    return data || null
  } catch (e) { return null }
}

// ─── HISTORIQUE PERFORMANCES ─────────────────────
export const saveExerciseHistory = async (userId, workoutId, exercises) => {
  try {
    const rows = exercises
      .filter(ex => ex.weight_log || ex.last_weight)
      .map(ex => ({
        user_id:       userId,
        exercise_id:   ex.id,
        exercise_name: ex.display_name || ex.name_fr || ex.id,
        workout_id:    workoutId || null,
        sets:          ex.sets || 3,
        reps:          ex.reps || '10',
        weight_kg:     parseFloat(ex.weight_log || ex.last_weight) || null,
        performed_at:  new Date().toISOString(),
      }))

    if (rows.length === 0) return true

    for (const row of rows) {
      const { data: prev } = await supabase
        .from('exercise_history')
        .select('weight_kg')
        .eq('user_id', userId)
        .eq('exercise_id', row.exercise_id)
        .order('weight_kg', { ascending: false })
        .limit(1)
        .single()

      if (!prev || (row.weight_kg && row.weight_kg > (prev?.weight_kg || 0))) {
        row.is_pr = true
      }
    }

    const { error } = await supabase.from('exercise_history').insert(rows)
    return !error
  } catch (e) {
    console.error('saveExerciseHistory error:', e)
    return false
  }
}

export const getExerciseHistory = async (userId, exerciseId, limit = 20) => {
  try {
    const { data } = await supabase
      .from('exercise_history')
      .select('*')
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId)
      .order('performed_at', { ascending: false })
      .limit(limit)
    return data || []
  } catch (e) { return [] }
}

export const getAllPRs = async (userId) => {
  try {
    const { data } = await supabase
      .from('exercise_history')
      .select('*')
      .eq('user_id', userId)
      .eq('is_pr', true)
      .order('performed_at', { ascending: false })
    return data || []
  } catch (e) { return [] }
}

// ─── SURCHARGE PROGRESSIVE ───────────────────────
const PROGRESSION_STEP = {
  STRENGTH:    { weight: 2.5, reps: 0 },
  MUSCLE_GAIN: { weight: 2.5, reps: 1 },
  FAT_LOSS:    { weight: 0,   reps: 2 },
  MAINTENANCE: { weight: 2.5, reps: 1 },
  PERFORMANCE: { weight: 2.5, reps: 1 },
}

const PROGRESSION_TYPE = {
  STRENGTH:    'weight',
  MUSCLE_GAIN: 'mixed',
  FAT_LOSS:    'reps',
  MAINTENANCE: 'mixed',
  PERFORMANCE: 'mixed',
}

export const getProgressiveOverload = async (userId, exerciseId) => {
  try {
    const { data } = await supabase
      .from('progressive_overload')
      .select('*')
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId)
      .single()
    return data || null
  } catch (e) { return null }
}

export const calculateNextTarget = (current, goal, consecutiveSuccess) => {
  if (!current || consecutiveSuccess < 2) return null
  const step = PROGRESSION_STEP[goal] || PROGRESSION_STEP.MUSCLE_GAIN
  const type = PROGRESSION_TYPE[goal] || 'mixed'
  const currentWeight = parseFloat(current.current_weight_kg) || 0
  const currentReps   = parseInt(current.current_reps) || 10

  if (type === 'weight') {
    return { weight: currentWeight + step.weight, reps: current.current_reps, label: `+${step.weight}kg` }
  }
  if (type === 'reps') {
    return { weight: currentWeight, reps: String(currentReps + step.reps), label: `+${step.reps} reps` }
  }
  const cycle = Math.floor(consecutiveSuccess / 2) % 2
  if (cycle === 0) {
    return { weight: currentWeight, reps: String(currentReps + 1), label: '+1 rep' }
  } else {
    return { weight: currentWeight + step.weight, reps: current.current_reps, label: `+${step.weight}kg` }
  }
}

export const updateProgressiveOverload = async (
  userId, exerciseId, weight, reps, sets, goal, allRepsCompleted
) => {
  try {
    const existing = await getProgressiveOverload(userId, exerciseId)
    const consecutive = allRepsCompleted
      ? (existing?.consecutive_success || 0) + 1
      : 0
    const type = PROGRESSION_TYPE[goal] || 'mixed'
    const next = calculateNextTarget(
      { current_weight_kg: weight, current_reps: reps }, goal, consecutive
    )
    await supabase.from('progressive_overload').upsert({
      user_id:             userId,
      exercise_id:         exerciseId,
      current_weight_kg:   parseFloat(weight) || null,
      current_reps:        String(reps),
      current_sets:        sets || 3,
      consecutive_success: consecutive,
      last_progression_at: allRepsCompleted && consecutive >= 2
        ? new Date().toISOString()
        : existing?.last_progression_at || null,
      next_target_weight:  next?.weight || null,
      next_target_reps:    next?.reps || null,
      progression_type:    type,
      updated_at:          new Date().toISOString(),
    }, { onConflict: 'user_id,exercise_id' })
    return next
  } catch (e) {
    console.error('updateProgressiveOverload error:', e)
    return null
  }
}

// ─── STATS HEBDOMADAIRES ─────────────────────────
export const getWeeklyStats = async (userId, weeksBack = 8) => {
  try {
    const since = new Date()
    since.setDate(since.getDate() - weeksBack * 7)
    const { data } = await supabase
      .from('weekly_stats')
      .select('*')
      .eq('user_id', userId)
      .gte('week_start', since.toISOString().split('T')[0])
      .order('week_start', { ascending: false })
    return data || []
  } catch (e) { return [] }
}

export const updateWeeklyStats = async (userId, workout) => {
  try {
    const now = new Date()
    const day = now.getDay()
    const monday = new Date(now)
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
    monday.setHours(0, 0, 0, 0)
    const weekStart = monday.toISOString().split('T')[0]

    const { data: existing } = await supabase
      .from('weekly_stats')
      .select('*')
      .eq('user_id', userId)
      .eq('week_start', weekStart)
      .single()

    const exercises = workout.main || []
    const volume = exercises.reduce((acc, ex) => {
      const w = parseFloat(ex.weight_log || ex.last_weight) || 0
      const r = parseInt(ex.reps) || 10
      const s = ex.sets || 3
      return acc + w * r * s
    }, 0)
    const prs = exercises.filter(ex => ex.is_pr).length

    await supabase.from('weekly_stats').upsert({
      user_id:        userId,
      week_start:     weekStart,
      total_volume:   (existing?.total_volume || 0) + volume,
      total_sessions: (existing?.total_sessions || 0) + 1,
      total_sets:     (existing?.total_sets || 0) + (workout.totalSets || 0),
      total_reps:     (existing?.total_reps || 0),
      prs_count:      (existing?.prs_count || 0) + prs,
      updated_at:     new Date().toISOString(),
    }, { onConflict: 'user_id,week_start' })
    return true
  } catch (e) { return false }
}

// ─── PROGRAMMES ──────────────────────────────────
export const getPrograms = async () => {
  try {
    const { data } = await supabase
      .from('programs')
      .select('*')
      .eq('is_active', true)
      .order('duration_weeks')
    return data || []
  } catch (e) { return [] }
}

export const getUserProgram = async (userId) => {
  try {
    const { data } = await supabase
      .from('user_programs')
      .select('*, program:programs(*)')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()
    return data || null
  } catch (e) { return null }
}

export const startProgram = async (userId, programId) => {
  try {
    await supabase.from('user_programs').update({ is_active: false }).eq('user_id', userId)
    const { error } = await supabase.from('user_programs').insert({
      user_id:    userId,
      program_id: programId,
      started_at: new Date().toISOString(),
      is_active:  true,
    })
    return !error
  } catch (e) { return false }
}
