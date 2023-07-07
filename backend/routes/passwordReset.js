const router = require("express").Router();
const { User } = require("../Models/user");
const sendEmail = require("../utilities/sendEmail");
const generateOTP = require("../utilities/otp");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const validateResetPasswordRequest = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
  });
  return schema.validate(data);
};

const validateResetPassword = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    newPassword: Joi.string().min(6).required().label("New Password"),
    confirmPassword: Joi.string().min(6).required().label("Confirm Password"),
  }).options({ abortEarly: false });
  return schema.validate(data);
};

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

    // Generate a new JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWTPRIVATEKEY, { expiresIn: '1h' });

    res.status(200).send({ message: 'OTP verified.', token });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Failed to verify OTP to reset password.' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    const { error } = validateResetPassword(req.body);
    if (error) {
      const validationErrors = error.details.map((detail) => detail.message);
      return res.status(400).send({ message: validationErrors });
    }

    // Verify the JWT token
    try {
      const decodedToken = jwt.verify(token, process.env.JWTPRIVATEKEY);
      const userId = decodedToken.userId;

      // Find the user in the database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: 'Please enter a valid email.' });
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
      return res.status(400).send({ message: 'Invalid or expired token.' });
    }

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Failed to reset password.' });
  }
});

module.exports = router;
