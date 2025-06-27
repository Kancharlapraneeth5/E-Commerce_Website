// API configuration for different environments
const config = {
  development: {
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
    API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/graphql',
    ENVIRONMENT: 'development'
  },
  production: {
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://e-commerce-website-us30.onrender.com',
    API_URL: process.env.REACT_APP_API_URL || 'https://e-commerce-website-us30.onrender.com/graphql',
    ENVIRONMENT: 'production'
  }
};

// Determine current environment
const currentEnv = process.env.NODE_ENV || 'development';
const currentConfig = config[currentEnv];

// Export current configuration
export const API_CONFIG = {
  ...currentConfig,
  IS_DEVELOPMENT: currentEnv === 'development',
  IS_PRODUCTION: currentEnv === 'production'
};

export const API_ENDPOINTS = {
  GRAPHQL: currentConfig.API_URL,
  AUTH: `${currentConfig.API_BASE_URL}/auth`,
};

console.log(`🚀 Frontend running in ${currentEnv} mode`);
console.log(`📡 API URL: ${currentConfig.API_URL}`);

export default API_CONFIG;
