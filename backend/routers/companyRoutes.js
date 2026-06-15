const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");

// Public routes (no authentication needed for testing)
router.get("/", companyController.getAllCompanies);
router.get("/:id", companyController.getCompanyById);
router.get("/:id/page", companyController.getCompanyPageData);

// Protected routes (NO AUTH for testing - remove verifyToken)
router.post("/", companyController.createCompany);
router.put("/:id", companyController.updateCompany);
router.delete("/:id", companyController.deleteCompany);

module.exports = router;