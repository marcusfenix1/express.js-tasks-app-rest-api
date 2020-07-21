//! add loginpass to process_env

const nodemailer = require("nodemailer");

// const mailTemplate = require("./template");

const user = process.env.NODEMAILER_USER;
const pass = process.env.NODEMAILER_PASS;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: user,
    pass: pass,
  },
});

const sendWelcomeEmail = (email, name) =>
  transporter.sendMail({
    from: '"Eugene Zhoglo 👻"',
    to: email,
    subject: "Welcome to task manager",
    text: `Hi,${name}! Welcome to Task Manager`,
  });

const sendCancellationEmail = (email, name) =>
  transporter.sendMail({
    from: '"Eugene Zhoglo 👻"',
    to: email,
    subject: "Goodby, please leave us a feedback",
    text: `Hi,${name}! We'll be very pleased if you leave your feedback why you are leaving us`,
  });

module.exports = { sendWelcomeEmail, sendCancellationEmail };
