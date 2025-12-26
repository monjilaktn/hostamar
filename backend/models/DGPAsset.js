const mongoose = require('mongoose');

const DGPAssetSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'locked', 'retired'], default: 'active' }
});

module.exports = mongoose.model('DGPAsset', DGPAssetSchema);
