/**
 * User Routes for the Personal Website backend
 * Defines all API endpoints related to user authentication and user management
 * Includes registration, login, and user profile access
 */

const express = require("express");
const router = express.Router();

// Import user controller functions
const { registerUser, loginUser, getMe } = require("../controllers/userController");

// Import authentication middleware
const { protect } = require("../middleware/authMiddleware");

/**
 * Public Routes - No authentication required
 */

// POST /api/users - Register a new user account
router.post('/', registerUser)

// POST /api/users/login - Login user and get JWT token
router.post('/login', loginUser)

/**
 * Protected Routes - Authentication required
 */

// GET /api/users/me - Get current authenticated user's data
router.get('/me', protect, getMe)

// POST /api/users/change-password - Change password for authenticated user
router.post('/change-password', protect, require('../controllers/userController').changePassword)

module.exports = router;