const mongoose = require('mongoose');

const scoreSchema = mongoose.Schema({
  score: {
    type: Number,
    required: true,
    trim: true,
  }
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;