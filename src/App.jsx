import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route,
  createRoutesFromElements
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import Events from './pages/Events';
import About from './pages/About';
import Contact from './pages/Contact';
import ManagerLogin from './pages/ManagerLogin';
import ManagerRegister from './pages/ManagerRegister';
import ManagerDashboard from './pages/ManagerDashboard';
import CreateEvent from './pages/CreateEvent';
import ManagerEventDetails from './pages/ManagerEventDetails';
import EventTeams from './pages/EventTeams';
import EditEvent from './pages/EditEvent';
import PublicEventView from './pages/PublicEventView';
import RegistrationSuccess from './pages/RegistrationSuccess';
import TeamDetails from './pages/TeamDetails';
import RegisterTeam from './pages/RegisterTeam';
import StudentLogin from './components/student/StudentLogin';
import StudentRegister from './components/student/StudentRegister';
import StudentDashboard from './components/student/StudentDashboard';
import StudentRegisteredEvents from './components/student/StudentRegisteredEvents';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            <Navbar />
            <Toaster position="top-right" />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/public/:shareLink" element={<PublicEventView />} />
              <Route path="/register/:eventId" element={<RegisterTeam />} />
              <Route path="/registration-success/:eventId" element={<RegistrationSuccess />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/manager/login" element={<ManagerLogin />} />
              <Route path="/login" element={<ManagerLogin />} />
              <Route path="/manager/register" element={<ManagerRegister />} />
              <Route path="/student/login" element={<StudentLogin />} />
              <Route path="/student/register" element={<StudentRegister />} />
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/registered"
                element={
                  <ProtectedRoute>
                    <StudentRegisteredEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/dashboard"
                element={
                  <ProtectedRoute>
                    <ManagerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events/create"
                element={
                  <ProtectedRoute>
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events/:id"
                element={
                  <ProtectedRoute>
                    <ManagerEventDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events/:id/teams"
                element={
                  <ProtectedRoute>
                    <EventTeams />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/teams/:teamId"
                element={
                  <ProtectedRoute>
                    <TeamDetails />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
