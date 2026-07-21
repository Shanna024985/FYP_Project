let app = require("./app")
const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log("App listening to port 3000")
})
console.log("yes")