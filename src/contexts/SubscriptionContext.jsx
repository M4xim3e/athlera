import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { getSubscription } from '../services/eraPlus'

const SubscriptionContext = createContext(null)

export function SubscriptionProvider({ children }) {
  const { user, authed } = useAuth()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

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

  const now = new Date()
  const periodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end)
    : null

  const isPlus =
    subscription?.plan === 'era_plus' &&
    subscription?.status === 'active' &&
    (!periodEnd || periodEnd > now)

  const isCancelled =
    subscription?.plan === 'era_plus' &&
    subscription?.status === 'cancelled' &&
    periodEnd && periodEnd > now

  const needsWelcome =
    isPlus && subscription?.era_plus_welcomed === false

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      loading,
      isPlus,
      isCancelled,
      needsWelcome,
      periodEnd,
      refresh: load,
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = () => useContext(SubscriptionContext)
