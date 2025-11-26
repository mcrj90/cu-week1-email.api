// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// TODO: replace these with your real SMTP settings
const transporter = nodemailer.createTransport({
  host: 'SMTP.YOUR-EMAIL-HOST.COM',
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: 'YOUR_SMTP_USERNAME',
    pass: 'YOUR_SMTP_PASSWORD'
  }
});

app.post('/api/week1-reflection', async (req, res) => {
  const { name, email, q1, q2, q3, q4 } = req.body;

  const mailOptions = {
    from: '"CU New Members" <no-reply@YOUR-DOMAIN.COM>',
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
    res.status(200).json({ message: 'Email sent' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ message: 'Error sending email' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
