const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;
const DATA_FILE = path.join(__dirname, 'feedbacks.json');

app.use(cors());
app.use(bodyParser.json());

// Ensure the data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
}

// Endpoint to submit feedback
app.post('/api/feedback', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const feedbacks = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  feedbacks.push({ name, email, message, date: new Date().toISOString() });
  fs.writeFileSync(DATA_FILE, JSON.stringify(feedbacks, null, 2), 'utf-8');
  res.json({ success: true });
});

// Endpoint to get all feedbacks
app.get('/api/feedbacks', (req, res) => {
  const feedbacks = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  res.json(feedbacks);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 