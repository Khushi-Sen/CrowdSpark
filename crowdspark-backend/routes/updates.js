const express = require('express');
const router = express.Router();
const Update = require('../models/Update');

router.post('/:campaignId', async (req, res) => {
  const { campaignId } = req.params;
  const { title, message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    const update = new Update({ campaignId, title, message });
    await update.save();
    res.status(201).json(update);
  } catch (err) {
    console.error('Error creating update:', err);
    res.status(500).json({ message: 'Failed to create update' });
  }
});

router.get('/:campaignId', async (req, res) => {
  const { campaignId } = req.params;

  try {
    const updates = await Update.find({ campaignId }).sort({ createdAt: -1 });
    res.status(200).json(updates);
  } catch (err) {
    console.error('Error fetching updates:', err);
    res.status(500).json({ message: 'Failed to fetch updates' });
  }
});

module.exports = router;
