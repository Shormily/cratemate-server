const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const multer = require("multer");
const nodemailer = require("nodemailer");
// const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// MIDDLEWARE
app.use(cors());
app.use(express.json());

 // Create a Nodemailer transporter
 const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: "587",
  secure: false,
  auth: {
    user: `${process.env.DB_USER}`,
    pass: `${process.env.DB_PASS}`,
  },
});
// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});
app.post("/api/send-email", upload.single("file"), async (req, res) => {
  const { recipientEmail, subject, message } = req.body;
  const pdfFile = req.file.buffer; // PDF file as a buffer
 

  const mailOptions = {
    from: "user",
    to: recipientEmail,
    subject,
    text: message,
    attachments: [
      {
        filename: "attachment.pdf",
        content: pdfFile,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Email sending failed" });
  }
});
app.get("/", (req, res) => {
  res.send("doctor is running");
});

app.listen(port, () => {
  console.log(`Car Doctor Server is running on port ${port}`);
});
