import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import {
  getProfile, saveProfile as saveProfileSvc,
  getWeightHistory, addWeight as addWeightSvc,
  getStreak, updateStreak,
} from '../services/userService'

const ProfileContext = createContext(null)

const cacheKey   = (uid) => `athlera-profile-${uid}`
const readCache  = (uid) => { try { const r = localStorage.getItem(cacheKey(uid)); return r ? JSON.parse(r) : null } catch { return null } }
const writeCache = (uid, p) => { try { localStorage.setItem(cacheKey(uid), JSON.stringify(p)) } catch {} }

export function ProfileProvider({ children }) {
  const { user, authed } = useAuth()
  const [profile,    setProfile]    = useState(null)
  const [weights,    setWeights]    = useState([])
  const [streak,     setStreak]     = useState({ current: 0, longest: 0 })
  const [loading,    setLoading]    = useState(true)
  const [hasProfile, setHasProfile] = useState(false)

  useEffect(() => {
    if (!authed || !user) {
      setProfile(null)
      setWeights([])
      setStreak({ current: 0, longest: 0 })
      setHasProfile(false)
      setLoading(false)
      return
    }
    load()
  }, [authed, user?.id])

  const load = async () => {
    // Phase 0 : cache localStorage -> 0 reseau, routing instantane
    const cached = readCache(user.id)
    if (cached) {
      setProfile(cached)
      setHasProfile(!!(cached?.goal))
      setLoading(false)
    } else {
      setLoading(true)
    }

    // Phase 1 : fetch frais (arriere-plan si cache dispo)
    try {
      const p = await getProfile(user.id)
      setProfile(p)
      setHasProfile(!!(p?.goal))
      if (p) writeCache(user.id, p)
    } catch (e) {
      console.error('Profile load error:', e)
      if (!cached) setHasProfile(false)
    }
    setLoading(false)

    // Phase 2 : poids & streak en arriere-plan (non-bloquant)
    try {
      const [w, s] = await Promise.all([
        getWeightHistory(user.id),
        getStreak(user.id),
      ])
      setWeights(w || [])
      setStreak(s || { current: 0, longest: 0 })
    } catch (e) {
      console.error('Background load error:', e)
    }
  }

  const saveProfile = async (data) => {
    try {
      const ok = await saveProfileSvc(user.id, data)
      if (ok) {
        setProfile(data)
        setHasProfile(!!(data?.goal))
        writeCache(user.id, data)
      }
      return ok
    } catch (e) {
      console.error('Save profile error:', e)
      return false
    }
  }

  const addWeight = async (value) => {
    const ok = await addWeightSvc(user.id, value)
    if (ok) {
      const updated = await getWeightHistory(user.id)
      setWeights(updated || [])
    }
    return ok
  }

  const refreshStreak = async () => {
    const s = await updateStreak(user.id)
    setStreak(s)
  }

  return (
    <ProfileContext.Provider value={{
      profile, weights, streak, loading, hasProfile,
      saveProfile, addWeight, refreshStreak,
    }}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => useContext(ProfileContext)
