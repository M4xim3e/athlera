import { useState } from 'react'
import { useLang } from '../contexts/LangContext'
import Icons from '../components/ui/Icons'

export default function LangPickerPage({ onDone }) {
  const { setLanguage } = useLang()
  const [selected, setSelected] = useState(null)

  const choose = (lang) => {
    setSelected(lang)
    setLanguage(lang)
    setTimeout(onDone, 280)
  }

  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--bg-base)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px', gap: 48,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 68, height: 68,
          background: 'var(--acc)', borderRadius: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: 'var(--shd-acc)',
        }}>
          <Icons.logo size={36} color="var(--txt-inv)" strokeWidth={2.2} />
        </div>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 44, color: 'var(--txt)',
          letterSpacing: '0.05em', lineHeight: 1,
        }}>
          ATHLERA
        </h1>
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { id: 'fr', label: 'Francais' },
          { id: 'en', label: 'English' },
        ].map(lng => (
          <button
            key={lng.id}
            onClick={() => choose(lng.id)}
            style={{
              width: '100%', padding: '22px 24px',
              background: selected === lng.id ? 'var(--acc-dim)' : 'var(--surface)',
              border: `2px solid ${selected === lng.id ? 'var(--acc)' : 'var(--border)'}`,
              borderRadius: 18, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
              transform: selected === lng.id ? 'scale(0.98)' : 'scale(1)',
            }}
          >
            <span style={{
              fontSize: 17, fontWeight: 700,
              color: selected === lng.id ? 'var(--acc-txt)' : 'var(--txt)',
              fontFamily: 'inherit',
            }}>
              {lng.label}
            </span>
            {selected === lng.id && (
              <Icons.check size={20} color="var(--acc-txt)" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
