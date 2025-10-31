const express = require('express');
const router = express.Router();
const districtController = require('../controllers/districtController');

// Get all districts
router.get('/', districtController.getAllDistricts);

// Get district by ID
router.get('/:id', districtController.getDistrictById);

// Get district comparison data
router.get('/:id/compare', districtController.getDistrictComparison);

module.exports = router;
