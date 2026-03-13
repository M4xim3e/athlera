import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// Lit la session depuis localStorage de façon synchrone — 0ms, 0 réseau
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('athlera-auth')
    if (!raw) return null
    const session = JSON.parse(raw)
    // expires_at est un timestamp Unix en secondes
    if (!session?.expires_at || session.expires_at < (Date.now() / 1000) + 60) return null
    return session.user || null
  } catch { return null }
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(getStoredUser)  // Init synchrone, 0 réseau
  const [loading, setLoading] = useState(false)          // Jamais bloquant
  const [error,   setError]   = useState(null)

  useEffect(() => {
    // Vérification/refresh en arrière-plan (ne bloque pas l'UI)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    setError(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('auth_error'); return { ok: false } }
    return { ok: true, userId: data.user?.id }
  }

  const signUp = async (email, password, name) => {
    setError(null)
    const { data, error } = await supabase.auth.signUp({
      email, password, options: { data: { name } }
    })
    if (error) {
      setError(error.message?.toLowerCase().includes('already') ? 'email_used' : 'signup_error')
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
