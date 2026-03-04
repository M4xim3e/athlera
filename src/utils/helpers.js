// src/utils/helpers.js
// Fonctions pures utilitaires — aucune dépendance React

export const sleep = ms => new Promise(r => setTimeout(r, ms))

export const fmtDate = (iso, lang) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(
    lang === 'fr' ? 'fr-FR' : 'en-GB',
    { weekday: 'short', day: 'numeric', month: 'short' }
  )
}

export const greet = (t) => {
  const h = new Date().getHours()
  return h < 12 ? t('morn') : h < 18 ? t('aftn') : t('evng')
}

export const calcBMI = (weight, height) => {
  if (!weight || !height) return null
  return (weight / Math.pow(height / 100, 2)).toFixed(1)
}

export const weekDelta = (weights) => {
  if (!weights || weights.length < 2) return null
  const cur  = weights[0]?.value
  const prev = weights.find((_, i) => i >= 6)?.value
  if (!cur || !prev) return null
  return (parseFloat(cur) - parseFloat(prev)).toFixed(1)
}

export const isStreakValid = (lastDate) => {
  if (!lastDate) return false
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const last  = new Date(lastDate); last.setHours(0, 0, 0, 0)
  return Math.round((today - last) / 86400000) <= 1
}