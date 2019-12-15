let scoreController = require("../controllers/scoreController");
const Score = require("../models/Score");
const Highscore = require("../models/HighScore");

let currentHighscore = 0;

/**
 * /
 */

module.exports = function (io/*,sharedSession ,sessionSetup */) {
	
	io.on("connection",
		socket => {
			console.log("Socket started");
			// if (currentHighscore === 0) {
				Highscore.findOne({}, (err, highscore) => {
					// if no highscore is saved in database
					if (err) {
						currentHighscore = 0;
						console.log("The current highscore is: " + currentHighscore);
					}
					// if highscore saved in database
					if (highscore) {
						console.log("The current highscore is: " + highscore);
						currentHighscore = highscore.score;
					}
					socket.emit("highscore", { score: currentHighscore });
				});
			// }

			socket.on("score", (data) => {
				const newScore = new Score(data);
				socket.emit("score", newScore);

				console.log("newScore: " + newScore);
				try {
					scoreController.addNewScoreWS(newScore);
					try {
						// If a new highscore has been made
						if (currentHighscore < newScore.score) {
							let newHighscore = new Highscore(data);
							currentHighscore = newHighscore.score;
							// Emit new score to all subscribers
							// Remember to listen for the event while testing/using
							io.sockets.emit("highscore", { score: currentHighscore });
							// Save new highscore to database
							scoreController.addNewHighscoreWS(newHighscore);
						}
					} catch (error) {
						console.error("failed to save highscore" + error);
					}
				} catch (error) {
					console.error("failed to save score" + error);
				}
			});

			socket.on("error", (error) => {
				console.log(`The server received: ${error["code"]}`);
			});

			socket.on("disconnect", () => {
				console.log("User disconnected");
			});
		},
	);
};