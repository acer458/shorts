// ==== FILE: email.js ====
// Utility for sending transactional emails using SendGrid API.

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * sendVerificationEmail(userEmail, token)
 * Emails a user a link with their unique verification token.
 */
async function sendVerificationEmail(userEmail, token) {
  const link = `https://YOUR_CLIENT_DOMAIN/verify?token=${token}`;
  await sgMail.send({
    to: userEmail,
    from: process.env.EMAIL_SENDER,
    subject: "Verify your Shorts App Account",
    html: `<h1>Verify Your Account</h1>
      <p>Click below to verify your account:</p>
      <a href="${link}">Verify Account</a>`
  });
}

module.exports = { sendVerificationEmail };
