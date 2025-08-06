// ==== email.js ====
// Send verification emails using your own Gmail SMTP (App Password required)

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,      // Your full Gmail address, e.g., "yourname@gmail.com"
    pass: process.env.GMAIL_APP_PASS,  // Your Gmail app password (not main Gmail password!)
  }
});

/**
 * Send a verification email
 * @param {string} userEmail - the recipient's email
 * @param {string} token - the verification token
 * @param {string} frontend - your frontend URL
 */
async function sendVerificationEmail(userEmail, token, frontend) {
  const link = `${frontend}/verify?token=${token}`;
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: userEmail,
    subject: "Verify your Shorts App Account",
    html: `<h2>Verify your account</h2>
           <p>Click below to activate your account:</p>
           <a href="${link}">${link}</a>`
  });
}

module.exports = { sendVerificationEmail };
