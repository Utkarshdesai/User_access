const jwt = require('jsonwebtoken');
const User = require('../entities/user');
const AppDataSource = require('../config/data-config');

const authenticateToken = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;
    
    if (!token) {
      console.log('No token found in cookies'); // Debug log
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', { 
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role
    }); // Debug log

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // Get user from database
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: decoded.userId });

    if (!user) {
      console.log('User not found in database:', decoded.userId); // Debug log
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Attach user to request
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    console.log('Authentication successful:', { 
      username: user.username, 
      role: user.role 
    }); // Debug log

    next();
  } catch (error) {
    console.error('Authentication error:', {
      message: error.message,
      name: error.name
    });
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    console.log('Checking role authorization:', {
      userRole: req.user.role,
      requiredRoles: roles
    }); // Debug log

    if (!roles.includes(req.user.role)) {
      console.log('Role authorization failed:', {
        userRole: req.user.role,
        requiredRoles: roles
      }); // Debug log
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    console.log('Role authorization successful:', {
      username: req.user.username,
      role: req.user.role
    }); // Debug log

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole
}; 