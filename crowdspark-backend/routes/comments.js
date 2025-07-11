const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');


router.get('/:campaignId', async (req, res) => {
  try {
    const comments = await Comment.find({ campaignId: req.params.campaignId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});


router.post('/:campaignId', async (req, res) => {
  try {
    const { text, author } = req.body;
    const newComment = new Comment({
      campaignId: req.params.campaignId,
      user: author || 'Guest',
      text,
    });
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ message: 'Failed to post comment', error: err.message });
  }
});

module.exports = router;
