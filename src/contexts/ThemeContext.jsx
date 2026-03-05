import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

const THEMES = ['black-era', 'white-era', 'pink-era']

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(
    () => localStorage.getItem('athlera_theme') || 'black-era'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
    localStorage.setItem('athlera_theme', mode)
  }, [mode])

  const setTheme = (t) => { if (THEMES.includes(t)) setMode(t) }
  const toggle   = () => setMode(m => {
    const idx = THEMES.indexOf(m)
    return THEMES[(idx + 1) % THEMES.length]
  })

  return (
    <ThemeContext.Provider value={{ mode, setTheme, toggle, THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
