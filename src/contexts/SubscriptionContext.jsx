import { createContext, useContext } from 'react'

const SubscriptionContext = createContext(null)

export function SubscriptionProvider({ children }) {
  return (
    <SubscriptionContext.Provider value={{
      subscription: { plan: 'era_plus', status: 'active' },
      loading: false,
      isPlus: true,
      isCancelled: false,
      needsWelcome: false,
      periodEnd: null,
      refresh: () => {},
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = () => useContext(SubscriptionContext)
