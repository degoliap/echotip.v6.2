const express = require('express');
const path = require('path');
const app = express();
const crypto = require('crypto');
const PORT = process.env.PORT || 3000;

const BOT_TOKEN = 'YOUR_BOT_TOKEN'; // Замените на реальный токен

app.use(express.json());

app.post('/auth', (req, res) => {
  const { hash, ...rest } = req.body;

  const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest();
  const dataCheckString = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${rest[key]}`)
    .join('\n');

  const hmac = crypto
    .createHmac('sha256', secret)
    .update(dataCheckString)
    .digest('hex');

  if (hmac === hash) {
    console.log('Authentication successful:', rest);
    res.json({ success: true, user: rest });
  } else {
    console.log('Authentication failed:', req.body);
    res.status(403).json({ success: false, message: 'Invalid hash' });
  }
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
