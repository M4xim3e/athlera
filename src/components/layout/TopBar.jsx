import Icons from '../ui/Icons'

export default function TopBar({ onBack, onMenu, title }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      paddingTop: 'calc(env(safe-area-inset-top, 0px) + 14px)',
      paddingBottom: '14px',
      paddingLeft: '22px',
      paddingRight: '22px',
      position: 'sticky', top: 0, zIndex: 20,
      background: 'var(--nav)', backdropFilter: 'blur(10px)',
    }}>

      {/* Gauche */}
      {onBack ? (
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', padding: 6, borderRadius: 10,
          color: 'var(--txt-sub)',
        }}>
          <Icons.chevLeft size={20} color="var(--txt-sub)" />
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            background: 'var(--acc)', borderRadius: 10,
            padding: 6, display: 'flex',
          }}>
            <Icons.logo size={16} color="var(--txt-inv)" strokeWidth={2.2} />
          </div>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 20, color: 'var(--acc-txt)', letterSpacing: '0.05em',
          }}>
            ATHLERA
          </span>
        </div>
      )}

      {/* Centre */}
      {title && (
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 18, color: 'var(--txt)', letterSpacing: '0.03em',
        }}>
          {title}
        </span>
      )}

      {/* Droite */}
      {onMenu ? (
        <button onClick={onMenu} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', padding: 6, borderRadius: 10,
        }}>
          <Icons.menu size={22} color="var(--txt)" />
        </button>
      ) : (
        <div style={{ width: 34 }} />
      )}
    </div>
  )
}
