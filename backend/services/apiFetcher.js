const axios = require('axios');
const crypto = require('crypto');
const DistrictData = require('../models/DistrictData');
const env = require('../config/env');
const logger = require('../utils/logger');

class ApiFetcher {
  constructor() {
    this.baseURL = env.MGNREGA_API_URL;
    this.apiKey = env.DATA_GOV_API_KEY;
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
    this.circuitBreakerFailures = 0;
    this.circuitBreakerThreshold = 5;
    this.circuitBreakerTimeout = 300000; // 5 minutes
    this.lastFailureTime = null;
  }

  // Check if circuit breaker is open
  isCircuitBreakerOpen() {
    if (this.circuitBreakerFailures >= this.circuitBreakerThreshold) {
      const timeSinceLastFailure = Date.now() - (this.lastFailureTime || 0);
      if (timeSinceLastFailure < this.circuitBreakerTimeout) {
        return true;
      } else {
        // Reset circuit breaker after timeout
        this.circuitBreakerFailures = 0;
        this.lastFailureTime = null;
      }
    }
    return false;
  }

  // Record circuit breaker failure
  recordFailure() {
    this.circuitBreakerFailures++;
    this.lastFailureTime = Date.now();
  }

  // Record circuit breaker success
  recordSuccess() {
    this.circuitBreakerFailures = 0;
    this.lastFailureTime = null;
  }

  // Sleep utility for retry delays
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Fetch data from MGNREGA API with retry logic
  async fetchDataWithRetry(url, attempt = 1) {
    try {
      if (this.isCircuitBreakerOpen()) {
        throw new Error('Circuit breaker is open - API temporarily unavailable');
      }

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'OurVoiceOurRights/1.0'
        },
        timeout: 30000 // 30 seconds
      });

      this.recordSuccess();
      return response.data;
    } catch (error) {
      logger.warn(`API fetch attempt ${attempt} failed:`, error.message);

      if (attempt < this.retryAttempts) {
        // Exponential backoff
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        logger.info(`Retrying in ${delay}ms...`);
        await this.sleep(delay);
        return this.fetchDataWithRetry(url, attempt + 1);
      }

      this.recordFailure();
      throw error;
    }
  }

  // Normalize API response data
  normalizeData(records) {
    return records.map(record => ({
      state_name: record.state_name || record.State_Name,
      district_name: record.district_name || record.District_Name,
      block_name: record.block_name || record.Block_Name,
      panchayat_name: record.panchayat_name || record.Panchayat_Name,
      persons_provided_work: parseInt(record.persons_provided_work || record.Persons_Provided_Work || 0),
      total_wages_paid: parseFloat(record.total_wages_paid || record.Total_Wages_Paid || 0),
      total_person_days: parseInt(record.total_person_days || record.Total_Person_Days || 0),
      total_households_worked: parseInt(record.total_households_worked || record.Total_Households_Worked || 0),
      average_days_of_work: parseFloat(record.average_days_of_work || record.Average_Days_of_Work || 0),
      work_completed: record.work_completed || record.Work_Completed,
      scheme_name: record.scheme_name || record.Scheme_Name,
      data_source: 'api'
    }));
  }

  // Generate hash of API response for deduplication
  generateResponseHash(data) {
    const hash = crypto.createHash('md5');
    hash.update(JSON.stringify(data));
    return hash.digest('hex');
  }

  // Main ingestion method
  async ingestData() {
    try {
      logger.info('Starting MGNREGA data ingestion');

      // Build API URL with filters
      const url = `${this.baseURL}?api-key=${this.apiKey}&format=json&limit=10000&filters[state_name]=Uttar Pradesh`;

      logger.info(`Fetching data from: ${url.replace(this.apiKey, '***')}`);

      const apiResponse = await this.fetchDataWithRetry(url);
      const records = apiResponse.records || [];

      if (!records.length) {
        logger.warn('No records received from API');
        return { success: false, message: 'No data received' };
      }

      logger.info(`Received ${records.length} records from API`);

      // Normalize data
      const normalizedData = this.normalizeData(records);

      // Generate response hash
      const responseHash = this.generateResponseHash(normalizedData);

      // Check if we already have this data
      const existingData = await DistrictData.findOne({ api_response_hash: responseHash });
      if (existingData) {
        logger.info('Data already exists, skipping ingestion');
        return { success: true, message: 'Data already up to date', records: records.length };
      }

      // Save new data
      const savedRecords = [];
      for (const record of normalizedData) {
        const districtRecord = new DistrictData({
          ...record,
          api_response_hash: responseHash,
          created_at: new Date()
        });
        await districtRecord.save();
        savedRecords.push(districtRecord);
      }

      logger.info(`Successfully saved ${savedRecords.length} records to database`);

      return {
        success: true,
        message: 'Data ingestion completed',
        records: savedRecords.length,
        hash: responseHash
      };

    } catch (error) {
      logger.error('Data ingestion failed:', error);
      return {
        success: false,
        message: error.message,
        error: error.stack
      };
    }
  }

  // Get cached data when API is unavailable
  async getCachedData(districtName = null) {
    try {
      const query = { state_name: 'Uttar Pradesh' };

      if (districtName) {
        query.district_name = new RegExp(`^${districtName}$`, 'i');
      }

      const cachedData = await DistrictData.find(query)
        .sort({ created_at: -1 })
        .limit(districtName ? 1 : 100);

      return {
        success: true,
        data: cachedData,
        cached: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error fetching cached data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new ApiFetcher();
