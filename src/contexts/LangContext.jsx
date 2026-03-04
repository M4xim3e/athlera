// src/contexts/LangContext.jsx
import { createContext, useCallback, useContext, useState } from 'react'
import { t as translate } from '../lib/i18n'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem('athlera_lang')
      || (navigator.language?.startsWith('fr') ? 'fr' : 'en')
  )

  const setLanguage = l => {
    setLang(l)
    localStorage.setItem('athlera_lang', l)
  }

  const t = useCallback(key => translate(lang, key), [lang])

  return (
    <LangContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)