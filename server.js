// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Nodemailer transport using Google Workspace / Gmail SMTP
// Values come from environment variables set in Render:
//   SMTP_USER = your Workspace email (e.g. worship@churchunlimitedclt.com)
//   SMTP_PASS = the app password or SMTP password
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS on port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Simple health check route
app.get('/', (req, res) => {
  res.send('CU Week1 Email API is running');
});

// Main endpoint the form will POST to
app.post('/api/week1-reflection', async (req, res) => {
  const { name, email, q1, q2, q3, q4 } = req.body || {};

  if (!name || !email || !q1 || !q2 || !q3 || !q4) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const mailOptions = {
    from: `"CU New Members" <${process.env.SMTP_USER}>`,
    to: 'worship@churchunlimitedclt.com',
    subject: 'New Week 1 Reflection – CU New Member',
    text: `
A new Week 1 reflection has been submitted.

Name: ${name}
Email: ${email}

How did you first hear about CU?
${q1}

What made you decide to visit C.H.U.R.C.H. Unlimited?
${q2}

What are you hoping to grow in spiritually during this season?
${q3}

What are you believing God for in this next chapter?
${q4}

Submitted at: ${new Date().toLocaleString()}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent for Week 1 reflection from:', email);
    res.status(200).json({ message: 'Email sent' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ message: 'Error sending email' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
