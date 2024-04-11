// userPersonalData.controller.js

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId; // Import ObjectId from mongoose
const User = require("../models/user.model");
const UserSkill = require("../models/userSkills.model");
const Skill = require("../models/skills.model");
const Certificate = require("../models/certification.model");
const ProjectExperience = require("../models/projectExperience.model");
const ApproverDetail = require("../models/approverDetail.model");

exports.getUserPersonalData = async (req, res) => {
    try {
      const userIdString = req.user.userId; // Assuming the user ID is available in the request as a string
      const userIdObject = new ObjectId(userIdString); // Convert string to ObjectId
  
      // Get total user skills count
      const totalUserSkills = await UserSkill.countDocuments({ userId: userIdObject });
  
      // Get count of approved, rejected, and pending skills
      const skillStatusCounts = await ApproverDetail.aggregate([
        { $match: { userId: userIdObject } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);
  
      // Ensure all possible status values are included
      const defaultSkillStatusCounts = [
        { _id: "Approved", count: 0 },
        { _id: "Rejected", count: 0 },
        { _id: "Pending", count: 0 },
      ];
  
      // Merge default values with actual values
      skillStatusCounts.forEach((status) => {
        const defaultStatus = defaultSkillStatusCounts.find((item) => item._id === status._id);
        if (defaultStatus) {
          defaultStatus.count = status.count;
        }
      });
  
      // Get count of user as approver and their status
      const approverCounts = await ApproverDetail.aggregate([
        { $match: { approverUserId: userIdObject } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);
  
      // Ensure all possible status values are included
      const defaultApproverStatusCounts = [
        { _id: "Approved", count: 0 },
        { _id: "Rejected", count: 0 },
        { _id: "Pending", count: 0 },
      ];
  
      // Merge default values with actual values
      approverCounts.forEach((status) => {
        const defaultStatus = defaultApproverStatusCounts.find((item) => item._id === status._id);
        if (defaultStatus) {
          defaultStatus.count = status.count;
        }
      });
  
      // Get average hacker rank score
      const averageHackerRankScore = await UserSkill.aggregate([
        { $match: { userId: userIdObject, hackerRankScore: { $exists: true } } },
        {
          $group: {
            _id: null,
            averageScore: { $avg: "$hackerRankScore" },
          },
        },
      ]);
  
      // Get average rating
      const averageRating = await ApproverDetail.aggregate([
        { $match: { userId: userIdObject, rating: { $exists: true } } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
          },
        },
      ]);
  
      // Set default values if no data found
      const defaultAverageHackerRankScore = averageHackerRankScore.length > 0 ? averageHackerRankScore[0].averageScore : null;
      const defaultAverageRating = averageRating.length > 0 ? averageRating[0].averageRating : null;
  
      // Get non-matching skill IDs in the skills collection to get the list of not covered certificates
      const userSkillIds = (await UserSkill.find({ userId: userIdObject })).map((skill) => skill.skillId);
      const notCoveredCertificates = await Certificate.find({ _id: { $nin: userSkillIds } });
  
      // Extract certificate names from notCoveredCertificates
      const notCoveredCertificateNames = notCoveredCertificates.map(cert => cert.certificateName);
  
      // Get non-matching skill names in the skills collection to get the list of not covered skills
      const notCoveredSkills = await Skill.find({ _id: { $nin: userSkillIds } });
  
      // Extract skill names from notCoveredSkills
      const notCoveredSkillNames = notCoveredSkills.map(skill => skill.skillName);
  
      // Construct the response object
      const userData = {
        totalUserSkills,
        skillStatusCounts: defaultSkillStatusCounts,
        approverStatusCounts: defaultApproverStatusCounts,
        averageHackerRankScore: defaultAverageHackerRankScore,
        averageRating: defaultAverageRating,
        notCoveredCertificateNames,
        notCoveredSkillNames,
      };
  
      // Return the user personal data
      res.status(200).json(userData);
    } catch (error) {
      console.error("Error fetching user personal data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
