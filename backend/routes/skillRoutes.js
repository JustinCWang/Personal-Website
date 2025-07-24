/**
 * Skill Routes for the Personal Website backend
 * Defines all API endpoints related to skill CRUD operations
 * Includes both public and protected routes
 */

const express = require('express')
const router = express.Router()

// Import skill controller functions
const { 
    getAllSkills,
    getSkillsByCategory,
    addSkill,
    updateSkill,
    deleteSkill,
    getMySkills
} = require('../controllers/skillController')

// Import authentication middleware
const { protect } = require('../middleware/authMiddleware')

/**
 * Public Routes - No authentication required
 */

// GET /api/skills - Get all skills for public display
// GET /api/skills/category/:category - Get skills by category for public display
router.get('/', getAllSkills)
router.get('/category/:category', getSkillsByCategory)

/**
 * Protected Routes - Authentication required
 */

// POST /api/skills - Create a new skill for authenticated user
router.post('/', protect, addSkill)

// PUT /api/skills/:id - Update specific skill (user must own the skill)
// DELETE /api/skills/:id - Delete specific skill (user must own the skill)
router.route('/:id').put(protect, updateSkill).delete(protect, deleteSkill)

// GET /api/skills/me - Get skills for authenticated user
router.get('/me', protect, getMySkills)

module.exports = router 