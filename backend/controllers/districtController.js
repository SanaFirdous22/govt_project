const DistrictData = require('../models/DistrictData');
const cacheService = require('../services/cacheService');
const logger = require('../utils/logger');

const CACHE_TTL = 3600; // 1 hour

// Get all districts
const getAllDistricts = async (req, res) => {
  try {
    const cacheKey = 'districts:list';
    let districts = await cacheService.get(cacheKey);

    if (!districts) {
      districts = await DistrictData.distinct('district_name', {
        state_name: 'Uttar Pradesh'
      }).sort();

      await cacheService.set(cacheKey, districts, CACHE_TTL);
      logger.info('Districts list cached');
    }

    res.json({
      success: true,
      data: districts,
      count: districts.length
    });
  } catch (error) {
    logger.error('Error fetching districts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch districts'
    });
  }
};

// Get district by ID/name
const getDistrictById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `district:${id}`;

    let districtData = await cacheService.get(cacheKey);

    if (!districtData) {
      // Get latest data for the district
      districtData = await DistrictData.findOne({
        district_name: new RegExp(`^${id}$`, 'i'),
        state_name: 'Uttar Pradesh'
      }).sort({ created_at: -1 });

      if (!districtData) {
        return res.status(404).json({
          success: false,
          error: 'District not found'
        });
      }

      // Get previous month data for comparison
      const currentDate = new Date(districtData.created_at);
      const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

      const prevData = await DistrictData.findOne({
        district_name: districtData.district_name,
        state_name: 'Uttar Pradesh',
        created_at: { $lt: currentDate, $gte: prevMonth }
      }).sort({ created_at: -1 });

      districtData = {
        ...districtData.toObject(),
        comparison: prevData ? calculateComparison(districtData, prevData) : null
      };

      await cacheService.set(cacheKey, districtData, CACHE_TTL);
      logger.info(`District data cached for ${id}`);
    }

    res.json({
      success: true,
      data: districtData
    });
  } catch (error) {
    logger.error('Error fetching district data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch district data'
    });
  }
};

// Get district comparison data
const getDistrictComparison = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `district:compare:${id}`;

    let comparisonData = await cacheService.get(cacheKey);

    if (!comparisonData) {
      // Get district data
      const districtData = await DistrictData.findOne({
        district_name: new RegExp(`^${id}$`, 'i'),
        state_name: 'Uttar Pradesh'
      }).sort({ created_at: -1 });

      if (!districtData) {
        return res.status(404).json({
          success: false,
          error: 'District not found'
        });
      }

      // Get state average
      const stateData = await DistrictData.aggregate([
        {
          $match: {
            state_name: 'Uttar Pradesh',
            created_at: districtData.created_at
          }
        },
        {
          $group: {
            _id: null,
            avgPersonsWorked: { $avg: '$persons_provided_work' },
            avgWagesPaid: { $avg: '$total_wages_paid' },
            avgPersonDays: { $avg: '$total_person_days' },
            avgHouseholds: { $avg: '$total_households_worked' }
          }
        }
      ]);

      // Get top/bottom districts
      const allDistricts = await DistrictData.find({
        state_name: 'Uttar Pradesh',
        created_at: districtData.created_at
      }).sort({ persons_provided_work: -1 });

      const topDistricts = allDistricts.slice(0, 3);
      const bottomDistricts = allDistricts.slice(-3).reverse();

      comparisonData = {
        district: districtData,
        stateAverage: stateData[0] || null,
        topDistricts,
        bottomDistricts
      };

      await cacheService.set(cacheKey, comparisonData, CACHE_TTL);
      logger.info(`Comparison data cached for ${id}`);
    }

    res.json({
      success: true,
      data: comparisonData
    });
  } catch (error) {
    logger.error('Error fetching comparison data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch comparison data'
    });
  }
};

// Helper function to calculate month-over-month comparison
const calculateComparison = (current, previous) => {
  const metrics = [
    'persons_provided_work',
    'total_wages_paid',
    'total_person_days',
    'total_households_worked'
  ];

  const comparison = {};

  metrics.forEach(metric => {
    const currentValue = current[metric] || 0;
    const previousValue = previous[metric] || 0;
    const change = previousValue !== 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;

    comparison[metric] = {
      current: currentValue,
      previous: previousValue,
      change: Math.round(change * 100) / 100, // Round to 2 decimal places
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'same'
    };
  });

  return comparison;
};

module.exports = {
  getAllDistricts,
  getDistrictById,
  getDistrictComparison
};
