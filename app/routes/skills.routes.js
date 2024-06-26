const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skills.controller');
const userSkillsController = require('../controllers/userSkills.controller');
const { authenticate } = require('../middleware/authentication.middleware');
const { verifyAdminRole } = require('../middleware/authorization.middleware');

//SKILLS
// Add a new skill
router.post('/add-skill', authenticate, verifyAdminRole, skillController.addSkill);

// Get all skills
router.get('/allSkills',authenticate, skillController.getAllSkills);


//USER SKILLS
router.post('/addUserSkills',authenticate, userSkillsController.addUserSkill);


router.get('/showUserSkills',authenticate, userSkillsController.showUserSkills);

//APPROVER
router.get('/approvalsForApprover',authenticate, userSkillsController.approvalsForApprover);

router.post('/approveUserSkill',authenticate, userSkillsController.approveUserSkill);

// Delete collections route
router.delete('/delete-collections', userSkillsController.deleteCollections);
router.delete('/deleteUserSkills', userSkillsController.emptySkillsForAllUsers);


module.exports = router;
