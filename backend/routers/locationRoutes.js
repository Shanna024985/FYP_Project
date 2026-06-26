const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

// Get all countries
router.get("/countries", locationController.getCountries);

// Get cities by country
router.get("/countries/:country/cities", locationController.getCitiesByCountry);

module.exports = router;