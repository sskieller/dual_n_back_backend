const Score = require('../models/Score');
const Highscore = require('../models/HighScore');

module.exports = {
  addNewScore: async(req,res) => {
    try {
      const newScore = new Score(req.body);
      await newScore.save();
    } catch (error) {
      res.status(400).send(error);
    };
  },

  addNewHighscore: async(req,res) => {
    try {
      const highscore = new Highscore(req.body);
      await highscore.save();
    } catch (error) {
      res.status(400).send(error);
    };
  },

  addNewScoreWS: async(req) => {
    try {
      const newScore = new Score(req);
      await newScore.save();
    } catch (error) {
      console.log(error);
      return error;  
    }
  },

  addNewHighscoreWS: async(req) => {
    try {
      const newHighscore = new Highscore(req);

      // Must deleteMany directly from Highscore schema
      await Highscore.deleteMany({}, (err) => {
        if (err) console.log(err);
      });
      // Saving the new highscore instead of the old one
      await newHighscore.save();
    } catch (error) {
      console.log(error);
      return error;
    }
  }
};