// src/components/workout/ExerciseCard.jsx
import { useState } from 'react'
import { useLang }  from '../../contexts/LangContext'
import { useAuth }  from '../../contexts/AuthContext'
import { saveExerciseWeight } from '../../services/userService'
import Icons from '../ui/Icons'
import Tag   from '../ui/Tag'
import Card  from '../ui/Card'

const TYPE_COLOR = { COMPOUND:'acc', ACCESSORY:'blue', ISOLATION:'gray' }

export default function ExerciseCard({ exercise: ex, onReplace, onUpdate }) {
  const { t }  = useLang()
  const { user } = useAuth()
  const [open,      setOpen]      = useState(false)
  const [showLog,   setShowLog]   = useState(false)
  const [logWeight, setLogWeight] = useState('')
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)

  const handleLogWeight = async () => {
    if (!logWeight || isNaN(logWeight)) return
    setSaving(true)
    await saveExerciseWeight(user?.id, ex.id, logWeight, ex.reps, ex.sets)
    onUpdate?.({ ...ex, weight_log: parseFloat(logWeight) })
    setSaving(false)
    setSaved(true)
    setShowLog(false)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Card padding="0" style={{ marginBottom: 12, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '15px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: 'var(--acc)', lineHeight: 1, minWidth: 22 }}>
              {ex.order}
            </span>
            <Tag label={ex.type} color={TYPE_COLOR[ex.type] || 'gray'} small />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setShowLog(!showLog)} title="Log poids" style={{
              background: ex.weight_log ? 'var(--acc-dim)' : 'var(--surface-up)',
              border: `1px solid ${ex.weight_log ? 'var(--acc)' : 'var(--border)'}`,
              borderRadius: 9, padding: '6px 8px',
              cursor: 'pointer', display: 'flex', gap: 4, alignItems: 'center',
              transition: 'all 0.15s',
            }}>
              <Icons.scale size={12} color={ex.weight_log ? 'var(--acc-txt)' : 'var(--txt-sub)'} />
              {ex.weight_log && (
                <span style={{ fontSize: 11, color: 'var(--acc-txt)', fontWeight: 700 }}>
                  {ex.weight_log}kg
                </span>
              )}
            </button>
            <button onClick={() => onReplace(ex)} style={{
              background: 'var(--surface-up)', border: '1px solid var(--border)',
              borderRadius: 9, padding: '6px 8px', cursor: 'pointer', display: 'flex',
            }}>
              <Icons.replace size={13} color="var(--txt-sub)" />
            </button>
            <button onClick={() => setOpen(!open)} style={{
              background: 'var(--surface-up)', border: '1px solid var(--border)',
              borderRadius: 9, padding: '6px 8px', cursor: 'pointer', display: 'flex',
            }}>
              {open ? <Icons.chevUp size={13} color="var(--txt-sub)" /> : <Icons.chevDown size={13} color="var(--txt-sub)" />}
            </button>
          </div>
        </div>

        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--txt)', marginBottom: 4, lineHeight: 1.2 }}>
          {ex.display_name}
        </h3>
        <p style={{ fontSize: 12, color: 'var(--txt-sub)', marginBottom: 12, lineHeight: 1.5 }}>
          {ex.display_muscle}
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 7 }}>
          {[
            { label: t('sets'), value: ex.sets },
            { label: 'Reps',    value: ex.reps },
            { label: t('restLbl'), value: `${ex.rest}s` },
            { label: t('rpe'),  value: ex.rpe },
          ].map(({ label, value }, i) => (
            <div key={i} style={{
              flex: 1, background: 'var(--surface-up)',
              borderRadius: 10, padding: '9px 6px', textAlign: 'center',
            }}>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: i === 0 ? 22 : 16,
                color: i === 0 ? 'var(--acc)' : 'var(--txt)', lineHeight: 1,
              }}>
                {value}
              </div>
              <div style={{ fontSize: 9, color: 'var(--txt-muted)', marginTop: 2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Log poids */}
        {showLog && (
          <div style={{ marginTop: 12, display: 'flex', gap: 8, animation: 'fadeUp 0.18s' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="number" value={logWeight}
                onChange={e => setLogWeight(e.target.value)}
                placeholder="ex: 60"
                style={{
                  width: '100%', background: 'var(--surface-up)',
                  border: '1.5px solid var(--acc)', borderRadius: 11,
                  padding: '11px 40px 11px 14px', fontSize: 15,
                  color: 'var(--txt)', fontFamily: 'inherit', outline: 'none',
                }}
              />
              <span style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                fontSize: 12, color: 'var(--txt-sub)', fontWeight: 600,
              }}>kg</span>
            </div>
            <button onClick={handleLogWeight} disabled={saving} style={{
              background: 'var(--acc)', border: 'none', borderRadius: 11,
              padding: '0 16px', cursor: 'pointer', display: 'flex', alignItems: 'center',
              color: 'var(--txt-inv)', fontWeight: 700, fontSize: 13, fontFamily: 'inherit',
              minWidth: 70,
            }}>
              {saving ? '…' : t('save')}
            </button>
          </div>
        )}

        {saved && (
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, animation: 'fadeUp 0.18s' }}>
            <Icons.check size={13} color="var(--ok)" />
            <span style={{ fontSize: 12, color: 'var(--ok)', fontWeight: 600 }}>Poids enregistré</span>
          </div>
        )}

        {/* Progression */}
        {ex.progress_note && (
          <div style={{ marginTop: 8, padding: '7px 11px', background: 'var(--acc-dim)', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 7 }}>
            <Icons.trending size={12} color="var(--acc-txt)" />
            <span style={{ fontSize: 11, color: 'var(--acc-txt)', fontWeight: 600 }}>{ex.progress_note}</span>
          </div>
        )}
      </div>

      {/* Détail expandable */}
      {open && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '18px 16px', animation: 'fadeUp 0.2s cubic-bezier(0.16,1,0.3,1)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <p style={{ fontSize: 9, color: 'var(--txt-muted)', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>
                Équipement
              </p>
              <p style={{ fontSize: 13, color: 'var(--txt)', lineHeight: 1.5 }}>{ex.display_equip}</p>
            </div>
            <div>
              <p style={{ fontSize: 9, color: 'var(--txt-muted)', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>
                Muscles ciblés
              </p>
              <p style={{ fontSize: 12, color: 'var(--txt-sub)', lineHeight: 1.5 }}>{ex.display_fiber}</p>
            </div>
            <div>
              <p style={{ fontSize: 9, color: 'var(--txt-muted)', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>
                Exécution
              </p>
              <p style={{ fontSize: 13, color: 'var(--txt)', lineHeight: 1.6, fontStyle: 'italic' }}>{ex.display_exec}</p>
            </div>
            {ex.display_tip && (
              <div style={{ padding: '13px 14px', background: 'var(--acc-dim)', borderRadius: 12, borderLeft: '3px solid var(--acc)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                  <Icons.target size={13} color="var(--acc-txt)" />
                  <span style={{ fontSize: 10, color: 'var(--acc-txt)', fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                    Conseil coach
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--txt-sub)', lineHeight: 1.6, fontStyle: 'italic' }}>{ex.display_tip}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}