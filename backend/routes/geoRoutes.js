const express = require('express');
const router = express.Router();
const geoController = require('../controllers/geoController');

// Reverse geocode coordinates to district
router.post('/reverse', geoController.reverseGeocode);

module.exports = router;
