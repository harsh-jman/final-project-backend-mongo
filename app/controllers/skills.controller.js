const Skill = require("../models/skills.model");

exports.addSkill = async (req, res) => {
  try {
    const { skillName, description } = req.body;

    // Check if the skillName already exists
    const existingSkill = await Skill.findOne({ skillName });
    if (existingSkill) {
      return res.status(400).json({ message: 'Skill already exists' });
    }

    // Create a new skill instance
    const newSkill = new Skill({
      skillName,
      description
    });

    // Save the new skill to the database
    await newSkill.save();

    res.status(201).json({ message: 'Skill added successfully', data: newSkill });
  } catch (error) {
    console.error('Error adding skill:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getAllSkills = async (req, res) => {
  try {
    // Fetch all skills from the database
    const allSkills = await Skill.find();

    // Return the skills as the response
    res.status(200).json({ data: allSkills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};