// Email scheduler utility for sending reminder emails
const cron = require('node-cron');
const Registration = require('../model/Registration');
const Seminar = require('../model/Seminar');
const emailService = require('./emailService');

// Function to send reminder emails for seminars happening tomorrow
const sendTomorrowReminders = async () => {
  try {
    console.log('Starting reminder email job...');
    
    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDateString = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Find all seminars happening tomorrow
    const tomorrowSeminars = await Seminar.find({
      date: {
        $gte: new Date(tomorrowDateString + 'T00:00:00.000Z'),
        $lt: new Date(tomorrowDateString + 'T23:59:59.999Z')
      },
      isArchived: { $ne: true }
    });
    
    console.log(`Found ${tomorrowSeminars.length} seminars happening tomorrow`);
    
    // For each seminar, find all registrations and send reminders
    for (const seminar of tomorrowSeminars) {
      const registrations = await Registration.find({ seminarId: seminar._id });
      
      console.log(`Sending reminders for seminar: ${seminar.title} (${registrations.length} registrations)`);
      
      for (const registration of registrations) {
        try {
          await emailService.sendSeminarReminder(registration, seminar);
          console.log(`Reminder sent to: ${registration.email}`);
        } catch (error) {
          console.error(`Failed to send reminder to ${registration.email}:`, error);
        }
      }
    }
    
    console.log('Reminder email job completed');
  } catch (error) {
    console.error('Error in reminder email job:', error);
  }
};

// Function to send feedback request emails for seminars that ended yesterday
const sendFeedbackRequests = async () => {
  try {
    console.log('Starting feedback request email job...');
    
    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDateString = yesterday.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Find all seminars that ended yesterday
    const yesterdaySeminars = await Seminar.find({
      date: {
        $gte: new Date(yesterdayDateString + 'T00:00:00.000Z'),
        $lt: new Date(yesterdayDateString + 'T23:59:59.999Z')
      },
      isArchived: { $ne: true }
    });
    
    console.log(`Found ${yesterdaySeminars.length} seminars that ended yesterday`);
    
    // For each seminar, find all registrations and send feedback requests
    for (const seminar of yesterdaySeminars) {
      const registrations = await Registration.find({ seminarId: seminar._id });
      
      console.log(`Sending feedback requests for seminar: ${seminar.title} (${registrations.length} registrations)`);
      
      for (const registration of registrations) {
        try {
          await emailService.sendFeedbackRequest(registration, seminar);
          console.log(`Feedback request sent to: ${registration.email}`);
        } catch (error) {
          console.error(`Failed to send feedback request to ${registration.email}:`, error);
        }
      }
    }
    
    console.log('Feedback request email job completed');
  } catch (error) {
    console.error('Error in feedback request email job:', error);
  }
};

// Schedule reminder emails to run daily at 9:00 AM
const startReminderScheduler = () => {
  cron.schedule('0 9 * * *', () => {
    console.log('Running daily reminder email job at 9:00 AM');
    sendTomorrowReminders();
  }, {
    scheduled: true,
    timezone: "Asia/Dhaka" // Adjust timezone as needed
  });
  
  console.log('Reminder email scheduler started - will run daily at 9:00 AM');
};

// Schedule feedback request emails to run daily at 10:00 AM
const startFeedbackScheduler = () => {
  cron.schedule('0 10 * * *', () => {
    console.log('Running daily feedback request email job at 10:00 AM');
    sendFeedbackRequests();
  }, {
    scheduled: true,
    timezone: "Asia/Dhaka" // Adjust timezone as needed
  });
  
  console.log('Feedback request email scheduler started - will run daily at 10:00 AM');
};

// Manual function to send reminders for a specific seminar (for testing)
const sendRemindersForSeminar = async (seminarId) => {
  try {
    const seminar = await Seminar.findById(seminarId);
    if (!seminar) {
      throw new Error('Seminar not found');
    }
    
    const registrations = await Registration.find({ seminarId: seminarId });
    
    console.log(`Sending reminders for seminar: ${seminar.title} (${registrations.length} registrations)`);
    
    for (const registration of registrations) {
      try {
        await emailService.sendSeminarReminder(registration, seminar);
        console.log(`Reminder sent to: ${registration.email}`);
      } catch (error) {
        console.error(`Failed to send reminder to ${registration.email}:`, error);
      }
    }
    
    return { success: true, message: `Reminders sent to ${registrations.length} participants` };
  } catch (error) {
    console.error('Error sending reminders for seminar:', error);
    throw error;
  }
};

// Initialize all schedulers
const initializeEmailSchedulers = () => {
  startReminderScheduler();
  startFeedbackScheduler();
  console.log('All email schedulers initialized');
};

module.exports = {
  sendTomorrowReminders,
  sendFeedbackRequests,
  sendRemindersForSeminar,
  initializeEmailSchedulers
};
