const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

const razorpay = new Razorpay({

  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_aPDakOSgv4Z2HQ",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "vJri5HLfSnmYW2DOyzuFowcW"
});

router.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  const options = {
    amount: amount * 100, 
    currency: "INR",
    receipt: "receipt_order_" + Date.now(),
  };

   try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Razorpay error:", err);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
});


module.exports = router;
