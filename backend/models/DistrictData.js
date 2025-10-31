const mongoose = require('mongoose');

const districtDataSchema = new mongoose.Schema({
  // API response fields (normalized)
  state_name: {
    type: String,
    required: true,
    index: true
  },
  district_name: {
    type: String,
    required: true,
    index: true
  },
  block_name: {
    type: String,
    index: true
  },
  panchayat_name: {
    type: String,
    index: true
  },

  // Key metrics
  persons_provided_work: {
    type: Number,
    default: 0
  },
  total_wages_paid: {
    type: Number,
    default: 0
  },
  total_person_days: {
    type: Number,
    default: 0
  },
  total_households_worked: {
    type: Number,
    default: 0
  },

  // Additional fields from API
  average_days_of_work: {
    type: Number,
    default: 0
  },
  work_completed: {
    type: String
  },
  scheme_name: {
    type: String
  },

  // Metadata
  created_at: {
    type: Date,
    default: Date.now,
    index: true
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  data_source: {
    type: String,
    default: 'api'
  },
  api_response_hash: {
    type: String,
    index: true
  }
});

// Compound indexes for efficient queries
districtDataSchema.index({ state_name: 1, district_name: 1, created_at: -1 });
districtDataSchema.index({ created_at: -1 });

// Update timestamp on save
districtDataSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Static method to get latest data for a district
districtDataSchema.statics.getLatestByDistrict = function(districtName, stateName = 'Uttar Pradesh') {
  return this.findOne({
    district_name: new RegExp(`^${districtName}$`, 'i'),
    state_name: stateName
  }).sort({ created_at: -1 });
};

// Static method to get aggregated data by district
districtDataSchema.statics.getAggregatedByDistrict = function(districtName, stateName = 'Uttar Pradesh') {
  return this.aggregate([
    {
      $match: {
        district_name: new RegExp(`^${districtName}$`, 'i'),
        state_name: stateName
      }
    },
    {
      $group: {
        _id: '$district_name',
        totalPersonsWorked: { $sum: '$persons_provided_work' },
        totalWagesPaid: { $sum: '$total_wages_paid' },
        totalPersonDays: { $sum: '$total_person_days' },
        totalHouseholds: { $sum: '$total_households_worked' },
        avgDaysOfWork: { $avg: '$average_days_of_work' },
        recordCount: { $sum: 1 },
        latestUpdate: { $max: '$created_at' }
      }
    }
  ]);
};

module.exports = mongoose.model('DistrictData', districtDataSchema);
