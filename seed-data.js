const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Seminex_2';

// Import models
const Seminar = require('./model/Seminar');
const Speaker = require('./model/Speaker');
const User = require('./model/User');

async function seedData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Seminar.deleteMany({});
    await Speaker.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create sample speakers
    const speakers = [
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@university.edu',
        organization: 'Tech University',
        designation: 'Professor of Computer Science',
        bio: 'Expert in machine learning and data science with 15+ years of experience.',
        expertise: 'Machine Learning, Data Science, AI',
        experience: '15 years'
      },
      {
        name: 'Prof. Michael Chen',
        email: 'michael.chen@techcorp.com',
        organization: 'TechCorp Industries',
        designation: 'Senior Data Scientist',
        bio: 'Leading expert in big data analytics and cloud computing.',
        expertise: 'Big Data, Cloud Computing, Analytics',
        experience: '12 years'
      },
      {
        name: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@research.org',
        organization: 'Research Institute',
        designation: 'Research Director',
        bio: 'Specialist in artificial intelligence and neural networks.',
        expertise: 'Artificial Intelligence, Neural Networks, Deep Learning',
        experience: '10 years'
      }
    ];

    const createdSpeakers = await Speaker.insertMany(speakers);
    console.log('✅ Created sample speakers');

    // Create sample seminars
    const seminars = [
      {
        title: 'Introduction to Machine Learning',
        description: 'Learn the fundamentals of machine learning algorithms and their applications in real-world scenarios.',
        topic: 'Machine Learning',
        speaker: createdSpeakers[0]._id,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        duration: 120,
        location: 'Main Auditorium',
        capacity: 100,
        registeredCount: 25,
        status: 'scheduled',
        requirements: 'Basic programming knowledge recommended',
        materials: ['Slides', 'Code Examples', 'Datasets']
      },
      {
        title: 'Big Data Analytics with Python',
        description: 'Comprehensive workshop on analyzing large datasets using Python and modern data science tools.',
        topic: 'Data Analytics',
        speaker: createdSpeakers[1]._id,
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        duration: 180,
        location: 'Computer Lab 1',
        capacity: 50,
        registeredCount: 15,
        status: 'scheduled',
        requirements: 'Python programming experience required',
        materials: ['Jupyter Notebooks', 'Sample Datasets', 'Tutorial Videos']
      },
      {
        title: 'Deep Learning Fundamentals',
        description: 'Explore neural networks, deep learning architectures, and their applications in AI.',
        topic: 'Deep Learning',
        speaker: createdSpeakers[2]._id,
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        duration: 150,
        location: 'Conference Room A',
        capacity: 75,
        registeredCount: 40,
        status: 'scheduled',
        requirements: 'Linear algebra and calculus knowledge helpful',
        materials: ['TensorFlow Examples', 'Research Papers', 'Practice Exercises']
      },
      {
        title: 'Cloud Computing for Data Scientists',
        description: 'Learn how to leverage cloud platforms for scalable data processing and machine learning.',
        topic: 'Cloud Computing',
        speaker: createdSpeakers[1]._id,
        date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days from now
        duration: 120,
        location: 'Virtual (Online)',
        capacity: 200,
        registeredCount: 85,
        status: 'scheduled',
        requirements: 'Basic understanding of data science concepts',
        materials: ['Cloud Platform Access', 'Hands-on Labs', 'Documentation']
      }
    ];

    const createdSeminars = await Seminar.insertMany(seminars);
    console.log('✅ Created sample seminars');

    // Create a test student user
    const testStudent = new User({
      name: 'Test Student',
      email: 'student@test.com',
      password: 'password123',
      role: 'student'
    });
    await testStudent.save();
    console.log('✅ Created test student user');

    console.log('\n🎉 Sample data created successfully!');
    console.log('\nTest credentials:');
    console.log('Email: student@test.com');
    console.log('Password: password123');
    console.log('\nSeminars created:', createdSeminars.length);
    console.log('Speakers created:', createdSpeakers.length);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
