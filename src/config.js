// API Configuration
// This file handles the API URL configuration using environment variables
// with fallback to production URL

const config = {
  // Use environment variable if available, fallback to production URL
  // Note: In React, environment variables must start with REACT_APP_ to be accessible
  API_URL: process.env.REACT_APP_API_URL || 'https://rondaze-server-749067412044.europe-west1.run.app',
  
  // For development, you can set REACT_APP_API_URL in a .env.local file:
  // REACT_APP_API_URL=http://localhost:3001
};

export default config;
