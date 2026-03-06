import { useState } from 'react'
import { useSubscription } from '../contexts/SubscriptionContext'
import { useAuth } from '../contexts/AuthContext'
import { useLang } from '../contexts/LangContext'
import { supabase } from '../lib/supabase'
import TopBar from '../components/layout/TopBar'
import Icons from '../components/ui/Icons'

const FEATURES = [
  {
    icon: 'activity',
    fr: 'Surcharge progressive intelligente',
    en: 'Smart progressive overload',
    desc_fr: 'Suggestions de progression adaptées à ton objectif après chaque séance.',
    desc_en: 'Progression suggestions adapted to your goal after each session.',
  },
  {
    icon: 'chart',
    fr: 'Historique & courbes de progression',
    en: 'History & progression curves',
    desc_fr: 'Visualise ta progression sur chaque exercice dans le temps.',
    desc_en: 'Visualize your progress on each exercise over time.',
  },
  {
    icon: 'calendar',
    fr: 'Programmes structurés 8-12 semaines',
    en: 'Structured 8-12 week programs',
    desc_fr: 'PPL, Push/Pull, Force — avec progression intégrée semaine par semaine.',
    desc_en: 'PPL, Push/Pull, Strength — with built-in weekly progression.',
  },
  {
    icon: 'bolt',
    fr: 'Statistiques avancées',
    en: 'Advanced statistics',
    desc_fr: 'Volume total, PRs, comparaison semaine — tout en un coup d\'œil.',
    desc_en: 'Total volume, PRs, week comparison — everything at a glance.',
  },
]

export default function EraPlusPage({ onBack }) {
  const { isPlus, refresh }  = useSubscription()
  const { user }             = useAuth()
  const { lang }             = useLang()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Simulation abonnement (sans Stripe pour l'instant)
  const handleSubscribe = async () => {
    setLoading(true)
    try {
      await supabase
        .from('subscriptions')
        .upsert({
          user_id:             user.id,
          plan:                'era_plus',
          status:              'active',
          current_period_start: new Date().toISOString(),
          current_period_end:   new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })

      await refresh()
      setSuccess(true)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg-base)',
      paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 32px)',
    }}>
      <TopBar onBack={onBack} />

      <div style={{ padding: '24px 18px 0' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--acc-dim)', border: '1px solid var(--acc)',
            borderRadius: 999, padding: '6px 16px', marginBottom: 16,
          }}>
            <Icons.bolt size={14} color="var(--acc-txt)" />
            <span style={{
              fontSize: 12, fontWeight: 800, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--acc-txt)',
            }}>
              ERA+
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 48, color: 'var(--txt)',
            letterSpacing: '0.03em', lineHeight: 1, marginBottom: 12,
          }}>
            {lang === 'fr' ? 'Passe au niveau\nsuivant' : 'Level up your\ntraining'}
          </h1>

          <p style={{ fontSize: 15, color: 'var(--txt-sub)', lineHeight: 1.6 }}>
            {lang === 'fr'
              ? 'Tout ce qu\'il faut pour progresser plus vite et plus intelligemment.'
              : 'Everything you need to progress faster and smarter.'}
          </p>
        </div>

        {/* Prix */}
        <div style={{
          background: 'var(--surface)',
          border: '2px solid var(--acc)',
          borderRadius: 24, padding: '24px 20px',
          textAlign: 'center', marginBottom: 24,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 200, height: 200,
            background: 'radial-gradient(ellipse, var(--acc-glo-m) 0%, transparent 68%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative' }}>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 64, color: 'var(--acc-txt)', lineHeight: 1,
            }}>
              6.99€
            </div>
            <div style={{ fontSize: 13, color: 'var(--txt-sub)', marginBottom: 20 }}>
              {lang === 'fr' ? '/ mois · Sans engagement' : '/ month · Cancel anytime'}
            </div>

            {isPlus ? (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'rgba(48,209,88,0.12)', borderRadius: 14, padding: '14px',
              }}>
                <Icons.check size={18} color="var(--ok)" />
                <span style={{ fontSize: 15, color: 'var(--ok)', fontWeight: 700 }}>
                  {lang === 'fr' ? 'ERA+ actif ✦' : 'ERA+ active ✦'}
                </span>
              </div>
            ) : success ? (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'rgba(48,209,88,0.12)', borderRadius: 14, padding: '14px',
              }}>
                <Icons.check size={18} color="var(--ok)" />
                <span style={{ fontSize: 15, color: 'var(--ok)', fontWeight: 700 }}>
                  {lang === 'fr' ? 'Bienvenue dans ERA+ !' : 'Welcome to ERA+!'}
                </span>
              </div>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={loading}
                style={{
                  width: '100%', background: 'var(--acc)', border: 'none',
                  borderRadius: 16, padding: '16px', cursor: loading ? 'wait' : 'pointer',
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 20, letterSpacing: '0.05em',
                  color: 'var(--txt-inv)',
                  opacity: loading ? 0.7 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                {loading
                  ? (lang === 'fr' ? 'Activation...' : 'Activating...')
                  : (lang === 'fr' ? 'Activer ERA+' : 'Activate ERA+')}
              </button>
            )}
          </div>
        </div>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FEATURES.map((f, i) => {
            const IC = Icons[f.icon] || Icons.bolt
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 18, padding: '16px',
              }}>
                <div style={{
                  width: 40, height: 40, flexShrink: 0,
                  background: 'var(--acc-dim)', borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <IC size={18} color="var(--acc-txt)" />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', marginBottom: 4 }}>
                    {lang === 'fr' ? f.fr : f.en}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--txt-sub)', lineHeight: 1.5 }}>
                    {lang === 'fr' ? f.desc_fr : f.desc_en}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Comparaison free vs plus */}
        <div style={{
          marginTop: 24,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 18, overflow: 'hidden',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ padding: '12px 14px' }} />
            <div style={{
              padding: '12px 14px', textAlign: 'center',
              fontSize: 11, fontWeight: 700, color: 'var(--txt-sub)',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              borderLeft: '1px solid var(--border)',
            }}>
              Free
            </div>
            <div style={{
              padding: '12px 14px', textAlign: 'center',
              fontSize: 11, fontWeight: 700, color: 'var(--acc-txt)',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              borderLeft: '1px solid var(--border)',
              background: 'var(--acc-dim)',
            }}>
              ERA+
            </div>
          </div>

          {[
            { label: lang === 'fr' ? 'Génération séance' : 'Workout generation', free: true, plus: true },
            { label: lang === 'fr' ? 'Séances custom' : 'Custom workouts', free: true, plus: true },
            { label: lang === 'fr' ? 'Surcharge progressive' : 'Progressive overload', free: false, plus: true },
            { label: lang === 'fr' ? 'Historique exercices' : 'Exercise history', free: false, plus: true },
            { label: lang === 'fr' ? 'Programmes 8-12 sem.' : '8-12 week programs', free: false, plus: true },
            { label: lang === 'fr' ? 'Stats avancées' : 'Advanced stats', free: false, plus: true },
          ].map((row, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              borderBottom: i < 5 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                padding: '12px 14px',
                fontSize: 13, color: 'var(--txt)',
              }}>
                {row.label}
              </div>
              <div style={{
                padding: '12px 14px', textAlign: 'center',
                borderLeft: '1px solid var(--border)',
              }}>
                {row.free
                  ? <Icons.check size={14} color="var(--ok)" />
                  : <Icons.x size={14} color="var(--txt-muted)" />}
              </div>
              <div style={{
                padding: '12px 14px', textAlign: 'center',
                borderLeft: '1px solid var(--border)',
                background: 'var(--acc-dim)',
              }}>
                {row.plus
                  ? <Icons.check size={14} color="var(--acc-txt)" />
                  : <Icons.x size={14} color="var(--txt-muted)" />}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          textAlign: 'center', fontSize: 11, color: 'var(--txt-muted)',
          marginTop: 16, lineHeight: 1.6,
        }}>
          {lang === 'fr'
            ? 'Résiliable à tout moment. Aucun engagement.'
            : 'Cancel anytime. No commitment.'}
        </p>
      </div>
    </div>
  )
}
