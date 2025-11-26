// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch'); // v2.x, works with require()

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check route
app.get('/', (req, res) => {
  res.send('CU Week1 Email API is running (Resend)');
});

// Main form endpoint
app.post('/api/week1-reflection', async (req, res) => {
  try {
    const { name, email, q1, q2, q3, q4 } = req.body || {};

    // Basic validation
    if (!name || !email || !q1 || !q2 || !q3 || !q4) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const apiKey = "re_ges3oaCf_9oDqjY8uf8RKJYXhjyzv5MMu"; // your Resend API key

    const subject = 'New Week 1 Reflection – CU New Member';
    const text = `
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
    `;

    // NOTE: await is INSIDE the async route handler – this is valid
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'CU New Members <onboarding@resend.dev>', // safe default sender
        to: ['mcrj90@gmail.com'],
        subject,
        text
      })
    });

    const resText = await response.text();
    console.log('Resend status:', response.status, 'body:', resText);

    if (!response.ok) {
      return res.status(500).json({ message: 'Error sending email' });
    }

    console.log('Email successfully sent via Resend for Week 1 reflection from:', email);
    return res.status(200).json({ message: 'Email sent' });

  } catch (err) {
    console.error('Error in /api/week1-reflection handler:', err);
    return res.status(500).json({ message: 'Error sending email' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
