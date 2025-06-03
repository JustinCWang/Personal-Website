/**
 * Project Routes for the Personal Website backend
 * Defines all API endpoints related to project CRUD operations
 * Includes both public and protected routes
 */

const express = require('express')
const router = express.Router()

// Import project controller functions
const { 
    getFeaturedProjects, 
    getProjects, 
    setProject, 
    updateProject, 
    deleteProject 
} = require('../controllers/projectController')

// Import authentication middleware
const { protect } = require('../middleware/authMiddleware')

/**
 * Public Routes - No authentication required
 */

// GET /api/projects/featured - Get featured projects for public display
router.get('/featured', getFeaturedProjects)

/**
 * Protected Routes - Authentication required
 */

// GET /api/projects - Get all projects for authenticated user
// POST /api/projects - Create a new project for authenticated user
router.route('/').get(protect, getProjects).post(protect, setProject)

// PUT /api/projects/:id - Update specific project (user must own the project)
// DELETE /api/projects/:id - Delete specific project (user must own the project)
router.route('/:id').put(protect, updateProject).delete(protect, deleteProject)

module.exports = router

