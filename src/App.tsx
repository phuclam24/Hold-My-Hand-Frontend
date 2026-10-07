import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import PortalLayout from './components/layout/PortalLayout'
import AdminLayout from './components/layout/Layout'
import { LandingHome, PortalHome, PortalProfile, PortalHistory, PortalLobby } from './pages/portal'
import AdminDashboard from './pages/admin/Dashboard'
import AccountManagement from './pages/admin/AccountManagement'
import AuditLogs from './pages/admin/AuditLogs'
import ActiveRooms from './pages/admin/ActiveRooms'
import ModDashboard from './pages/moderator/Dashboard'
import CharacterStats from './pages/moderator/CharacterStats'
import ChapterManagement from './pages/moderator/ChapterManagement'
import QuestManagement from './pages/moderator/QuestManagement'

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode
  allowedRoles?: string[]
}) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Route theo role về trang phù hợp
    if (user.role === 'Admin') return <Navigate to="/admin" replace />
    if (user.role === 'Moderator') return <Navigate to="/moderator" replace />
    return <Navigate to="/portal" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <Routes>
      {/* Public Game Portal Homepage */}
      <Route path="/" element={<LandingHome />} />

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Web Portal - Player */}
      <Route
        path="/portal"
        element={
          <ProtectedRoute allowedRoles={['Player']}>
            <PortalLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PortalHome />} />
        <Route path="profile" element={<PortalProfile />} />
        <Route path="history" element={<PortalHistory />} />
        <Route path="lobby" element={<PortalLobby />} />
      </Route>

      {/* Admin Panel */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="accounts" element={<AccountManagement />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="rooms" element={<ActiveRooms />} />
      </Route>

      {/* Moderator Panel */}
      <Route
        path="/moderator"
        element={
          <ProtectedRoute allowedRoles={['Moderator']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ModDashboard />} />
        <Route path="characters" element={<CharacterStats />} />
        <Route path="chapters" element={<ChapterManagement />} />
        <Route path="quests" element={<QuestManagement />} />
      </Route>

      {/* Fallback to homepage */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

