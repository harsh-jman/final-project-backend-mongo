const Log = require("../models/logs.model");

exports.logMessage = async (req, res) => {
  try {
    const { level, message ,task} = req.body;

    // Create a new log instance
    const newLog = new Log({
      level,
      message,
      task,
      timestamp: new Date(),
    });

    // Save the log to the database
    await newLog.save();

    res.status(200).json({ message: "Log saved successfully" });
  } catch (error) {
    console.error("Error saving log:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getLogs = async (req, res) => {
    try {
      // Retrieve logs from the database
      const logs = await Log.aggregate([
        // Group by the 'task' field to get the latest entry for each task
        { $group: { _id: '$task', latestEntry: { $last: '$$ROOT' } } },
        // Project only the necessary fields
        {
          $project: {
            _id: 0, // Exclude the _id field
            task: '$_id', // Rename the _id field to 'task'
            message: '$latestEntry.message',
            level: '$latestEntry.level',
            createdAt: '$latestEntry.createdAt',
          },
        },
      ]);
  
      res.status(200).json(logs);
    } catch (error) {
      console.error("Error retrieving logs:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
