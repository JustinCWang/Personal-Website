const express = require('express')
const router = express.Router()
const { getFeaturedProjects, getProjects, setProject, updateProject, deleteProject } = require('../controllers/projectController')

const { protect } = require('../middleware/authMiddleware')

// Public route for featured projects
router.get('/featured', getFeaturedProjects)

// Protected routes
router.route('/').get(protect, getProjects).post(protect, setProject)
router.route('/:id').put(protect, updateProject).delete(protect, deleteProject)

module.exports = router

