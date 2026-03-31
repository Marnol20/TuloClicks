import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './styles/App.css'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Events from './components/Events'
import Speakers from './components/Speakers'
import Attendees from './components/Attendees'
import Venues from './components/Venues'
import Login from './components/Login'
import SignUp from './components/SignUp'
import UserView from './components/UserView'
import EventDetails from './components/EventDetails'

function ProtectedAdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'))

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/home" replace />
  }

  return children
}

function AuthRedirectRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'))

  if (!user) {
    return children
  }

  if (user.role === 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <Navigate to="/home" replace />
}

function AppRoutes() {
  const location = useLocation()

  const isAdminPage =
    location.pathname === '/dashboard' ||
    location.pathname === '/events' ||
    location.pathname === '/speakers' ||
    location.pathname === '/attendees' ||
    location.pathname === '/venues' ||
    location.pathname.startsWith('/events/')

  if (isAdminPage) {
    return (
      <ProtectedAdminRoute>
        <div className="app-wrapper">
          <Sidebar />
          <div className="app-content">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/events" element={<Events />} />
              <Route path="/speakers" element={<Speakers />} />
              <Route path="/attendees" element={<Attendees />} />
              <Route path="/venues" element={<Venues />} />
              <Route path="/events/:eventId" element={<EventDetails onBack={() => window.history.back()} />} />
            </Routes>
          </div>
        </div>
      </ProtectedAdminRoute>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthRedirectRoute>
            <Login />
          </AuthRedirectRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthRedirectRoute>
            <SignUp />
          </AuthRedirectRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/home/*" element={<UserView />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App