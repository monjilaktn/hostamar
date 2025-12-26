const express = require('express');
const router = express.Router();
const DGPAsset = require('../models/DGPAsset');
const auth = require('../middleware/auth');

// Create a new DGP Asset
router.post('/', auth, async (req, res) => {
  try {
    const { symbol, name, price } = req.body;
    const asset = new DGPAsset({ symbol, name, price, owner: req.user.id });
    await asset.save();
    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ message: 'Error creating asset', error: err.message });
  }
});

// Read all DGP Assets
router.get('/', auth, async (req, res) => {
  try {
    const assets = await DGPAsset.find();
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update a DGP Asset
router.put('/:id', auth, async (req, res) => {
  try {
    const { price, status } = req.body;
    const asset = await DGPAsset.findByIdAndUpdate(
      req.params.id,
      { price, status, lastUpdated: Date.now() },
      { new: true }
    );
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    res.json(asset);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
});

// Delete a DGP Asset
router.delete('/:id', auth, async (req, res) => {
  try {
    const asset = await DGPAsset.findByIdAndDelete(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    res.json({ message: 'Asset deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed', error: err.message });
  }
});

module.exports = router;
