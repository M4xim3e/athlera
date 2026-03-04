// src/components/ui/Input.jsx
import { useState } from 'react'
import Icons from './Icons'

export default function Input({
  label, value, onChange, type = 'text',
  placeholder, suffix, error, disabled,
  min, max, autoComplete, rows
}) {
  const [focused, setFocused] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const isPass = type === 'password'
  const isTextarea = type === 'textarea'

  const containerStyle = {
    display: 'flex', flexDirection: 'column', gap: 6
  }

  const labelStyle = {
    fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: 'var(--txt-sub)'
  }

  const wrapStyle = {
    display: 'flex', alignItems: 'center',
    background: 'var(--surface-up)',
    border: `1.5px solid ${error ? 'var(--err)' : focused ? 'var(--acc)' : 'var(--border)'}`,
    borderRadius: 13, transition: 'border-color 0.15s', overflow: 'hidden'
  }

  const inputStyle = {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    padding: '13px 16px', fontSize: 15, color: 'var(--txt)',
    fontFamily: 'inherit', resize: 'none',
  }

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={wrapStyle}>
        {isTextarea ? (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows || 3}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={inputStyle}
          />
        ) : (
          <input
            type={isPass ? (showPass ? 'text' : 'password') : type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            min={min} max={max}
            autoComplete={autoComplete}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={inputStyle}
          />
        )}
        {suffix && !isPass && (
          <span style={{ paddingRight: 14, fontSize: 13, color: 'var(--txt-sub)', whiteSpace: 'nowrap' }}>
            {suffix}
          </span>
        )}
        {isPass && (
          <button
            type="button"
            onClick={() => setShowPass(s => !s)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 14px', display: 'flex' }}
          >
            {showPass
              ? <Icons.eyeOff size={15} color="var(--txt-sub)" />
              : <Icons.eye    size={15} color="var(--txt-sub)" />
            }
          </button>
        )}
      </div>
      {error && (
        <p style={{ fontSize: 12, color: 'var(--err)', marginTop: 2 }}>{error}</p>
      )}
    </div>
  )
}