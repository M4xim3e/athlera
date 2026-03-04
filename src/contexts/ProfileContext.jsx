// src/contexts/ProfileContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import {
  getProfile, saveProfile as save,
  getWeightHistory, addWeight as add,
  getStreak, updateStreak,
} from '../services/userService'

const ProfileContext = createContext(null)

export function ProfileProvider({ children }) {
  const { user } = useAuth()
  const uid = user?.id

  const [profile,  setProfile]  = useState(null)
  const [weights,  setWeights]  = useState([])
  const [streak,   setStreak]   = useState({ current: 0, longest: 0 })
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    if (!uid) { setLoading(false); return }
    const load = async () => {
      setLoading(true)
      const [p, w, s] = await Promise.all([
        getProfile(uid),
        getWeightHistory(uid),
        getStreak(uid),
      ])
      setProfile(p)
      setWeights(w)
      setStreak(s)
      setLoading(false)
    }
    load()
  }, [uid])

  const saveProfile = async (data) => {
    await save(uid, data)
    setProfile(prev => ({ ...prev, ...data }))
  }

  const addWeight = async (value) => {
    await add(uid, value)
    const w = await getWeightHistory(uid)
    setWeights(w)
    setProfile(prev => ({ ...prev, weight: parseFloat(value) }))
  }

  const refreshStreak = async () => {
    const s = await updateStreak(uid)
    setStreak(s)
  }

  const hasProfile = !!profile?.goal

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