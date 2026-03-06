import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { getSubscription } from '../services/eraPlus'

const SubscriptionContext = createContext(null)

export function SubscriptionProvider({ children }) {
  const { user, authed } = useAuth()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    if (!authed || !user) {
      setSubscription({ plan: 'free', status: 'free' })
      setLoading(false)
      return
    }
    load()
  }, [authed, user?.id])

  const load = async () => {
    setLoading(true)
    const sub = await getSubscription(user.id)
    setSubscription(sub)
    setLoading(false)
  }

  const isPlus = subscription?.plan === 'era_plus' &&
                 subscription?.status === 'active'

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      loading,
      isPlus,
      refresh: load,
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = () => useContext(SubscriptionContext)
