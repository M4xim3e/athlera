import { useEffect, useState } from 'react'
import { useAuth }         from '../contexts/AuthContext'
import { useLang }         from '../contexts/LangContext'
import { getWeeklyStats, getAllPRs } from '../services/eraPlus'  // internal service
import TopBar from '../components/layout/TopBar'
import Icons  from '../components/ui/Icons'

function BarChart({ data, lang }) {
  if (!data?.length) return null
  const max = Math.max(...data.map(d => d.total_volume || 0), 1)

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
      {data.slice(0, 8).reverse().map((week, i) => {
        const h = Math.max(((week.total_volume || 0) / max) * 80, 4)
        const isLast = i === data.slice(0, 8).length - 1
        return (
          <div key={i} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 4,
          }}>
            <div style={{
              width: '100%', height: h,
              background: isLast ? 'var(--acc)' : 'var(--surface-high)',
              borderRadius: '4px 4px 0 0',
              transition: 'height 0.3s var(--ease)',
            }} />
            <span style={{ fontSize: 8, color: 'var(--txt-muted)' }}>
              {new Date(week.week_start).toLocaleDateString(
                lang === 'fr' ? 'fr-FR' : 'en-GB',
                { day: 'numeric', month: 'short' }
              ).slice(0, 5)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function StatsPage({ onBack, onUpgrade }) {
  const { user }    = useAuth()
  const { lang }    = useLang()

  const [weeklyStats, setWeeklyStats] = useState([])
  const [prs,         setPrs]         = useState([])
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    load()
  }, [user?.id])

  const load = async () => {
    setLoading(true)
    const [ws, pr] = await Promise.all([
      getWeeklyStats(user.id, 8),
      getAllPRs(user.id),
    ])
    setWeeklyStats(ws)
    setPrs(pr)
    setLoading(false)
  }

  const thisWeek = weeklyStats[0]
  const lastWeek = weeklyStats[1]
  const volumeDelta = thisWeek && lastWeek && lastWeek.total_volume > 0
    ? (((thisWeek.total_volume - lastWeek.total_volume) / lastWeek.total_volume) * 100).toFixed(0)
    : null


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
            {lang === 'fr' ? 'Statistiques' : 'Statistics'}
          </h1>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--txt-muted)' }}>
            {lang === 'fr' ? 'Chargement...' : 'Loading...'}
          </div>
        ) : (
          <>
            {/* Stats cette semaine */}
            <div style={{ marginBottom: 16 }}>
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
                textTransform: 'uppercase', color: 'var(--txt-sub)', marginBottom: 10,
              }}>
                {lang === 'fr' ? 'Cette semaine' : 'This week'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 16, padding: '16px',
                }}>
                  <div style={{ fontSize: 10, color: 'var(--txt-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    {lang === 'fr' ? 'Volume total' : 'Total volume'}
                  </div>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 28, color: 'var(--txt)', lineHeight: 1,
                  }}>
                    {thisWeek?.total_volume
                      ? `${Math.round(thisWeek.total_volume).toLocaleString()}`
                      : '--'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--txt-muted)', marginTop: 2 }}>kg·reps</div>
                  {volumeDelta !== null && (
                    <div style={{
                      fontSize: 11, fontWeight: 700, marginTop: 4,
                      color: parseFloat(volumeDelta) >= 0 ? 'var(--ok)' : 'var(--err)',
                    }}>
                      {parseFloat(volumeDelta) >= 0 ? '+' : ''}{volumeDelta}% vs sem. préc.
                    </div>
                  )}
                </div>

                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 16, padding: '16px',
                }}>
                  <div style={{ fontSize: 10, color: 'var(--txt-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    {lang === 'fr' ? 'Séances' : 'Sessions'}
                  </div>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 28, color: 'var(--txt)', lineHeight: 1,
                  }}>
                    {thisWeek?.total_sessions || '--'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--txt-muted)', marginTop: 2 }}>
                    {thisWeek?.total_sets || 0} {lang === 'fr' ? 'séries' : 'sets'}
                  </div>
                </div>
              </div>
            </div>

            {/* Volume chart */}
            {weeklyStats.length > 1 && (
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 18, padding: '16px', marginBottom: 16,
              }}>
                <p style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
                  textTransform: 'uppercase', color: 'var(--txt-sub)', marginBottom: 14,
                }}>
                  {lang === 'fr' ? 'Volume 8 semaines' : '8 weeks volume'}
                </p>
                <BarChart data={weeklyStats} lang={lang} />
              </div>
            )}

            {/* PRs */}
            {prs.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
                  textTransform: 'uppercase', color: 'var(--txt-sub)', marginBottom: 10,
                }}>
                  {lang === 'fr' ? `Records personnels (${prs.length})` : `Personal records (${prs.length})`}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {prs.slice(0, 10).map((pr, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 14px', background: 'var(--surface)',
                      border: '1px solid var(--border)', borderRadius: 14,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 28, height: 28, background: 'rgba(255,159,10,0.12)',
                          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Icons.flame size={12} color="var(--warn)" />
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt)' }}>
                            {pr.exercise_name}
                          </p>
                          <p style={{ fontSize: 11, color: 'var(--txt-muted)' }}>
                            {new Date(pr.performed_at).toLocaleDateString(
                              lang === 'fr' ? 'fr-FR' : 'en-GB'
                            )}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: 20, color: 'var(--warn)', lineHeight: 1,
                        }}>
                          {pr.weight_kg ? `${pr.weight_kg}kg` : '--'}
                        </p>
                        <p style={{ fontSize: 10, color: 'var(--txt-muted)' }}>
                          {pr.sets}×{pr.reps}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {prs.length === 0 && weeklyStats.length === 0 && (
              <div style={{
                textAlign: 'center', padding: '40px 20px',
                color: 'var(--txt-muted)', fontSize: 13,
              }}>
                {lang === 'fr'
                  ? 'Fais ta première séance pour voir tes stats !'
                  : 'Complete your first workout to see your stats!'}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
