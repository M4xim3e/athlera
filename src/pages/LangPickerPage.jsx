// src/pages/LangPickerPage.jsx
import { useState } from 'react'
import { useLang }  from '../contexts/LangContext'
import Icons        from '../components/ui/Icons'

export default function LangPickerPage({ onDone }) {
  const { setLanguage } = useLang()
  const [selected, setSelected] = useState(null)
  const [visible,  setVisible]  = useState(true)

  const choose = (lang) => {
    setSelected(lang)
    setLanguage(lang)
    setTimeout(onDone, 320)
  }

  const LANGS = [
    { id: 'fr', flag: '🇫🇷', name: 'Français',  sub: 'Continuer en français' },
    { id: 'en', flag: '🇬🇧', name: 'English',   sub: 'Continue in English'   },
  ]

  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--bg-base)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px',
      gap: 40,
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72,
          background: 'var(--acc)', borderRadius: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: 'var(--shd-acc)',
        }}>
          <Icons.logo size={38} color="var(--txt-inv)" strokeWidth={2.2} />
        </div>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 48, color: 'var(--txt)',
          letterSpacing: '0.05em', lineHeight: 1,
        }}>
          ATHLERA
        </h1>
      </div>

      {/* Choix */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {LANGS.map(lang => (
          <button
            key={lang.id}
            onClick={() => choose(lang.id)}
            style={{
              width: '100%', padding: '20px 22px',
              background: selected === lang.id ? 'var(--acc-dim)' : 'var(--surface)',
              border: `2px solid ${selected === lang.id ? 'var(--acc)' : 'var(--border)'}`,
              borderRadius: 20, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 16,
              transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
              transform: selected === lang.id ? 'scale(0.98)' : 'scale(1)',
            }}
          >
            <span style={{ fontSize: 36 }}>{lang.flag}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--txt)' }}>
                {lang.name}
              </div>
              <div style={{ fontSize: 13, color: 'var(--txt-sub)', marginTop: 2 }}>
                {lang.sub}
              </div>
            </div>
            {selected === lang.id && (
              <div style={{ marginLeft: 'auto' }}>
                <Icons.check size={20} color="var(--acc-txt)" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}