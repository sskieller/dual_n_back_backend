let scoreController = require("../controllers/scoreController");
const Score = require("../models/Score");
const Highscore = require("../models/HighScore");

let currentHighscores = [];

/**
 * /
 */

function sortNumber(a, b) {
	return a - b;
}

module.exports = function (io/*,sharedSession ,sessionSetup */) {
	
	io.on("connection",
		socket => {
			console.log("Socket started");
			// if (currentHighscore === 0) {
				Highscore.find
				Highscore.findOne({}, (err, highscore) => {
					// if no highscore is saved in database
					if (err) {
						currentHighscores = [0];
					}
					// if highscore saved in database
					if (highscore) {
						currentHighscores = highscore.score;
					}
					socket.emit("highscore", { score: currentHighscores });
				});
			// }

			socket.on("score", (data) => {
				const newScore = new Score(data);
				socket.emit("score", newScore);
				console.log("New score recieved: " + newScore.score);
				try {
					scoreController.addNewScoreWS(newScore);
					try {
						// If a new highscore has been made
						currentHighscores.sort(sortNumber);
						if(currentHighscores[0] < newScore.score || currentHighscores.length < 10) {

							if(currentHighscores.length < 10){
								currentHighscores.push(newScore.score);
							}else{
								currentHighscores[0] = newScore.score;
							}
							
							let newHighscores = new Highscore();
							currentHighscores.sort(sortNumber);
							newHighscores.score = currentHighscores;

							// Emit new score to all subscribers
							// Remember to listen for the event while testing/using
							io.sockets.emit("highscore", { score: currentHighscores });
							// Save new highscores to database
							scoreController.addNewHighscoreWS(newHighscores);
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