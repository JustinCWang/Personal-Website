/**
 * Main server file for the Personal Website backend
 * Sets up Express server with middleware, routes, and database connection
 */

// Import required dependencies
const express = require("express")           // Web framework for Node.js
const cors = require("cors")                 // Middleware for Cross-Origin Resource Sharing
const colors = require('colors')             // Console output coloring
const dotenv = require("dotenv").config()   // Environment variable configuration
const { errorHandler } = require('./middleware/errorMiddleware')  // Custom error handling middleware
const connectDB = require('./config/db')    // Database connection configuration
const port = process.env.PORT || 5000       // Server port from environment or default 5000

// Connect to MongoDB database
connectDB()

// Initialize Express application
const app = express()

/**
 * MIDDLEWARE CONFIGURATION
 */

// CORS configuration - allows frontend to communicate with backend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow frontend origins (Vite dev server and Create React App)
  credentials: true // Allow cookies/credentials to be sent with requests
}))

// Body parsing middleware - enables reading JSON and URL-encoded data from requests
app.use(express.json());                           // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies

/**
 * ROUTE HANDLERS
 */

// Project routes - handles CRUD operations for projects
app.use('/api/projects', require('./routes/projectRoutes'))

// User routes - handles user authentication and user-related operations
app.use('/api/users', require('./routes/userRoutes'))

/**
 * ERROR HANDLING MIDDLEWARE
 * Must be last middleware - catches and formats all errors
 */
app.use(errorHandler)

/**
 * START SERVER
 * Listen on specified port and log server status
 */
app.listen(port, () => console.log(`Server started on port ${port}`))
