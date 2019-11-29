const User = require("../models/User");

module.exports = {
	registerNewUser: async (req, res) => {
		// Register new user
		try {
			const user = new User(req.body);
			// Check if user already existing
			const query = User.where({ username: user.username });
			query.findOne(async (err, userAlreadyCreated) => {
				if (userAlreadyCreated) return res.status(409).send({ error: "User already created" });
				// Continue with user registration
				await user.save();
				const token = await user.generateAuthToken();
				res.status(201).send({ user, token });
			});

		} catch (error) {
			res.status(400).send(error);
		}
	},

	loginUser: async (req, res) => {
		// Login registered user
		try {
			console.log("logging in");
			const { username, password } = req.body;
      console.log(req.body);
      const user = await User.findByCredentials(username, password);
      console.log("user found")
			if (!user) {
				return res.status(401).send({ error: "Login failed! Check authentication credentials" });
			}
			const token = await user.generateAuthToken();
			res.status(200).send({ user, token });
		} catch (error) {
			res.status(400).send(error);
		}
	},

	logoutUser: async (req, res) => {
		// Logout user
		try {
			req.user.tokens = req.user.tokens.filter((token) => {
				return token.token != req.token;
			});

			await req.user.save();
			res.send();

		} catch (error) {
			res.status(500).send(error);
		}
	},

	logoutAll: async (req, res) => {
		// Logout user from all devices
		try {
			req.user.tokens.splice(0, req.user.tokens.length);

			await req.user.save();
			res.send();

		} catch (error) {
			res.status(500).send(error);
		}
	},
};