// Import required functions
const { findUserWithHigherProficiency, findUserWithHigherDesignation, findAdminUsers } = require('./dynamicApproverAllocation.support.controller');

// Function to dynamically allocate an approver
async function dynamicApproverAllocation(userId, skillId, proficiency) {
  try {
    // Find users with higher proficiency
    const higherProficiencyUsers = await findUserWithHigherProficiency(skillId, proficiency, userId);

    // If higher proficiency users exist, return one randomly
    if (higherProficiencyUsers.length > 0) {
      const randomIndex = Math.floor(Math.random() * higherProficiencyUsers.length);
      return higherProficiencyUsers[randomIndex];
    }

    // Find users with higher designation
    const higherDesignationUsers = await findUserWithHigherDesignation(userId);

    // If higher designation users exist, return one randomly
    if (higherDesignationUsers.length > 0) {
      const randomIndex = Math.floor(Math.random() * higherDesignationUsers.length);
      return higherDesignationUsers[randomIndex];
    }

    // If no suitable user is found, assign an admin as the approver
    const adminUsers = await findAdminUsers(userId);
    if (adminUsers.length > 0) {
      // Return a random admin user
      const randomIndex = Math.floor(Math.random() * adminUsers.length);
      return adminUsers[randomIndex];
    } else {
      // If no admin users exist, return null
      return null;
    }
  } catch (error) {
    console.error('Error allocating approver dynamically:', error);
    return null;
  }
}

module.exports = dynamicApproverAllocation;
