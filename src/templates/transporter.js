const nodemailer = require("nodemailer");
const userId = process.env.USER_ID;
const userPass = process.env.USER_PAS;


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: userId,
    pass: userPass,
  },
});

module.exports = transporter;


