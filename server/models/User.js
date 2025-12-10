const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "user" },
  status: { type: String, default: "pending" }, // pending | active | suspended
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
