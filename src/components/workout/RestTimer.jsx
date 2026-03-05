import { useState, useEffect, useRef } from 'react'
import Icons from '../ui/Icons'

export default function RestTimer() {
  const [running, setRunning]   = useState(false)
  const [elapsed, setElapsed]   = useState(0)
  const intervalRef             = useRef(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed(e => e + 1)
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const reset = () => { setRunning(false); setElapsed(0) }

  const fmt = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  }

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--surface)',
      border: `2px solid ${running ? 'var(--acc)' : 'var(--border)'}`,
      borderRadius: 999,
      padding: '10px 20px',
      display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: running ? 'var(--shd-acc)' : 'var(--shd-md)',
      zIndex: 100,
      transition: 'all 0.2s',
      minWidth: 200,
    }}>
      {/* Temps */}
      <span style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 28, color: running ? 'var(--acc-txt)' : 'var(--txt)',
        lineHeight: 1, letterSpacing: '0.05em', minWidth: 72, textAlign: 'center',
      }}>
        {fmt(elapsed)}
      </span>

      {/* Start / Pause */}
      <button onClick={() => setRunning(r => !r)} style={{
        background: running ? 'var(--acc)' : 'var(--surface-up)',
        border: `1px solid ${running ? 'var(--acc)' : 'var(--border)'}`,
        borderRadius: 999, width: 38, height: 38,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.15s',
      }}>
        {running
          ? <Icons.timer size={16} color="var(--txt-inv)" />
          : <Icons.bolt  size={16} color="var(--txt-sub)" />
        }
      </button>

      {/* Reset */}
      <button onClick={reset} style={{
        background: 'transparent', border: 'none',
        cursor: 'pointer', display: 'flex', padding: 4,
      }}>
        <Icons.replace size={14} color="var(--txt-muted)" />
      </button>
    </div>
  )
}
