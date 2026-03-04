// src/components/layout/BurgerMenu.jsx
import { useTheme } from '../../contexts/ThemeContext'
import { useLang }  from '../../contexts/LangContext'
import { useAuth }  from '../../contexts/AuthContext'
import Icons from '../ui/Icons'
import Button from '../ui/Button'

export default function BurgerMenu({ onClose, onNavigate }) {
  const { mode, toggle } = useTheme()
  const { lang, setLanguage, t } = useLang()
  const { signOut, user } = useAuth()

  const handle = async (id) => {
    if (id === 'theme')   { toggle(); return }
    if (id === 'lang')    { setLanguage(lang === 'fr' ? 'en' : 'fr'); return }
    if (id === 'logout')  { await signOut(); onClose(); return }
    if (id === 'profile') { onNavigate?.('profile'); onClose(); return }
  }

  const items = [
    { id: 'profile', icon: <Icons.user size={18} />,   label: t('menuProf') },
    { id: 'theme',   icon: mode === 'dark' ? <Icons.sun size={18} /> : <Icons.moon size={18} />, label: t('menuTheme'), sub: mode === 'dark' ? t('menuDark') : t('menuLight') },
    { id: 'lang',    icon: <Icons.globe size={18} />,  label: t('menuLang'), sub: lang === 'fr' ? 'Français' : 'English' },
    { id: 'logout',  icon: <Icons.logout size={18} />, label: t('menuOut'), danger: true },
  ]

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 40,
        background: 'var(--overlay)'
      }} />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 50,
        width: Math.min(300, window.innerWidth * 0.85),
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideRight 0.22s cubic-bezier(0.16,1,0.3,1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '22px 20px 18px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 22, color: 'var(--acc-txt)', letterSpacing: '0.05em'
            }}>
              ATHLERA
            </span>
            <div style={{ fontSize: 13, color: 'var(--txt-sub)', marginTop: 2 }}>
              {user?.email}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            cursor: 'pointer', display: 'flex', padding: 4
          }}>
            <Icons.x size={20} color="var(--txt-sub)" />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, padding: '8px 10px' }}>
          {items.map(item => (
            <button key={item.id} onClick={() => handle(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 13,
              width: '100%', padding: '14px 14px', borderRadius: 14,
              border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: 'inherit', textAlign: 'left',
              color: item.danger ? 'var(--err)' : 'var(--txt)',
              transition: 'background 0.12s'
            }}>
              <span style={{ color: item.danger ? 'var(--err)' : 'var(--txt-sub)' }}>
                {item.icon}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{item.label}</div>
                {item.sub && (
                  <div style={{ fontSize: 12, color: 'var(--txt-muted)', marginTop: 1 }}>
                    {item.sub}
                  </div>
                )}
              </div>
              {!item.danger && <Icons.chevRight size={14} color="var(--txt-muted)" />}
            </button>
          ))}
        </div>

        {/* Footer version */}
        <div style={{
          padding: '0 0 40px', textAlign: 'center',
          fontSize: 11, color: 'var(--txt-muted)'
        }}>
          ATHLERA · {t('version')} 1.0.0
        </div>
      </div>
    </>
  )
}