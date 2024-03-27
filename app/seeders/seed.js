// Import the seeding function
const seedAdminOnce = require('./adminSeeder');

// MongoDB connection URL
const mongoURL = require('../../config/database.config').url; // Replace with your MongoDB connection URL

// Call the seeding function with the MongoDB connection URL
seedAdminOnce(mongoURL)
  .then(() => {
    console.log('Seeding completed');
    process.exit(0); // Exit the process once seeding is done
  })
  .catch(error => {
    console.error('Error seeding:', error);
    process.exit(1); // Exit with an error code if seeding fails
  });
