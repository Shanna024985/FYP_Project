const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");

// IMPORTANT: Admin routes MUST come BEFORE /:id routes
router.get("/admin/deleted", companyController.getDeletedCompanies);

// Public routes (no authentication needed for testing)
router.get("/", companyController.getAllCompanies);
router.get("/:id", companyController.getCompanyById);
router.get("/:id/page", companyController.getCompanyPageData);

// Protected routes (NO AUTH for testing - remove verifyToken)
router.post("/", companyController.createCompany);
router.put("/:id", companyController.updateCompany);
router.put("/:id/logo", companyController.updateCompanyLogo);
router.put("/:id/banner", companyController.updateCompanyBanner);
router.put("/:id/profile", companyController.updateCompanyProfile);
router.delete("/:id", companyController.deleteCompany);
router.patch("/:id/restore", companyController.restoreCompany);

module.exports = router;