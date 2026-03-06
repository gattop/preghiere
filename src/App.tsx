import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Layout } from './components/Layout'
import { useAuth } from './hooks/useAuth'

const HomePage      = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })))
const FolderPage    = lazy(() => import('./pages/FolderPage').then(m => ({ default: m.FolderPage })))
const PrayerPage    = lazy(() => import('./pages/PrayerPage').then(m => ({ default: m.PrayerPage })))
const RosarioPage   = lazy(() => import('./pages/RosarioPage').then(m => ({ default: m.RosarioPage })))
const VangeloPage   = lazy(() => import('./pages/VangeloPage').then(m => ({ default: m.VangeloPage })))
const LoginPage     = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })))
const ProfilePage   = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })))
const PreferitiPage = lazy(() => import('./pages/PreferitiPage').then(m => ({ default: m.PreferitiPage })))
const PropostaPage  = lazy(() => import('./pages/PropostaPage').then(m => ({ default: m.PropostaPage })))
const AdminPage     = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })))
const BiblePage     = lazy(() => import('./pages/BiblePage').then(m => ({ default: m.BiblePage })))

function LayoutWrapper() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default function App() {
  const { loading } = useAuth()
  if (loading) return <div className="spinner" style={{ marginTop: '4rem' }} />

  return (
    <Suspense fallback={<div className="spinner" style={{ marginTop: '4rem' }} />}>
      <Routes>
        {/* Full-screen page (no header/footer) */}
        <Route path="/rosario" element={<RosarioPage />} />

        {/* Standard layout */}
        <Route element={<LayoutWrapper />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cartella/:id" element={<FolderPage />} />
          <Route path="/cartella/*" element={<FolderPage />} />
          <Route path="/preghiera/:id" element={<PrayerPage />} />
          <Route path="/vangelo" element={<VangeloPage />} />
          <Route path="/bibbia" element={<BiblePage />} />
          <Route path="/accedi" element={<LoginPage />} />
          <Route path="/profilo" element={<ProfilePage />} />
          <Route path="/preferiti" element={<PreferitiPage />} />
          <Route path="/proposta" element={<PropostaPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
