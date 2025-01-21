const express = require("express");
const Institution = require("../models/Institution");

const router = express.Router();

// Get all institutions
router.get("/", async (req, res) => {
  try {
    const institutions = await Institution.find();
    res.json(institutions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new institution
router.post("/", async (req, res) => {
  const { name, location, country } = req.body;
  try {
    const institution = new Institution({ name, location, country });
    const savedInstitution = await institution.save();
    res.status(201).json(savedInstitution);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a single institution by ID
router.get("/:id", async (req, res) => {
  try {
    const institution = await Institution.findById(req.params.id);
    if (!institution) {
      return res.status(404).json({ message: "Institution not found" });
    }
    res.json(institution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an institution by ID
router.put("/:id", async (req, res) => {
  const { name, location, country } = req.body;
  try {
    const updatedInstitution = await Institution.findByIdAndUpdate(
      req.params.id,
      { name, location, country },
      { new: true }
    );
    if (!updatedInstitution) {
      return res.status(404).json({ message: "Institution not found" });
    }
    res.json(updatedInstitution);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an institution by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedInstitution = await Institution.findByIdAndDelete(req.params.id);
    if (!deletedInstitution) {
      return res.status(404).json({ message: "Institution not found" });
    }
    res.json({ message: "Institution deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
