const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
	const token = req.header("Authorization").replace("Bearer ", "");
	let data = "";
	try {
		console.log("verifying");
		// eslint-disable-next-line no-undef
		data = jwt.verify(token, process.env.JWT_KEY);
		console.log("verified");
	} catch (error) {

		console.error(error);
		// throw new Error(error);
	}


	try {
		const user = await User.findOne(
			{
				_id: data._id,
				"tokens.token": token
			}
		);

		if (!user) {
			console.log("User not logged in");
			throw new Error();
		}

    req.user = user;
		req.token = token;

		next();
	} catch (error) {
		res.status(401).send({
			error: "Not authorized to access this resource"
		});
	}
};

// eslint-disable-next-line no-undef
module.exports = auth;