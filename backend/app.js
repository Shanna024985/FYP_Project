const express = require("express")
var session = require('express-session')
require("dotenv").config();
let cors = require("cors")
const path = require('path');

let app = express();
app.use(cors({
    origin: ["http://localhost:5173","http://localhost:5174","http://localhost:3000"]
}))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
// Singpass also needs session data
app.use(session({secret: 'singpassSessionData', resave: false, saveUninitialized: true, cookie: {secure: false, maxAge: 120000}}))
// socket for updating messages


let mainRoutes = require("./routers/mainRoutes")
app.use("/api",mainRoutes)



// START THE SERVER - ADD THIS
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});

module.exports = app;