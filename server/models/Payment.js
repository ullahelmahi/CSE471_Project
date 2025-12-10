const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
  amount: Number,
  method: String,     // bkash, nagad, card, etc.
  status: String,     // success, pending, failed
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", paymentSchema);
