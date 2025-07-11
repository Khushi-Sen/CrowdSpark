const Campaign = require('../models/campaign');

exports.createCampaign = async (req, res) => {
  try {
    const { title, description, goal, category } = req.body;
    const userId = req.body.userId;

    if (!title || !description || !goal || !category || !userId) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const campaign = new Campaign({ title, description, goal, category, createdBy: userId });
    await campaign.save();

    res.status(201).json(campaign);
  } catch (err) {
    console.error('Create Campaign Error:', err);
    res.status(500).json({ message: 'Failed to create campaign' });
  }
};

exports.getAllCampaigns = async (req, res) => {
  try {
    const now = new Date();
    await Campaign.deleteMany({
  $or: [
    { endDate: { $lt: new Date() } },
    { status: "rejected" }
  ]
});

    const campaigns = await Campaign.find({ endDate: { $gte: now } }).sort({ createdAt: -1 });

    res.json(campaigns);
  } catch (err) {
    console.error('Fetch Campaigns Error:', err);
    res.status(500).json({ message: 'Failed to fetch campaigns' });
  }
};


exports.getUserCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ createdBy: req.params.userId });
    res.json(campaigns);
  } catch (err) {
    console.error('Fetch My Campaigns Error:', err);
    res.status(500).json({ message: 'Failed to fetch user campaigns' });
  }
};
