/* This JavaScript file sends the email to the user.
* In case of verification, this function will send an OTP to the given mail id.
 */

const nodemailer = require('nodemailer');

module.exports = async (email, subject, text) => {

  try {
    const transporter = nodemailer.createTransport({

      host: "smtp.office365.com",
      port: 587,
      requireTLS: true,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    });

    await transporter.sendMail({

      from: process.env.USER,
      to: email,
      subject: subject,
      text: text
    });
    console.log("Email Sent successfully to the given mail.");

  } catch (error) {
    console.log("Email not sent.");
    console.log(error);
  }

}