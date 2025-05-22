const bcrypt = require('bcrypt')
const User = require("../entities/user");
const AppDataSource = require('../config/data-config');

const Signup = async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    const userRepository = AppDataSource.getRepository(User);
    const { username, password, role = 'Employee' } = req.body;

    console.log('Signup attempt:', { username, role }); // Debug log

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Validate role
    const validRoles = ['Employee', 'Manager', 'Admin'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ 
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}` 
      });
    }

    // Check if user exists
    const existingUser = await userRepository.findOneBy({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = userRepository.create({
      username,
      password: hashedPassword,
      role: role || 'Employee'
    });

    console.log('Creating new user:', { ...newUser, password: '[REDACTED]' }); // Debug log

    await userRepository.save(newUser);

    res.status(201).json({ 
      message: 'User created successfully', 
      data: { 
        username: newUser.username, 
        role: newUser.role 
      } 
    });

  } catch (error) {
    console.error('Signup error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

module.exports = Signup;