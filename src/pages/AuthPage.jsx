// src/pages/AuthPage.jsx
import { useEffect, useState } from 'react'
import { useAuth }   from '../contexts/AuthContext'
import { useLang }   from '../contexts/LangContext'
import { getProfile } from '../services/userService'
import Icons  from '../components/ui/Icons'
import Button from '../components/ui/Button'
import Input  from '../components/ui/Input'

const validatePassword = (pass) => {
  if (pass.length < 8) return 'min8'
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass)) return 'needSpecial'
  return null
}

const PASS_ERRORS = {
  fr: {
    min8:       'Minimum 8 caractères.',
    needSpecial:'Au moins un caractère spécial requis (!@#$%...).',
  },
  en: {
    min8:       'Minimum 8 characters.',
    needSpecial:'At least one special character required (!@#$%...).',
  },
}

export default function AuthPage({ onDone }) {
  const { signIn, signUp, error, clearError } = useAuth()
  const { t, lang } = useLang()

  const [tab,     setTab]     = useState('login')
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [pass,    setPass]    = useState('')
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 40) }, [])

  const switchTab = (v) => {
    setTab(v); clearError(); setErrors({})
    setName(''); setEmail(''); setPass('')
  }

  const validate = () => {
    const e = {}
    if (tab === 'register' && !name.trim()) {
      e.name = lang === 'fr' ? 'Requis' : 'Required'
    }
    if (!email.includes('@')) {
      e.email = lang === 'fr' ? 'Email invalide' : 'Invalid email'
    }
    if (tab === 'register') {
      const passErr = validatePassword(pass)
      if (passErr) e.pass = PASS_ERRORS[lang]?.[passErr] || PASS_ERRORS.fr[passErr]
    } else {
      if (pass.length < 1) e.pass = lang === 'fr' ? 'Requis' : 'Required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) return
    setLoading(true)
    if (tab === 'login') {
      const res = await signIn(email, pass)
      if (res.ok) {
        const profile = await getProfile(res.userId)
        onDone(!profile?.goal)
      }
    } else {
      const res = await signUp(email, pass, name.trim())
      if (res.ok) onDone(true)
    }
    setLoading(false)
  }

  const getServerError = () => {
    if (!error) return null
    if (error === 'email_used') return lang === 'fr' ? 'Cette adresse email est déjà utilisée.' : 'This email is already in use.'
    if (error === 'auth_error') return lang === 'fr' ? 'Email ou mot de passe incorrect.' : 'Invalid email or password.'
    return lang === 'fr' ? 'Une erreur est survenue. Réessayez.' : 'An error occurred. Please try again.'
  }

  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--bg-base)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px 48px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -80, left: '50%',
        transform: 'translateX(-50%)',
        width: 400, height: 400,
        background: 'radial-gradient(ellipse, var(--acc-glo) 0%, transparent 68%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-16px)',
        transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{ background: 'var(--acc)', borderRadius: 14, padding: 9, display: 'flex' }}>
          <Icons.logo size={22} color="var(--txt-inv)" strokeWidth={2.2} />
        </div>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 28, color: 'var(--acc-txt)', letterSpacing: '0.05em',
        }}>
          ATHLERA
        </span>
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 420,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 24, overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.55s cubic-bezier(0.16,1,0.3,1) 0.1s',
      }}>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg-alt)', padding: 4, position: 'relative' }}>
          {[['login', t('signIn')], ['register', t('register')]].map(([v, lbl]) => (
            <button key={v} onClick={() => switchTab(v)} style={{
              flex: 1, padding: '11px 0',
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
              color: tab === v ? 'var(--txt)' : 'var(--txt-sub)',
              borderRadius: 10, position: 'relative', zIndex: 1,
              transition: 'color 0.15s',
            }}>
              {lbl}
            </button>
          ))}
          <div style={{
            position: 'absolute', top: 4, left: 4,
            width: 'calc(50% - 4px)', height: 'calc(100% - 8px)',
            background: 'var(--surface)', borderRadius: 10,
            boxShadow: 'var(--shd-sm)',
            transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1)',
            transform: tab === 'login' ? 'translateX(0)' : 'translateX(100%)',
          }} />
        </div>

        {/* Form */}
        <div key={tab} style={{
          padding: '28px 24px 26px',
          display: 'flex', flexDirection: 'column', gap: 16,
          animation: 'fadeUp 0.22s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 30, color: 'var(--txt)', lineHeight: 1.05,
            }}>
              {tab === 'login' ? t('welcome') : t('welcomeNew')}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--txt-sub)', marginTop: 4 }}>
              {t('authSub')}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tab === 'register' && (
              <Input label={t('nameLbl')} value={name} onChange={setName}
                placeholder="Alex" error={errors.name} autoComplete="given-name" />
            )}
            <Input label={t('emailLbl')} value={email} onChange={setEmail}
              type="email" placeholder="you@email.com" error={errors.email}
              autoComplete="email" />
            <div>
              <Input label={t('passLbl')} value={pass} onChange={setPass}
                type="password" placeholder="••••••••" error={errors.pass}
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'} />
              {tab === 'register' && !errors.pass && (
                <p style={{ fontSize: 11, color: 'var(--txt-muted)', marginTop: 6, lineHeight: 1.5 }}>
                  {lang === 'fr'
                    ? 'Minimum 8 caractères avec au moins un caractère spécial.'
                    : 'Minimum 8 characters with at least one special character.'}
                </p>
              )}
            </div>
          </div>

          {/* Erreur serveur */}
          {getServerError() && (
            <div style={{
              padding: '10px 14px',
              background: 'rgba(255,69,58,0.08)',
              borderRadius: 10, fontSize: 13, color: 'var(--err)',
              animation: 'fadeUp 0.2s',
            }}>
              {getServerError()}
            </div>
          )}

          <Button
            label={tab === 'login' ? t('signIn') : t('register')}
            full loading={loading} onClick={submit} size="lg"
          />

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--txt-sub)' }}>
            {tab === 'login' ? t('noAcc') : t('hasAcc')}{' '}
            <button onClick={() => switchTab(tab === 'login' ? 'register' : 'login')} style={{
              background: 'none', border: 'none',
              color: 'var(--acc-txt)', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
            }}>
              {tab === 'login' ? t('toReg') : t('toLog')}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
