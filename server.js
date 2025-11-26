// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch'); // required because Resend uses HTTPS API

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check route
app.get('/', (req, res) => {
  res.send('CU Week1 Email API is running (Resend)');
});

// Main form endpoint (TEMP TEST VERSION - no email yet)
app.post('/api/week1-reflection', async (req, res) => {
  const { name, email, q1, q2, q3, q4 } = req.body || {};

  // Basic validation
  if (!name || !email || !q1 || !q2 || !q3 || !q4) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  console.log('Received Week 1 reflection:', req.body);

  // For now, DON'T send email – just confirm it works end-to-end
  return res.status(200).json({ message: 'Test OK – form reached the server.' });
});


  try {
    // Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Use Resend's verified default sender for now
        from: 'CU New Members <onboarding@resend.dev>',
        to: ['worship@churchunlimitedclt.com'],
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
    res.status(200).json({ message: 'Email sent' });

  } catch (err) {
    console.error('Error calling Resend:', err);
    res.status(500).json({ message: 'Error sending email' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
