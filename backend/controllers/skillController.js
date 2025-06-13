/**
 * Skill Controller
 * @desc Handles all skill-related operations
 * @module controllers/skillController
 */

const Skill = require('../models/Skill');

/**
 * Get all skills
 * @desc Retrieves all skills sorted by category and name
 * @route GET /api/skills
 * @access Public
 */
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, name: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get skills by category
 * @desc Retrieves all skills in a specific category
 * @route GET /api/skills/category/:category
 * @access Public
 * @param {string} category - The category to filter skills by
 */
exports.getSkillsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const skills = await Skill.find({ category }).sort({ name: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Add a new skill
 * @desc Creates a new skill with duplicate checking
 * @route POST /api/skills
 * @access Private
 * @param {string} name - The name of the skill
 * @param {string} category - The category of the skill
 */
exports.addSkill = async (req, res) => {
  try {
    const { name, category } = req.body;

    // Check if skill already exists in the category
    const existingSkill = await Skill.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      category 
    });

    if (existingSkill) {
      return res.status(400).json({ 
        message: `Skill '${name}' already exists in the ${category} category` 
      });
    }

    const skill = new Skill({
      name,
      category
    });

    const newSkill = await skill.save();
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Delete a skill
 * @desc Removes a skill by its ID
 * @route DELETE /api/skills/:id
 * @access Private
 * @param {string} id - The ID of the skill to delete
 */
exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findById(id);
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    await skill.deleteOne();
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update a skill
 * @desc Modifies an existing skill's name or category
 * @route PUT /api/skills/:id
 * @access Private
 * @param {string} id - The ID of the skill to update
 * @param {string} name - The new name of the skill
 * @param {string} category - The new category of the skill
 */
exports.updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;

    // Check if skill already exists with new name and category
    const existingSkill = await Skill.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      category,
      _id: { $ne: id }
    });

    if (existingSkill) {
      return res.status(400).json({ 
        message: `Skill '${name}' already exists in the ${category} category` 
      });
    }

    const skill = await Skill.findById(id);
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    skill.name = name;
    skill.category = category;
    skill.updatedAt = Date.now();

    const updatedSkill = await skill.save();
    res.json(updatedSkill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 