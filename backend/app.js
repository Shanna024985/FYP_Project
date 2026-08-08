const express = require("express");
var session = require('express-session');
const cookieParser = require('cookie-parser'); // Add this
require("dotenv").config();
let cors = require("cors");
const path = require('path');

let app = express();

// CORS - Allow credentials
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    credentials: true // ← IMPORTANT: Allow cookies to be sent
}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Cookie parser middleware
app.use(cookieParser());

// Session middleware - FIXED
app.use(session({
    secret: process.env.JWT_SECRET_KEY || 'your-secret-key', // ← Use env variable
    resave: false, 
    saveUninitialized: true,
    cookie: { 
        secure: false,  // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // ← 24 hours (not 2 minutes!)
    }
}));

// Serve static files
let pathForServingHtmlFile = path.join(__dirname, "dist");
console.log(pathForServingHtmlFile);
app.use("/", express.static(pathForServingHtmlFile));

// Routes
let mainRoutes = require("./routers/mainRoutes");
app.use("/api", mainRoutes);

// Catch-all for React Router
app.use((req, res) => {
    res.sendFile(path.join(pathForServingHtmlFile, "index.html"));
});

// START THE SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});

module.exports = app;

