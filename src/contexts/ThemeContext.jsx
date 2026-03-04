// src/contexts/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(
    () => localStorage.getItem('athlera_theme') || 'dark'
  )

  useEffect(() => {
    localStorage.setItem('athlera_theme', mode)
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  const toggle = () => setMode(m => m === 'dark' ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ mode, toggle, isDark: mode === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)