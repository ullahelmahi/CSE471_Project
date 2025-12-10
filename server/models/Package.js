const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  name: String,
  speed: String,
  price: Number,
  duration: Number, // duration in days
  description: String,
  status: { type: String, default: "active" } // active | deleted
});

module.exports = mongoose.model("Package", packageSchema);
