import { Navigate, useLocation } from 'react-router-dom'
import { getCurrentUser, getToken, hasRole } from '../../services/auth'

function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation()
  const token = getToken()
  const user = getCurrentUser()

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!hasRole(allowedRoles)) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />
    }

    if (user.role === 'organizer') {
      return <Navigate to="/organizer" replace />
    }

    return <Navigate to="/home" replace />
  }

  return children
}

export default ProtectedRoute