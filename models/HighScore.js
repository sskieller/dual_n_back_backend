const mongoose = require('mongoose');

const highscoreSchema = mongoose.Schema({
  highscore: {
    type: Number,
    required: true,
    trim: true,
  }
});

const Highscore = mongoose.model('Highscore', highscoreSchema);

module.exports = Highscore;