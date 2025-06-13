/**
 * Skill Model
 * @desc Defines the schema and model for skills in the portfolio
 * @module models/Skill
 */

const mongoose = require('mongoose');

/**
 * Skill Schema
 * @desc Schema definition for skills with validation
 * @property {String} name - Name of the skill (required)
 * @property {String} category - Category of the skill (required, enum)
 * @property {Date} createdAt - Timestamp of creation
 * @property {Date} updatedAt - Timestamp of last update
 */
const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Skill category is required'],
    enum: {
      values: ['Languages', 'Frontend', 'Backend', 'AI/ML', 'DevOps & Tools', 'Additional Tools'],
      message: '{VALUE} is not a valid category'
    },
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Pre-save middleware
 * @desc Updates the updatedAt timestamp before saving
 */
skillSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill; 