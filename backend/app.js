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
let pathForServingHtmlFile = path.join(__dirname,"dist")
console.log(pathForServingHtmlFile)
app.use("/",express.static(pathForServingHtmlFile))

let mainRoutes = require("./routers/mainRoutes")
app.use("/api",mainRoutes)

// For Singpass, the app needs to show public keys
app.use("/.well-known/jwks.json", (req, res) => {
    res.status(200).json({keys: [JSON.parse(process.env.SINGPASS_PUBLIC_KEY_SIG), JSON.parse(process.env.SINGPASS_PUBLIC_KEY_ENC)]})
});

// Singpass also needs session data
app.use(session({secret: 'singpassSessionData', cookie: {maxAge: 120000}}))

// Catch-all for React Router
app.use((req, res) => {
    res.sendFile(path.join(pathForServingHtmlFile, "index.html"));
});
  
module.exports = app;