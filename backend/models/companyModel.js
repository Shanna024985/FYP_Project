const { query } = require("../services/dbConnection");

// CREATE - Create a company with logo, banner, and profile images
module.exports.createCompany = function createCompany(companyData) {
    const { 
        name, url, contact_email, 
        logo_file_name, logo_file_data,
        banner_file_name, banner_file_data,
        profile_file_name, profile_file_data,
        tagline, description, city 
    } = companyData;
    
    const logoData = logo_file_data ? Buffer.from(logo_file_data, 'base64') : Buffer.from('');
    const logoName = logo_file_name || '';
    const bannerData = banner_file_data ? Buffer.from(banner_file_data, 'base64') : Buffer.from('');
    const bannerName = banner_file_name || '';
    const profileData = profile_file_data ? Buffer.from(profile_file_data, 'base64') : Buffer.from('');
    const profileName = profile_file_name || '';
    
    let sql = `INSERT INTO company(
        name, url, contact_email, 
        logo_file_name, logo_file_data,
        banner_file_name, banner_file_data,
        profile_file_name, profile_file_data,
        tagline, description, city
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
    RETURNING *;`;
    
    return query(sql, [
        name, url, contact_email,
        logoName, logoData,
        bannerName, bannerData,
        profileName, profileData,
        tagline, description, city
    ]).then(function(result) {
        return result.rows;
    });
}

// READ - Get all companies
module.exports.getAllCompanies = function getAllCompanies() {
    let sql = `SELECT id, name, url, contact_email, 
               logo_file_name, banner_file_name, profile_file_name,
               tagline, description, city 
               FROM company 
               ORDER BY id DESC;`;
    return query(sql, []).then(function(result) {
        return result.rows;
    });
}

// READ - Get single company by ID
module.exports.getCompanyById = function getCompanyById(companyId) {
    let sql = `SELECT id, name, url, contact_email, 
               logo_file_name, banner_file_name, profile_file_name,
               tagline, description, city 
               FROM company 
               WHERE id = $1;`;
    return query(sql, [companyId]).then(function(result) {
        return result.rows;
    });
}

// READ - Get company page data (jobs + reviews + rating + images)
module.exports.getCompanyPageData = function getCompanyPageData(companyId) {
    let sql = `SELECT c.id, c.name, c.url, c.contact_email, 
               c.tagline, c.description, c.city,
               c.logo_file_name, c.banner_file_name, c.profile_file_name,
               COALESCE((SELECT json_agg(json_build_object('id', j.id, 'title', j.title, 'location', j.location, 'category', j.category)) FROM job j WHERE j.company_id = c.id), '[]') as jobs,
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
        tagline, description, city,
        logo_file_name, logo_file_data,
        banner_file_name, banner_file_data,
        profile_file_name, profile_file_data
    } = companyData;
    
    const logoData = logo_file_data ? Buffer.from(logo_file_data, 'base64') : undefined;
    const bannerData = banner_file_data ? Buffer.from(banner_file_data, 'base64') : undefined;
    const profileData = profile_file_data ? Buffer.from(profile_file_data, 'base64') : undefined;
    
    let sql = `UPDATE company 
               SET name = COALESCE($1, name),
                   url = COALESCE($2, url),
                   contact_email = COALESCE($3, contact_email),
                   tagline = COALESCE($4, tagline),
                   description = COALESCE($5, description),
                   city = COALESCE($6, city)`;
    
    let params = [name, url, contact_email, tagline, description, city];
    let paramIndex = 7;
    
    if (logo_file_name !== undefined) {
        sql += `, logo_file_name = COALESCE($${paramIndex}, logo_file_name)`;
        params.push(logo_file_name);
        paramIndex++;
    }
    
    if (logoData !== undefined) {
        sql += `, logo_file_data = COALESCE($${paramIndex}, logo_file_data)`;
        params.push(logoData);
        paramIndex++;
    }
    
    if (banner_file_name !== undefined) {
        sql += `, banner_file_name = COALESCE($${paramIndex}, banner_file_name)`;
        params.push(banner_file_name);
        paramIndex++;
    }
    
    if (bannerData !== undefined) {
        sql += `, banner_file_data = COALESCE($${paramIndex}, banner_file_data)`;
        params.push(bannerData);
        paramIndex++;
    }
    
    if (profile_file_name !== undefined) {
        sql += `, profile_file_name = COALESCE($${paramIndex}, profile_file_name)`;
        params.push(profile_file_name);
        paramIndex++;
    }
    
    if (profileData !== undefined) {
        sql += `, profile_file_data = COALESCE($${paramIndex}, profile_file_data)`;
        params.push(profileData);
        paramIndex++;
    }
    
    sql += ` WHERE id = $${paramIndex}
             RETURNING id, name, url, contact_email, 
             logo_file_name, banner_file_name, profile_file_name,
             tagline, description, city;`;
    
    params.push(companyId);
    
    return query(sql, params).then(function(result) {
        return result.rows;
    });
}

// UPDATE - Update company logo only
module.exports.updateCompanyLogo = function updateCompanyLogo(companyId, logoFileName, logoFileData) {
    const logoData = logoFileData ? Buffer.from(logoFileData, 'base64') : Buffer.from('');
    
    let sql = `UPDATE company 
               SET logo_file_name = $1, logo_file_data = $2
               WHERE id = $3
               RETURNING id, logo_file_name;`;
    
    return query(sql, [logoFileName, logoData, companyId]).then(function(result) {
        return result.rows;
    });
}

// UPDATE - Update company banner only
module.exports.updateCompanyBanner = function updateCompanyBanner(companyId, bannerFileName, bannerFileData) {
    const bannerData = bannerFileData ? Buffer.from(bannerFileData, 'base64') : Buffer.from('');
    
    let sql = `UPDATE company 
               SET banner_file_name = $1, banner_file_data = $2
               WHERE id = $3
               RETURNING id, banner_file_name;`;
    
    return query(sql, [bannerFileName, bannerData, companyId]).then(function(result) {
        return result.rows;
    });
}

// UPDATE - Update company profile image only
module.exports.updateCompanyProfile = function updateCompanyProfile(companyId, profileFileName, profileFileData) {
    const profileData = profileFileData ? Buffer.from(profileFileData, 'base64') : Buffer.from('');
    
    let sql = `UPDATE company 
               SET profile_file_name = $1, profile_file_data = $2
               WHERE id = $3
               RETURNING id, profile_file_name;`;
    
    return query(sql, [profileFileName, profileData, companyId]).then(function(result) {
        return result.rows;
    });
}

// DELETE - Soft delete: Move company to deleted_companies table
module.exports.deleteCompany = function deleteCompany(companyId) {
    // First, get the company data
    let getSql = `SELECT * FROM company WHERE id = $1;`;
    return query(getSql, [companyId]).then(function(companyResult) {
        if (companyResult.rows.length === 0) {
            return [];
        }
        
        const company = companyResult.rows[0];
        
        // Store in deleted_companies table
        let insertSql = `INSERT INTO deleted_companies (company_id, company_data) 
                         VALUES ($1, $2) RETURNING id;`;
        return query(insertSql, [companyId, company]).then(function(insertResult) {
            // Then delete from company table
            let deleteSql = `DELETE FROM company WHERE id = $1 RETURNING id;`;
            return query(deleteSql, [companyId]).then(function(deleteResult) {
                return deleteResult.rows;
            });
        });
    });
}

// RESTORE - Restore a soft-deleted company
module.exports.restoreCompany = function restoreCompany(companyId) {
    // First, get the deleted company data
    let getSql = `SELECT company_data FROM deleted_companies WHERE company_id = $1 ORDER BY deleted_at DESC LIMIT 1;`;
    return query(getSql, [companyId]).then(function(deletedResult) {
        if (deletedResult.rows.length === 0) {
            return [];
        }
        
        const companyData = deletedResult.rows[0].company_data;
        
        // Restore to company table
        let insertSql = `INSERT INTO company (
            id, name, url, contact_email, 
            logo_file_name, logo_file_data,
            banner_file_name, banner_file_data,
            profile_file_name, profile_file_data,
            tagline, description, city
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id;`;
        
        return query(insertSql, [
            companyData.id,
            companyData.name,
            companyData.url,
            companyData.contact_email,
            companyData.logo_file_name,
            companyData.logo_file_data,
            companyData.banner_file_name,
            companyData.banner_file_data,
            companyData.profile_file_name,
            companyData.profile_file_data,
            companyData.tagline,
            companyData.description,
            companyData.city
        ]).then(function(restoreResult) {
            // Delete from deleted_companies
            let deleteSql = `DELETE FROM deleted_companies WHERE company_id = $1;`;
            return query(deleteSql, [companyId]).then(function() {
                return restoreResult.rows;
            });
        });
    });
}

// GET - Get all deleted companies (for admin)
module.exports.getDeletedCompanies = function getDeletedCompanies() {
    let sql = `SELECT * FROM deleted_companies ORDER BY deleted_at DESC;`;
    return query(sql, []).then(function(result) {
        return result.rows;
    });
}