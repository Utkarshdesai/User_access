const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
const authRoutes = require('./routes/auth');
const softwareRoutes = require('./routes/software');
const requestRoutes = require('./routes/request');
const AppDataSource = require('./config/data-config');

// Load environment variables first
dotenv.config();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize database connection
(async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database initialized successfully');

    // Routes
    app.use('/api/auth', authRoutes);    // Authentication routes
    app.use('/api', softwareRoutes);  // Software management routes
    app.use('/api/requests', requestRoutes);   // Request management routes

    // Health check route
    app.get("/", (req, res) => {
      return res.json({
        success: true,
        message: 'Your server is up and running....'
      });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error initializing Data Source:', error);
    process.exit(1);
  }
})();






app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})

