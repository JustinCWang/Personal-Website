/**
 * Authentication middleware for the Personal Website backend
 * Handles JWT token verification and user authentication
 * Protects routes that require user authentication
 */

// Import required dependencies
const jwt = require('jsonwebtoken')                    // JSON Web Token library for token verification
const asyncHandler = require('express-async-handler')  // Wrapper for async functions to handle errors
const User = require('../models/userModel')            // User model for database operations

/**
 * Authentication middleware to protect routes
 * @desc Verifies JWT token and authenticates user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {Error} Throws error if token is invalid or missing
 * @access Middleware
 */
const protect = asyncHandler(async (req, res, next) => {
    let token

    // Check if authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from authorization header (format: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1]
            
            // Verify the JWT token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Fetch user data from database using the decoded token ID
            // Exclude password field from the returned user object
            req.user = await User.findById(decoded.id).select('-password')

            // Continue to the next middleware/route handler
            next()
        } catch (error) {
            // Log error for debugging purposes
            console.log(error)
            res.status(401)  // Set unauthorized status
            throw new Error('Not authorized')
        }
    }

    // If no token was provided in the authorization header
    if (!token) {
        res.status(401)  // Set unauthorized status
        throw new Error('Not authorized, no token')
    }
})

module.exports = { protect }