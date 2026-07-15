const companyModel = require("../models/companyModel");

// CREATE - Create a company
module.exports.createCompany = (req, res, next) => {
    let { 
        name, url, contact_email, 
        logo_file_name, logo_file_data,
        banner_file_name, banner_file_data,
        profile_file_name, profile_file_data,
        tagline, description, city 
    } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: "Company name is required" });
    }
    if (!url) {
        return res.status(400).json({ error: "Company URL is required" });
    }
    if (!contact_email) {
        return res.status(400).json({ error: "Contact email is required" });
    }
    
    return companyModel.createCompany({
        name, url, contact_email,
        logo_file_name: logo_file_name || '',
        logo_file_data: logo_file_data || '',
        banner_file_name: banner_file_name || '',
        banner_file_data: banner_file_data || '',
        profile_file_name: profile_file_name || '',
        profile_file_data: profile_file_data || '',
        tagline: tagline || '',
        description: description || '',
        city: city || ''
    })
    .then(function(companyDetails) {
        if (companyDetails.length == 0) {
            return res.status(400).json({ error: "Failed to create company" });
        }
        res.status(201).json({ 
            message: "Company created successfully", 
            company: companyDetails[0] 
        });
    }).catch(function(error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
}

// READ - Get all companies
module.exports.getAllCompanies = (req, res, next) => {
    return companyModel.getAllCompanies()
        .then(function(companies) {
            res.json({ count: companies.length, companies: companies });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// READ - Get all deleted companies (for admin)
module.exports.getDeletedCompanies = (req, res, next) => {
    return companyModel.getDeletedCompanies()
        .then(function(deletedCompanies) {
            res.json({ count: deletedCompanies.length, deleted_companies: deletedCompanies });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// READ - Get single company by ID
module.exports.getCompanyById = (req, res, next) => {
    let companyId = req.params.id;
    
    return companyModel.getCompanyById(companyId)
        .then(function(companyDetails) {
            if (companyDetails.length == 0) {
                return res.status(404).json({ error: "Company not found" });
            }
            res.json({ company: companyDetails[0] });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// READ - Get company page data
module.exports.getCompanyPageData = (req, res, next) => {
    let companyId = req.params.id;
    
    return companyModel.getCompanyPageData(companyId)
        .then(function(companyData) {
            if (companyData.length == 0) {
                return res.status(404).json({ error: "Company not found" });
            }
            res.json({ company: companyData[0] });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// UPDATE - Update a company
module.exports.updateCompany = (req, res, next) => {
    let companyId = req.params.id;
    let companyData = req.body;
    
    return companyModel.getCompanyById(companyId)
        .then(function(existingCompany) {
            if (existingCompany.length == 0) {
                return res.status(404).json({ error: "Company not found" });
            }
            return companyModel.updateCompany(companyId, companyData)
                .then(function(updatedCompany) {
                    if (updatedCompany.length == 0) {
                        return res.status(404).json({ error: "Company not found" });
                    }
                    res.json({ 
                        message: "Company updated successfully", 
                        company: updatedCompany[0] 
                    });
                });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// UPDATE - Update company logo only
module.exports.updateCompanyLogo = (req, res, next) => {
    let companyId = req.params.id;
    let { logo_file_name, logo_file_data } = req.body;
    
    if (!logo_file_name || !logo_file_data) {
        return res.status(400).json({ error: "Logo file name and data are required" });
    }
    
    return companyModel.updateCompanyLogo(companyId, logo_file_name, logo_file_data)
        .then(function(result) {
            if (result.length == 0) {
                return res.status(404).json({ error: "Company not found" });
            }
            res.json({ 
                message: "Company logo updated successfully", 
                logo: result[0] 
            });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// UPDATE - Update company banner only
module.exports.updateCompanyBanner = (req, res, next) => {
    let companyId = req.params.id;
    let { banner_file_name, banner_file_data } = req.body;
    
    if (!banner_file_name || !banner_file_data) {
        return res.status(400).json({ error: "Banner file name and data are required" });
    }
    
    return companyModel.updateCompanyBanner(companyId, banner_file_name, banner_file_data)
        .then(function(result) {
            if (result.length == 0) {
                return res.status(404).json({ error: "Company not found" });
            }
            res.json({ 
                message: "Company banner updated successfully", 
                banner: result[0] 
            });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// UPDATE - Update company profile image only
module.exports.updateCompanyProfile = (req, res, next) => {
    let companyId = req.params.id;
    let { profile_file_name, profile_file_data } = req.body;
    
    if (!profile_file_name || !profile_file_data) {
        return res.status(400).json({ error: "Profile file name and data are required" });
    }
    
    return companyModel.updateCompanyProfile(companyId, profile_file_name, profile_file_data)
        .then(function(result) {
            if (result.length == 0) {
                return res.status(404).json({ error: "Company not found" });
            }
            res.json({ 
                message: "Company profile image updated successfully", 
                profile: result[0] 
            });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// DELETE - Soft delete a company (move to deleted_companies table)
module.exports.deleteCompany = (req, res, next) => {
    let companyId = req.params.id;
    
    return companyModel.deleteCompany(companyId)
        .then(function(deletedCompany) {
            if (deletedCompany.length == 0) {
                return res.status(404).json({ error: "Company not found or already deleted" });
            }
            res.json({ 
                message: "Company deleted successfully. You can restore this company.", 
                deletedId: deletedCompany[0].id 
            });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// RESTORE - Restore a soft-deleted company
module.exports.restoreCompany = (req, res, next) => {
    let companyId = req.params.id;
    
    return companyModel.restoreCompany(companyId)
        .then(function(restoredCompany) {
            if (restoredCompany.length == 0) {
                return res.status(404).json({ error: "Company not found in deleted records" });
            }
            res.json({ 
                message: "Company restored successfully", 
                restoredId: restoredCompany[0].id 
            });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}