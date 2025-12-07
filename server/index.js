const express = require('express');
const app = express();
const port = 5000;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(port, () => {
  console.log('Server running on http://localhost:' + port);
});
