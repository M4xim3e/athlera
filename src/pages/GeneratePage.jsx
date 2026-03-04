// src/pages/GeneratePage.jsx
import { useState } from 'react'
import { useProfile } from '../contexts/ProfileContext'
import { useWorkout } from '../contexts/WorkoutContext'
import { useLang }    from '../contexts/LangContext'
import { generateWorkout } from '../services/workoutEngine'
import TopBar  from '../components/layout/TopBar'
import Button  from '../components/ui/Button'
import Chip    from '../components/ui/Chip'
import Icons   from '../components/ui/Icons'

const TYPES = ['AUTO','PUSH','PULL','LEGS','UPPER','LOWER','FULL']
const TYPE_LABELS = {
  AUTO:'Auto 🧠', PUSH:'Push', PULL:'Pull',
  LEGS:'Jambes', UPPER:'Haut', LOWER:'Bas', FULL:'Full Body',
}
const LOADING_MSGS = {
  fr: ['Analyse du profil…','Calcul du volume…','Sélection des exercices…','Vérification blessures…','Optimisation progression…','Séance prête !'],
  en: ['Analysing profile…','Calculating volume…','Selecting exercises…','Checking injuries…','Optimising progression…','Session ready!'],
}

export default function GeneratePage({ onDone, onBack }) {
  const { profile }             = useProfile()
  const { history, setCurrent } = useWorkout()
  const { t, lang }             = useLang()

  const [duration,      setDuration]      = useState(45)
  const [focusType,     setFocusType]     = useState('AUTO')
  const [wantWarmup,    setWantWarmup]    = useState(true)
  const [wantFinisher,  setWantFinisher]  = useState(false)
  const [wantStretches, setWantStretches] = useState(true)
  const [loading, setLoading] = useState(false)
  const [msgIdx,  setMsgIdx]  = useState(0)

  // Curseur 30 → 105 min (par paliers de 5)
  const MIN_DUR = 30, MAX_DUR = 105

  const generate = async () => {
    setLoading(true); setMsgIdx(0)
    const msgs = LOADING_MSGS[lang] || LOADING_MSGS.fr
    const iv = setInterval(() => setMsgIdx(i => i >= msgs.length - 1 ? i : i + 1), 320)
    await new Promise(r => setTimeout(r, msgs.length * 320 + 200))
    clearInterval(iv)
    const workout = generateWorkout({
      focusType: focusType === 'AUTO' ? null : focusType,
      duration, profile, history, lang,
      wantWarmup, wantFinisher, wantStretches,
    })
    setCurrent(workout)
    setLoading(false)
    onDone()
  }

  if (loading) {
    const msgs = LOADING_MSGS[lang] || LOADING_MSGS.fr
    return (
      <div style={{
        minHeight: '100dvh', background: 'var(--bg-base)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 32, padding: 24,
      }}>
        <div style={{ position: 'relative', width: 80, height: 80 }}>
          <div style={{
            position: 'absolute', inset: -12, borderRadius: '50%',
            background: 'conic-gradient(var(--acc) 0%, transparent 60%)',
            animation: 'spin 1.2s linear infinite',
          }} />
          <div style={{
            position: 'absolute', inset: 0, background: 'var(--bg-base)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icons.dumbbell size={32} color="var(--acc)" />
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: 'var(--txt)', letterSpacing: '0.03em', marginBottom: 12 }}>
            Génération en cours
          </h2>
          <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p key={msgIdx} style={{ fontSize: 14, color: 'var(--txt-sub)', animation: 'fadeUp 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
              {msgs[msgIdx]}
            </p>
          </div>
        </div>
        <div style={{ width: 160, height: 2, background: 'var(--border)', borderRadius: 100, overflow: 'hidden' }}>
          <div style={{
            height: '100%', background: 'var(--acc)', borderRadius: 100,
            width: `${((msgIdx + 1) / msgs.length) * 100}%`,
            transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1)',
          }} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)', paddingBottom: 110 }}>
      <TopBar onBack={onBack} title={t('planSess')} />

      <div style={{ padding: '24px 18px 0' }}>

        {/* Durée — curseur */}
        <div className="fade-up" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--txt-sub)' }}>
              {t('durLbl')}
            </p>
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 28, color: 'var(--acc)', lineHeight: 1,
            }}>
              {duration} <span style={{ fontSize: 14, color: 'var(--txt-sub)' }}>{t('minLbl')}</span>
            </span>
          </div>
          <div style={{ position: 'relative', padding: '8px 0' }}>
            <input
              type="range" min={MIN_DUR} max={MAX_DUR} step={5}
              value={duration} onChange={e => setDuration(Number(e.target.value))}
              style={{
                width: '100%', appearance: 'none', WebkitAppearance: 'none',
                height: 3, borderRadius: 100, outline: 'none', cursor: 'pointer',
                background: `linear-gradient(to right, var(--acc) 0%, var(--acc) ${((duration - MIN_DUR) / (MAX_DUR - MIN_DUR)) * 100}%, var(--border) ${((duration - MIN_DUR) / (MAX_DUR - MIN_DUR)) * 100}%, var(--border) 100%)`,
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--txt-muted)' }}>{MIN_DUR} min</span>
            <span style={{ fontSize: 11, color: 'var(--txt-muted)' }}>{MAX_DUR} min</span>
          </div>
        </div>

        {/* Type */}
        <div className="fade-up fade-up-1" style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--txt-sub)', marginBottom: 12 }}>
            {t('sessType')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 9 }}>
            {TYPES.map(tp => (
              <Chip key={tp} selected={focusType === tp} onClick={() => setFocusType(tp)}
                style={{ padding: '15px 12px', borderRadius: 15, justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>
                {TYPE_LABELS[tp]}
              </Chip>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="fade-up fade-up-2" style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--txt-sub)', marginBottom: 12 }}>
            Options
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[
              { key: 'wantWarmup',    val: wantWarmup,    set: setWantWarmup,    label: t('wantWarmup'),    icon: 'activity' },
              { key: 'wantFinisher',  val: wantFinisher,  set: setWantFinisher,  label: t('wantFinisher'),  icon: 'flame'    },
              { key: 'wantStretches', val: wantStretches, set: setWantStretches, label: t('wantStretches'), icon: 'target'   },
            ].map(opt => {
              const IC = Icons[opt.icon]
              return (
                <div key={opt.key} onClick={() => opt.set(v => !v)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px',
                  background: opt.val ? 'var(--acc-dim)' : 'var(--surface)',
                  border: `1.5px solid ${opt.val ? 'var(--acc)' : 'var(--border)'}`,
                  borderRadius: 16, cursor: 'pointer',
                  transition: 'all 0.16s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <IC size={18} color={opt.val ? 'var(--acc-txt)' : 'var(--txt-sub)'} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: opt.val ? 'var(--acc-txt)' : 'var(--txt)' }}>
                      {opt.label}
                    </span>
                  </div>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: opt.val ? 'var(--acc)' : 'var(--surface-up)',
                    border: `2px solid ${opt.val ? 'var(--acc)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.16s',
                  }}>
                    {opt.val && <Icons.check size={12} color="var(--txt-inv)" />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Résumé profil */}
        {profile && (
          <div className="fade-up fade-up-3" style={{
            padding: '14px 16px', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 16, marginBottom: 20,
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--txt-muted)', marginBottom: 10 }}>
              Profil actif
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[
                profile.goal?.replace('_',' '),
                profile.level,
                `${profile.freq}j/sem`,
                profile.has_gym ? (profile.gym_id || 'Salle') : 'Domicile',
                profile.injuries ? '⚠️ Blessure' : null,
              ].filter(Boolean).map((tag, i) => (
                <span key={i} style={{
                  background: 'var(--surface-up)', border: '1px solid var(--border)',
                  borderRadius: 999, padding: '3px 10px',
                  fontSize: 11, color: 'var(--txt-sub)', fontWeight: 600,
                }}>{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA sticky */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        padding: '16px 18px 36px',
        background: 'var(--nav)', backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--border)',
      }}>
        <Button
          label={`Générer — ${duration} min`} full size="lg"
          onClick={generate}
          iconRight={<Icons.bolt size={16} color="var(--txt-inv)" />}
        />
      </div>
    </div>
  )
}