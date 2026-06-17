let companyModel = require("../models/companyModel");

// CREATE - Create a company
module.exports.createCompany = (req, res, next) => {
    let { 
        name, url, contact_email, 
        logo_file_name, logo_file_data, 
        tagline, description, city 
    } = req.body;
    
    if (!name || !contact_email) {
        return res.status(400).json({ error: "Company name and contact email are required" });
    }
    
    return companyModel.createCompany({ 
        name, url, contact_email, 
        logo_file_name, logo_file_data, 
        tagline, description, city 
    }).then(function(companyDetails) {
        if (companyDetails.length == 0) {
            return res.status(400).json({ error: "Failed to create company" });
        }
        res.status(201).json({ message: "Company created successfully", company: companyDetails[0] });
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

// READ - Get company by ID
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

// READ - Get company page data (for Figma company page)
module.exports.getCompanyPageData = (req, res, next) => {
    let companyId = req.params.id;
    
    return companyModel.getCompanyPageData(companyId)
        .then(function(companyDetails) {
            if (companyDetails.length == 0) {
                return res.status(404).json({ error: "Company not found" });
            }
            
            let company = companyDetails[0];
            
            res.json({
                company: {
                    id: company.id,
                    name: company.name,
                    city: company.city,
                    contact_email: company.contact_email,
                    url: company.url,
                    tagline: company.tagline,
                    description: company.description
                },
                jobs: company.jobs || [],
                average_rating: parseFloat(company.average_rating || 0),
                total_reviews: parseInt(company.total_reviews || 0)
            });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// UPDATE - Update a company
module.exports.updateCompany = (req, res, next) => {
    let companyId = req.params.id;
    let companyData = req.body;
    
    return companyModel.updateCompany(companyId, companyData)
        .then(function(updatedCompany) {
            if (updatedCompany.length == 0) {
                return res.status(404).json({ error: "Company not found" });
            }
            res.json({ message: "Company updated successfully", company: updatedCompany[0] });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

// DELETE - Delete a company
module.exports.deleteCompany = (req, res, next) => {
    let companyId = req.params.id;
    
    return companyModel.deleteCompany(companyId)
        .then(function(deletedCompany) {
            if (deletedCompany.length == 0) {
                return res.status(404).json({ error: "Company not found" });
            }
            res.json({ message: "Company deleted successfully", deletedId: deletedCompany[0].id });
        }).catch(function(error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}