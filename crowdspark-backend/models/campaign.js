const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  title: String,
  description: String,
  goal: Number,
  category: String,
  endDate: Date,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  raisedAmount: {
  type: Number,
  default: 0
} 

}, { timestamps: true });

module.exports = mongoose.model('Campaign', CampaignSchema);
