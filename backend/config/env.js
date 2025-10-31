require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/mgnrega',
  STATE: process.env.STATE || 'Uttar Pradesh',
  MGNREGA_API_URL: process.env.MGNREGA_API_URL || 'https://api.data.gov.in/resource/mgnrega-monthly-performance',
  DATA_GOV_API_KEY: process.env.DATA_GOV_API_KEY,
  CACHE_TTL: parseInt(process.env.CACHE_TTL) || 3600, // 1 hour
  GEOCODE_CACHE_TTL: parseInt(process.env.GEOCODE_CACHE_TTL) || 86400, // 24 hours
  INGESTION_INTERVAL_HOURS: parseInt(process.env.INGESTION_INTERVAL_HOURS) || 6,
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  REDIS_URL: process.env.REDIS_URL,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};
