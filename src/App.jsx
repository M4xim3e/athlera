import { useEffect, useState, lazy, Suspense } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { LangProvider } from './contexts/LangContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProfileProvider, useProfile } from './contexts/ProfileContext'
import { WorkoutProvider } from './contexts/WorkoutContext'
import { SubscriptionProvider } from './contexts/SubscriptionContext'
import SplashPage from './pages/SplashPage'
import LangPickerPage from './pages/LangPickerPage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import GeneratePage from './pages/GeneratePage'
import WorkoutPage from './pages/WorkoutPage'
import ProfilePage from './pages/ProfilePage'
import CustomWorkoutPage from './pages/CustomWorkoutPage'
import StatsPage from './pages/StatsPage'
import ProgramsPage from './pages/ProgramsPage'

function Router() {
  const { authed, loading: authLoading } = useAuth()
  const { hasProfile, loading: profLoading } = useProfile()

  const [screen, setScreen] = useState('splash')
  const langPicked = !!localStorage.getItem('athlera_lang')

  // Auth et profil sont maintenant synchrones depuis localStorage
  // On attend juste que les 2 soient resolved (= false = quasi-instantane)
  const ready = !authLoading && !profLoading

  useEffect(() => {
    if (!ready) return

    // Utilisateur connecte avec profil -> skip splash directement
    if (authed && hasProfile && screen === 'splash') {
      setScreen('dashboard')
      return
    }
  }, [ready])

  // Routing apres splash
  const handleSplashDone = () => {
    if (!langPicked) { setScreen('langpicker'); return }
    if (!authed || !hasProfile) { setScreen('auth'); return }
    setScreen('dashboard')
  }

  const navigate = (dest) => setScreen(dest)

  if (screen === 'splash') {
    return <SplashPage onDone={handleSplashDone} />
  }
  if (screen === 'langpicker') {
    return <LangPickerPage onDone={() => navigate('auth')} />
  }
  if (screen === 'auth') {
    return <AuthPage onDone={() => navigate('dashboard')} />
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
