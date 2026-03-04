// src/contexts/WorkoutContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { getWorkouts, saveWorkout as save, updateStreak } from '../services/userService'

const WorkoutContext = createContext(null)

export function WorkoutProvider({ children }) {
  const { user } = useAuth()
  const uid = user?.id

  const [history, setHistory] = useState([])
  const [current, setCurrent] = useState(null)

  useEffect(() => {
    if (!uid) return
    getWorkouts(uid).then(setHistory)
  }, [uid])

  const saveSession = async (workout) => {
    await save(uid, workout)
    await updateStreak(uid)
    const updated = await getWorkouts(uid)
    setHistory(updated)
  }

  return (
    <WorkoutContext.Provider value={{ history, current, setCurrent, saveSession }}>
      {children}
    </WorkoutContext.Provider>
  )
}

export const useWorkout = () => useContext(WorkoutContext)