/**
 * User Controller for the Personal Website backend
 * Handles user authentication, registration, and user data management
 * Manages JWT token generation and password hashing
 */

// Import required dependencies
const jwt = require('jsonwebtoken')                    // JSON Web Token library for token generation
const bcrypt = require('bcryptjs')                     // Password hashing library
const asyncHandler = require('express-async-handler')  // Wrapper for async functions to handle errors
const User = require('../models/userModel')            // User model for database operations

/**
 * Register a new user
 * @desc Creates a new user account with hashed password
 * @route POST /api/users
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
    // Extract user data from request body
    const { name, email, password } = req.body

    // Validate that all required fields are provided
    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    // Check if user already exists with this email
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    // Generate salt and hash the password for security
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user in the database
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    // If user creation successful, return user data with JWT token
    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)  // Generate JWT token for authentication
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

/**
 * Authenticate a user (login)
 * @desc Validates user credentials and returns JWT token
 * @route POST /api/users/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
    // Extract login credentials from request body
    const { email, password } = req.body

    // Find user by email in the database
    const user = await User.findOne({ email })

    // Verify user exists and password matches
    if (user && (await bcrypt.compare(password, user.password))) {
        // Return user data with JWT token if authentication successful
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)  // Generate JWT token for authentication
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

/**
 * Get current user data
 * @desc Returns authenticated user's information
 * @route GET /api/users/me
 * @access Private (requires authentication)
 */
const getMe = asyncHandler(async (req, res) => {
    // Extract user data from authenticated user (set by auth middleware)
    const {_id, name, email} = await User.findById(req.user.id)

    // Return user data (excluding password)
    res.status(200).json({
        id: _id,
        name,
        email
    })
})  

/**
 * Generate JWT token for user authentication
 * @desc Creates a signed JWT token with user ID
 * @param {string} id - User ID to include in token
 * @returns {string} Signed JWT token valid for 30 days
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',  // Token expires in 30 days
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe
}