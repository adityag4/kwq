const express = require("express");
const Donor = require("../models/Donor");

const router = express.Router();

// Get all donors
router.get("/", async (req, res) => {
  try {
    const donors = await Donor.find();
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new donor
router.post("/", async (req, res) => {
  const { name, email, phone, donatedAmount } = req.body;
  try {
    const donor = new Donor({ name, email, phone, donatedAmount });
    const savedDonor = await donor.save();
    res.status(201).json(savedDonor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
