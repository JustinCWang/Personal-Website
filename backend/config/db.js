/**
 * Database Configuration for the Personal Website backend
 * Handles MongoDB connection setup using Mongoose
 * Includes error handling and connection status logging
 */

const mongoose = require('mongoose')

/**
 * Connect to MongoDB database
 * @desc Establishes connection to MongoDB using connection string from environment variables
 * @throws {Error} Exits process if connection fails
 * @returns {Promise} Promise that resolves when connection is established
 */
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the connection string from environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI)

        // Log successful connection with host information
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
    } catch (error) {
        // Log connection error and exit the process
        console.log(error)
        process.exit(1)  // Exit with failure code
    }
}

// Export the connection function
module.exports = connectDB