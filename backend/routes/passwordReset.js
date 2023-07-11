/* This route helps the users who have forgotten their passwords.
 * A user can verify themselves using an OTP which then directs them to a reset password page. 
 */

const router = require("express").Router();
const { User } = require("../Models/user");
const sendEmail = require("../utilities/sendEmail");
const generateOTP = require("../utilities/otp");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const authenticateToken = require("../utilities/authenticateToken");

/** This function validates the user inputs for sending the OTP to reset thier password. 
 *  The only required string is the email. The OTP is sent to the given mail only if it is registered in the database.
*/
const validateResetPasswordRequest = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
  });
  return schema.validate(data);
};

/** This function validates the user Inputs for resetting their password.
 * The required inputs are : 1) newPassword  2) confirmPassword.
 * A JWT is attached to the header for authentication.
 */
const validateResetPassword = (data) => {
  const schema = Joi.object({
    newPassword: Joi.string().min(6).required().label("New Password"),
    confirmPassword: Joi.string().min(6).required().label("Confirm Password"),
  }).options({ abortEarly: false });
  return schema.validate(data);
};

/** This post method genrates an OTP and sends it the the email for verification if and only if the email is valid.
 * 
 */
router.post("/", async (req, res) => {
  try {
    const { error } = validateResetPasswordRequest(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).send({ message: "User with this email does not exist, please register." });
    }

    const otp = generateOTP(6);

    // Send OTP to the user's email
    const subject = 'Password OTP';
    const text = `Your OTP for password reset is: ${otp}`;
    await sendEmail(email, subject, text);

    // Update user document with OTP
    user.otp = otp;
    await user.save();

    res.status(201).send({
      message: "Reset Password",
      verificationMessage: "An OTP has been sent to your email. Please use the received OTP to reset your password."
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

/** This post ('/reset-password-verification') method verifies if the entered OTP matches the generated OTP.
 * If the OTP's match, a JWT is generated and attached to the header when reseting the password.
 */
router.post('/reset-password-verification', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'Please enter a valid email.' });
    }

    // Compare the OTPs
    if (otp !== user.otp) {
      return res.status(400).send({ message: 'Invalid OTP.' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWTPRIVATEKEY);

    // Store the token in the user's document
    user.resetToken = token;
    await user.save();

    res.status(200).send({ token });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Failed to verify OTP to reset password.' });
  }
});

router.put('/reset-password', authenticateToken, async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;

    const { error } = validateResetPassword(req.body);
    if (error) {
      const validationErrors = error.details.map((detail) => detail.message);
      return res.status(400).send({ message: validationErrors });
    }

    // Find the user in the database
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    // Validate new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).send({ message: 'Passwords do not match.' });
    }

    // Update the user's password
    user.password = newPassword;
    user.confirmPassword = confirmPassword;
    await user.save();

    res.status(200).send({ message: 'Password reset successful.' });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Failed to reset password.' });
  }
});


module.exports = router;
