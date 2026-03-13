import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useProfile } from '../contexts/ProfileContext'
import { useWorkout } from '../contexts/WorkoutContext'
import { useLang } from '../contexts/LangContext'
import { useTheme } from '../contexts/ThemeContext'
import TopBar from '../components/layout/TopBar'
import BurgerMenu from '../components/layout/BurgerMenu'
import Card from '../components/ui/Card'
import Tag from '../components/ui/Tag'
import Button from '../components/ui/Button'
import Icons from '../components/ui/Icons'
import { greet, fmtDate, weekDelta } from '../utils/helpers'

const GOAL_COLOR = {
  MUSCLE_GAIN: 'acc', FAT_LOSS: 'red',
  STRENGTH: 'blue', MAINTENANCE: 'green', PERFORMANCE: 'blue',
}
const GOAL_LABEL = {
  MUSCLE_GAIN: 'gMuscle', FAT_LOSS: 'gFat',
  STRENGTH: 'gStrength', MAINTENANCE: 'gMaintain', PERFORMANCE: 'gPerf',
}
const FOCUS_COLOR = {
  PUSH: 'acc', PULL: 'blue', LEGS: 'green',
  FULL: 'gray', UPPER: 'blue', LOWER: 'green', CUSTOM: 'gray',
}

function Sparkline({ weights }) {
  if (!weights?.length || weights.length < 2) return null
  const vals = weights.slice(0, 10).map(w => parseFloat(w.value)).reverse()
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const range = max - min || 1
  const W = 100, H = 30, pad = 3
  const pts = vals.map((v, i) => {
    const x = pad + (i / (vals.length - 1)) * (W - pad * 2)
    const y = H - pad - ((v - min) / range) * (H - pad * 2)
    return `${x},${y}`
  }).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={80} height={24} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke="var(--acc)"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle
        cx={pts.split(' ').pop().split(',')[0]}
        cy={pts.split(' ').pop().split(',')[1]}
        r="2.5" fill="var(--acc)"
      />
    </svg>
  )
}

export default function DashboardPage({ onNavigate }) {
  const { user } = useAuth()
  const { profile, weights, streak, addWeight } = useProfile()
  const { history } = useWorkout()
  const { t, lang } = useLang()
  const { mode } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [editWeight, setEditWeight] = useState(false)
  const [newWeight, setNewWeight] = useState('')

  const name = profile?.name || user?.user_metadata?.name || ''
  const goalKey = GOAL_LABEL[profile?.goal] || 'gMuscle'
  const delta = weekDelta(weights)
  const lastWo = history[0]
  const curWeight = weights[0]?.value

  const handleSaveWeight = async () => {
    if (!newWeight || isNaN(newWeight)) return
    await addWeight(parseFloat(newWeight))
    setNewWeight('')
    setEditWeight(false)
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg-base)',
      paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 32px)',
    }}>
      <TopBar onMenu={() => setMenuOpen(true)} />
      {menuOpen && (
        <BurgerMenu
          onClose={() => setMenuOpen(false)}
          onNavigate={onNavigate}
        />
      )}

      <div style={{ padding: '20px 18px 0' }}>

        {/* Salutation */}
        <div className="fade-up" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 36, lineHeight: 1.05,
                color: 'var(--txt)', letterSpacing: '0.02em',
              }}>
                {greet(t)}, {name || 'Athlète'}
              </h1>
              <p style={{ fontSize: 13, color: 'var(--txt-sub)', marginTop: 3 }}>
                {new Date().toLocaleDateString(
                  lang === 'fr' ? 'fr-FR' : 'en-GB',
                  { weekday: 'long', day: 'numeric', month: 'long' }
                )}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {profile?.goal && (
                <Tag label={t(goalKey)} color={GOAL_COLOR[profile.goal] || 'acc'} />
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="fade-up fade-up-1" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9, marginBottom: 16,
        }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '14px 10px', textAlign: 'center',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 5 }}>
              <Icons.flame size={18} color={streak?.current > 0 ? 'var(--warn)' : 'var(--txt-muted)'} />
            </div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 28, color: streak?.current > 0 ? 'var(--warn)' : 'var(--txt)', lineHeight: 1,
            }}>
              {streak?.current || 0}
            </div>
            <div style={{ fontSize: 9, color: 'var(--txt-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>
              {t('streak')}
            </div>
          </div>

          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '14px 10px', textAlign: 'center',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 5 }}>
              <Icons.scale size={18} color="var(--txt-muted)" />
            </div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 28, color: 'var(--txt)', lineHeight: 1,
            }}>
              {curWeight || '--'}
            </div>
            <div style={{ fontSize: 9, color: 'var(--txt-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>
              kg
            </div>
          </div>

          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '14px 10px', textAlign: 'center',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 5 }}>
              <Icons.calendar size={18} color="var(--txt-muted)" />
            </div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 28, color: 'var(--txt)', lineHeight: 1,
            }}>
              {history.length}
            </div>
            <div style={{ fontSize: 9, color: 'var(--txt-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>
              {t('sessions')}
            </div>
          </div>
        </div>

        {/* CTA Générer */}
        <div className="fade-up fade-up-2" style={{ marginBottom: 12 }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 22, padding: '22px 20px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -40, right: -40,
              width: 180, height: 180,
              background: 'radial-gradient(ellipse, var(--acc-glo-m) 0%, transparent 68%)',
              borderRadius: '50%', pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
                <Icons.bolt size={18} color="var(--acc)" />
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--acc-txt)' }}>
                  {t('readyTrain')}
                </span>
              </div>
              <h2 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 28, color: 'var(--txt)',
                letterSpacing: '0.02em', lineHeight: 1.1, marginBottom: 16,
              }}>
                {history.length === 0 ? t('firstSession') : t('nextSession')}
              </h2>
              <Button
                label={t('gen')} full
                onClick={() => onNavigate('generate')}
                iconRight={<Icons.chevRight size={15} color="var(--txt-inv)" />}
              />
            </div>
          </div>
        </div>

        {/* CTA Créer séance custom */}
        <div className="fade-up fade-up-2" style={{ marginBottom: 12 }}>
          <button
            onClick={() => onNavigate('custom')}
            style={{
              width: '100%', background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 18, padding: '16px 20px',
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--acc)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, background: 'var(--acc-dim)',
                borderRadius: 12, display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0,
              }}>
                <Icons.edit size={18} color="var(--acc-txt)" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)' }}>
                  {lang === 'fr' ? 'Créer ma séance' : 'Create my workout'}
                </p>
                <p style={{ fontSize: 12, color: 'var(--txt-sub)', marginTop: 2 }}>
                  {lang === 'fr' ? 'Exos, séries, poids, repos' : 'Exercises, sets, weight, rest'}
                </p>
              </div>
            </div>
            <Icons.chevRight size={16} color="var(--txt-muted)" />
          </button>
        </div>

        {/* Stats & Programmes */}
        <div className="fade-up fade-up-2" style={{ marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
              <button
                onClick={() => onNavigate('stats')}
                style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 16, padding: '16px', cursor: 'pointer',
                  fontFamily: 'inherit', textAlign: 'left',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--acc)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{
                  width: 36, height: 36, background: 'var(--acc-dim)',
                  borderRadius: 10, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: 10,
                }}>
                  <Icons.activity size={16} color="var(--acc-txt)" />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)' }}>
                  {lang === 'fr' ? 'Statistiques' : 'Statistics'}
                </p>
                <p style={{ fontSize: 11, color: 'var(--txt-sub)', marginTop: 2 }}>
                  {lang === 'fr' ? 'Volume, PRs, courbes' : 'Volume, PRs, curves'}
                </p>
              </button>

              <button
                onClick={() => onNavigate('programs')}
                style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 16, padding: '16px', cursor: 'pointer',
                  fontFamily: 'inherit', textAlign: 'left',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--acc)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{
                  width: 36, height: 36, background: 'var(--acc-dim)',
                  borderRadius: 10, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: 10,
                }}>
                  <Icons.calendar size={16} color="var(--acc-txt)" />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)' }}>
                  {lang === 'fr' ? 'Programmes' : 'Programs'}
                </p>
                <p style={{ fontSize: 11, color: 'var(--txt-sub)', marginTop: 2 }}>
                  {lang === 'fr' ? '8-12 semaines' : '8-12 weeks'}
                </p>
              </button>
            </div>
          </div>

        {/* Carte poids */}
        <div className="fade-up fade-up-3" style={{ marginBottom: 16 }}>
          <Card>
            <div style={{
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              marginBottom: editWeight ? 12 : 0,
            }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--txt-sub)', marginBottom: 4 }}>
                  {t('curW')}
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, color: 'var(--txt)', lineHeight: 1 }}>
                    {curWeight || '--'}
                  </span>
                  <span style={{ fontSize: 14, color: 'var(--txt-sub)' }}>kg</span>
                  {delta !== null && (
                    <span style={{
                      fontSize: 12, fontWeight: 700,
                      color: parseFloat(delta) > 0
                        ? profile?.goal === 'FAT_LOSS' ? 'var(--err)' : 'var(--ok)'
                        : profile?.goal === 'FAT_LOSS' ? 'var(--ok)' : 'var(--err)',
                    }}>
                      {parseFloat(delta) > 0 ? '+' : ''}{delta} kg
                    </span>
                  )}
                </div>
                {profile?.target_weight && (
                  <p style={{ fontSize: 12, color: 'var(--txt-muted)', marginTop: 2 }}>
                    {t('tgtW')} : {profile.target_weight} kg
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <Sparkline weights={weights} />
                <button onClick={() => setEditWeight(!editWeight)} style={{
                  background: 'var(--surface-up)', border: '1px solid var(--border)',
                  borderRadius: 9, padding: '6px 10px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                  fontSize: 11, color: 'var(--txt-sub)', fontFamily: 'inherit',
                }}>
                  <Icons.edit size={11} color="var(--txt-muted)" />
                  {t('updateW')}
                </button>
              </div>
            </div>

            {editWeight && (
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="number" value={newWeight}
                  onChange={e => setNewWeight(e.target.value)}
                  placeholder="75.0"
                  style={{
                    flex: '1 1 0', minWidth: 0,
                    background: 'var(--surface-up)',
                    border: '1.5px solid var(--acc)', borderRadius: 11,
                    padding: '11px 12px', fontSize: 15,
                    color: 'var(--txt)', fontFamily: 'inherit', outline: 'none',
                  }}
                />
                <button onClick={handleSaveWeight} style={{
                  flexShrink: 0, background: 'var(--acc)', border: 'none',
                  borderRadius: 11, padding: '0 16px', height: 46,
                  cursor: 'pointer', color: 'var(--txt-inv)',
                  fontWeight: 700, fontSize: 13, fontFamily: 'inherit',
                }}>
                  {t('save')}
                </button>
                <button onClick={() => setEditWeight(false)} style={{
                  flexShrink: 0, background: 'var(--surface-up)',
                  border: '1px solid var(--border)', borderRadius: 11,
                  padding: '0 14px', height: 46, cursor: 'pointer',
                  color: 'var(--txt-sub)', fontWeight: 600,
                  fontSize: 13, fontFamily: 'inherit',
                }}>
                  {t('cancel')}
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* Dernière séance */}
        {lastWo && (
          <div className="fade-up fade-up-4" style={{ marginBottom: 16 }}>
            <p style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: 'var(--txt-sub)', marginBottom: 10,
            }}>
              {t('lastWo')}
            </p>
            <Card onClick={() => onNavigate('workout')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, background: 'var(--acc-dim)',
                    borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icons.dumbbell size={20} color="var(--acc-txt)" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                      <Tag label={lastWo.focus} color={FOCUS_COLOR[lastWo.focus] || 'gray'} small />
                      {lastWo.custom_name && (
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt)' }}>
                          {lastWo.custom_name}
                        </span>
                      )}
                      <span style={{ fontSize: 11, color: 'var(--txt-muted)' }}>
                        {lastWo.exercise_count} {t('exos')} · {lastWo.total_sets} {t('series')}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--txt-sub)' }}>
                      {fmtDate(lastWo.completed_at, lang)}
                    </p>
                  </div>
                </div>
                <Icons.chevRight size={16} color="var(--txt-muted)" />
              </div>
            </Card>
          </div>
        )}

        {/* Historique récent */}
        {history.length > 1 && (
          <div className="fade-up fade-up-4">
            <p style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: 'var(--txt-sub)', marginBottom: 10,
            }}>
              {t('recSess')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {history.slice(1, 5).map(wo => (
                <div key={wo.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', background: 'var(--surface)',
                  border: '1px solid var(--border)', borderRadius: 14,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Tag label={wo.focus} color={FOCUS_COLOR[wo.focus] || 'gray'} small />
                    {wo.custom_name && (
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--txt)' }}>
                        {wo.custom_name}
                      </span>
                    )}
                    <span style={{ fontSize: 13, color: 'var(--txt-sub)' }}>
                      {wo.exercise_count} {t('exos')} · {wo.total_sets} {t('series')}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--txt-muted)' }}>
                    {fmtDate(wo.completed_at, lang)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {history.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--txt-muted)', fontSize: 13 }}>
            {t('emptyH')}
          </div>
        )}
      </div>
    </div>
  )
}
