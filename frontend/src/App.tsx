import { useState, useEffect } from 'react'
import { goalsAPI, handleAPIError, type Goal } from './services/api'
import './App.css'

function App() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    // You can uncomment this when your backend is ready
    // fetchGoals()
  }, [])

  return (
    <div className="app">
      <header className="header">
        <nav className="nav">
          <div className="nav-brand">
            <h2>Personal Website</h2>
          </div>
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#goals">Goals</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main className="main">
        <section id="hero" className="hero">
          <div className="hero-content">
            <h1>Welcome to My Personal Website</h1>
            <p>This is a clean, modern design ready for backend integration</p>
            <button className="cta-button" onClick={fetchGoals}>
              Load Goals from Backend
            </button>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container">
            <h2>About Me</h2>
            <p>This section can contain information about yourself.</p>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="container">
            <h2>Projects</h2>
            <div className="projects-grid">
              <div className="project-card">
                <h3>Project 1</h3>
                <p>Description of your project</p>
              </div>
              <div className="project-card">
                <h3>Project 2</h3>
                <p>Description of your project</p>
              </div>
            </div>
          </div>
        </section>

        <section id="goals" className="section">
          <div className="container">
            <h2>Goals</h2>
            {loading ? (
              <p>Loading goals...</p>
            ) : error ? (
              <div className="error-message">
                <p style={{ color: '#ef4444', fontWeight: 'bold' }}>Error: {error}</p>
                <button className="cta-button" onClick={fetchGoals} style={{ marginTop: '1rem' }}>
                  Try Again
                </button>
              </div>
            ) : (
              <div className="goals-list">
                {goals.length > 0 ? (
                  goals.map((goal, index) => (
                    <div key={index} className="goal-item">
                      <h4>{goal.title}</h4>
                      <p>{goal.description}</p>
                    </div>
                  ))
                ) : (
                  <p>No goals found. Make sure your backend is running!</p>
                )}
              </div>
            )}
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container">
            <h2>Contact</h2>
            <p>Get in touch with me.</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Personal Website. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
