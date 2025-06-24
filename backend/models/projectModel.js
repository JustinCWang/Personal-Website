/**
 * Project Model for the Personal Website backend
 * Defines the MongoDB schema for project documents
 * Includes fields for project details, technologies, time frame, and user relationships
 * Extended with blog-like fields for detailed project content
 */

const mongoose = require('mongoose')

/**
 * Project Schema Definition
 * @desc Defines the structure of project documents in MongoDB
 * @fields user, title, description, technologies, githubUrl, demoUrl, status, featured, startDate, endDate
 * @fields detailedContent, images, challenges, learnings, futurePlans, tags
 */
const projectSchema = mongoose.Schema({
    // Reference to the user who owns this project
    user: {
        type: mongoose.Schema.Types.ObjectId,  // MongoDB ObjectId reference
        required: true,                        // User must be specified
        ref: 'User'                           // Reference to User model
    },
    
    // Project title - required field
    title: {
        type: String,
        required: [true, 'Please add a project title']
    },
    
    // Project description - required field
    description: {
        type: String,
        required: [true, 'Please add a project description']
    },
    
    // Array of technologies used in the project
    technologies: {
        type: [String],    // Array of strings
        default: []        // Default to empty array if not provided
    },
    
    // GitHub repository URL (optional)
    githubUrl: {
        type: String,
        default: ''        // Default to empty string
    },
    
    // Live demo URL (optional)
    demoUrl: {
        type: String,
        default: ''        // Default to empty string
    },
    
    // Project development status
    status: {
        type: String,
        enum: ['Planning', 'In Progress', 'Completed', 'On Hold'],  // Only allow these values
        default: 'Planning'  // Default status for new projects
    },
    
    // Whether this project should be featured on the landing page
    featured: {
        type: Boolean,
        default: false     // Default to not featured
    },
    
    // Project start date (month and year)
    startDate: {
        type: Date,
        required: [true, 'Please add a start date']
    },
    
    // Project end date (month and year) - optional for ongoing projects
    endDate: {
        type: Date,
        default: null      // Default to null for ongoing projects
    },

    // Blog-like detailed content fields
    detailedContent: {
        type: String,
        default: ''        // Rich text content for detailed project description
    },

    // Array of image URLs for the project
    images: {
        type: [String],    // Array of image URLs
        default: []        // Default to empty array
    },

    // Project challenges and solutions
    challenges: {
        type: String,
        default: ''        // Text describing challenges faced and how they were solved
    },

    // Key learnings from the project
    learnings: {
        type: String,
        default: ''        // Text describing what was learned from the project
    },

    // Future plans for the project
    futurePlans: {
        type: String,
        default: ''        // Text describing future development plans
    },

    // Additional tags for categorization
    tags: {
        type: [String],    // Array of tag strings
        default: []        // Default to empty array
    },

    // Project complexity level
    complexity: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'Intermediate'
    },

    // Estimated time to complete (in hours)
    estimatedHours: {
        type: Number,
        default: null
    },

    // Team size (1 for solo projects)
    teamSize: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true  // Automatically add createdAt and updatedAt fields
})

// Export the Project model based on the schema
module.exports = mongoose.model('Project', projectSchema)