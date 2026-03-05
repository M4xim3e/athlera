// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    setError(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('auth_error')
      return { ok: false }
    }
    return { ok: true, userId: data.user?.id }
  }

  const signUp = async (email, password, name) => {
    setError(null)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    })
    if (error) {
      if (error.message?.toLowerCase().includes('already')) {
        setError('email_used')
      } else {
        setError('signup_error')
      }
      return { ok: false }
    }
    if (data?.user?.identities?.length === 0) {
      setError('email_used')
      return { ok: false }
    }
    return { ok: true, userId: data.user?.id }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider value={{
      user, loading, error,
      signIn, signUp, signOut, clearError,
      authed: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
