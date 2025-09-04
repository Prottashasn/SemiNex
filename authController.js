const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register user
const register = async (req, res) => {
  try {
    const {name, email, password , role} = req.body;
    
    console.log('Registration request body:', req.body);
    console.log('Email:', email);
    console.log('Name:', name); 
    console.log('Role:', role);
    console.log('Password length:', password ? password.length : 0);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    console.log('Creating user with email:', email);

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || 'student' 
    });

    console.log('User object before save:', user);
    console.log('User schema fields:', Object.keys(user.schema.obj));

    const savedUser = await user.save();
    
    console.log('User saved successfully:', savedUser);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      success: true,
      token,
      user: {
        id: user._id,
        name:user.email,
        email: user.email,
        role: user.role

      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email); 


    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

      const response = {
      message: 'Login successful',
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name, 
        role: user.role 
        
      }
    };
    
    console.log('User from database:', user);
    console.log('Login successful, user role:', user.role); 
    console.log('Sending response:', response);

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.Id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getProfile   
};                                                                    