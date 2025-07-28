/**
 * Main server file for the Personal Website backend
 * Sets up Express server with middleware, routes, and database connection
 * Modified for Vercel serverless deployment
 */

// Import required dependencies
const express = require("express")           // Web framework for Node.js
const cors = require("cors")                 // Middleware for Cross-Origin Resource Sharing
const colors = require('colors')             // Console output coloring
const dotenv = require("dotenv").config()   // Environment variable configuration
const { errorHandler } = require('./middleware/errorMiddleware')  // Custom error handling middleware
const connectDB = require('./config/db')    // Database connection configuration

// Connect to MongoDB database
connectDB()

// Initialize Express application
const app = express()

/**
 * MIDDLEWARE CONFIGURATION
 */

// CORS configuration - allows frontend to communicate with backend
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
     // Add your Vercel domain here
  ],
  credentials: true // Allow cookies/credentials to be sent with requests
}))

// Body parsing middleware - enables reading JSON and URL-encoded data from requests
app.use(express.json());                           // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies

/**
 * ROUTE HANDLERS
 */

// Health check route for Vercel
app.get('/api', (req, res) => {
  res.json({ message: 'Personal Website API is running!' })
})

// Project routes - handles CRUD operations for projects
app.use('/api/projects', require('./routes/projectRoutes'))

// User routes - handles user authentication and user-related operations
app.use('/api/users', require('./routes/userRoutes'))

// Skills routes - handles CRUD operations for skills
app.use('/api/skills', require('./routes/skillRoutes'))

/**
 * ERROR HANDLING MIDDLEWARE
 * Must be last middleware - catches and formats all errors
 */
app.use(errorHandler)

/**
 * START SERVER OR EXPORT FOR VERCEL
 */
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000
  app.listen(port, () => console.log(`Server started on port ${port}`))
}

// Export app for Vercel serverless functions
module.exports = app
