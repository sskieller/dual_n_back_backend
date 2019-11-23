const express = require('express');
const Score = require('../models/Scores');
const Highscore = require('../models/HighScore');
const router = express.Router();
const auth = require('../middleware/auth');

/* 
 * /scores
*/

router.post('/', auth, async(req,res) => {
  // Add new score
  try {
    const score = new Score(req.body);
    await score.save();
    // MAYBE WEBSOCKET HERE??
    // Update Highscore according to new score
    res.status(201).send(score);

  } catch (error) {
    res.status(400).send(error);
  };
});

router.get('/highscore', auth, async(req,res) => {
  try {
    
  } catch (error) {
    
  }
})

module.exports = router;