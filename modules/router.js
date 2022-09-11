const path = require("path");
module.exports = (app,express,dirname)=>{
    app.use("/js",express.static(path.join(dirname,"public/js"))).use("/css",express.static(path.join(dirname,"public/css")));

    app.use("/favicon.ico",express.static(path.join(dirname,"src/images/favicon.ico")));

    app.use("/mp3",express.static(path.join(dirname,"src/mp3")));

    app.use("/",(req,res,next)=>{
        console.log("New connection :",req.ip);
        next();
    })
}