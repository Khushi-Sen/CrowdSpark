
// const express = require('express');
// const router = express.Router();
// const Campaign = require('../models/campaign');


// router.post('/', async (req, res) => {
//   try {
//     const { title, description, goal, category, endDate, userId } = req.body;

//     if (!category || !userId) {
//       return res.status(400).json({ message: 'Category and userId are required' });
//     }

//     const campaign = new Campaign({
//       title,
//       description,
//       goal,
//       category,
//       endDate,
//       creator: userId,  
//       status: "pending"

//     });

//     await campaign.save();

//     res.status(201).json({ message: 'Campaign created successfully', campaign });
//   } catch (err) {
//     console.error("Create Campaign Error:", err);
//     res.status(500).json({ message: "Failed to create campaign" });
//   }
// });


// router.get('/', async (req, res) => {
//   try {
//     const campaigns = await Campaign.find().sort({ createdAt: -1 });
//     res.json(campaigns);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch campaigns' });
//   }
// });


// router.get('/user/:userId', async (req, res) => {
//   try {
//     const campaigns = await Campaign.find({ creator: req.params.userId }).sort({ createdAt: -1 });
//     res.json(campaigns);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch user campaigns' });
//   }
// });


// router.get('/:id', async (req, res) => {
//   try {
//     const campaign = await Campaign.findById(req.params.id).populate('creator');
//     if (!campaign) {
//       return res.status(404).json({ message: 'Campaign not found' });
//     }
//     res.json(campaign);
//   } catch (err) {
//     console.error('Fetch campaign by ID error:', err);
//     res.status(500).json({ message: 'Failed to fetch campaign' });
//   }
// });



// router.post('/payment/success', async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, campaignId } = req.body;

//   try {
    
//     const campaign = await Campaign.findById(campaignId);
//     if (!campaign) {
//       return res.status(404).json({ message: 'Campaign not found' });
//     }

//     campaign.raisedAmount = (campaign.raisedAmount || 0) + amount;
//     await campaign.save();

//     res.status(200).json({ message: 'Payment recorded and campaign updated' });
//   } catch (err) {
//     console.error("Payment success error:", err);
//     res.status(500).json({ message: "Failed to update campaign" });
//   }
// });


// router.put('/:campaignId/fund', async (req, res) => {
//   const { amount } = req.body;

//   if (!amount || amount <= 0) {
//     return res.status(400).json({ message: 'Invalid donation amount' });
//   }

//   try {
//     const campaign = await Campaign.findById(req.params.campaignId);
//     if (!campaign) {
//       return res.status(404).json({ message: 'Campaign not found' });
//     }

//     campaign.raisedAmount = (campaign.raisedAmount || 0) + amount;
//     await campaign.save();

//     res.json({ message: 'Campaign updated with your donation', raisedAmount: campaign.raisedAmount });
//   } catch (err) {
//     console.error('Error updating campaign funds:', err);
//     res.status(500).json({ message: 'Failed to update campaign' });
//   }
// });


// module.exports = router;

const express = require('express');
const router = express.Router();
const Campaign = require('../models/campaign');

const autoDeleteExpiredOrRejectedCampaigns = async () => {
  try {
    const now = new Date();
    await Campaign.deleteMany({
      $or: [
        { status: "rejected" },
        { endDate: { $lt: now } }
      ]
    });
  } catch (err) {
    console.error("Auto delete error:", err);
  }
};


router.post('/', async (req, res) => {
  try {
    const { title, description, goal, category, endDate, userId } = req.body;

    if (!category || !userId) {
      return res.status(400).json({ message: 'Category and userId are required' });
    }

    const campaign = new Campaign({
      title,
      description,
      goal,
      category,
      endDate,
      creator: userId,
      status: "pending"
    });

    await campaign.save();
    res.status(201).json({ message: 'Campaign created successfully', campaign });
  } catch (err) {
    console.error("Create Campaign Error:", err);
    res.status(500).json({ message: "Failed to create campaign" });
  }
});


router.get('/', async (req, res) => {
  try {
    await autoDeleteExpiredOrRejectedCampaigns(); 
    const campaigns = await Campaign.find({ status: "approved" }).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch campaigns' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    await autoDeleteExpiredOrRejectedCampaigns();
    const campaigns = await Campaign.find({
      creator: req.params.userId,
      status: { $ne: "rejected" }
    }).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user campaigns' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('creator');
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (err) {
    console.error('Fetch campaign by ID error:', err);
    res.status(500).json({ message: 'Failed to fetch campaign' });
  }
});


router.post('/payment/success', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, campaignId } = req.body;

  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    campaign.raisedAmount = (campaign.raisedAmount || 0) + amount;
    await campaign.save();

    res.status(200).json({ message: 'Payment recorded and campaign updated' });
  } catch (err) {
    console.error("Payment success error:", err);
    res.status(500).json({ message: "Failed to update campaign" });
  }
});


router.put('/:campaignId/fund', async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid donation amount' });
  }

  try {
    const campaign = await Campaign.findById(req.params.campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    campaign.raisedAmount = (campaign.raisedAmount || 0) + amount;
    await campaign.save();

    res.json({ message: 'Campaign updated with your donation', raisedAmount: campaign.raisedAmount });
  } catch (err) {
    console.error('Error updating campaign funds:', err);
    res.status(500).json({ message: 'Failed to update campaign' });
  }
});


router.delete('/:campaignId', async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (err) {
    console.error("Error deleting campaign:", err);
    res.status(500).json({ message: "Failed to delete campaign" });
  }
});

module.exports = router;
