const pg = require("pg");
const dotenv = require("dotenv");
dotenv.config();

console.log('DB_HOST from env:', process.env.DB_HOST); // Debug line

const pool = new pg.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

// Monkey patch .query(...) method to console log all queries before executing it
const oldQuery = pool.query;
pool.query = function (...args) {
    const [sql, params] = args;
    console.log(`EXECUTING QUERY |`, sql, params);
    return oldQuery.apply(pool, args);
};

module.exports.query = function(sql, params) {
    return pool.query(sql, params);
};