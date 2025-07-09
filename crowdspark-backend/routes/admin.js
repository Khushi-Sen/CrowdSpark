
const express = require('express');
const router = express.Router();
const Campaign = require('../models/campaign');
const User = require('../models/user');


router.get('/campaigns', async (req, res) => {
  try {
    const { search = "", status = "all" } = req.query;

    const query = {
      ...(search && { title: new RegExp(search, "i") }),
      ...(status !== "all" && { status })
    };

    const campaigns = await Campaign.find(query).populate("creator", "email");
    res.json(campaigns);
  } catch (err) {
    console.error("Admin fetch campaigns error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.patch('/campaigns/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Campaign.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: "Campaign not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update campaign status" });
  }
});


router.get('/stats', async (req, res) => {
  try {
    const totalCampaigns = await Campaign.countDocuments();
    const pendingCampaigns = await Campaign.countDocuments({ status: "pending" });
    const approvedCampaigns = await Campaign.countDocuments({ status: "approved" });
    const rejectedCampaigns = await Campaign.countDocuments({ status: "rejected" });
    const totalUsers = await User.countDocuments();

    res.json({
      totalCampaigns,
      pendingCampaigns,
      approvedCampaigns,
      rejectedCampaigns,
      totalUsers,
      totalContributions: "Coming Soon"
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Stats fetch failed" });
  }
});

router.put('/campaigns/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json({ message: `Campaign ${status} successfully`, campaign });
  } catch (err) {
    console.error("Admin update status error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
