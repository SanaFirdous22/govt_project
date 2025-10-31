const axios = require('axios');
const cacheService = require('./cacheService');
const env = require('../config/env');
const logger = require('../utils/logger');

class GeoService {
  constructor() {
    this.nominatimBaseURL = 'https://nominatim.openstreetmap.org';
    this.cacheTTL = env.GEOCODE_CACHE_TTL || 86400; // 24 hours
    this.rateLimitDelay = 1000; // 1 second between requests
    this.lastRequestTime = 0;
  }

  // Rate limiting for Nominatim API
  async enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.rateLimitDelay) {
      const waitTime = this.rateLimitDelay - timeSinceLastRequest;
      await this.sleep(waitTime);
    }

    this.lastRequestTime = Date.now();
  }

  // Sleep utility
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Reverse geocode coordinates to get district
  async reverseGeocode(lat, lng) {
    try {
      const cacheKey = `geocode:${lat.toFixed(4)},${lng.toFixed(4)}`;

      // Check cache first
      const cachedResult = await cacheService.get(cacheKey);
      if (cachedResult) {
        logger.info(`Using cached geocode result for ${lat},${lng}`);
        return cachedResult.district;
      }

      // Enforce rate limiting
      await this.enforceRateLimit();

      const url = `${this.nominatimBaseURL}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`;

      logger.info(`Reverse geocoding: ${lat},${lng}`);

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'OurVoiceOurRights/1.0'
        },
        timeout: 10000 // 10 seconds
      });

      if (!response.data || !response.data.address) {
        logger.warn(`No address found for coordinates: ${lat},${lng}`);
        return null;
      }

      const address = response.data.address;

      // Extract district name (try different possible fields)
      let district = address.state_district ||
                     address.county ||
                     address.city_district ||
                     address.suburb;

      // If no district found, try to extract from display_name
      if (!district && response.data.display_name) {
        const displayName = response.data.display_name;
        // Look for common district patterns in Indian addresses
        const districtMatch = displayName.match(/([^,]+),\s*([^,]+),\s*Uttar Pradesh/);
        if (districtMatch) {
          district = districtMatch[1].trim();
        }
      }

      // Clean up district name
      if (district) {
        district = district.replace(/\s+district/i, '').trim();
        // Capitalize first letter of each word
        district = district.replace(/\b\w/g, l => l.toUpperCase());
      }

      // Validate that the location is in Uttar Pradesh
      const isInUP = address.state === 'Uttar Pradesh' ||
                     address.state_code === 'UP' ||
                     response.data.display_name.includes('Uttar Pradesh');

      if (!isInUP) {
        logger.warn(`Location ${lat},${lng} is not in Uttar Pradesh: ${address.state}`);
        return null;
      }

      // Cache the result
      const cacheData = {
        district: district,
        fullAddress: response.data.display_name,
        timestamp: new Date().toISOString()
      };

      await cacheService.set(cacheKey, cacheData, this.cacheTTL);

      logger.info(`Successfully geocoded ${lat},${lng} to district: ${district}`);

      return district;

    } catch (error) {
      logger.error('Reverse geocoding error:', error);

      // If geocoding fails, return null (user can select manually)
      return null;
    }
  }

  // Get coordinates for a district (for validation)
  async geocodeDistrict(districtName, state = 'Uttar Pradesh') {
    try {
      const cacheKey = `geocode_district:${districtName}_${state}`;

      const cachedResult = await cacheService.get(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      await this.enforceRateLimit();

      const query = `${districtName}, ${state}, India`;
      const url = `${this.nominatimBaseURL}/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'OurVoiceOurRights/1.0'
        },
        timeout: 10000
      });

      if (!response.data || response.data.length === 0) {
        return null;
      }

      const result = response.data[0];
      const coordinates = {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name
      };

      await cacheService.set(cacheKey, coordinates, this.cacheTTL);

      return coordinates;

    } catch (error) {
      logger.error('District geocoding error:', error);
      return null;
    }
  }

  // Validate if coordinates are within Uttar Pradesh bounds (rough approximation)
  isWithinUP(lat, lng) {
    // Rough bounding box for Uttar Pradesh
    const bounds = {
      north: 30.4,
      south: 23.9,
      east: 84.7,
      west: 77.1
    };

    return lat >= bounds.south && lat <= bounds.north &&
           lng >= bounds.west && lng <= bounds.east;
  }
}

module.exports = new GeoService();
