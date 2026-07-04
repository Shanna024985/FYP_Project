const companyModel = require("../models/companyModel");
const { query } = require("../services/dbConnection");

// Helper: Get user ID from request - FIXED
const getUserIdFromReq = (req, res) => {
    return res?.locals?.userId || req.user?.userId || req.user?.id;
};

// CREATE - Create a company
module.exports.createCompany = (req, res, next) => {
    let { 
        name, url, contact_email, 
        logo_url,
        banner_url, 
        profile_url,
        tagline, description, city, address
    } = req.body;
    
    const userId = getUserIdFromReq(req, res);
    
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
        name, 
        url, 
        contact_email,
        logo_url: logo_url || '',
        banner_url: banner_url || '',
        profile_url: profile_url || '',
        tagline: tagline || '',
        description: description || '',
        city: city || '',
        address: address || ''
    })
    .then(function(companyDetails) {
        if (companyDetails.length == 0) {
            return res.status(400).json({ error: "Failed to create company" });
        }
        
        if (userId) {
            const companyId = companyDetails[0].id;
            const ownershipSql = `INSERT INTO company_ownership (user_id, company_id) VALUES ($1, $2);`;
            return query(ownershipSql, [userId, companyId])
                .then(function() {
                    res.status(201).json({ 
                        message: "Company created successfully", 
                        company: companyDetails[0] 
                    });
                });
        }
        
        res.status(201).json({ 
            message: "Company created successfully", 
            company: companyDetails[0] 
        });
    }).catch(function(error) {
        return res.status(500).json({ error: error.message });
    });
};

// READ - Get all companies
module.exports.getAllCompanies = (req, res, next) => {
    return companyModel.getAllCompanies()
        .then(function(companies) {
            res.json({ count: companies.length, companies: companies });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
};

// READ - Get companies by user (from token)
module.exports.getCompaniesByUser = (req, res, next) => {
    const userId = getUserIdFromReq(req, res);
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }
    
    let sql = `SELECT c.*, 
               (SELECT COUNT(*) FROM job WHERE company_id = c.id) as total_jobs,
               (SELECT COUNT(*) FROM job WHERE company_id = c.id AND status = 'Active') as active_jobs
               FROM company c
               JOIN company_ownership co ON c.id = co.company_id
               WHERE co.user_id = $1
               ORDER BY c.id DESC;`;
    
    return query(sql, [userId])
        .then(function(result) {
            res.json({ 
                count: result.rows.length, 
                companies: result.rows 
            });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
};

// READ - Get companies by user ID (from URL param)
module.exports.getCompaniesByUserId = (req, res, next) => {
    let userId = req.params.userId;
    
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    
    let sql = `SELECT c.*, 
               (SELECT COUNT(*) FROM job WHERE company_id = c.id) as total_jobs,
               (SELECT COUNT(*) FROM job WHERE company_id = c.id AND status = 'Active') as active_jobs
               FROM company c
               JOIN company_ownership co ON c.id = co.company_id
               WHERE co.user_id = $1
               ORDER BY c.id DESC;`;
    
    return query(sql, [userId])
        .then(function(result) {
            res.json({ 
                count: result.rows.length, 
                companies: result.rows 
            });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
};

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
            return res.status(500).json({ error: error.message });
        });
};

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
            return res.status(500).json({ error: error.message });
        });
};

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
            return res.status(500).json({ error: error.message });
        });
};

// UPDATE - Update company logo only
module.exports.updateCompanyLogo = (req, res, next) => {
    let companyId = req.params.id;
    let { logo_url } = req.body;
    
    if (!logo_url) {
        return res.status(400).json({ error: "Logo URL is required" });
    }
    
    return companyModel.updateCompanyLogo(companyId, logo_url)
        .then(function(result) {
            if (result.length == 0) {
                return res.status(404).json({ error: "Company not found" });
            }
            res.json({ 
                message: "Company logo updated successfully", 
                logo: result[0] 
            });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
};

// UPDATE - Update company banner only
module.exports.updateCompanyBanner = (req, res, next) => {
    let companyId = req.params.id;
    let { banner_url } = req.body;
    
    if (!banner_url) {
        return res.status(400).json({ error: "Banner URL is required" });
    }
    
    return companyModel.updateCompanyBanner(companyId, banner_url)
        .then(function(result) {
            if (result.length == 0) {
                return res.status(404).json({ error: "Company not found" });
            }
            res.json({ 
                message: "Company banner updated successfully", 
                banner: result[0] 
            });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
};

// UPDATE - Update company profile only
module.exports.updateCompanyProfile = (req, res, next) => {
    let companyId = req.params.id;
    let { profile_url } = req.body;
    
    if (!profile_url) {
        return res.status(400).json({ error: "Profile URL is required" });
    }
    
    return companyModel.updateCompanyProfile(companyId, profile_url)
        .then(function(result) {
            if (result.length == 0) {
                return res.status(404).json({ error: "Company not found" });
            }
            res.json({ 
                message: "Company profile updated successfully", 
                profile: result[0] 
            });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
};

// DELETE - Soft delete a company
module.exports.deleteCompany = (req, res, next) => {
    let companyId = req.params.id;
    const userId = getUserIdFromReq(req, res);
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }
    
    return companyModel.getCompanyById(companyId)
        .then(function(existingCompany) {
            if (existingCompany.length == 0) {
                return res.status(404).json({ error: "Company not found" });
            }
            
            let ownershipSql = `SELECT id FROM company_ownership WHERE user_id = $1 AND company_id = $2;`;
            return query(ownershipSql, [userId, companyId])
                .then(function(ownership) {
                    if (ownership.rows.length === 0) {
                        return res.status(403).json({ 
                            error: "Unauthorized: You don't own this company" 
                        });
                    }
                    
                    return companyModel.deleteCompany(companyId)
                        .then(function(deletedCompany) {
                            res.json({ 
                                message: "Company deleted successfully. You can restore this company.", 
                                deletedId: deletedCompany[0].id 
                            });
                        });
                });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
};

// RESTORE - Restore a soft-deleted company
module.exports.restoreCompany = (req, res, next) => {
    let companyId = req.params.id;
    const userId = getUserIdFromReq(req, res);
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }
    
    let ownershipSql = `SELECT id FROM company_ownership WHERE user_id = $1 AND company_id = $2;`;
    return query(ownershipSql, [userId, companyId])
        .then(function(ownership) {
            if (ownership.rows.length === 0) {
                return res.status(403).json({ 
                    error: "Unauthorized: You don't own this company" 
                });
            }
            
            return companyModel.restoreCompany(companyId)
                .then(function(restoredCompany) {
                    if (restoredCompany.length == 0) {
                        return res.status(404).json({ error: "Company not found or not deleted" });
                    }
                    res.json({ 
                        message: "Company restored successfully", 
                        restoredId: restoredCompany[0].id 
                    });
                });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
};

// GET - Get all deleted companies
module.exports.getDeletedCompanies = (req, res, next) => {
    return companyModel.getDeletedCompanies()
        .then(function(deletedCompanies) {
            res.json({ count: deletedCompanies.length, deleted_companies: deletedCompanies });
        }).catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
};