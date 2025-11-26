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
