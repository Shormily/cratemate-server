const express = require('express');
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const multer = require('multer');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

// const path = require('path');

const storage = multer.memoryStorage(); // Store uploaded files in memory
const upload = multer({ storage });

// MIDDLEWARE
app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: `${process.env.STMP_HOST}`,
  port: `${process.env.STMP_PORT}`, // or 587 for TLS
  secure: false, // true for 465, false for other ports
  auth: {
    user: `${process.env.DB_USER}`,
    pass: `${process.env.STMP_PASS}`,
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

app.post('/send-email', upload.single('pdf'), async (req, res) => {
  try {
    const { firstname, lastname, gender, birthday, subject, email, experience,phone,select,address,message,jobtitle,companyname } = req.body;
    
    console.log(req.body)
    // Create an email with Nodemailer
    const mailOptions = {
      from: `${process.env.DB_USER}`,
      to: 'aicratmate@gmail.com',
      subject: subject,
      text: ` 
      Firstname: ${firstname}
      Lastname: ${lastname}
        Gender: ${gender}
        Birthday: ${birthday}
        Phone: ${phone}
        Email: ${email}
        Subject: ${subject}
        Select: ${select}
        Address: ${address}
        Experience: ${experience}
        Message: ${message}
        Jobtitle: ${jobtitle}
        Companyname: ${companyname}
      `,
      attachments: [
        {
          filename: 'resume.pdf',
         content: req?.file?.buffer,// Attach the PDF file from memory
        },
      ],
    };
    const mailOptionse = {
      from: `${process.env.DB_USER}`,
      to: 'aicratmate@gmail.com',
      subject: subject,
      text: ` 
      Firstname: ${firstname}
      Lastname: ${lastname}
      Phone: ${phone}
        Email: ${email}
        Message: ${message}
        Jobtitle: ${jobtitle}
        Companyname: ${companyname}
      `,
    }
    // Send the email
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(mailOptionse);

    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});



app.post('/send-message', upload.single('pdf'), async (req, res) => {
  try {
    const { firstname, lastname, subject ,email,phone,message,jobtitle,companyname } = req.body;
    
    console.log(req.body)
    // Create an email with Nodemailer
   
    const mailOptionse = {
      from: `${process.env.DB_USER}`,
      to: 'aicratmate@gmail.com',
      subject: subject,
      text: ` 
      Firstname: ${firstname}
      Lastname: ${lastname}
      Phone: ${phone}
        Email: ${email}
        Message: ${message}
        Jobtitle: ${jobtitle}
        Companyname: ${companyname}
      `,
    }
    // Send the email
  
    await transporter.sendMail(mailOptionse);

    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});
app.get("/", (req, res) => {
  res.send("doctor is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

