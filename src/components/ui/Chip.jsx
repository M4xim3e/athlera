// src/components/ui/Chip.jsx
import { useState } from 'react'

export default function Chip({ selected, onClick, children, style = {} }) {
  const [press, setPress] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      onTouchStart={() => setPress(true)}
      onTouchEnd={() => setPress(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 8, padding: '13px 16px', borderRadius: 16,
        cursor: 'pointer', userSelect: 'none',
        border: `1.5px solid ${selected ? 'var(--acc)' : 'var(--border)'}`,
        background: selected ? 'var(--acc-dim)' : 'var(--surface)',
        color: selected ? 'var(--acc-txt)' : 'var(--txt-sub)',
        fontWeight: 500, fontSize: 14,
        transform: press ? 'scale(0.97)' : 'scale(1)',
        transition: 'all 0.16s cubic-bezier(0.16,1,0.3,1)',
        ...style
      }}
    >
      {children}
    </div>
  )
}