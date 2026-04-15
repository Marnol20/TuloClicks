import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Styles
import './styles/App.css'
import './styles/Index.css'

// Components
import ProtectedRoute from './components/common/ProtectedRoute'

// Layouts
import AdminLayout from './components/layouts/AdminLayout'
import OrganizerLayout from './components/layouts/OrganizerLayout'
import UserLayout from './components/layouts/UserLayout'

// Auth
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import OrganizerApprovals from './pages/admin/OrganizerApprovals'
import EventApprovals from './pages/admin/EventApprovals'
import Venues from './pages/admin/Venues'
import Payments from './pages/admin/Payments'
import SupportIssues from './pages/admin/SupportIssues'
import Categories from './pages/admin/Categories'
import Reports from './pages/admin/Reports'
import ActivityLogs from './pages/admin/ActivityLogs'

// Organizer Pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard'
import OrganizerEvents from './pages/organizer/OrganizerEvents'
import OrganizerSpeakers from './pages/organizer/OrganizerSpeakers'
import OrganizerTickets from './pages/organizer/OrganizerTickets'
import OrganizerBookings from './pages/organizer/OrganizerBookings'
import OrganizerScanQR from './pages/organizer/OrganizerScanQR'

// User Pages
import Home from './pages/user/Home'
import BrowseEvents from './pages/user/BrowseEvents'
import EventDetails from './pages/user/EventDetails'
import MyTickets from './pages/user/MyTickets'
import ApplyOrganizer from './pages/user/ApplyOrganizer'
import BookingDetails from './pages/user/BookingDetails'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* User Routes */}
        <Route path="/home" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="events" element={<BrowseEvents />} />
          <Route path="events/:id" element={<EventDetails />} />

          <Route
            path="tickets"
            element={
              <ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}>
                <MyTickets />
              </ProtectedRoute>
            }
          />

          <Route
            path="tickets/:id"
            element={
              <ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}>
                <BookingDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="apply-organizer"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <ApplyOrganizer />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="organizers" element={<OrganizerApprovals />} />
          <Route path="events" element={<EventApprovals />} />
          <Route path="categories" element={<Categories />} />
          <Route path="venues" element={<Venues />} />
          <Route path="payments" element={<Payments />} />
          <Route path="support" element={<SupportIssues />} />
          <Route path="reports" element={<Reports />} />
          <Route path="activity-logs" element={<ActivityLogs />} />
        </Route>

        {/* Organizer Routes */}
        <Route
          path="/organizer"
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <OrganizerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OrganizerDashboard />} />
          <Route path="events" element={<OrganizerEvents />} />
          <Route path="speakers" element={<OrganizerSpeakers />} />
          <Route path="tickets" element={<OrganizerTickets />} />
          <Route path="bookings" element={<OrganizerBookings />} />
          <Route path="scan-qr" element={<OrganizerScanQR />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App