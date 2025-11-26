// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch'); // v2.x, works with require()

const app = express();
const PORT = process.env.PORT || 4000;

// ---------------------------
// CONFIG
// ---------------------------
const RESEND_API_KEY = "re_QjyGwbiY_QBEnySF8TCVviBBAHG8nixkm"; // your latest key
const CU_INBOX = "churchunlimited2020@gmail.com";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check
app.get('/', (req, res) => {
  res.send('CU Email API is running (Week1 + Gifts via Resend)');
});

// ---------------------------
// 1) WEEK 1 REFLECTION ENDPOINT
// ---------------------------
app.post('/api/week1-reflection', async (req, res) => {
  try {
    const { name, email, q1, q2, q3, q4 } = req.body || {};

    if (!name || !email || !q1 || !q2 || !q3 || !q4) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

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

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'CU New Members <onboarding@resend.dev>',
        to: [CU_INBOX],
        subject,
        text
      })
    });

    const resText = await response.text();
    console.log('Resend (Week1) →', response.status, resText);

    if (!response.ok) {
      return res.status(500).json({ message: 'Error sending email' });
    }

    return res.status(200).json({ message: 'Email sent' });

  } catch (err) {
    console.error('Week 1 error:', err);
    return res.status(500).json({ message: 'Error sending email' });
  }
});

// ---------------------------
// 2) SPIRITUAL GIFTS ENDPOINT (we’ll hook this up later)
// ---------------------------
app.post('/api/gifts-assessment', async (req, res) => {
  try {
    const {
      name,
      email,
      allGifts,           // array of { name, score }
      topGifts,           // array of { name, score }
      suggestedMinistries // array of strings
    } = req.body || {};

    if (!name || !email || !Array.isArray(allGifts) || !Array.isArray(topGifts)) {
      return res.status(400).json({ message: 'Missing or invalid fields' });
    }

    const subject = 'New Spiritual Gifts Assessment – CU Member';

    const allGiftsText = allGifts
      .map(g => `- ${g.name}: ${g.score}`)
      .join('\n');

    const topGiftsText = topGifts
      .map((g, i) => `${i + 1}. ${g.name} (${g.score})`)
      .join('\n');

    const ministriesText =
      Array.isArray(suggestedMinistries) && suggestedMinistries.length
        ? suggestedMinistries.map(m => `- ${m}`).join('\n')
        : 'No ministry suggestions were provided.';

    const text = `
A new Spiritual Gifts Assessment has been submitted.

Name: ${name}
Email: ${email}

Top Gifts (strongest to weakest):
${topGiftsText}

All Gifts (full ranking):
${allGiftsText}

Suggested Ministries:
${ministriesText}

Submitted at: ${new Date().toLocaleString()}
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'CU New Members <onboarding@resend.dev>',
        to: [CU_INBOX],
        subject,
        text
      })
    });

    const resText = await response.text();
    console.log('Resend (Gifts) →', response.status, resText);

    if (!response.ok) {
      return res.status(500).json({ message: 'Error sending gifts email' });
    }

    return res.status(200).json({ message: 'Email sent' });

  } catch (err) {
    console.error('Gifts error:', err);
    return res.status(500).json({ message: 'Error sending gifts email' });
  }
});

// ---------------------------
// START SERVER
// ---------------------------
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
