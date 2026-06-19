const { query } = require("../services/dbConnection");

// CREATE - Create a company
module.exports.createCompany = function createCompany(companyData) {
    const { 
        name, url, contact_email, 
        logo_file_name, logo_file_data, 
        tagline, description, city 
    } = companyData;
    
    // Convert empty logo to empty bytea
    const logoData = logo_file_data || Buffer.from('');
    const logoName = logo_file_name || '';
    
    let sql = `INSERT INTO company(
        name, url, contact_email, 
        logo_file_name, logo_file_data, 
        tagline, description, city
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
    RETURNING *;`;
    
    return query(sql, [
        name, url, contact_email,
        logoName, logoData,
        tagline, description, city
    ]).then(function(result) {
        return result.rows;
    });
}

// READ - Get all companies
module.exports.getAllCompanies = function getAllCompanies() {
    let sql = `SELECT id, name, url, contact_email, tagline, description, city 
               FROM company ORDER BY id DESC;`;
    return query(sql, []).then(function(result) {
        return result.rows;
    });
}

// READ - Get single company by ID
module.exports.getCompanyById = function getCompanyById(companyId) {
    let sql = `SELECT id, name, url, contact_email, tagline, description, city, logo_file_name, encode(logo_file_data, 'base64') as logo_base64
               FROM company WHERE id = $1;`;
    return query(sql, [companyId]).then(function(result) {
        return result.rows;
    });
}

// READ - Get company page data (jobs + reviews + rating)
module.exports.getCompanyPageData = function getCompanyPageData(companyId) {
    let sql = `SELECT c.id, c.name, c.url, c.contact_email, c.tagline, c.description, c.city,
               COALESCE((SELECT json_agg(json_build_object('id', j.id, 'title', j.title, 'location', j.location)) FROM job j WHERE j.company_id = c.id), '[]') as jobs,
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
    const { name, url, contact_email, tagline, description, city } = companyData;
    
    let sql = `UPDATE company 
               SET name = COALESCE($1, name),
                   url = COALESCE($2, url),
                   contact_email = COALESCE($3, contact_email),
                   tagline = COALESCE($4, tagline),
                   description = COALESCE($5, description),
                   city = COALESCE($6, city)
               WHERE id = $7
               RETURNING id, name, url, contact_email, tagline, description, city;`;
    
    return query(sql, [name, url, contact_email, tagline, description, city, companyId])
        .then(function(result) {
            return result.rows;
        });
}

// DELETE - Delete a company
module.exports.deleteCompany = function deleteCompany(companyId) {
    let sql = "DELETE FROM company WHERE id = $1 RETURNING id;";
    return query(sql, [companyId]).then(function(result) {
        return result.rows;
    });
}