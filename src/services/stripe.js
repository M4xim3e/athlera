import { supabase } from '../lib/supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

async function getAuthHeader() {
  const { data } = await supabase.auth.getSession()
  const token = data?.session?.access_token
  if (!token) throw new Error('Not authenticated')
  return `Bearer ${token}`
}

export const createCheckoutSession = async () => {
  try {
    const authHeader = await getAuthHeader()
    const priceId = import.meta.env.VITE_STRIPE_PRICE_ID

    if (!priceId) {
      console.error('VITE_STRIPE_PRICE_ID manquant')
      return null
    }

    const res = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        price_id:    priceId,
        success_url: `${window.location.origin}?era_plus=success`,
        cancel_url:  `${window.location.origin}?era_plus=cancel`,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('create-checkout error:', err)
      return null
    }

    const data = await res.json()
    return data?.url || null
  } catch (e) {
    console.error('createCheckoutSession error:', e)
    return null
  }
}

export const cancelSubscription = async () => {
  try {
    const authHeader = await getAuthHeader()

    const res = await fetch(`${SUPABASE_URL}/functions/v1/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('cancel-subscription error:', err)
      return false
    }

    return true
  } catch (e) {
    console.error('cancelSubscription error:', e)
    return false
  }
}
