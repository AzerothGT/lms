import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './components/pages/LoginPage'
import Home from './components/pages/Home'
import DashboardLayout from './components/layouts/DashboardLayout'
import Dashboard from './components/pages/Dashboard'
import CourseCatalog from './components/pages/CourseCatalog'
import ComingSoon from './components/pages/ComingSoon'

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sf-bg font-sans text-sf-secondary-text">
        LOADING…
      </div>
    )
  }
  if (!user) return <Navigate to="/auth" replace />
  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<LoginPage />} />
          <Route
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<CourseCatalog />} />
            <Route path="/assignments" element={<ComingSoon title="ASSIGNMENTS" />} />
            <Route path="/reports" element={<ComingSoon title="REPORTS" />} />
            <Route path="/settings" element={<ComingSoon title="SETTINGS" />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
