/**
 * Project Controller for the Personal Website backend
 * Handles all project-related CRUD operations
 * Manages both public featured projects and private user projects
 */

// Import required dependencies
const asyncHandler = require('express-async-handler')  // Wrapper for async functions to handle errors
const Project = require('../models/projectModel')      // Project model for database operations
const User = require('../models/userModel')            // User model for authorization checks

/**
 * Get featured projects for public display
 * @desc Retrieves all projects marked as featured for the landing page
 * @route GET /api/projects/featured
 * @access Public
 */
const getFeaturedProjects = asyncHandler(async (req, res) => {
    // Fetch projects marked as featured, populate user name, exclude user field from response
    const featuredProjects = await Project.find({ featured: true })
        .populate('user', 'name')    // Populate user field with only the name
        .select('-user')             // Remove user field from response for security
        .sort({ updatedAt: -1 })     // Sort by most recently updated first

    // Return the featured projects array
    res.status(200).json(featuredProjects)
})

/**
 * Get all projects for authenticated user
 * @desc Retrieves all projects belonging to the authenticated user
 * @route GET /api/projects
 * @access Private (requires authentication)
 */
const getProjects = asyncHandler(async (req, res) => {
    // Find all projects belonging to the authenticated user
    const projects = await Project.find({ user: req.user.id })

    // Return user's projects
    res.status(200).json(projects)
})

/**
 * Create a new project
 * @desc Creates a new project for the authenticated user
 * @route POST /api/projects
 * @access Private (requires authentication)
 */
const setProject = asyncHandler(async (req, res) => {
    // Validate required fields
    if (!req.body || !req.body.title || !req.body.description || !req.body.startDate) {
        res.status(400)
        throw new Error('Please add title, description, and start date fields')
    }

    // Create new project with provided data and authenticated user ID
    const project = await Project.create({
        title: req.body.title,
        description: req.body.description,
        technologies: req.body.technologies || [],    // Default to empty array if not provided
        githubUrl: req.body.githubUrl || '',          // Default to empty string if not provided
        demoUrl: req.body.demoUrl || '',              // Default to empty string if not provided
        status: req.body.status || 'Planning',        // Default to 'Planning' status
        featured: req.body.featured || false,         // Default to not featured
        startDate: req.body.startDate,                // Project start date
        endDate: req.body.endDate || null,            // Project end date (optional)
        user: req.user.id                             // Associate with authenticated user
    })

    // Return the newly created project
    res.status(200).json(project)
})

/**
 * Update an existing project
 * @desc Updates a project if the user owns it
 * @route PUT /api/projects/:id
 * @access Private (requires authentication and ownership)
 */
const updateProject = asyncHandler(async (req, res) => {
    // Find the project by ID
    const project = await Project.findById(req.params.id)

    // Check if project exists
    if (!project) {
        res.status(400)
        throw new Error('Project not found')
    }

    // Find the authenticated user
    const user = await User.findById(req.user.id)

    // Verify user exists
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Verify that the authenticated user owns this project
    if (project.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    // Update the project with new data and return the updated version
    const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,      // Project ID to update
        req.body,           // New data from request body
        { new: true }       // Return the updated document
    )

    // Return the updated project
    res.status(200).json(updatedProject)
})

/**
 * Delete a project
 * @desc Deletes a project if the user owns it
 * @route DELETE /api/projects/:id
 * @access Private (requires authentication and ownership)
 */
const deleteProject = asyncHandler(async (req, res) => {
    // Find the project by ID
    const project = await Project.findById(req.params.id)

    // Check if project exists
    if (!project) {
        res.status(400)
        throw new Error('Project not found')
    }

    // Find the authenticated user
    const user = await User.findById(req.user.id)

    // Verify user exists
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Verify that the authenticated user owns this project
    if (project.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    // Delete the project from the database
    await project.deleteOne()

    // Return confirmation with the deleted project ID
    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getFeaturedProjects,
    getProjects,
    setProject,
    updateProject,
    deleteProject,
}