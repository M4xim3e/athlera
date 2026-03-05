import { useEffect, useState } from 'react'
import Icons from '../components/ui/Icons'

export default function SplashPage({ onDone }) {
  const [visible,  setVisible]  = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setTimeout(() => setVisible(true), 50)
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(progressInterval); return 100 }
        return p + 5
      })
    }, 90)
    const timer = setTimeout(() => onDone(), 2200)
    return () => {
      clearInterval(progressInterval)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg-base, #060606)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 'env(safe-area-inset-top, 0px)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      paddingLeft: 'env(safe-area-inset-left, 0px)',
      paddingRight: 'env(safe-area-inset-right, 0px)',
    }}>

      {/* Glow ambiant */}
      <div style={{
        position: 'absolute',
        top: '38%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 320, height: 320,
        background: 'radial-gradient(ellipse, var(--acc-glo-m) 0%, transparent 68%)',
        borderRadius: '50%',
        animation: 'glowPulse 2.2s ease infinite',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.7s',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.7)',
        transition: 'all 0.55s cubic-bezier(0.34,1.56,0.64,1)',
        marginBottom: 18,
      }}>
        <div style={{
          width: 80, height: 80,
          background: 'var(--acc, #B8FF52)',
          borderRadius: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shd-acc)',
        }}>
          <Icons.logo size={42} color="var(--txt-inv, #060606)" strokeWidth={2.2} />
        </div>
      </div>

      {/* Titre */}
      <div style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.7s 0.25s',
        textAlign: 'center',
        marginBottom: 48,
      }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 58,
          color: 'var(--txt, #F0F0F0)',
          letterSpacing: '0.05em',
          lineHeight: 1,
          marginBottom: 10,
        }}>
          ATHLERA
        </h1>
        <p style={{ fontSize: 14, color: 'var(--txt-sub, #888)' }}>
          Train with precision.
        </p>
      </div>

      {/* Loader */}
      <div style={{
        position: 'absolute',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 60px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 140,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s 0.8s',
      }}>
        <div style={{
          height: 2,
          background: 'var(--border, #1A1A1A)',
          borderRadius: 100,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            background: 'var(--acc, #B8FF52)',
            width: `${progress}%`,
            transition: 'width 0.09s linear',
            borderRadius: 100,
          }} />
        </div>
      </div>
    </div>
  )
}
