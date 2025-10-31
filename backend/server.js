const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const cron = require('node-cron');

const env = require('./config/env');
const logger = require('./utils/logger');
const errorHandler = require('./utils/errorHandler');

// Import routes
const districtRoutes = require('./routes/districtRoutes');
const geoRoutes = require('./routes/geoRoutes');
const healthRoutes = require('./routes/healthRoutes');

// Import services
const apiFetcher = require('./services/apiFetcher');

const app = express();
const PORT = env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  max: env.RATE_LIMIT_MAX_REQUESTS || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS
const corsOptions = {
  origin: env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
  credentials: true,
  optionSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Routes
app.use('/api/districts', districtRoutes);
app.use('/api/geo', geoRoutes);
app.use('/api/health', healthRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

// Database connection
mongoose.connect(env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  logger.info('Connected to MongoDB');
})
.catch((err) => {
  logger.error('MongoDB connection error:', err);
  process.exit(1);
});

// Schedule data ingestion (every 6 hours)
if (env.NODE_ENV === 'production') {
  cron.schedule('0 */6 * * *', async () => {
    logger.info('Running scheduled data ingestion');
    try {
      await apiFetcher.ingestData();
      logger.info('Scheduled data ingestion completed');
    } catch (error) {
      logger.error('Scheduled data ingestion failed:', error);
    }
  });
}

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
  logger.info(`Health check available at http://localhost:${PORT}/api/health`);
});

module.exports = app;
