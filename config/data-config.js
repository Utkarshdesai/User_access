

const { DataSource } = require('typeorm');
const User = require('../entities/user');
const Software = require('../entities/software');
const Request = require('../entities/request');

// Ensure environment variables are loaded
require('dotenv').config();

// Check if DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // PostgreSQL connection string
  synchronize: true, // Auto-create/modify tables based on entities
  logging: true, // Enable query logging for debugging
  entities: [User, Software, Request], // List of entity files
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // SSL settings for production
});

module.exports = AppDataSource;

