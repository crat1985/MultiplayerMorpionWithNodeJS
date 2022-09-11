const path = require("path");
module.exports = (app,dirname)=>{
    app.get("/",(req,res)=>{
        res.sendFile(path.join(dirname,"public/html/index.html"))
    })
    app.get("/join",(req,res)=>{
        res.sendFile(path.join(dirname,"public/html/join.html"))
    })
    app.get("/404",(req,res)=>{
        res.sendFile(path.join(dirname,"public/html/404.html"))
    })
}