/**
 * Vercel Serverless Function Entry Point
 * Exports the Express app for Vercel's serverless environment
 */

const app = require('../server')

// Export the Express app as a serverless function
module.exports = app 