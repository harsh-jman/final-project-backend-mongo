// const mongoose = require("mongoose");
const User = require("../models/user.model");
const UserSkill = require("../models/userSkills.model");
// const Certificate = require("../models/certification.model");
// const ProjectExperience = require("../models/projectExperience.model");
// const ApproverDetail = require("../models/approverDetail.model");

// Function to find users with higher proficiency
async function findUserWithHigherProficiency(skillId, proficiency, userId) {
    try {
      // Define proficiency levels
      const proficiencyLevels = ["beginner", "intermediate", "advanced"];
      
      // Find the index of the current proficiency level in the proficiencyLevels array
      const currentIndex = proficiencyLevels.indexOf(proficiency);
  
      // Find users with higher proficiency level
      const higherProficiencyUsers = await UserSkill.find({
        skillId,
        proficiency: { $in: proficiencyLevels.slice(currentIndex + 1) },
        userId: { $ne: userId } // Exclude the current user's ID
      }, { userId: 1 });
  
      // Extract userIds from the found user skills
      return higherProficiencyUsers.map(userSkill => userSkill.userId);
    } catch (error) {
      console.error('Error finding users with higher proficiency:', error);
      return [];
    }
  }
  

// Function to find users with higher designation
async function findUserWithHigherDesignation(userId) {
    try {
      const currentUser = await User.findById(userId);
      if (!currentUser) {
        return [];
      }
      const currentUserDesignation = currentUser.designation;
  
      // Define designation levels
      const designationLevels = ["Solution Enabler", "Consultant", "Architect", "Principal Architect"];
      const currentIndex = designationLevels.indexOf(currentUserDesignation);
  
      // Find users with higher designation
      const higherDesignationUsers = await User.find({
        designation: { $in: designationLevels.slice(currentIndex + 1) },
        _id: { $ne: userId } // Exclude the current user's ID
      }, { _id: 1 });
  
      return higherDesignationUsers.map(user => user._id);
    } catch (error) {
      console.error('Error finding users with higher designation:', error);
      return [];
    }
  }
  

// Function to find an admin user to assign as the approver
async function findAdminUsers(userId) {
    try {
      const adminUsers = await User.find({ role: "admin", _id: { $ne: userId } }, { _id: 1 });
      return adminUsers.map(user => user._id);
    } catch (error) {
      console.error('Error finding admin users:', error);
      return [];
    }
  }

module.exports = { findUserWithHigherProficiency, findUserWithHigherDesignation, findAdminUsers };
