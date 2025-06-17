/**
 * Skill Controller for the Personal Website backend
 * Handles all skill-related CRUD operations
 * Manages both public skills display and private skill management
 */

// Import required dependencies
const asyncHandler = require('express-async-handler')  // Wrapper for async functions to handle errors
const Skill = require('../models/skillModel')         // Skill model for database operations
const User = require('../models/userModel')           // User model for authorization checks

/**
 * Get all skills
 * @desc Retrieves all skills sorted by category and name
 * @route GET /api/skills
 * @access Public
 */
const getAllSkills = asyncHandler(async (req, res) => {
    const skills = await Skill.find().sort({ category: 1, name: 1 })
    res.status(200).json(skills)
})

/**
 * Get skills by category
 * @desc Retrieves all skills in a specific category
 * @route GET /api/skills/category/:category
 * @access Public
 */
const getSkillsByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params
    const skills = await Skill.find({ category }).sort({ name: 1 })
    res.status(200).json(skills)
})

/**
 * Add a new skill
 * @desc Creates a new skill with duplicate checking
 * @route POST /api/skills
 * @access Private (requires authentication)
 */
const addSkill = asyncHandler(async (req, res) => {
    const { name, category } = req.body

    // Validate required fields
    if (!name || !category) {
        res.status(400)
        throw new Error('Please add name and category fields')
    }

    // Check if skill already exists in the category
    const existingSkill = await Skill.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        category 
    })

    if (existingSkill) {
        res.status(400)
        throw new Error(`Skill '${name}' already exists in the ${category} category`)
    }

    // Create new skill
    const skill = await Skill.create({
        name,
        category,
        user: req.user.id  // Associate with authenticated user
    })

    res.status(201).json(skill)
})

/**
 * Update a skill
 * @desc Modifies an existing skill's name or category
 * @route PUT /api/skills/:id
 * @access Private (requires authentication and ownership)
 */
const updateSkill = asyncHandler(async (req, res) => {
    // Find the skill by ID
    const skill = await Skill.findById(req.params.id)

    // Check if skill exists
    if (!skill) {
        res.status(400)
        throw new Error('Skill not found')
    }

    // Find the authenticated user
    const user = await User.findById(req.user.id)

    // Verify user exists
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Verify that the authenticated user owns this skill
    if (skill.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    // Check if skill already exists with new name and category
    const existingSkill = await Skill.findOne({ 
        name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
        category: req.body.category,
        _id: { $ne: req.params.id }
    })

    if (existingSkill) {
        res.status(400)
        throw new Error(`Skill '${req.body.name}' already exists in the ${req.body.category} category`)
    }

    // Update the skill with new data and return the updated version
    const updatedSkill = await Skill.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )

    res.status(200).json(updatedSkill)
})

/**
 * Delete a skill
 * @desc Deletes a skill if the user owns it
 * @route DELETE /api/skills/:id
 * @access Private (requires authentication and ownership)
 */
const deleteSkill = asyncHandler(async (req, res) => {
    // Find the skill by ID
    const skill = await Skill.findById(req.params.id)

    // Check if skill exists
    if (!skill) {
        res.status(400)
        throw new Error('Skill not found')
    }

    // Find the authenticated user
    const user = await User.findById(req.user.id)

    // Verify user exists
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Verify that the authenticated user owns this skill
    if (skill.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    // Delete the skill from the database
    await skill.deleteOne()

    // Return confirmation with the deleted skill ID
    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getAllSkills,
    getSkillsByCategory,
    addSkill,
    updateSkill,
    deleteSkill,
} 