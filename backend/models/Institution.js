const mongoose = require("mongoose");

const institutionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  contactEmail: { type: String, required: true },
});

module.exports = mongoose.model("Institution", institutionSchema);