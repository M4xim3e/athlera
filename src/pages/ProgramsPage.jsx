import { useEffect, useState } from 'react'
import { useAuth }         from '../contexts/AuthContext'
import { useLang }         from '../contexts/LangContext'
import { getPrograms, getUserProgram, startProgram } from '../services/eraPlus'
import TopBar from '../components/layout/TopBar'
import Icons  from '../components/ui/Icons'

const LEVEL_COLOR = {
  BEGINNER:     'green',
  INTERMEDIATE: 'acc',
  ADVANCED:     'red',
}

const GOAL_FR = {
  MUSCLE_GAIN: 'Prise de masse',
  STRENGTH:    'Force',
  FAT_LOSS:    'Sèche',
  MAINTENANCE: 'Maintien',
}

export default function ProgramsPage({ onBack, onUpgrade }) {
  const { user }   = useAuth()
  const { lang }   = useLang()

  const [programs,    setPrograms]    = useState([])
  const [userProgram, setUserProgram] = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [starting,    setStarting]    = useState(null)

  useEffect(() => {
    if (!user?.id) return
    load()
  }, [user?.id])

  const load = async () => {
    setLoading(true)
    const [progs, up] = await Promise.all([
      getPrograms(),
      getUserProgram(user.id),
    ])
    setPrograms(progs)
    setUserProgram(up)
    setLoading(false)
  }

  const handleStart = async (programId) => {
    setStarting(programId)
    await startProgram(user.id, programId)
    await load()
    setStarting(null)
  }


  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--bg-base)',
      paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 32px)',
    }}>
      <TopBar onBack={onBack} />

      <div style={{ padding: '20px 18px 0' }}>

        <div style={{ marginBottom: 20 }}>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 34, color: 'var(--txt)', letterSpacing: '0.02em',
          }}>
            {lang === 'fr' ? 'Programmes' : 'Programs'}
          </h1>
        </div>

        {/* Programme actif */}
        {userProgram && (
          <div style={{ marginBottom: 20 }}>
            <p style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: 'var(--txt-sub)', marginBottom: 10,
            }}>
              {lang === 'fr' ? 'Programme en cours' : 'Active program'}
            </p>
            <div style={{
              background: 'var(--acc-dim)', border: '2px solid var(--acc)',
              borderRadius: 18, padding: '18px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--acc-txt)', marginBottom: 4 }}>
                    {lang === 'fr'
                      ? userProgram.program?.name_fr
                      : userProgram.program?.name_en}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--txt-sub)' }}>
                    {lang === 'fr' ? 'Semaine' : 'Week'} {userProgram.current_week} / {userProgram.program?.duration_weeks}
                  </p>
                </div>
                <div style={{
                  background: 'var(--acc)', borderRadius: 10,
                  padding: '6px 12px',
                }}>
                  <span style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 16, color: 'var(--txt-inv)',
                  }}>
                    J{userProgram.current_day}
                  </span>
                </div>
              </div>

              {/* Barre de progression */}
              <div style={{ marginTop: 14 }}>
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', background: 'var(--acc)', borderRadius: 100,
                    width: `${((userProgram.current_week - 1) / userProgram.program?.duration_weeks) * 100}%`,
                  }} />
                </div>
                <p style={{ fontSize: 10, color: 'var(--txt-muted)', marginTop: 4 }}>
                  {Math.round(((userProgram.current_week - 1) / userProgram.program?.duration_weeks) * 100)}% {lang === 'fr' ? 'complété' : 'completed'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Liste des programmes */}
        <p style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
          textTransform: 'uppercase', color: 'var(--txt-sub)', marginBottom: 10,
        }}>
          {lang === 'fr' ? 'Tous les programmes' : 'All programs'}
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--txt-muted)' }}>
            {lang === 'fr' ? 'Chargement...' : 'Loading...'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {programs.map(prog => {
              const isActive = userProgram?.program_id === prog.id
              const isStarting = starting === prog.id

              return (
                <div key={prog.id} style={{
                  background: 'var(--surface)',
                  border: `1px solid ${isActive ? 'var(--acc)' : 'var(--border)'}`,
                  borderRadius: 18, padding: '18px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--txt)', marginBottom: 4 }}>
                        {lang === 'fr' ? prog.name_fr : prog.name_en}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--txt-sub)', lineHeight: 1.5 }}>
                        {lang === 'fr' ? prog.description_fr : prog.description_en}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                    {[
                      `${prog.duration_weeks} ${lang === 'fr' ? 'sem.' : 'wks'}`,
                      `${prog.frequency}j/sem`,
                      lang === 'fr' ? GOAL_FR[prog.goal] || prog.goal : prog.goal,
                      prog.level,
                    ].map((tag, i) => (
                      <span key={i} style={{
                        background: 'var(--surface-up)', border: '1px solid var(--border)',
                        borderRadius: 999, padding: '3px 10px',
                        fontSize: 11, color: 'var(--txt-sub)', fontWeight: 600,
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleStart(prog.id)}
                    disabled={isActive || isStarting}
                    style={{
                      width: '100%',
                      background: isActive ? 'var(--acc-dim)' : 'var(--acc)',
                      border: isActive ? '1px solid var(--acc)' : 'none',
                      borderRadius: 12, padding: '12px',
                      cursor: isActive ? 'default' : 'pointer',
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 16, letterSpacing: '0.05em',
                      color: isActive ? 'var(--acc-txt)' : 'var(--txt-inv)',
                      opacity: isStarting ? 0.7 : 1,
                    }}
                  >
                    {isActive
                      ? (lang === 'fr' ? '✓ En cours' : '✓ Active')
                      : isStarting
                        ? (lang === 'fr' ? 'Démarrage...' : 'Starting...')
                        : (lang === 'fr' ? 'Démarrer ce programme' : 'Start this program')}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
