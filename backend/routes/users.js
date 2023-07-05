/* This file is used to register a user onto the database. 
* It validates the user inputs and then onboards the user onto the databse
*/

const router = require('express').Router();
const { User, validate } = require('../Models/user');
const bcrypt = require('bcrypt');
const Token = require('../Models/verificationTokens');
const sendEmail = require('../utilities/sendEmail');
const generateOTP = require('../utilities/otp');

router.post('/', async (req, res) => {

  try {

    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    user_mail = await User.findOne({ email: req.body.email });
    if (user_mail)
      return res.status(409).send({ message: "User with this mail id already exists!" });

    const user_name = await User.findOne({ username: req.body.username })
    if (user_name)
      return res.status(409).send({ message: "Username already exists!" });

    if (req.body.password !== req.body.confirmPassword)
      return res.status(400).send({ message: "Password and confirm password do not match!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const otp = generateOTP();

    await new User({ ...req.body, password: hashPassword, otp: otp }).save();


    // Send OTP to the user's email
    const subject = 'Email Verification OTP';
    const text = `Your OTP for email verification is: ${otp}`;
    await sendEmail(req.body.email, subject, text);


    res.status(201).send({
      message: "User created successfully",
      verificationMessage: "An OTP has been sent to your email. Please verify your credentials using the received OTP."
    });


  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// User Email verification using OTP 
router.post('/verify', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Compare the OTPs
    if (otp === user.otp) {
      // OTP matched, email verified
      user.isVerified = true;
      await user.save();

      // Return success response
      res.status(200).send({ message: 'Email verified successfully' });
    } else {
      // OTP didn't match
      res.status(400).send({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Failed to verify OTP' });
  }
});




module.exports = router;
