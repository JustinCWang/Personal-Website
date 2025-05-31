import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import GoalForm from './components/GoalForm'
import { goalsAPI, handleAPIError, type Goal } from './services/api'

const Dashboard = () => {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, logout } = useAuth()

  // Fetch goals from backend
  const fetchGoals = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await goalsAPI.getAll()
      setGoals(data)
    } catch (error) {
      setError(handleAPIError(error))
      console.error('Error fetching goals:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  const handleGoalCreated = (newGoal: Goal) => {
    setGoals(prevGoals => [newGoal, ...prevGoals])
  }

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await goalsAPI.delete(goalId)
      setGoals(prevGoals => prevGoals.filter(goal => goal._id !== goalId))
    } catch (error) {
      setError(handleAPIError(error))
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <nav className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-primary-600">My Goals Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-600">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Goal Creation Form */}
        <GoalForm onGoalCreated={handleGoalCreated} />

        {/* Goals Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-slate-800">Your Goals</h3>
            <button
              onClick={fetchGoals}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-slate-600">Loading goals...</p>
            </div>
          ) : error ? (
            <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600 font-semibold mb-4">Error: {error}</p>
              <button 
                onClick={fetchGoals}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.length > 0 ? (
                goals.map((goal) => (
                  <div key={goal._id} className="bg-slate-50 border-l-4 border-primary-600 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-slate-800 mb-2">{goal.title}</h4>
                        <p className="text-slate-600">{goal.description}</p>
                      </div>
                      <button
                        onClick={() => goal._id && handleDeleteGoal(goal._id)}
                        className="ml-4 text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete goal"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-slate-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-600 text-lg">No goals yet!</p>
                  <p className="text-slate-500 mt-2">Create your first goal using the form above.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <Dashboard /> : <Login />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
