/**
 * Error handling middleware for the Personal Website backend
 * Catches and formats all errors that occur in the application
 * Provides consistent error response format across the API
 */

/**
 * Central error handler middleware
 * @desc Catches and formats all application errors
 * @param {Object} err - Error object containing error details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object  
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON error response with message and stack trace (in development)
 */
const errorHandler = (err, req, res, next) => {
  // Use existing status code or default to 500 (Internal Server Error)
  const statusCode = res.statusCode ? res.statusCode : 500

  // Set the response status code
  res.status(statusCode)

  // Send JSON error response
  res.json({
    message: err.message,  // Error message for client
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,  // Stack trace only in development
  })
}

module.exports = {
  errorHandler,
}