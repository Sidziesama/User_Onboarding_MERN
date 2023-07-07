// This router handles the user login requests.

const router = require("express").Router();
const { User } = require("../Models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
// const Token = require("../Models/verificationTokens");
// const crypto = require("crypto");
// const sendEmail = require("../utilities/sendEmail");

/** This post function validates the user email and password. 
 * It checks if the email id exists in the database. If the email does not exist, it displays an Invalid Credentials Error Message
 * It checks if the password is correct or not.
 */
router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const token = user.generateAuthToken();
		res.status(200).send({ data: token, message: "Logged in successfully !" });

	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

/** This function validates the user input data.
 * It checks if the email id is valid and is required, 
 * and the password is required.
 */
const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;