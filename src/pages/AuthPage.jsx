import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useLang } from '../contexts/LangContext'
import Icons from '../components/ui/Icons'

const GOALS = [
  { id: 'MUSCLE_GAIN', fr: 'Prise de muscle',  en: 'Muscle gain',  icon: 'dumbbell' },
  { id: 'FAT_LOSS',    fr: 'Perte de gras',    en: 'Fat loss',     icon: 'flame'    },
  { id: 'STRENGTH',    fr: 'Force',             en: 'Strength',     icon: 'bolt'     },
  { id: 'MAINTENANCE', fr: 'Maintien',          en: 'Maintenance',  icon: 'target'   },
  { id: 'PERFORMANCE', fr: 'Performance',       en: 'Performance',  icon: 'activity' },
]

const LEVELS = [
  { id: 'beginner',     fr: 'Débutant',      en: 'Beginner'      },
  { id: 'intermediate', fr: 'Intermédiaire', en: 'Intermediate'  },
  { id: 'advanced',     fr: 'Avancé',        en: 'Advanced'      },
]

const SEXES = [
  { id: 'homme',  fr: 'Homme',              en: 'Male'           },
  { id: 'femme',  fr: 'Femme',              en: 'Female'         },
  { id: 'neutre', fr: 'Ne se prononce pas', en: 'Prefer not to say' },
]

const FREQ = [2, 3, 4, 5, 6]

export default function AuthPage({ onDone }) {
  const { lang } = useLang()
  const t = (fr, en) => lang === 'fr' ? fr : en

  const [mode,    setMode]    = useState('login')
  const [step,    setStep]    = useState(0)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  // Étape 0 — Compte
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [name,     setName]     = useState('')

  // Étape 1 — Corps
  const [dob,    setDob]    = useState('')
  const [sexe,   setSexe]   = useState('')
  const [taille, setTaille] = useState('')
  const [poids,  setPoids]  = useState('')

  // Étape 2 — Objectif
  const [goal,  setGoal]  = useState('')
  const [level, setLevel] = useState('')
  const [freq,  setFreq]  = useState(3)

  const validateStep0 = () => {
    if (!name.trim())
      return setError(t('Prénom requis', 'First name required')), false
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      return setError(t('Email invalide', 'Invalid email')), false
    if (password.length < 6)
      return setError(t('Mot de passe trop court (6 min)', 'Password too short (6 min)')), false
    return true
  }

  const validateStep1 = () => {
    if (!dob)    return setError(t('Date de naissance requise', 'Date of birth required')), false
    if (!sexe)   return setError(t('Sexe requis', 'Sex required')), false
    if (!taille) return setError(t('Taille requise', 'Height required')), false
    if (!poids)  return setError(t('Poids requis', 'Weight required')), false
    return true
  }

  const validateStep2 = () => {
    if (!goal)  return setError(t('Objectif requis', 'Goal required')), false
    if (!level) return setError(t('Niveau requis', 'Level required')), false
    return true
  }

  const handleNext = () => {
    setError('')
    const valid = step === 0 ? validateStep0() : step === 1 ? validateStep1() : true
    if (!valid) return
    setStep(s => s + 1)
  }

  const handleLogin = async () => {
    setError('')
    if (!email.trim() || !password)
      return setError(t('Champs requis', 'Required fields'))
    setLoading(true)
    const { error: e } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (e) return setError(e.message)
    onDone(false)
  }

  const handleSignup = async () => {
    setError('')
    if (!validateStep2()) return
    setLoading(true)
    try {
      // 1. Créer le compte auth
      const { data, error: signupErr } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      })
      if (signupErr) throw signupErr
      const userId = data.user?.id
      if (!userId) throw new Error(t('Erreur de création du compte', 'Account creation error'))

      // 2. Calculer l'âge depuis dob
      const birthYear = new Date(dob).getFullYear()
      const age = new Date().getFullYear() - birthYear

      // 3. Créer le profil avec les colonnes exactes de la DB
      const { error: profileErr } = await supabase.from('profiles').upsert({
        id:         userId,
        name,
        email,
        dob,
        sexe,
        gender:     sexe,
        age,
        height:     parseFloat(taille),
        weight:     parseFloat(poids),
        goal,
        level,
        freq,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })
      if (profileErr) throw profileErr

      // 4. Enregistrer le poids initial
      await supabase.from('weight_history').insert({
        user_id:     userId,
        value:       parseFloat(poids),
        recorded_at: new Date().toISOString(),
      })

      setLoading(false)
      onDone(false)
    } catch (e) {
      setLoading(false)
      setError(e.message)
    }
  }

  // ─── Styles réutilisables ───
  const inputStyle = {
    width: '100%',
    background: 'var(--surface-up)',
    border: '1.5px solid var(--border)',
    borderRadius: 14,
    padding: '14px 16px',
    fontSize: 16,
    color: 'var(--txt)',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
    WebkitAppearance: 'none',
  }

  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--txt-sub)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 6,
    display: 'block',
  }

  const btnPrimary = {
    width: '100%',
    background: 'var(--acc)',
    border: 'none',
    borderRadius: 14,
    padding: '15px',
    cursor: 'pointer',
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 20,
    letterSpacing: '0.05em',
    color: 'var(--txt-inv)',
    marginTop: 4,
    opacity: loading ? 0.7 : 1,
    transition: 'opacity 0.15s',
  }

  const onFocusAcc = e => e.target.style.borderColor = 'var(--acc)'
  const onBlurBrd  = e => e.target.style.borderColor = 'var(--border)'

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 'calc(env(safe-area-inset-top, 0px) + 48px)',
      paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 32px)',
      paddingLeft: 20,
      paddingRight: 20,
      overflowY: 'auto',
      position: 'relative',
    }}>

      {/* Glow ERA background */}
      <div style={{
        position: 'fixed', top: -100, right: -100,
        width: 350, height: 350,
        background: 'radial-gradient(ellipse, var(--acc-glo-m) 0%, transparent 65%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ width: '100%', maxWidth: 400, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52,
            background: 'var(--acc)', borderRadius: 16,
            boxShadow: 'var(--shd-acc)', marginBottom: 10,
          }}>
            <Icons.logo size={26} color="var(--txt-inv)" strokeWidth={2.2} />
          </div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 40, color: 'var(--acc-txt)',
            letterSpacing: '0.05em', lineHeight: 1, marginBottom: 4,
          }}>
            ATHLERA
          </h1>
          {mode === 'signup' && (
            <p style={{ fontSize: 13, color: 'var(--txt-sub)' }}>
              {t('Étape', 'Step')} {step + 1}/3 —{' '}
              {step === 0
                ? t('Ton compte', 'Your account')
                : step === 1
                ? t('Ton corps', 'Your body')
                : t('Ton objectif', 'Your goal')}
            </p>
          )}
        </div>

        {/* Barre de progression */}
        {mode === 'signup' && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 99,
                background: i <= step ? 'var(--acc)' : 'var(--border)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
        )}

        {/* ══ LOGIN ══ */}
        {mode === 'login' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>{t('Email', 'Email')}</label>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ton@email.com"
                style={inputStyle}
                onFocus={onFocusAcc}
                onBlur={onBlurBrd}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('Mot de passe', 'Password')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: 48 }}
                  onFocus={onFocusAcc}
                  onBlur={onBlurBrd}
                />
                <button onClick={() => setShowPwd(!showPwd)} style={{
                  position: 'absolute', right: 14, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
                }}>
                  {showPwd
                    ? <Icons.eyeOff size={18} color="var(--txt-muted)" />
                    : <Icons.eye    size={18} color="var(--txt-muted)" />}
                </button>
              </div>
            </div>

            {error && (
              <p style={{ fontSize: 13, color: 'var(--err)', textAlign: 'center' }}>{error}</p>
            )}

            <button onClick={handleLogin} disabled={loading} style={btnPrimary}>
              {loading ? '...' : t('Connexion', 'Sign in')}
            </button>

            <button onClick={() => { setMode('signup'); setStep(0); setError('') }} style={{
              background: 'none', border: '1px solid var(--border)', borderRadius: 14,
              padding: '13px', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 14, fontWeight: 600, color: 'var(--txt-sub)',
            }}>
              {t('Créer un compte', 'Create an account')}
            </button>
          </div>
        )}

        {/* ══ SIGNUP ÉTAPE 0 — Compte ══ */}
        {mode === 'signup' && step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>{t('Prénom', 'First name')} *</label>
              <input
                type="text"
                autoComplete="given-name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t('Ton prénom', 'Your first name')}
                style={inputStyle}
                onFocus={onFocusAcc}
                onBlur={onBlurBrd}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('Email', 'Email')} *</label>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ton@email.com"
                style={inputStyle}
                onFocus={onFocusAcc}
                onBlur={onBlurBrd}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('Mot de passe', 'Password')} *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={t('6 caractères minimum', '6 characters minimum')}
                  style={{ ...inputStyle, paddingRight: 48 }}
                  onFocus={onFocusAcc}
                  onBlur={onBlurBrd}
                />
                <button onClick={() => setShowPwd(!showPwd)} style={{
                  position: 'absolute', right: 14, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
                }}>
                  {showPwd
                    ? <Icons.eyeOff size={18} color="var(--txt-muted)" />
                    : <Icons.eye    size={18} color="var(--txt-muted)" />}
                </button>
              </div>
            </div>

            {error && (
              <p style={{ fontSize: 13, color: 'var(--err)', textAlign: 'center' }}>{error}</p>
            )}

            <button onClick={handleNext} style={btnPrimary}>
              {t('Continuer', 'Continue')} →
            </button>

            <button onClick={() => { setMode('login'); setError('') }} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, color: 'var(--txt-sub)',
              textAlign: 'center', padding: '8px',
            }}>
              {t('Déjà un compte ? Connexion', 'Already have an account? Sign in')}
            </button>
          </div>
        )}

        {/* ══ SIGNUP ÉTAPE 1 — Corps ══ */}
        {mode === 'signup' && step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>{t('Date de naissance', 'Date of birth')} *</label>
              <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                max={new Date(
                  new Date().setFullYear(new Date().getFullYear() - 13)
                ).toISOString().split('T')[0]}
                style={inputStyle}
                onFocus={onFocusAcc}
                onBlur={onBlurBrd}
              />
            </div>

            <div>
              <label style={labelStyle}>{t('Sexe', 'Sex')} *</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {SEXES.map(s => (
                  <button key={s.id} onClick={() => setSexe(s.id)} style={{
                    flex: 1, padding: '11px 4px', borderRadius: 12, cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 11, fontWeight: 600,
                    lineHeight: 1.3, textAlign: 'center',
                    background: sexe === s.id ? 'var(--acc-dim)' : 'var(--surface-up)',
                    border: `1.5px solid ${sexe === s.id ? 'var(--acc)' : 'var(--border)'}`,
                    color: sexe === s.id ? 'var(--acc-txt)' : 'var(--txt-sub)',
                    transition: 'all 0.15s',
                  }}>
                    {lang === 'fr' ? s.fr : s.en}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>{t('Taille (cm)', 'Height (cm)')} *</label>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  value={taille}
                  onChange={e => setTaille(e.target.value.replace(/[^0-9.,]/g, ''))}
                  placeholder="175"
                  style={inputStyle}
                  onFocus={onFocusAcc}
                  onBlur={onBlurBrd}
                />
              </div>
              <div>
                <label style={labelStyle}>{t('Poids (kg)', 'Weight (kg)')} *</label>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  value={poids}
                  onChange={e => setPoids(e.target.value.replace(/[^0-9.,]/g, ''))}
                  placeholder="75"
                  style={inputStyle}
                  onFocus={onFocusAcc}
                  onBlur={onBlurBrd}
                />
              </div>
            </div>

            {error && (
              <p style={{ fontSize: 13, color: 'var(--err)', textAlign: 'center' }}>{error}</p>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button onClick={() => { setStep(0); setError('') }} style={{
                flex: 1, background: 'var(--surface-up)',
                border: '1px solid var(--border)', borderRadius: 14,
                padding: '14px', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 18, color: 'var(--txt-sub)',
              }}>←</button>
              <button onClick={handleNext} style={{ ...btnPrimary, flex: 3, marginTop: 0 }}>
                {t('Continuer', 'Continue')} →
              </button>
            </div>
          </div>
        )}

        {/* ══ SIGNUP ÉTAPE 2 — Objectif ══ */}
        {mode === 'signup' && step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>{t('Objectif', 'Goal')} *</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {GOALS.map(g => {
                  const IC = Icons[g.icon] || Icons.bolt
                  return (
                    <button key={g.id} onClick={() => setGoal(g.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '13px 16px', borderRadius: 14, cursor: 'pointer',
                      fontFamily: 'inherit', textAlign: 'left',
                      background: goal === g.id ? 'var(--acc-dim)' : 'var(--surface-up)',
                      border: `1.5px solid ${goal === g.id ? 'var(--acc)' : 'var(--border)'}`,
                      color: goal === g.id ? 'var(--acc-txt)' : 'var(--txt)',
                      transition: 'all 0.15s',
                    }}>
                      <IC size={18} color={goal === g.id ? 'var(--acc-txt)' : 'var(--txt-sub)'} />
                      <span style={{ fontWeight: 600, fontSize: 14, flex: 1 }}>
                        {lang === 'fr' ? g.fr : g.en}
                      </span>
                      {goal === g.id && (
                        <Icons.check size={16} color="var(--acc-txt)" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label style={labelStyle}>{t('Niveau', 'Level')} *</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {LEVELS.map(l => (
                  <button key={l.id} onClick={() => setLevel(l.id)} style={{
                    flex: 1, padding: '11px 4px', borderRadius: 12, cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
                    background: level === l.id ? 'var(--acc-dim)' : 'var(--surface-up)',
                    border: `1.5px solid ${level === l.id ? 'var(--acc)' : 'var(--border)'}`,
                    color: level === l.id ? 'var(--acc-txt)' : 'var(--txt-sub)',
                    transition: 'all 0.15s',
                  }}>
                    {lang === 'fr' ? l.fr : l.en}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>
                {t('Séances / semaine', 'Sessions / week')}
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {FREQ.map(f => (
                  <button key={f} onClick={() => setFreq(f)} style={{
                    flex: 1, padding: '11px 4px', borderRadius: 12, cursor: 'pointer',
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: 18,
                    background: freq === f ? 'var(--acc-dim)' : 'var(--surface-up)',
                    border: `1.5px solid ${freq === f ? 'var(--acc)' : 'var(--border)'}`,
                    color: freq === f ? 'var(--acc-txt)' : 'var(--txt-sub)',
                    transition: 'all 0.15s',
                  }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p style={{ fontSize: 13, color: 'var(--err)', textAlign: 'center' }}>{error}</p>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button onClick={() => { setStep(1); setError('') }} style={{
                flex: 1, background: 'var(--surface-up)',
                border: '1px solid var(--border)', borderRadius: 14,
                padding: '14px', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 18, color: 'var(--txt-sub)',
              }}>←</button>
              <button
                onClick={handleSignup}
                disabled={loading}
                style={{ ...btnPrimary, flex: 3, marginTop: 0 }}
              >
                {loading ? '...' : t("C'est parti ✦", "Let's go ✦")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [name,     setName]     = useState('')
  const [showPwd,  setShowPwd]  = useState(false)

  // Étape 1 — Corps
  const [dob,     setDob]     = useState('')
  const [sexe,    setSexe]    = useState('')
  const [taille,  setTaille]  = useState('')
  const [poids,   setPoids]   = useState('')

  // Étape 2 — Objectif
  const [goal,    setGoal]    = useState('')
  const [level,   setLevel]   = useState('')
  const [freq,    setFreq]    = useState(3)

  const t = (fr, en) => lang === 'fr' ? fr : en

  const validateStep = () => {
    if (mode === 'login') return true
    if (step === 0) {
      if (!name.trim())     return setError(t('Prénom requis', 'First name required')), false
      if (!email.trim())    return setError(t('Email requis', 'Email required')), false
      if (!/\S+@\S+\.\S+/.test(email)) return setError(t('Email invalide', 'Invalid email')), false
      if (password.length < 6) return setError(t('Mot de passe trop court (6 min)', 'Password too short (6 min)')), false
      return true
    }
    if (step === 1) {
      if (!dob)    return setError(t('Date de naissance requise', 'Date of birth required')), false
      if (!sexe)   return setError(t('Sexe requis', 'Sex required')), false
      if (!taille) return setError(t('Taille requise', 'Height required')), false
      if (!poids)  return setError(t('Poids requis', 'Weight required')), false
      return true
    }
    if (step === 2) {
      if (!goal)  return setError(t('Objectif requis', 'Goal required')), false
      if (!level) return setError(t('Niveau requis', 'Level required')), false
      return true
    }
    return true
  }

  const handleNext = () => {
    setError('')
    if (!validateStep()) return
    setStep(s => s + 1)
  }

  const handleLogin = async () => {
    setError('')
    if (!email.trim() || !password) return setError(t('Champs requis', 'Required fields'))
    setLoading(true)
    const { error: e } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (e) return setError(e.message)
    onDone(false)
  }

  const handleSignup = async () => {
    setError('')
    if (!validateStep()) return
    setLoading(true)
    try {
      const { data, error: signupErr } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      })
      if (signupErr) throw signupErr

      const userId = data.user?.id
      if (!userId) throw new Error('No user ID')

      const age = new Date().getFullYear() - new Date(dob).getFullYear()

      const { error: profileErr } = await supabase.from('profiles').upsert({
        id:            userId,
        name,
        email,
        date_of_birth: dob,
        sexe,
        height_cm:     parseInt(taille),
        goal,
        level,
        frequency:     freq,
      }, { onConflict: 'id' })

      if (profileErr) throw profileErr

      const { error: weightErr } = await supabase.from('weights').insert({
        user_id: userId,
        value:   parseFloat(poids),
      })

      setLoading(false)
      onDone(false)
    } catch (e) {
      setLoading(false)
      setError(e.message)
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--surface-up)',
    border: '1.5px solid var(--border)',
    borderRadius: 14,
    padding: '14px 16px',
    fontSize: 15,
    color: 'var(--txt)',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--txt-sub)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 6,
    display: 'block',
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
      paddingTop: 'calc(env(safe-area-inset-top, 0px) + 24px)',
      paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Glow ERA */}
      <div style={{
        position: 'absolute', top: -80, right: -80,
        width: 300, height: 300,
        background: 'radial-gradient(ellipse, var(--acc-glo-m) 0%, transparent 68%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 56, height: 56,
            background: 'var(--acc)', borderRadius: 18,
            boxShadow: 'var(--shd-acc)', marginBottom: 12,
          }}>
            <Icons.logo size={28} color="var(--txt-inv)" strokeWidth={2.2} />
          </div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 42, color: 'var(--acc-txt)',
            letterSpacing: '0.05em', lineHeight: 1,
          }}>
            ATHLERA
          </h1>
          {mode === 'signup' && (
            <p style={{ fontSize: 13, color: 'var(--txt-sub)', marginTop: 4 }}>
              {t('Étape', 'Step')} {step + 1}/3 — {
                step === 0 ? t('Ton compte', 'Your account') :
                step === 1 ? t('Ton corps', 'Your body') :
                t('Ton objectif', 'Your goal')
              }
            </p>
          )}
        </div>

        {/* Progress bar signup */}
        {mode === 'signup' && (
          <div style={{
            display: 'flex', gap: 6, marginBottom: 28,
          }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 99,
                background: i <= step ? 'var(--acc)' : 'var(--border)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
        )}

        {/* ── LOGIN ── */}
        {mode === 'login' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>{t('Email', 'Email')}</label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ton@email.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--acc)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('Mot de passe', 'Password')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: 48 }}
                  onFocus={e => e.target.style.borderColor = 'var(--acc)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <button onClick={() => setShowPwd(!showPwd)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
                }}>
                  {showPwd
                    ? <Icons.eyeOff size={18} color="var(--txt-muted)" />
                    : <Icons.eye size={18} color="var(--txt-muted)" />}
                </button>
              </div>
            </div>
            {error && <p style={{ fontSize: 13, color: 'var(--err)', textAlign: 'center' }}>{error}</p>}
            <button onClick={handleLogin} disabled={loading} style={{
              background: 'var(--acc)', border: 'none', borderRadius: 14,
              padding: '15px', cursor: loading ? 'wait' : 'pointer',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 20, letterSpacing: '0.05em', color: 'var(--txt-inv)',
              opacity: loading ? 0.7 : 1, marginTop: 4,
            }}>
              {loading ? '...' : t('Connexion', 'Sign in')}
            </button>
            <button onClick={() => { setMode('signup'); setStep(0); setError('') }} style={{
              background: 'none', border: '1px solid var(--border)', borderRadius: 14,
              padding: '13px', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 14, fontWeight: 600, color: 'var(--txt-sub)',
            }}>
              {t("Créer un compte", "Create an account")}
            </button>
          </div>
        )}

        {/* ── SIGNUP ÉTAPE 0 — Compte ── */}
        {mode === 'signup' && step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>{t('Prénom', 'First name')} *</label>
              <input
                type="text" value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t('Ton prénom', 'Your first name')}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--acc)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('Email', 'Email')} *</label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ton@email.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--acc)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('Mot de passe', 'Password')} *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="6 caractères minimum"
                  style={{ ...inputStyle, paddingRight: 48 }}
                  onFocus={e => e.target.style.borderColor = 'var(--acc)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <button onClick={() => setShowPwd(!showPwd)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
                }}>
                  {showPwd
                    ? <Icons.eyeOff size={18} color="var(--txt-muted)" />
                    : <Icons.eye size={18} color="var(--txt-muted)" />}
                </button>
              </div>
            </div>
            {error && <p style={{ fontSize: 13, color: 'var(--err)', textAlign: 'center' }}>{error}</p>}
            <button onClick={handleNext} style={{
              background: 'var(--acc)', border: 'none', borderRadius: 14,
              padding: '15px', cursor: 'pointer',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 20, letterSpacing: '0.05em', color: 'var(--txt-inv)',
              marginTop: 4,
            }}>
              {t('Continuer', 'Continue')} →
            </button>
            <button onClick={() => { setMode('login'); setError('') }} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, color: 'var(--txt-sub)',
              textAlign: 'center', padding: '8px',
            }}>
              {t('Déjà un compte ? Connexion', 'Already have an account? Sign in')}
            </button>
          </div>
        )}

        {/* ── SIGNUP ÉTAPE 1 — Corps ── */}
        {mode === 'signup' && step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>{t('Date de naissance', 'Date of birth')} *</label>
              <input
                type="date" value={dob}
                onChange={e => setDob(e.target.value)}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--acc)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('Sexe', 'Sex')} *</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {SEXES.map(s => (
                  <button key={s.id} onClick={() => setSexe(s.id)} style={{
                    flex: 1, padding: '11px 6px', borderRadius: 12, cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
                    background: sexe === s.id ? 'var(--acc-dim)' : 'var(--surface-up)',
                    border: `1.5px solid ${sexe === s.id ? 'var(--acc)' : 'var(--border)'}`,
                    color: sexe === s.id ? 'var(--acc-txt)' : 'var(--txt-sub)',
                    transition: 'all 0.15s',
                  }}>
                    {lang === 'fr' ? s.fr : s.en}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>{t('Taille (cm)', 'Height (cm)')} *</label>
                <input
                  type="number" value={taille}
                  onChange={e => setTaille(e.target.value)}
                  placeholder="175"
                  min="100" max="250"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--acc)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <div>
                <label style={labelStyle}>{t('Poids (kg)', 'Weight (kg)')} *</label>
                <input
                  type="number" value={poids}
                  onChange={e => setPoids(e.target.value)}
                  placeholder="75"
                  min="30" max="300"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--acc)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>
            {error && <p style={{ fontSize: 13, color: 'var(--err)', textAlign: 'center' }}>{error}</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button onClick={() => { setStep(0); setError('') }} style={{
                flex: 1, background: 'var(--surface-up)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '14px', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: 'var(--txt-sub)',
              }}>
                ←
              </button>
              <button onClick={handleNext} style={{
                flex: 3, background: 'var(--acc)', border: 'none', borderRadius: 14,
                padding: '14px', cursor: 'pointer',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 20, letterSpacing: '0.05em', color: 'var(--txt-inv)',
              }}>
                {t('Continuer', 'Continue')} →
              </button>
            </div>
          </div>
        )}

        {/* ── SIGNUP ÉTAPE 2 — Objectif ── */}
        {mode === 'signup' && step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>{t('Objectif', 'Goal')} *</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {GOALS.map(g => {
                  const IC = Icons[g.icon] || Icons.bolt
                  return (
                    <button key={g.id} onClick={() => setGoal(g.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '13px 16px', borderRadius: 14, cursor: 'pointer',
                      fontFamily: 'inherit', textAlign: 'left',
                      background: goal === g.id ? 'var(--acc-dim)' : 'var(--surface-up)',
                      border: `1.5px solid ${goal === g.id ? 'var(--acc)' : 'var(--border)'}`,
                      color: goal === g.id ? 'var(--acc-txt)' : 'var(--txt)',
                      transition: 'all 0.15s',
                    }}>
                      <IC size={18} color={goal === g.id ? 'var(--acc-txt)' : 'var(--txt-sub)'} />
                      <span style={{ fontWeight: 600, fontSize: 14 }}>
                        {lang === 'fr' ? g.fr : g.en}
                      </span>
                      {goal === g.id && <Icons.check size={16} color="var(--acc-txt)" style={{ marginLeft: 'auto' }} />}
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('Niveau', 'Level')} *</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {LEVELS.map(l => (
                  <button key={l.id} onClick={() => setLevel(l.id)} style={{
                    flex: 1, padding: '11px 6px', borderRadius: 12, cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
                    background: level === l.id ? 'var(--acc-dim)' : 'var(--surface-up)',
                    border: `1.5px solid ${level === l.id ? 'var(--acc)' : 'var(--border)'}`,
                    color: level === l.id ? 'var(--acc-txt)' : 'var(--txt-sub)',
                    transition: 'all 0.15s',
                  }}>
                    {lang === 'fr' ? l.fr : l.en}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('Séances / semaine', 'Sessions / week')}</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {FREQ.map(f => (
                  <button key={f} onClick={() => setFreq(f)} style={{
                    flex: 1, padding: '11px 4px', borderRadius: 12, cursor: 'pointer',
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: 18,
                    background: freq === f ? 'var(--acc-dim)' : 'var(--surface-up)',
                    border: `1.5px solid ${freq === f ? 'var(--acc)' : 'var(--border)'}`,
                    color: freq === f ? 'var(--acc-txt)' : 'var(--txt-sub)',
                    transition: 'all 0.15s',
                  }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            {error && <p style={{ fontSize: 13, color: 'var(--err)', textAlign: 'center' }}>{error}</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button onClick={() => { setStep(1); setError('') }} style={{
                flex: 1, background: 'var(--surface-up)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '14px', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: 'var(--txt-sub)',
              }}>
                ←
              </button>
              <button onClick={handleSignup} disabled={loading} style={{
                flex: 3, background: 'var(--acc)', border: 'none', borderRadius: 14,
                padding: '14px', cursor: loading ? 'wait' : 'pointer',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 20, letterSpacing: '0.05em', color: 'var(--txt-inv)',
                opacity: loading ? 0.7 : 1,
              }}>
                {loading ? '...' : t("C'est parti ✦", "Let's go ✦")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
