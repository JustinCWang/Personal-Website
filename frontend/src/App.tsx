/**
 * Main Application Component for the Personal Website frontend
 * Handles routing, authentication, and the main dashboard functionality
 * Manages project CRUD operations and user interface
 */

// Import React dependencies and hooks
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'

// Import authentication context and components
import { AuthProvider } from './contexts/AuthContext.tsx'
import { useAuth } from './hooks/useAuth.ts'
import { useDarkMode } from './hooks/useDarkMode.ts'
import Login from './components/Login.tsx'
import Dashboard from './components/Dashboard.tsx'
import LandingPage from './components/LandingPage.tsx'

/**
 * App Content Component
 * @desc Manages routing and authentication state for the entire application
 * @returns {JSX.Element} Router-based content with authentication handling
 */
const AppContent = () => {
  // Get authentication state from context
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const { isDarkMode } = useDarkMode()

  /**
   * Handle successful login
   * @desc Redirects user to dashboard after successful authentication
   */
  const handleLoginSuccess = () => {
    navigate('/dashboard')
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className={`min-h-screen transition-all duration-300 flex items-center justify-center ${
        isDarkMode ? 'page-bg-dark' : 'page-bg-light'
      }`}>
        <div className={`text-center ${
          isDarkMode ? 'text-primary-dark' : 'text-primary-light'
        }`}>
          <div className={`inline-block animate-spin rounded-full h-12 w-12 border-b-2 mb-4 ${
            isDarkMode ? 'spinner-dark' : 'spinner-light'
          }`}></div>
          <p className="text-xl font-mono">Loading...</p>
        </div>
      </div>  
    )
  }

  return (
    <Routes>
      {/* Landing Page Route - Public access */}
      <Route 
        path="/" 
        element={
          <LandingPage 
            onLogin={() => navigate('/login')}  // Navigate to login when login button clicked
          />
        } 
      />
      
      {/* Login Route - Redirect to dashboard if already authenticated */}
      <Route 
        path="/login" 
        element={
          !isAuthenticated ? (
            <Login onLoginSuccess={handleLoginSuccess} />
          ) : (
            <Navigate to="/dashboard" replace />  // Redirect authenticated users to dashboard
          )
        } 
      />
      
      {/* Dashboard Route - Requires authentication */}
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated ? (
            <Dashboard />
          ) : (
            <Navigate to="/login" replace />  // Redirect unauthenticated users to login
          )
        } 
      />
    </Routes>
  )
}

/**
 * Main App Component
 * @desc Root component that provides authentication context and routing
 * @returns {JSX.Element} Complete application with routing and authentication
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
