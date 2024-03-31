const mongoose = require("mongoose");
const User = require("../models/user.model"); // Import the User model
const UserSkill = require("../models/userSkills.model");
const Certificate = require("../models/certification.model");
const ProjectExperience = require("../models/projectExperience.model");
const ApproverDetail = require("../models/approverDetail.model");
const dynamicApproverAllocation = require("../controllers/dynamicApproverAllocation");


//Transaction Aproach
exports.addUserSkill = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { skillId, proficiency, certificate, projectExperience } = req.body;
    const userId = req.user.userId; // Access userId from req.user

    // If certificate details provided and all fields are non-empty, check if certificate with provided ID already exists
    if (
      certificate &&
      Object.values(certificate).every((value) => value !== "")
    ) {
      const existingCertificate = await Certificate.findOne({
        certificateId: certificate.certificateId,
      });

      if (existingCertificate) {
        return res.status(400).json({ error: "Certificate already exists" });
      }
    }

    // Create a new user skill entry
    const userSkill = new UserSkill({
      userId,
      skillId,
      proficiency,
    });

    // If certificate details provided and all fields are non-empty, create a new certificate entry and update user skill
    if (
      certificate &&
      Object.values(certificate).every((value) => value !== "")
    ) {
      // Create new certificate entry
      const newCertificate = new Certificate({
        userId,
        certificateName: certificate.certificateName,
        certificateId: certificate.certificateId,
        description: certificate.description,
        issuingAuthority: certificate.issuingAuthority,
        issueDate: certificate.issueDate,
        validityPeriodMonths: certificate.validityPeriodMonths,
        supportedDocumentLink: certificate.supportedDocumentLink,
      });

      // Save new certificate entry
      const savedCertificate = await newCertificate.save({ session });
      userSkill.certificateId = savedCertificate._id;
    }

    // If project experience details provided and any field is non-empty, create a new project experience entry and update user skill
    if (
      projectExperience &&
      Object.values(projectExperience).some((value) => value !== "")
    ) {
      const newProjectExperience = new ProjectExperience({
        userId,
        projectName: projectExperience.projectName,
        description: projectExperience.description,
        startDate: projectExperience.startDate,
        endDate: projectExperience.endDate,
        supportedDocumentLink: projectExperience.supportedDocumentLink,
      });
      const savedProjectExperience = await newProjectExperience.save({
        session,
      });
      userSkill.projectExperienceId = savedProjectExperience._id;
    }

    // Save user skill entry
    const savedUserSkill = await userSkill.save({ session });

    // Update the user schema with the newly created userSkill ID
    await User.findByIdAndUpdate(
      userId,
      { $push: { skills: savedUserSkill._id } },
      { session }
    );

    // Allocate approver dynamically
    
    const approverUserId = await dynamicApproverAllocation(userId, skillId,proficiency);

    // Initialize approverDetail without approverUserId
    const newApproverDetail = new ApproverDetail({
      userId,
      userSkillId: savedUserSkill._id,
      approverUserId: approverUserId, // Added approverUserId field
    });

    // Save approverDetail
    const savedApproverDetail = await newApproverDetail.save();

    // Update userSkill with the approverDetailId
    savedUserSkill.approverDetailId = savedApproverDetail._id;
    await savedUserSkill.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Respond with success message
    res.status(201).json({ message: "Skill added successfully" });
  } catch (error) {
    // Rollback the transaction if an error occurs
    await session.abortTransaction();
    session.endSession();

    console.error("Error adding skill:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.showUserSkills = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Define population options for fields that might be empty
    const populationOptions = [
      { path: "skillId" },
      {
        path: "approverDetailId",
        populate: { path: "approverUserId", select: "firstName lastName" },
      },
    ];

    // Fetch user skills with linked data, conditionally populating certificate and projectExperience fields
    const userSkills = await UserSkill.find({ userId })
      .populate(populationOptions)
      .populate({
        path: "certificateId",
        match: { _id: { $exists: true } }, // Only populate certificateId if it exists
      })
      .populate({
        path: "projectExperienceId",
        match: { _id: { $exists: true } }, // Only populate projectExperienceId if it exists
      });

    // Respond with user skills
    res.status(200).json({ userSkills });
  } catch (error) {
    console.error("Error fetching user skills:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const collectionsToDelete = [
  "userskills",
  "certificates",
  "approverdetails",
  "projectexperiences",
];

exports.deleteCollections = async (req, res) => {
  try {
    // Loop through the collection names and delete each collection
    for (const collectionName of collectionsToDelete) {
      // Drop the collection
      await mongoose.connection.dropCollection(collectionName);
      console.log(`Collection '${collectionName}' deleted successfully`);
    }
    res.status(200).json({ message: "Collections deleted successfully" });
  } catch (error) {
    console.error("Error deleting collections:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
