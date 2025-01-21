const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  donationAmount: { type: Number, required: true },
});

module.exports = mongoose.model("Donor", donorSchema);