const DistrictData = require('../models/DistrictData');
const logger = require('../utils/logger');

// Health check endpoint
const getHealth = async (req, res) => {
  try {
    // Check database connection
    const dbStatus = await DistrictData.findOne().limit(1);

    // Get last successful data fetch
    const lastFetch = await DistrictData.findOne()
      .sort({ created_at: -1 })
      .select('created_at');

    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: dbStatus !== null ? 'connected' : 'disconnected',
      lastDataFetch: lastFetch ? lastFetch.created_at.toISOString() : null,
      uptime: process.uptime(),
      memory: process.memoryUsage()
    };

    // Return 200 if database is connected, 503 if not
    const statusCode = healthData.database === 'connected' ? 200 : 503;

    res.status(statusCode).json(healthData);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
};

module.exports = {
  getHealth
};
