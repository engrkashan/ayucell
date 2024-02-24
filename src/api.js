const express = require("express");
const serverless = require("serverless-http");
const nodemailer = require("nodemailer");

const app = express();
const router = express.Router();

// Middleware to parse JSON bodies
app.use(express.json());

router.get("/", (req, res) => {
  res.json({
    hello: "hi!",
  });
});

router.post("/submit-form", (req, res) => {
  const { name, email, phone } = req.body;

  // Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your-email@gmail.com",
      pass: "your-email-password",
    },
  });

  const mailOptions = {
    from: "your-email@gmail.com",
    to: "recipient@example.com",
    subject: "New Form Submission",
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
