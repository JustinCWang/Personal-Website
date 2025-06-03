/**
 * User Model for the Personal Website backend
 * Defines the MongoDB schema for user documents
 * Handles user authentication and account information
 */

const mongoose = require("mongoose");

/**
 * User Schema Definition
 * @desc Defines the structure of user documents in MongoDB
 * @fields name, email, password
 */
const userSchema = new mongoose.Schema({
    // User's full name
    name: {
        type: String,
        required: [true, "Please add a name"]  // Required field with custom error message
    },
    
    // User's email address - used for login and must be unique
    email: {
        type: String,
        required: [true, "Please add an email"],  // Required field with custom error message
        unique: true                              // Ensure email uniqueness across all users
    },
    
    // User's password - will be hashed before storage
    password: {
        type: String,
        required: [true, "Please add a password"]  // Required field with custom error message
    }
}, {
    timestamps: true  // Automatically add createdAt and updatedAt fields
})

// Export the User model based on the schema
module.exports = mongoose.model("User", userSchema);