import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../contexts/SubscriptionContext'
import { useLang } from '../contexts/LangContext'
import { markWelcomed } from '../services/eraPlus'
import Icons from '../components/ui/Icons'

const STEPS = [
  { icon: 'activity', fr: 'Surcharge progressive', en: 'Progressive overload', desc_fr: 'Après chaque séance, on t\'indique combien ajouter.', desc_en: 'After each session, we tell you how much to add.' },
  { icon: 'chart', fr: 'Courbes de progression', en: 'Progression curves', desc_fr: 'Visualise chaque PR sur chaque exercice.', desc_en: 'Track every PR on every exercise.' },
  { icon: 'calendar', fr: 'Programmes structurés', en: 'Structured programs', desc_fr: 'PPL, Force, Full Body — semaine par semaine.', desc_en: 'PPL, Strength, Full Body — week by week.' },
  { icon: 'bolt', fr: 'Stats avancées', en: 'Advanced stats', desc_fr: 'Volume, comparaison semaine, top PRs.', desc_en: 'Volume, week comparison, top PRs.' },
]

export default function EraWelcomePage({ onDone }) {
  const { user } = useAuth()
  const { refresh } = useSubscription()
  const { lang } = useLang()
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 80)
  }, [step])

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setVisible(false)
      setTimeout(() => setStep(s => s + 1), 180)
    } else {
      await markWelcomed(user.id)
      await refresh()
      onDone()
    }
  }

  const s = STEPS[step]
  const IC = Icons[s.icon] || Icons.bolt

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg-base)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px',
      paddingTop: 'calc(env(safe-area-inset-top, 0px) + 32px)',
      paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 32px)',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 360, height: 360,
        background: 'radial-gradient(ellipse, var(--acc-glo-m) 0%, transparent 68%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Badge ERA+ */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'var(--acc-dim)', border: '1px solid var(--acc)',
        borderRadius: 999, padding: '5px 14px', marginBottom: 40,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s',
      }}>
        <Icons.bolt size={12} color="var(--acc-txt)" />
        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--acc-txt)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          ERA+
        </span>
      </div>

      {/* Icon */}
      <div style={{
        width: 96, height: 96,
        background: 'var(--acc)',
        borderRadius: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'var(--shd-acc)',
        marginBottom: 32,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.7)',
        transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <IC size={44} color="var(--txt-inv)" />
      </div>

      {/* Texte */}
      <div style={{
        textAlign: 'center', marginBottom: 48,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1) 0.1s',
      }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 40, color: 'var(--txt)',
          letterSpacing: '0.03em', lineHeight: 1, marginBottom: 14,
        }}>
          {lang === 'fr' ? s.fr : s.en}
        </h2>
        <p style={{ fontSize: 16, color: 'var(--txt-sub)', lineHeight: 1.6, maxWidth: 300, margin: '0 auto' }}>
          {lang === 'fr' ? s.desc_fr : s.desc_en}
        </p>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            height: 6,
            width: i === step ? 24 : 6,
            background: i === step ? 'var(--acc)' : 'var(--border)',
            borderRadius: 100,
            transition: 'all 0.3s var(--ease)',
          }} />
        ))}
      </div>

      {/* Bouton */}
      <button
        onClick={handleNext}
        style={{
          width: '100%', maxWidth: 320,
          background: 'var(--acc)', border: 'none', borderRadius: 18,
          padding: '18px', cursor: 'pointer',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 20, letterSpacing: '0.05em', color: 'var(--txt-inv)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s 0.2s',
        }}
      >
        {step < STEPS.length - 1
          ? (lang === 'fr' ? 'Suivant' : 'Next')
          : (lang === 'fr' ? 'C\'est parti !' : 'Let\'s go!')}
      </button>
    </div>
  )
}
