const redis = require('redis');
const env = require('../config/env');
const logger = require('../utils/logger');

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;

    if (env.REDIS_URL) {
      this.initRedis();
    }
  }

  initRedis() {
    try {
      this.client = redis.createClient({
        url: env.REDIS_URL
      });

      this.client.on('error', (err) => {
        logger.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        logger.info('Connected to Redis');
        this.isConnected = true;
      });

      this.client.on('ready', () => {
        this.isConnected = true;
      });

      this.client.on('end', () => {
        this.isConnected = false;
      });

      this.client.connect();
    } catch (error) {
      logger.error('Failed to initialize Redis:', error);
    }
  }

  // Get data from cache
  async get(key) {
    try {
      if (!this.isConnected || !this.client) {
        return null;
      }

      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  // Set data in cache with TTL
  async set(key, data, ttl = 3600) {
    try {
      if (!this.isConnected || !this.client) {
        return false;
      }

      await this.client.setEx(key, ttl, JSON.stringify(data));
      return true;
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  }

  // Delete data from cache
  async del(key) {
    try {
      if (!this.isConnected || !this.client) {
        return false;
      }

      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  }

  // Clear all cache
  async clear() {
    try {
      if (!this.isConnected || !this.client) {
        return false;
      }

      await this.client.flushAll();
      return true;
    } catch (error) {
      logger.error('Cache clear error:', error);
      return false;
    }
  }

  // Get cache stats
  async getStats() {
    try {
      if (!this.isConnected || !this.client) {
        return { status: 'disconnected' };
      }

      const info = await this.client.info();
      return {
        status: 'connected',
        info: info
      };
    } catch (error) {
      logger.error('Cache stats error:', error);
      return { status: 'error', error: error.message };
    }
  }

  // Graceful shutdown
  async close() {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
    }
  }
}

module.exports = new CacheService();
