let app = require("./backend/app")
const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log("App listening to port 3000")
})