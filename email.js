// ==== email.js ====
// Utility for sending verification email with SendGrid

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * @param {string} userEmail - to send to
 * @param {string} token - verification token
 * @param {string} frontend - frontend URL (from /api/register)
 */
async function sendVerificationEmail(userEmail, token, frontend) {
  const link = `${frontend}/verify?token=${token}`;
  await sgMail.send({
    to: userEmail,
    from: process.env.EMAIL_SENDER,
    subject: "Verify your Shorts App Account",
    html: `<h2>Verify your account</h2>
           <p>Click below to activate your account:</p>
           <a href="${link}">${link}</a>`
  });
}

module.exports = { sendVerificationEmail };
