// src/components/ui/Button.jsx
import { useState } from 'react'

export default function Button({
  label, onClick, variant = 'primary', size = 'md',
  disabled = false, loading = false, full = false,
  iconLeft, iconRight, type = 'button'
}) {
  const [hov, setHov] = useState(false)
  const [press, setPress] = useState(false)

  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: 999, fontFamily: 'inherit', fontWeight: 700,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    width: full ? '100%' : 'auto', opacity: disabled && !loading ? 0.35 : 1,
    transform: press && !disabled ? 'scale(0.965)' : 'scale(1)',
    transition: 'all 0.15s cubic-bezier(0.16,1,0.3,1)',
    userSelect: 'none', border: 'none', outline: 'none',
  }

  const sizes = {
    sm: { fontSize: 11, padding: '9px 16px' },
    md: { fontSize: 14, padding: '14px 22px' },
    lg: { fontSize: 15, padding: '17px 28px' },
  }

  const variants = {
    primary: {
      background: hov && !disabled ? 'var(--acc-hov)' : 'var(--acc)',
      color: 'var(--txt-inv)',
      boxShadow: hov && !disabled ? 'var(--shd-acc)' : 'none',
    },
    ghost: {
      background: hov ? 'var(--surface-up)' : 'transparent',
      color: hov ? 'var(--txt)' : 'var(--txt-sub)',
      border: `1.5px solid ${hov ? 'var(--border-strong)' : 'var(--border)'}`,
      boxShadow: 'none',
    },
    subtle: {
      background: hov ? 'var(--acc-glo-m)' : 'var(--acc-dim)',
      color: 'var(--acc-txt)',
      border: '1px solid var(--acc-glo-m)',
      boxShadow: 'none',
    },
    danger: {
      background: hov ? 'rgba(255,69,58,0.10)' : 'transparent',
      color: 'var(--err)',
      border: `1.5px solid ${hov ? 'var(--err)' : 'var(--border)'}`,
      boxShadow: 'none',
    },
  }

  const style = {
    ...base,
    ...sizes[size],
    ...variants[variant],
  }

  return (
    <button
      type={type} onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPress(false) }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      onTouchStart={() => setPress(true)}
      onTouchEnd={() => setPress(false)}
      style={style}
    >
      {loading ? (
        <span style={{
          width: 16, height: 16, borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.3)',
          borderTopColor: variant === 'primary' ? 'var(--txt-inv)' : 'var(--acc)',
          animation: 'spin 0.8s linear infinite', display: 'inline-block'
        }} />
      ) : (
        <>
          {iconLeft  && <span style={{ display: 'flex' }}>{iconLeft}</span>}
          <span>{label}</span>
          {iconRight && <span style={{ display: 'flex' }}>{iconRight}</span>}
        </>
      )}
    </button>
  )
}