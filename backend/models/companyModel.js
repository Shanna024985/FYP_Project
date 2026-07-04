const { query } = require("../services/dbConnection");

// CREATE - Create a company
module.exports.createCompany = function createCompany(companyData) {
    const { 
        name, url, contact_email, 
        logo_url,
        banner_url,
        profile_url,
        tagline, description, city, address
    } = companyData;
    
    let sql = `INSERT INTO company(
        name, url, contact_email, 
        logo_url,
        banner_url,
        profile_url,
        tagline, description, city, address
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
    RETURNING *;`;
    
    return query(sql, [
        name, url, contact_email,
        logo_url || '',
        banner_url || '',
        profile_url || '',
        tagline || '',
        description || '',
        city || '',
        address || ''
    ]).then(function(result) {
        return result.rows;
    });
}

// READ - Get all companies
module.exports.getAllCompanies = function getAllCompanies() {
    let sql = `SELECT id, name, url, contact_email, 
               logo_url, banner_url, profile_url,
               tagline, description, city, address
               FROM company 
               ORDER BY id DESC;`;
    return query(sql, []).then(function(result) {
        return result.rows;
    });
}

// READ - Get single company by ID
module.exports.getCompanyById = function getCompanyById(companyId) {
    let sql = `SELECT id, name, url, contact_email, 
               logo_url, banner_url, profile_url,
               tagline, description, city, address
               FROM company 
               WHERE id = $1;`;
    return query(sql, [companyId]).then(function(result) {
        return result.rows;
    });
}

// READ - Get company page data
module.exports.getCompanyPageData = function getCompanyPageData(companyId) {
    let sql = `SELECT c.id, c.name, c.url, c.contact_email, 
               c.tagline, c.description, c.city, c.address,
               c.logo_url, c.banner_url, c.profile_url,
               COALESCE((SELECT json_agg(json_build_object('id', j.id, 'title', j.title, 'location', j.location)) FROM job j WHERE j.company_id = c.id), '[]') as jobs,
               COALESCE((SELECT json_agg(json_build_object('id', r.id, 'rating', r.rating, 'message', r.message, 'created_at', r.created_at)) FROM review r WHERE r.company_id = c.id), '[]') as reviews,
               COALESCE((SELECT AVG(rating) FROM review WHERE company_id = c.id), 0) as average_rating,
               COALESCE((SELECT COUNT(*) FROM review WHERE company_id = c.id), 0) as total_reviews
               FROM company c 
               WHERE c.id = $1;`;
    return query(sql, [companyId]).then(function(result) {
        return result.rows;
    });
}

// UPDATE - Update a company
module.exports.updateCompany = function updateCompany(companyId, companyData) {
    const { 
        name, url, contact_email, 
        tagline, description, city, address,
        logo_url, banner_url, profile_url
    } = companyData;
    
    let sql = `UPDATE company 
               SET name = COALESCE($1, name),
                   url = COALESCE($2, url),
                   contact_email = COALESCE($3, contact_email),
                   tagline = COALESCE($4, tagline),
                   description = COALESCE($5, description),
                   city = COALESCE($6, city),
                   address = COALESCE($7, address)`;
    
    let params = [name, url, contact_email, tagline, description, city, address];
    let paramIndex = 8;
    
    if (logo_url !== undefined) {
        sql += `, logo_url = COALESCE($${paramIndex}, logo_url)`;
        params.push(logo_url);
        paramIndex++;
    }
    
    if (banner_url !== undefined) {
        sql += `, banner_url = COALESCE($${paramIndex}, banner_url)`;
        params.push(banner_url);
        paramIndex++;
    }
    
    if (profile_url !== undefined) {
        sql += `, profile_url = COALESCE($${paramIndex}, profile_url)`;
        params.push(profile_url);
        paramIndex++;
    }
    
    sql += ` WHERE id = $${paramIndex}
             RETURNING id, name, url, contact_email, 
             logo_url, banner_url, profile_url,
             tagline, description, city, address;`;
    
    params.push(companyId);
    
    return query(sql, params).then(function(result) {
        return result.rows;
    });
}

// UPDATE - Update company logo only
module.exports.updateCompanyLogo = function updateCompanyLogo(companyId, logo_url) {
    let sql = `UPDATE company 
               SET logo_url = $1
               WHERE id = $2
               RETURNING id, logo_url;`;
    
    return query(sql, [logo_url, companyId]).then(function(result) {
        return result.rows;
    });
}

// UPDATE - Update company banner only
module.exports.updateCompanyBanner = function updateCompanyBanner(companyId, banner_url) {
    let sql = `UPDATE company 
               SET banner_url = $1
               WHERE id = $2
               RETURNING id, banner_url;`;
    
    return query(sql, [banner_url, companyId]).then(function(result) {
        return result.rows;
    });
}

// UPDATE - Update company profile only
module.exports.updateCompanyProfile = function updateCompanyProfile(companyId, profile_url) {
    let sql = `UPDATE company 
               SET profile_url = $1
               WHERE id = $2
               RETURNING id, profile_url;`;
    
    return query(sql, [profile_url, companyId]).then(function(result) {
        return result.rows;
    });
}

// DELETE - Soft delete
module.exports.deleteCompany = function deleteCompany(companyId) {
    let getSql = `SELECT * FROM company WHERE id = $1;`;
    return query(getSql, [companyId]).then(function(companyResult) {
        if (companyResult.rows.length === 0) {
            return [];
        }
        
        const company = companyResult.rows[0];
        
        let insertSql = `INSERT INTO deleted_companies (company_id, company_data) 
                         VALUES ($1, $2) RETURNING id;`;
        return query(insertSql, [companyId, company]).then(function(insertResult) {
            let deleteSql = `DELETE FROM company WHERE id = $1 RETURNING id;`;
            return query(deleteSql, [companyId]).then(function(deleteResult) {
                return deleteResult.rows;
            });
        });
    });
}

// RESTORE - Restore a soft-deleted company
module.exports.restoreCompany = function restoreCompany(companyId) {
    let getSql = `SELECT company_data FROM deleted_companies WHERE company_id = $1 ORDER BY deleted_at DESC LIMIT 1;`;
    return query(getSql, [companyId]).then(function(deletedResult) {
        if (deletedResult.rows.length === 0) {
            return [];
        }
        
        const companyData = deletedResult.rows[0].company_data;
        
        let insertSql = `INSERT INTO company (
            id, name, url, contact_email, 
            logo_url, banner_url, profile_url,
            tagline, description, city, address
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id;`;
        
        return query(insertSql, [
            companyData.id,
            companyData.name,
            companyData.url,
            companyData.contact_email,
            companyData.logo_url,
            companyData.banner_url,
            companyData.profile_url,
            companyData.tagline,
            companyData.description,
            companyData.city,
            companyData.address
        ]).then(function(restoreResult) {
            let deleteSql = `DELETE FROM deleted_companies WHERE company_id = $1;`;
            return query(deleteSql, [companyId]).then(function() {
                return restoreResult.rows;
            });
        });
    });
}

// GET - Get all deleted companies
module.exports.getDeletedCompanies = function getDeletedCompanies() {
    let sql = `SELECT * FROM deleted_companies ORDER BY deleted_at DESC;`;
    return query(sql, []).then(function(result) {
        return result.rows;
    });
}