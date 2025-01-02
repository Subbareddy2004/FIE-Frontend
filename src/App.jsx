import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ManagerLogin from './pages/ManagerLogin'
import ManagerRegister from './pages/ManagerRegister'
import ManagerDashboard from './pages/ManagerDashboard'
import CreateEvent from './pages/CreateEvent'
import ManagerEventDetails from './pages/ManagerEventDetails'
import StudentEventDetails from './pages/StudentEventDetails'
import RegisterTeam from './pages/RegisterTeam'
import EventTeams from './pages/EventTeams'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manager/login" element={<ManagerLogin />} />
            <Route path="/manager/register" element={<ManagerRegister />} />
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/manager/create-event" element={<CreateEvent />} />
            <Route path="/manager/events/:id" element={<ManagerEventDetails />} />
            <Route path="/manager/events/:id/teams" element={<EventTeams />} />
            <Route path="/event/:id" element={<StudentEventDetails />} />
            <Route path="/register-team/:eventId" element={<RegisterTeam />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
