const geoService = require('../services/geoService');
const logger = require('../utils/logger');

// Reverse geocode coordinates to district
const reverseGeocode = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }

    // Validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude) ||
        latitude < -90 || latitude > 90 ||
        longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        error: 'Invalid coordinates'
      });
    }

    const district = await geoService.reverseGeocode(latitude, longitude);

    if (!district) {
      return res.status(404).json({
        success: false,
        error: 'Could not determine district from coordinates'
      });
    }

    logger.info(`Reverse geocoded ${lat},${lng} to district: ${district}`);

    res.json({
      success: true,
      data: { district }
    });
  } catch (error) {
    logger.error('Error in reverse geocoding:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reverse geocode coordinates'
    });
  }
};

module.exports = {
  reverseGeocode
};
