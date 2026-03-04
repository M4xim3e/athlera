// src/components/ui/Tag.jsx
export default function Tag({ label, color = 'gray', small = false, icon }) {
  const colors = {
    gray:  { background: 'var(--tag-gray)',  color: 'var(--txt-sub)' },
    acc:   { background: 'var(--tag-acc)',   color: 'var(--acc-txt)' },
    green: { background: 'var(--tag-green)', color: 'var(--ok)'      },
    blue:  { background: 'var(--tag-blue)',  color: 'var(--info)'    },
    red:   { background: 'var(--tag-red)',   color: 'var(--err)'     },
  }

  const s = colors[color] || colors.gray

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: small ? '2px 8px' : '4px 10px',
      borderRadius: 999,
      fontSize: small ? 9 : 10,
      fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      ...s
    }}>
      {icon}{label}
    </span>
  )
}