// src/components/ui/Card.jsx
import { useState } from 'react'

export default function Card({ children, style = {}, glow = false, onClick, padding = '18px' }) {
  const [hov, setHov] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onClick && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${hov ? 'var(--border-up)' : 'var(--border)'}`,
        borderRadius: 22,
        overflow: 'hidden',
        padding,
        boxShadow: glow ? '0 0 36px var(--acc-glo-m)' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.18s, box-shadow 0.18s',
        ...style
      }}
    >
      {children}
    </div>
  )
}