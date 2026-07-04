const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { verifyToken } = require('../middlewares/jwtmiddleware');

// Public routes (no authentication needed)
router.get('/', companyController.getAllCompanies);
router.get('/:id', companyController.getCompanyById);
router.get('/page/:id', companyController.getCompanyPageData);

// Protected routes (authentication required)
router.post('/', verifyToken, companyController.createCompany);
router.put('/:id', verifyToken, companyController.updateCompany);
router.delete('/:id', verifyToken, companyController.deleteCompany);
router.post('/restore/:id', verifyToken, companyController.restoreCompany);
router.get('/user/companies', verifyToken, companyController.getCompaniesByUser);
router.get('/user/:userId/companies', verifyToken, companyController.getCompaniesByUserId);
router.get('/deleted', verifyToken, companyController.getDeletedCompanies);

// Image update routes (authentication required)
router.put('/:id/logo', verifyToken, companyController.updateCompanyLogo);
router.put('/:id/banner', verifyToken, companyController.updateCompanyBanner);
router.put('/:id/profile', verifyToken, companyController.updateCompanyProfile);

module.exports = router;