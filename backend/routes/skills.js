/**
 * Skills Routes
 * @desc Defines all routes for skill management
 * @module routes/skills
 */

const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/skills
 * @desc    Get all skills
 * @access  Public
 */
router.get('/', skillController.getAllSkills);

/**
 * @route   GET /api/skills/category/:category
 * @desc    Get skills by category
 * @access  Public
 */
router.get('/category/:category', skillController.getSkillsByCategory);

/**
 * @route   POST /api/skills
 * @desc    Add a new skill
 * @access  Private
 */
router.post('/', protect, skillController.addSkill);

/**
 * @route   DELETE /api/skills/:id
 * @desc    Delete a skill
 * @access  Private
 */
router.delete('/:id', protect, skillController.deleteSkill);

/**
 * @route   PUT /api/skills/:id
 * @desc    Update a skill
 * @access  Private
 */
router.put('/:id', protect, skillController.updateSkill);

module.exports = router; 