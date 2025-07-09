const express = require('express');
const router = express.Router();
const User = require('../models/user'); 
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);


router.get('/all-users', async (req, res) => {
  try {
    const users = await User.find();
    console.log("🧾 Users in DB:", users);
    res.json(users);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
