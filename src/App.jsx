import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

function App() {
  const [viewMode, setViewMode] = useState('admin') // 'admin' or 'user'

  const switchToUser = function() {
    setViewMode('user')
  }

  const switchToAdmin = function() {
    setViewMode('admin')
  }

  return (
    <BrowserRouter>
      {viewMode === 'user' ? (
        <UserView onSwitchToAdmin={switchToAdmin} />
      ) : (
        <div className="app-wrapper">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Dashboard onSwitchToUser={switchToUser} />} />
            <Route path="/events" element={<Events />} />
            <Route path="/speakers" element={<Speakers />} />
            <Route path="/attendees" element={<Attendees />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/events/:eventId" element={<EventDetails onBack={() => window.history.back()} />} />
          </Routes>
        </div>
      )}
    </BrowserRouter>
  )
}

export default App
