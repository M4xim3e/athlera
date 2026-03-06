import { useState } from 'react'
import { useAuth }         from '../../contexts/AuthContext'
import { useLang }         from '../../contexts/LangContext'
import { useTheme }        from '../../contexts/ThemeContext'
import { useProfile }      from '../../contexts/ProfileContext'
import { useSubscription } from '../../contexts/SubscriptionContext'
import { cancelEraPlus, getReferralCode } from '../../services/eraPlus'
import Icons from '../ui/Icons'

const THEMES = [
  { id: 'black-era', label: 'Black Era', desc: 'Sombre & électrique' },
  { id: 'white-era', label: 'White Era', desc: 'Clair & épuré'       },
  { id: 'pink-era',  label: 'Pink Era',  desc: 'Rose & bold'         },
]

export default function BurgerMenu({ onClose, onNavigate }) {
  const { user, signOut }        = useAuth()
  const { t, lang, setLanguage } = useLang()
  const { mode, setTheme }       = useTheme()
  const { profile }              = useProfile()
  const {
    isPlus, isCancelled, periodEnd, refresh,
  } = useSubscription()

  const [view,              setView]              = useState('main')
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showReferral,      setShowReferral]      = useState(false)
  const [referralCode,      setReferralCode]      = useState(null)
  const [cancelling,        setCancelling]        = useState(false)

  const handleNav     = (dest) => { onClose(); onNavigate?.(dest) }
  const handleSignOut = async () => { onClose(); await signOut() }
  const currentTheme  = THEMES.find(th => th.id === mode) || THEMES[0]

  const fmtDate = (d) => d
    ? new Date(d).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null

  const handleCancel = async () => {
    setCancelling(true)
    const ok = await cancelEraPlus()
    if (ok) await refresh()
    setCancelling(false)
    setShowCancelConfirm(false)
  }

  const handleReferral = async () => {
    if (!referralCode) {
      const data = await getReferralCode(user.id)
      setReferralCode(data?.referral_code || null)
    }
    setShowReferral(true)
  }

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'var(--overlay)', zIndex: 40,
        animation: 'fadeIn 0.18s',
        backdropFilter: 'blur(3px)',
      }} />

      {/* Panneau */}
      <div style={{
        position: 'fixed', top: 0, right: 0,
        width: '78%', maxWidth: 320, height: '100dvh',
        background: 'var(--surface)',
        borderLeft: `1.5px solid ${isPlus ? 'var(--acc)' : 'var(--border)'}`,
        zIndex: 50, display: 'flex', flexDirection: 'column',
        animation: 'slideRight 0.28s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: isPlus ? 'var(--shd-acc)' : 'var(--shd-md)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {view !== 'main' && (
              <button onClick={() => setView('main')} style={{
                background: 'var(--surface-up)', border: '1px solid var(--border)',
                borderRadius: 9, padding: 7, cursor: 'pointer', display: 'flex',
              }}>
                <Icons.chevLeft size={14} color="var(--txt-sub)" />
              </button>
            )}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <p style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 20, color: 'var(--acc-txt)',
                  letterSpacing: '0.05em', lineHeight: 1,
                }}>
                  {view === 'theme' ? 'Thème' : view === 'era' ? 'ERA+' : (profile?.name || 'Athlète')}
                </p>
                {view === 'main' && isPlus && (
                  <span style={{
                    background: 'var(--acc)', borderRadius: 999,
                    padding: '2px 8px', fontSize: 9, fontWeight: 800,
                    color: 'var(--txt-inv)', letterSpacing: '0.07em',
                  }}>
                    ERA+
                  </span>
                )}
              </div>
              {view === 'main' && (
                <p style={{ fontSize: 12, color: 'var(--txt-sub)', marginTop: 2 }}>
                  {user?.email}
                </p>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'var(--surface-up)', border: '1px solid var(--border)',
            borderRadius: 10, padding: 8, cursor: 'pointer', display: 'flex',
          }}>
            <Icons.x size={16} color="var(--txt-sub)" />
          </button>
        </div>

        {/* ── VUE PRINCIPALE ── */}
        {view === 'main' && (
          <div style={{
            flex: 1, padding: '10px 12px',
            display: 'flex', flexDirection: 'column', gap: 2,
            overflowY: 'auto',
          }}>

            {(isPlus || isCancelled) && (
              <>
                <SectionLabel label="ERA+" />
                <MenuItem
                  icon={<Icons.activity size={17} color="var(--acc-txt)" />}
                  label={lang === 'fr' ? 'Statistiques' : 'Statistics'}
                  onClick={() => handleNav('stats')}
                  accent
                />
                <MenuItem
                  icon={<Icons.calendar size={17} color="var(--acc-txt)" />}
                  label={lang === 'fr' ? 'Programmes' : 'Programs'}
                  onClick={() => handleNav('programs')}
                  accent
                />
                {isPlus && (
                  <MenuItem
                    icon={<Icons.users size={17} color="var(--acc-txt)" />}
                    label={lang === 'fr' ? 'Inviter un ami' : 'Invite a friend'}
                    onClick={handleReferral}
                    accent
                  />
                )}
                <MenuItem
                  icon={<Icons.bolt size={17} color={isPlus ? 'var(--acc-txt)' : 'var(--txt-sub)'} />}
                  label={lang === 'fr' ? 'Gérer ERA+' : 'Manage ERA+'}
                  onClick={() => setView('era')}
                  accent={isPlus}
                />
                <Divider />
              </>
            )}

            <SectionLabel label={lang === 'fr' ? 'Navigation' : 'Navigation'} />
            <MenuItem
              icon={<Icons.user size={17} color="var(--txt-sub)" />}
              label={t('menuProf')}
              onClick={() => handleNav('profile')}
            />

            <Divider />

            {/* Thème */}
            <button onClick={() => setView('theme')} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 12px', borderRadius: 13,
              background: 'transparent', border: 'none', cursor: 'pointer',
              width: '100%', fontFamily: 'inherit', transition: 'background 0.13s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-up)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 34, height: 34, background: 'var(--surface-up)',
                  borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icons.palette size={17} color="var(--txt-sub)" />
                </div>
                <div>
                  <div style={{ fontSize: 14, color: 'var(--txt)', fontWeight: 600, textAlign: 'left' }}>
                    {lang === 'fr' ? 'Thème' : 'Theme'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--txt-sub)', marginTop: 1, textAlign: 'left' }}>
                    {currentTheme.label}
                  </div>
                </div>
              </div>
              <Icons.chevRight size={14} color="var(--txt-sub)" />
            </button>

            {/* Langue */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 12px', borderRadius: 13,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 34, height: 34, background: 'var(--surface-up)',
                  borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icons.globe size={17} color="var(--txt-sub)" />
                </div>
                <span style={{ fontSize: 14, color: 'var(--txt)', fontWeight: 600 }}>
                  {t('menuLang')}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['fr', 'en'].map(l => (
                  <button key={l} onClick={() => setLanguage(l)} style={{
                    padding: '5px 11px', borderRadius: 999,
                    fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    background: lang === l ? 'var(--acc)' : 'var(--surface-up)',
                    color:      lang === l ? 'var(--txt-inv)' : 'var(--txt-sub)',
                    border: `1px solid ${lang === l ? 'var(--acc)' : 'var(--border)'}`,
                    transition: 'all 0.15s',
                  }}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <Divider />

            {!isPlus && !isCancelled && (
              <button onClick={() => handleNav('eraplus')} style={{
                width: '100%', background: 'var(--acc)', border: 'none',
                borderRadius: 14, padding: '13px', cursor: 'pointer',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 16, letterSpacing: '0.05em', color: 'var(--txt-inv)',
                marginBottom: 6,
              }}>
                ✦ {lang === 'fr' ? 'Passer à ERA+' : 'Upgrade to ERA+'}
              </button>
            )}

            <MenuItem
              icon={<Icons.logout size={17} color="var(--err)" />}
              label={t('menuOut')}
              onClick={handleSignOut}
              danger
            />
          </div>
        )}

        {/* ── VUE THÈME ── */}
        {view === 'theme' && (
          <div style={{
            flex: 1, padding: '16px 12px',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <p style={{
              fontSize: 11, color: 'var(--txt-sub)', fontWeight: 700,
              letterSpacing: '0.07em', textTransform: 'uppercase',
              padding: '0 6px', marginBottom: 4,
            }}>
              {lang === 'fr' ? 'Choisissez votre ambiance' : 'Choose your vibe'}
            </p>
            {THEMES.map(th => (
              <button key={th.id} onClick={() => setTheme(th.id)} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '16px',
                background: mode === th.id ? 'var(--acc-dim)' : 'var(--surface-up)',
                border: `2px solid ${mode === th.id ? 'var(--acc)' : 'var(--border)'}`,
                borderRadius: 16, cursor: 'pointer', width: '100%', fontFamily: 'inherit',
                transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                  background: th.id === 'black-era' ? '#060606'
                             : th.id === 'white-era' ? '#F5F5F3' : '#08040A',
                  border: `2px solid ${
                    th.id === 'black-era' ? '#B8FF52'
                    : th.id === 'white-era' ? '#FF6B00' : '#FF2D9B'
                  }`,
                  boxShadow: `0 0 10px ${
                    th.id === 'black-era' ? 'rgba(184,255,82,0.3)'
                    : th.id === 'white-era' ? 'rgba(255,107,0,0.3)' : 'rgba(255,45,155,0.3)'
                  }`,
                }} />
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{
                    fontSize: 15, fontWeight: 700,
                    color: mode === th.id ? 'var(--acc-txt)' : 'var(--txt)',
                  }}>
                    {th.label}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--txt-sub)', marginTop: 2 }}>
                    {th.desc}
                  </div>
                </div>
                {mode === th.id && <Icons.check size={18} color="var(--acc-txt)" />}
              </button>
            ))}
          </div>
        )}

        {/* ── VUE ERA+ ── */}
        {view === 'era' && (
          <div style={{
            flex: 1, padding: '16px 12px',
            display: 'flex', flexDirection: 'column', gap: 10,
            overflowY: 'auto',
          }}>
            <div style={{
              background: isPlus ? 'var(--acc-dim)' : 'rgba(255,159,10,0.08)',
              border: `1px solid ${isPlus ? 'var(--acc)' : 'rgba(255,159,10,0.3)'}`,
              borderRadius: 16, padding: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Icons.bolt size={16} color={isPlus ? 'var(--acc-txt)' : 'var(--warn)'} />
                <span style={{
                  fontSize: 12, fontWeight: 800, letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  color: isPlus ? 'var(--acc-txt)' : 'var(--warn)',
                }}>
                  {isCancelled
                    ? (lang === 'fr' ? 'Annulé' : 'Cancelled')
                    : (lang === 'fr' ? 'Actif' : 'Active')}
                </span>
              </div>
              {periodEnd && (
                <p style={{ fontSize: 13, color: 'var(--txt-sub)' }}>
                  {isCancelled
                    ? (lang === 'fr' ? "Accès jusqu'au" : 'Access until')
                    : (lang === 'fr' ? 'Renouvellement le' : 'Renewal on')}
                  {' '}
                  <strong style={{ color: 'var(--txt)' }}>
                    {fmtDate(periodEnd)}
                  </strong>
                </p>
              )}
            </div>

            {isPlus && (
              <>
                <MenuItem
                  icon={<Icons.activity size={17} color="var(--acc-txt)" />}
                  label={lang === 'fr' ? 'Statistiques' : 'Statistics'}
                  onClick={() => handleNav('stats')}
                  accent
                />
                <MenuItem
                  icon={<Icons.calendar size={17} color="var(--acc-txt)" />}
                  label={lang === 'fr' ? 'Programmes' : 'Programs'}
                  onClick={() => handleNav('programs')}
                  accent
                />
                <MenuItem
                  icon={<Icons.users size={17} color="var(--acc-txt)" />}
                  label={lang === 'fr' ? 'Inviter un ami' : 'Invite a friend'}
                  onClick={handleReferral}
                  accent
                />
                <Divider />
                <MenuItem
                  icon={<Icons.x size={17} color="var(--err)" />}
                  label={lang === 'fr' ? 'Annuler ERA+' : 'Cancel ERA+'}
                  onClick={() => setShowCancelConfirm(true)}
                  danger
                />
              </>
            )}

            {isCancelled && !isPlus && (
              <button
                onClick={() => handleNav('eraplus')}
                style={{
                  width: '100%', background: 'var(--acc)', border: 'none',
                  borderRadius: 14, padding: '14px', cursor: 'pointer',
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 17, letterSpacing: '0.05em', color: 'var(--txt-inv)',
                }}
              >
                {lang === 'fr' ? 'Renouveler ERA+' : 'Renew ERA+'}
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 11, color: 'var(--txt-muted)', textAlign: 'center' }}>
            ATHLERA {isPlus ? '✦ ERA+' : ''} · {currentTheme.label} · v0.6
          </p>
        </div>
      </div>

      {/* ── MODAL ANNULATION ── */}
      {showCancelConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: 'var(--overlay)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          padding: '0 16px calc(env(safe-area-inset-bottom, 0px) + 16px)',
        }}>
          <div style={{
            width: '100%', maxWidth: 430,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 24, padding: '28px 24px',
            animation: 'slideUp 0.22s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{
                width: 56, height: 56, background: 'rgba(255,69,58,0.1)',
                borderRadius: 18, display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 14px',
              }}>
                <Icons.x size={24} color="var(--err)" />
              </div>
              <h3 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 26, color: 'var(--txt)', marginBottom: 10,
              }}>
                {lang === 'fr' ? 'Annuler ERA+ ?' : 'Cancel ERA+?'}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--txt-sub)', lineHeight: 1.6 }}>
                {lang === 'fr'
                  ? `Tu conserveras l'accès ERA+ jusqu'au ${fmtDate(periodEnd)}. Après cette date, ton compte repassera en version gratuite.`
                  : `You'll keep ERA+ access until ${fmtDate(periodEnd)}. After that, your account will revert to the free version.`}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                style={{
                  background: 'var(--err)', border: 'none', borderRadius: 14,
                  padding: '14px', cursor: 'pointer',
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 17, letterSpacing: '0.04em', color: '#fff',
                  opacity: cancelling ? 0.7 : 1, transition: 'opacity 0.15s',
                }}
              >
                {cancelling
                  ? (lang === 'fr' ? 'Annulation...' : 'Cancelling...')
                  : (lang === 'fr' ? "Confirmer l'annulation" : 'Confirm cancellation')}
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                style={{
                  background: 'var(--surface-up)', border: '1px solid var(--border)',
                  borderRadius: 14, padding: '14px', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: 14,
                  fontWeight: 600, color: 'var(--txt-sub)',
                }}
              >
                {lang === 'fr' ? 'Garder ERA+' : 'Keep ERA+'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL REFERRAL ── */}
      {showReferral && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: 'var(--overlay)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          padding: '0 16px calc(env(safe-area-inset-bottom, 0px) + 16px)',
        }}>
          <div style={{
            width: '100%', maxWidth: 430,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 24, padding: '28px 24px',
            animation: 'slideUp 0.22s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{
                width: 56, height: 56, background: 'var(--acc-dim)',
                borderRadius: 18, display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 14px',
              }}>
                <Icons.users size={24} color="var(--acc-txt)" />
              </div>
              <h3 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 26, color: 'var(--txt)', marginBottom: 10,
              }}>
                {lang === 'fr' ? 'Invite un ami' : 'Invite a friend'}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--txt-sub)', lineHeight: 1.5, marginBottom: 16 }}>
                {lang === 'fr'
                  ? 'Partage ton code unique à tes amis pour leur faire découvrir Athlera.'
                  : 'Share your unique code with friends to introduce them to Athlera.'}
              </p>
              <div style={{
                background: 'var(--acc-dim)', border: '2px solid var(--acc)',
                borderRadius: 16, padding: '18px',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 36, color: 'var(--acc-txt)', letterSpacing: '0.15em',
              }}>
                {referralCode?.toUpperCase() || '- - - - - -'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={async () => {
                  try { await navigator.clipboard.writeText(referralCode || '') } catch (e) {}
                }}
                style={{
                  flex: 1, background: 'var(--acc)', border: 'none',
                  borderRadius: 14, padding: '13px', cursor: 'pointer',
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 16, color: 'var(--txt-inv)',
                }}
              >
                {lang === 'fr' ? 'Copier' : 'Copy'}
              </button>
              <button
                onClick={() => setShowReferral(false)}
                style={{
                  flex: 1, background: 'var(--surface-up)',
                  border: '1px solid var(--border)',
                  borderRadius: 14, padding: '13px', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: 14,
                  fontWeight: 600, color: 'var(--txt-sub)',
                }}
              >
                {lang === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function SectionLabel({ label }) {
  return (
    <p style={{
      fontSize: 9, fontWeight: 700, color: 'var(--txt-muted)',
      textTransform: 'uppercase', letterSpacing: '0.09em',
      padding: '4px 10px 2px',
    }}>
      {label}
    </p>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
}

function MenuItem({ icon, label, onClick, danger, accent }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 12px', borderRadius: 13,
      background: 'transparent', border: 'none',
      cursor: 'pointer', width: '100%', textAlign: 'left',
      transition: 'background 0.13s', fontFamily: 'inherit',
    }}
    onMouseEnter={e => e.currentTarget.style.background =
      danger ? 'rgba(255,69,58,0.07)' : accent ? 'var(--acc-dim)' : 'var(--surface-up)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        width: 34, height: 34, flexShrink: 0,
        background: danger
          ? 'rgba(255,69,58,0.1)'
          : accent ? 'var(--acc-dim)' : 'var(--surface-up)',
        borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: accent ? '1px solid var(--acc)' : 'none',
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: 14, fontWeight: 600,
        color: danger ? 'var(--err)' : accent ? 'var(--acc-txt)' : 'var(--txt)',
      }}>
        {label}
      </span>
    </button>
  )
}
