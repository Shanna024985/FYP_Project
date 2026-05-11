const express = require("express")
require("dotenv").config();
let cors = require("cors")
const path = require('path');

let app = express();
app.use(cors({
    origin: ["https://google-drive-folder-creation.onrender.com","http://localhost:5173","http://localhost:5174","http://localhost:3000","https://game-for-cny.vercel.app"]
}))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
let pathForServingHtmlFile = path.join(__dirname,"dist")
console.log(pathForServingHtmlFile)
app.use("/",express.static(pathForServingHtmlFile))

let mainRoutes = require("./routers/mainRoutes")
app.use("/api",mainRoutes)

// Catch-all for React Router
app.use((req, res) => {
    res.sendFile(path.join(pathForServingHtmlFile, "index.html"));
});
  
module.exports = app;