const mongoose = require('mongoose');

const highscoreSchema = mongoose.Schema({
  score: {
    type: Array,
    required: true,
    trim: true,
  }
});

const Highscore = mongoose.model('Highscore', highscoreSchema);

module.exports = Highscore;