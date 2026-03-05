import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import {
  getProfile, saveProfile as saveProfileSvc,
  getWeightHistory, addWeight as addWeightSvc,
  getStreak, updateStreak,
} from '../services/userService'

const ProfileContext = createContext(null)

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
  }, [authed, user])

  const load = async () => {
    setLoading(true)
    const [p, w, s] = await Promise.all([
      getProfile(user.id),
      getWeightHistory(user.id),
      getStreak(user.id),
    ])
    setProfile(p)
    setHasProfile(!!(p?.goal))
    setWeights(w)
    setStreak(s)
    setLoading(false)
  }

  const saveProfile = async (data) => {
    const ok = await saveProfileSvc(user.id, data)
    if (ok) {
      setProfile(data)
      setHasProfile(!!(data?.goal))
    }
    return ok
  }

  const addWeight = async (value) => {
    const ok = await addWeightSvc(user.id, value)
    if (ok) {
      const updated = await getWeightHistory(user.id)
      setWeights(updated)
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
