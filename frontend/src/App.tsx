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
import NotesIndex from './pages/notes/NotesIndex.tsx'
import CalculusNote from './pages/notes/mathematics/CalculusNote.tsx'
import LinearAlgebraNote from './pages/notes/mathematics/LinearAlgebra.tsx'
import ProbabilityStatisticsNote from './pages/notes/mathematics/ProbabilityStatistics.tsx'
import FoundationsDataScienceNote from './pages/notes/mathematics/FoundationsDataScienceNote.tsx'
import DiscreteMathNote from './pages/notes/mathematics/DiscreteMath.tsx'
import IntroPythonNote from './pages/notes/programming-tools/IntroPythonNote.tsx'
import IntroJavaNote from './pages/notes/programming-tools/IntroJavaNote.tsx'
import CProgrammingNote from './pages/notes/programming-tools/CProgrammingNote.tsx'
import GoNote from './pages/notes/programming-tools/GoNote.tsx'
import OCamlNote from './pages/notes/programming-tools/OCamlNote.tsx'
import SQLNote from './pages/notes/programming-tools/SQLNote.tsx'
import WebFrameworksToolingNote from './pages/notes/programming-tools/WebFrameworksToolingNote.tsx'
import ProgrammingLanguagesNote from './pages/notes/computer-science/ProgrammingLanguagesNote.tsx'
import WebDevelopmentNote from './pages/notes/computer-science/WebDevelopmentNote.tsx'
import AlgorithmsNote from './pages/notes/computer-science/AlgorithmsNote.tsx'
import ArtificialIntelligenceNote from './pages/notes/computer-science/ArtificialIntelligenceNote.tsx'
import MachineLearningNote from './pages/notes/computer-science/MachineLearningNote.tsx'
import ComputerVisionNote from './pages/notes/computer-science/ComputerVisionNote.tsx'
import ComputerSystemsNote from './pages/notes/computer-science/ComputerSystemsNote.tsx'
import DatabaseSystemsNote from './pages/notes/computer-science/DatabaseSystemsNote.tsx'
import InformationSecurityNote from './pages/notes/computer-science/InformationSecurityNote.tsx'
import CryptographyNote from './pages/notes/computer-science/CryptographyNote.tsx'
import DistributedSystemsNote from './pages/notes/computer-science/DistributedSystemsNote.tsx'

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
      <div className={`min-h-screen transition-all duration-300 flex items-center justify-center ${isDarkMode ? 'page-bg-dark' : 'page-bg-light'
        }`}>
        <div className={`text-center ${isDarkMode ? 'text-primary-dark' : 'text-primary-light'
          }`}>
          <div className={`inline-block animate-spin rounded-full h-12 w-12 border-b-2 mb-4 ${isDarkMode ? 'spinner-dark' : 'spinner-light'
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

      {/* Notes Routes - Public access */}
      <Route path="/notes" element={<NotesIndex />} />
      <Route path="/notes/calculus" element={<CalculusNote />} />
      <Route path="/notes/linear-algebra" element={<LinearAlgebraNote />} />
      <Route path="/notes/probability-statistics" element={<ProbabilityStatisticsNote />} />
      <Route path="/notes/foundations-data-science" element={<FoundationsDataScienceNote />} />
      <Route path="/notes/discrete-math" element={<DiscreteMathNote />} />
      <Route path="/notes/intro-python" element={<IntroPythonNote />} />
      <Route path="/notes/intro-java" element={<IntroJavaNote />} />
      <Route path="/notes/c-programming" element={<CProgrammingNote />} />
      <Route path="/notes/go" element={<GoNote />} />
      <Route path="/notes/ocaml" element={<OCamlNote />} />
      <Route path="/notes/sql" element={<SQLNote />} />
      <Route path="/notes/web-frameworks-and-tooling" element={<WebFrameworksToolingNote />} />
      <Route path="/notes/programming-languages" element={<ProgrammingLanguagesNote />} />
      <Route path="/notes/web-development" element={<WebDevelopmentNote />} />
      <Route path="/notes/algorithms" element={<AlgorithmsNote />} />
      <Route path="/notes/artificial-intelligence" element={<ArtificialIntelligenceNote />} />
      <Route path="/notes/machine-learning" element={<MachineLearningNote />} />
      <Route path="/notes/computer-vision" element={<ComputerVisionNote />} />
      <Route path="/notes/computer-systems" element={<ComputerSystemsNote />} />
      <Route path="/notes/database-systems" element={<DatabaseSystemsNote />} />
      <Route path="/notes/information-security" element={<InformationSecurityNote />} />
      <Route path="/notes/cryptography" element={<CryptographyNote />} />
      <Route path="/notes/distributed-systems" element={<DistributedSystemsNote />} />

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
