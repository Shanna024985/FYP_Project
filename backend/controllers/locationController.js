const { COUNTRIES_AND_CITIES } = require('../config/locations');

// Get all countries
module.exports.getCountries = (req, res, next) => {
    const countries = Object.keys(COUNTRIES_AND_CITIES);
    res.json({ countries });
};

// Get cities by country
module.exports.getCitiesByCountry = (req, res, next) => {
    const country = req.params.country;
    const cities = COUNTRIES_AND_CITIES[country] || [];
    res.json({ country, cities });
};