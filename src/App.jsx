import { useEffect, useState } from 'react'
import { ThemeProvider }               from './contexts/ThemeContext'
import { LangProvider, useLang }       from './contexts/LangContext'
import { AuthProvider, useAuth }       from './contexts/AuthContext'
import { ProfileProvider, useProfile } from './contexts/ProfileContext'
import { WorkoutProvider }             from './contexts/WorkoutContext'
import SplashPage        from './pages/SplashPage'
import LangPickerPage    from './pages/LangPickerPage'
import AuthPage          from './pages/AuthPage'
import OnboardingPage    from './pages/OnboardingPage'
import DashboardPage     from './pages/DashboardPage'
import GeneratePage      from './pages/GeneratePage'
import WorkoutPage       from './pages/WorkoutPage'
import ProfilePage       from './pages/ProfilePage'
import CustomWorkoutPage from './pages/CustomWorkoutPage'

function Router() {
  const { authed, loading: authLoading } = useAuth()
  const { hasProfile, loading: profLoading } = useProfile()

  const [screen,     setScreen]     = useState('splash')
  const [splashDone, setSplashDone] = useState(false)

  // Langue choisie une seule fois sur ce device
  const [langPicked] = useState(
    () => !!localStorage.getItem('athlera_lang')
  )

  useEffect(() => {
    if (!splashDone) return
    // Langue jamais choisie → LangPicker (1 seule fois)
    if (!langPicked) { setScreen('langpicker'); return }
    // Auth en cours de chargement → attendre
    if (authLoading || profLoading) return
    // Pas connecté → Auth
    if (!authed) { setScreen('auth'); return }
    // Connecté sans profil → Onboarding
    if (!hasProfile) { setScreen('onboarding'); return }
    // Tout bon → Dashboard direct sans repasser par auth
    setScreen('dashboard')
  }, [splashDone, langPicked, authed, hasProfile, authLoading, profLoading])

  const navigate = (dest) => setScreen(dest)

  if (screen === 'splash')     return <SplashPage        onDone={() => setSplashDone(true)} />
  if (screen === 'langpicker') return <LangPickerPage    onDone={() => navigate('auth')} />
  if (screen === 'auth')       return <AuthPage          onDone={(needsOnboarding) => navigate(needsOnboarding ? 'onboarding' : 'dashboard')} />
  if (screen === 'onboarding') return <OnboardingPage    onDone={() => navigate('dashboard')} />
  if (screen === 'dashboard')  return <DashboardPage     onNavigate={navigate} />
  if (screen === 'generate')   return <GeneratePage      onDone={() => navigate('workout')} onBack={() => navigate('dashboard')} />
  if (screen === 'workout')    return <WorkoutPage       onBack={() => navigate('dashboard')} onNew={() => navigate('generate')} />
  if (screen === 'profile')    return <ProfilePage       onBack={() => navigate('dashboard')} />
  if (screen === 'custom')     return <CustomWorkoutPage onBack={() => navigate('dashboard')} onSaved={() => navigate('dashboard')} />
  return null
}

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <AuthProvider>
          <ProfileProvider>
            <WorkoutProvider>
              <Router />
            </WorkoutProvider>
          </ProfileProvider>
        </AuthProvider>
      </LangProvider>
    </ThemeProvider>
  )
}
  if (screen === 'splash')     return <SplashPage        onDone={() => setSplashDone(true)} />
  if (screen === 'langpicker') return <LangPickerPage    onDone={() => { setLangPicked(true); setScreen('auth') }} />
  if (screen === 'auth')       return <AuthPage          onDone={(needsOnboarding) => navigate(needsOnboarding ? 'onboarding' : 'dashboard')} />
  if (screen === 'onboarding') return <OnboardingPage    onDone={() => navigate('dashboard')} />
  if (screen === 'dashboard')  return <DashboardPage     onNavigate={navigate} />
  if (screen === 'generate')   return <GeneratePage      onDone={() => navigate('workout')} onBack={() => navigate('dashboard')} />
  if (screen === 'workout')    return <WorkoutPage       onBack={() => navigate('dashboard')} onNew={() => navigate('generate')} />
  if (screen === 'profile')    return <ProfilePage       onBack={() => navigate('dashboard')} />
  if (screen === 'custom')     return <CustomWorkoutPage onBack={() => navigate('dashboard')} onSaved={() => navigate('dashboard')} />
  return null
}

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <AuthProvider>
          <ProfileProvider>
            <WorkoutProvider>
              <Router />
            </WorkoutProvider>
          </ProfileProvider>
        </AuthProvider>
      </LangProvider>
    </ThemeProvider>
  )
}
