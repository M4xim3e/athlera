// src/pages/WorkoutPage.jsx
import { useState } from 'react'
import { useWorkout }  from '../contexts/WorkoutContext'
import { useProfile }  from '../contexts/ProfileContext'
import { useAuth }     from '../contexts/AuthContext'
import { useLang }     from '../contexts/LangContext'
import { findReplacement } from '../services/workoutEngine'
import { toggleFavorite }  from '../services/userService'
import TopBar      from '../components/layout/TopBar'
import BurgerMenu  from '../components/layout/BurgerMenu'
import ExerciseCard from '../components/workout/ExerciseCard'
import Button  from '../components/ui/Button'
import Tag     from '../components/ui/Tag'
import Icons   from '../components/ui/Icons'

const FOCUS_COLOR = { PUSH:'acc', PULL:'blue', LEGS:'green', FULL:'gray', UPPER:'blue', LOWER:'green' }

export default function WorkoutPage({ onBack, onNew }) {
  const { current, setCurrent, saveSession, history } = useWorkout()
  const { profile, refreshStreak } = useProfile()
  const { user } = useAuth()
  const { t, lang } = useLang()

  const [tab,       setTab]       = useState('main')
  const [saved,     setSaved]     = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [isFav,     setIsFav]     = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [savedWoId, setSavedWoId] = useState(null)

  if (!current) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <p style={{ fontSize: 15, color: 'var(--txt-sub)' }}>Aucune séance en cours.</p>
        <Button label="Générer une séance" onClick={onNew} />
      </div>
    )
  }

  const handleReplace = (ex) => {
    const usedIds = new Set(current.main.map(e => e.id))
    const replacement = findReplacement(ex, usedIds, profile, lang)
    if (!replacement) return
    const newMain = current.main.map(e => e.id === ex.id ? { ...replacement, order: e.order, progress_note: e.progress_note } : e)
    setCurrent({ ...current, main: newMain })
  }

  const handleUpdateEx = (updatedEx) => {
    const newMain = current.main.map(e => e.id === updatedEx.id ? updatedEx : e)
    setCurrent({ ...current, main: newMain })
  }

  const handleSave = async () => {
    setSaving(true)
    const id = await saveSession(current)
    await refreshStreak()
    setSaving(false)
    setSaved(true)
    setSavedWoId(id)
  }

  const handleFav = async () => {
    if (!savedWoId) return
    await toggleFavorite(savedWoId, isFav)
    setIsFav(!isFav)
  }

  const tabs = [
    { id:'warmup',   label: t('warmup'),   show: current.warmup?.length > 0 },
    { id:'main',     label: t('main'),      show: true },
    { id:'finisher', label: t('finisher'),  show: !!current.finisher },
    { id:'stretches',label: t('stretches'), show: current.cooldown?.length > 0 },
  ].filter(tb => tb.show)

  const activeTab = tabs.find(tb => tb.id === tab) ? tab : 'main'

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)', paddingBottom: 32 }}>
      <TopBar onBack={onBack} onMenu={() => setMenuOpen(true)} />
      {menuOpen && <BurgerMenu onClose={() => setMenuOpen(false)} />}

      <div style={{ padding: '16px 18px 0' }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
            <Tag label={current.focus} color={FOCUS_COLOR[current.focus] || 'gray'} />
            <span style={{ fontSize: 12, color: 'var(--txt-muted)' }}>
              {current.exerciseCount} ex · {current.totalSets} séries · ~{current.estimatedDuration} min
            </span>
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, color: 'var(--txt)', letterSpacing: '0.02em', lineHeight: 1.1 }}>
            Séance {current.focus}
          </h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 18, scrollbarWidth: 'none' }}>
          {tabs.map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id)} style={{
              background: activeTab === tb.id ? 'var(--acc)' : 'var(--surface)',
              color:      activeTab === tb.id ? 'var(--txt-inv)' : 'var(--txt-sub)',
              border: `1px solid ${activeTab === tb.id ? 'var(--acc)' : 'var(--border)'}`,
              borderRadius: 999, padding: '8px 16px',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.16s',
            }}>
              {tb.label}
            </button>
          ))}
        </div>

        {/* Échauffement */}
        {activeTab === 'warmup' && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {current.warmup.map((item, i) => (
              <div key={i} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 16, padding: '14px 16px',
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                <div style={{ width: 32, height: 32, background: 'var(--acc-dim)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icons.activity size={14} color="var(--acc-txt)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)' }}>{item.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--acc-txt)', background: 'var(--acc-dim)', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                      {item.duration}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--txt-sub)', lineHeight: 1.5 }}>{item.instruction}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Principal */}
        {activeTab === 'main' && (
          <div className="fade-up">
            {current.main.map(ex => (
              <ExerciseCard key={ex.id} exercise={ex} onReplace={handleReplace} onUpdate={handleUpdateEx} />
            ))}
          </div>
        )}

        {/* Finisher */}
        {activeTab === 'finisher' && current.finisher && (
          <div className="fade-up">
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '18px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
                <Icons.flame size={18} color="var(--warn)" />
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--txt)' }}>{current.finisher.name}</h3>
                <span style={{ background: 'rgba(255,159,10,0.12)', color: 'var(--warn)', fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 999 }}>
                  {current.finisher.rounds} tours
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--txt-sub)', marginBottom: 14 }}>{current.finisher.note}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {current.finisher.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--surface-up)', borderRadius: 12 }}>
                    <span style={{ fontSize: 14, color: 'var(--txt)', fontWeight: 600 }}>{item.name}</span>
                    <span style={{ fontSize: 13, color: 'var(--acc-txt)', fontWeight: 700 }}>{item.reps}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Étirements */}
        {activeTab === 'stretches' && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ padding: '10px 14px', background: 'rgba(48,209,88,0.08)', borderRadius: 12, display: 'flex', gap: 8, marginBottom: 4 }}>
              <Icons.info size={14} color="var(--ok)" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: 'var(--ok)', lineHeight: 1.5 }}>
                Ces étirements sont ciblés selon les muscles travaillés aujourd'hui.
              </p>
            </div>
            {current.cooldown.map((item, i) => (
              <div key={i} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 16, padding: '14px 16px',
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                <div style={{ width: 32, height: 32, background: 'rgba(48,209,88,0.10)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icons.target size={14} color="var(--ok)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)' }}>{item.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--ok)', background: 'rgba(48,209,88,0.10)', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                      {item.duration}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--txt-sub)', lineHeight: 1.5 }}>{item.instruction}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
          {!saved ? (
            <Button label={t('saveW')} full size="lg" loading={saving} onClick={handleSave}
              iconRight={<Icons.check size={16} color="var(--txt-inv)" />} />
          ) : (
            <>
              <div style={{ textAlign: 'center', padding: '14px', background: 'rgba(48,209,88,0.10)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Icons.check size={16} color="var(--ok)" />
                <span style={{ fontSize: 14, color: 'var(--ok)', fontWeight: 700 }}>{t('savedW')}</span>
              </div>
              <Button
                label={isFav ? `★ ${t('savedFavW')}` : t('saveFavW')}
                full variant={isFav ? 'subtle' : 'ghost'}
                onClick={handleFav}
                iconLeft={<Icons.bolt size={14} color={isFav ? 'var(--acc-txt)' : 'var(--txt-sub)'} />}
              />
            </>
          )}
          <Button label={t('newW')} full variant="ghost" onClick={onNew}
            iconLeft={<Icons.bolt size={14} color="var(--txt-sub)" />} />
        </div>
      </div>
    </div>
  )
}