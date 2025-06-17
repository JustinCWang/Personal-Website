/**
 * Skill Model for the Personal Website backend
 * Defines the MongoDB schema for skill documents
 * Includes fields for skill details and user relationships
 */

const mongoose = require('mongoose');

/**
 * Skill Schema Definition
 * @desc Defines the structure of skill documents in MongoDB
 * @fields user, name, category
 */
const skillSchema = mongoose.Schema({
    // Reference to the user who owns this skill
    user: {
        type: mongoose.Schema.Types.ObjectId,  // MongoDB ObjectId reference
        required: true,                        // User must be specified
        ref: 'User'                           // Reference to User model
    },
    
    // Skill name - required field
    name: {
        type: String,
        required: [true, 'Please add a skill name'],
        trim: true
    },
    
    // Skill category - required field with enum validation
    category: {
        type: String,
        required: [true, 'Please add a skill category'],
        enum: {
            values: ['Programming Languages', 'Frontend', 'Backend', 'AI/ML', 'DevOps & Tools', 'Additional Tools'],
            message: '{VALUE} is not a valid category'
        },
        trim: true
    }
}, {
    timestamps: true  // Automatically add createdAt and updatedAt fields
});

// Export the Skill model based on the schema
module.exports = mongoose.model('Skill', skillSchema); 