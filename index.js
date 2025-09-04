const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import email scheduler
const emailScheduler = require('./utils/emailScheduler');




// Import your existing routes
const seminarRoutes = require('./routes/seminarRoutes');
const speakerRoutes = require('./routes/speakerRoutes');
// Add these new routes:
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const archiveRoutes = require('./routes/archiveRoutes');
const reportRoutes = require('./routes/reportRoutes');

console.log('=== DEBUG: Checking route modules ===');
console.log('userRoutes type:', typeof userRoutes, 'Value:', userRoutes);
console.log('authRoutes type:', typeof authRoutes, 'Value:', authRoutes);
console.log('seminarRoutes type:', typeof seminarRoutes, 'Value:', seminarRoutes);
console.log('speakerRoutes type:', typeof speakerRoutes, 'Value:', speakerRoutes);
console.log('=====================================');


const app = express();
// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB with fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Seminex_2';

// Try to connect to MongoDB, but don't fail if it's not available
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  console.log('📊 Database URL:', MONGODB_URI);
  console.log('🗄️  Database Name:', mongoose.connection.db.databaseName);
  
  // Initialize email schedulers
  emailScheduler.initializeEmailSchedulers();
  
  // Test the User model after connection
  //const User = require('./model/User');
  //const testUser = new User({
    //email: 'test@test.com',
  //  password: 'testpassword'
  //});
  //console.log('🔍 User model schema fields:', Object.keys(testUser.schema.obj));
})
.catch(err => {
  console.log('⚠️  MongoDB connection failed. Starting server without database...');
  console.log('💡 To fix this:');
  console.log('   1. Install MongoDB: https://www.mongodb.com/try/download/community');
  console.log('   2. Or use MongoDB Atlas: https://www.mongodb.com/atlas');
  console.log('   3. Or start MongoDB service: net start MongoDB');
});


// Registration Routes (simple)
//app.post('/api/registrations', registrationController.createRegistration);

// Your existing routes
app.use('/api/seminars', seminarRoutes);
app.use('/api/speakers', speakerRoutes);

// Add these new routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/archives', archiveRoutes);
app.use('/api/reports', reportRoutes);


// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Route to check all users in database
//app.get('/api/users', async (req, res) => {
  //try {
   // const User = require('./model/User');
   // const users = await User.find({}).select('-password');
    
    //console.log('All users in database:', users);
    
    //res.json({
    //  message: 'All users',
    //  count: users.length,
   //   users: users
  //  });
 // } catch (error) {
 //   console.error('Error fetching users:', error);
 //   res.status(500).json({ error: error.message });
//  }
//});

// Test route to check current schema
//app.get('/api/test-schema', async (req, res) => {
 // try {
   // const User = require('./model/User');
   // const testUser = new User({
   //   email: 'test@example.com',
   //   password: 'testpassword'
   // });
    
   // console.log('Test user object:', testUser);
    //console.log('Test user schema:', testUser.schema.obj);
    //console.log('Schema fields:', Object.keys(testUser.schema.obj));
    
    //res.json({
    //  message: 'Schema test',
    //  schemaFields: Object.keys(testUser.schema.obj),
    //  schema: testUser.schema.obj
   // });
  //} catch (error) {
  //  console.error('Schema test error:', error);
  //  res.status(500).json({ error: error.message });
 // }
//});

// Route to clear all users (for testing)
//app.delete('/api/clear-users', async (req, res) => {
//  try {
//    const User = require('./model/User');
//    const result = await User.deleteMany({});
    
 //   console.log('Cleared all users:', result);
    
 //   res.json({
  //    message: 'All users cleared',
  //    deletedCount: result.deletedCount
   // });
  //} catch (error) {
   // console.error('Error clearing users:', error);
   // res.status(500).json({ error: error.message });
 // }
//});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend should be available at: http://localhost:5173`);
});
          