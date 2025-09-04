const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Seminex_2';

async function resetDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Drop the users collection to remove old schema
    const db = mongoose.connection.db;
    await db.dropCollection('users');
    console.log('✅ Dropped users collection');

    // Create new User model
    const userSchema = new mongoose.Schema({
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
      },
      password: {
        type: String,
        required: true,
        minlength: 6
      }
    }, {
      timestamps: true,
      collection: 'users'
    });

    // Hash password before saving
    const bcrypt = require('bcryptjs');
    userSchema.pre('save', async function(next) {
      if (!this.isModified('password')) return next();
      
      try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
      } catch (error) {
        next(error);
      }
    });

    // Method to compare password
    userSchema.methods.comparePassword = async function(candidatePassword) {
      return bcrypt.compare(candidatePassword, this.password);
    };

    const User = mongoose.model('User', userSchema);

    // Test creating a user
    const testUser = new User({
      email: 'test@example.com',
      password: 'testpassword'
    });

    console.log('Test user schema fields:', Object.keys(testUser.schema.obj));
    
    // Test creating a seminar
    const Seminar = require('./model/Seminar');
    const testSeminar = new Seminar({
      title: 'Test Seminar',
      speaker: 'Test Speaker',
      topic: 'Test Topic',
      description: 'Test Description',
      venue: 'Test Venue'
    });

    console.log('Test seminar schema fields:', Object.keys(testSeminar.schema.obj));
    
    // Test creating a speaker
    const Speaker = require('./model/Speaker');
    const testSpeaker = new Speaker({
      name: 'Test Speaker',
      email: 'test@speaker.com',
      organization: 'Test Org',
      designation: 'Test Role',
      bio: 'Test Bio',
      expertise: 'Test Expertise',
      experience: '5 years'
    });

    console.log('Test speaker schema fields:', Object.keys(testSpeaker.schema.obj));
    
    console.log('✅ Database reset complete!');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase(); 