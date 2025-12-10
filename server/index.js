const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require("./routes/authRoutes");    // <-- NEW

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// -------------------------
// MongoDB Connection (fixed)
// -------------------------
mongoose.connect("mongodb://127.0.0.1:27017/isp")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Admin routes
app.use('/api/admin', adminRoutes);

// Auth routes (NEW)
app.use('/api/auth', authRoutes);

// Start server
app.listen(port, () => {
  console.log('Server running on http://localhost:' + port);
});
