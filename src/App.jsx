import { useEffect, useState } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { LangProvider } from './contexts/LangContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProfileProvider, useProfile } from './contexts/ProfileContext'
import { WorkoutProvider } from './contexts/WorkoutContext'
import { SubscriptionProvider, useSubscription } from './contexts/SubscriptionContext'
import SplashPage from './pages/SplashPage'
import LangPickerPage from './pages/LangPickerPage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import GeneratePage from './pages/GeneratePage'
import WorkoutPage from './pages/WorkoutPage'
import ProfilePage from './pages/ProfilePage'
import CustomWorkoutPage from './pages/CustomWorkoutPage'
import EraPlusPage from './pages/EraPlusPage'
import EraWelcomePage from './pages/EraWelcomePage'
import StatsPage from './pages/StatsPage'
import ProgramsPage from './pages/ProgramsPage'

function Router() {
  const { authed, loading: authLoading } = useAuth()
  const { hasProfile, loading: profLoading } = useProfile()
  const { needsWelcome, loading: subLoading, refresh } = useSubscription()

  const [screen,      setScreen]      = useState('splash')
  const [splashDone,  setSplashDone]  = useState(false)
  const [loadingDone, setLoadingDone] = useState(false)

  const langPicked = !!localStorage.getItem('athlera_lang')

  // Détecter retour Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('era_plus') === 'success') {
      window.history.replaceState({}, '', '/')
      setTimeout(() => refresh(), 2500)
    }
  }, [])

  // Attendre que tout soit chargé
  useEffect(() => {
    if (!authLoading && !profLoading && !subLoading) {
      setLoadingDone(true)
    }
  }, [authLoading, profLoading, subLoading])

  // ✅ FIX SESSION : Si déjà connecté au chargement → skip la splash
  useEffect(() => {
    if (!loadingDone) return
    if (authed && hasProfile) {
      setSplashDone(true)
    }
  }, [loadingDone])

  // Routing principal
  useEffect(() => {
    if (!splashDone || !loadingDone) return
    if (!langPicked) {
      setScreen('langpicker')
      return
    }
    if (!authed) {
      setScreen('auth')
      return
    }
    if (!hasProfile) {
      setScreen('auth')
      return
    }
    if (needsWelcome) {
      setScreen('erawelcome')
      return
    }
    setScreen('dashboard')
  }, [splashDone, loadingDone, authed, hasProfile, langPicked, needsWelcome])

  const navigate = (dest) => setScreen(dest)

  if (screen === 'splash') {
    return <SplashPage onDone={() => setSplashDone(true)} />
  }
  if (screen === 'langpicker') {
    return <LangPickerPage onDone={() => navigate('auth')} />
  }
  if (screen === 'auth') {
    return <AuthPage onDone={() => navigate('dashboard')} />
  }
  if (screen === 'erawelcome') {
    return <EraWelcomePage onDone={() => navigate('dashboard')} />
  }
  if (screen === 'dashboard') {
    return <DashboardPage onNavigate={navigate} />
  }
  if (screen === 'generate') {
    return (
      <GeneratePage
        onDone={() => navigate('workout')}
        onBack={() => navigate('dashboard')}
      />
    )
  }
  if (screen === 'workout') {
    return (
      <WorkoutPage
        onBack={() => navigate('dashboard')}
        onNew={() => navigate('generate')}
      />
    )
  }
  if (screen === 'profile') {
    return <ProfilePage onBack={() => navigate('dashboard')} />
  }
  if (screen === 'custom') {
    return (
      <CustomWorkoutPage
        onBack={() => navigate('dashboard')}
        onSaved={() => navigate('dashboard')}
      />
    )
  }
  if (screen === 'eraplus') {
    return <EraPlusPage onBack={() => navigate('dashboard')} />
  }
  if (screen === 'stats') {
    return (
      <StatsPage
        onBack={() => navigate('dashboard')}
        onUpgrade={() => navigate('eraplus')}
      />
    )
  }
  if (screen === 'programs') {
    return (
      <ProgramsPage
        onBack={() => navigate('dashboard')}
        onUpgrade={() => navigate('eraplus')}
      />
    )
  }
  return null
}

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <AuthProvider>
          <ProfileProvider>
            <WorkoutProvider>
              <SubscriptionProvider>
                <Router />
              </SubscriptionProvider>
            </WorkoutProvider>
          </ProfileProvider>
        </AuthProvider>
      </LangProvider>
    </ThemeProvider>
  )
}
