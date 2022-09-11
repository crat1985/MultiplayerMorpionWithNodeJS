const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const https = require("https").createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
},app);
const {Server} = require("socket.io");
const port = 443;

app.use("/js",express.static(path.join(__dirname,"public/js"))).use("/css",express.static(path.join(__dirname,"public/css")));

app.use("/favicon.ico",express.static(path.join(__dirname,"src/images/favicon.ico")));

app.use("/mp3",express.static(path.join(__dirname,"src/mp3")));

app.use("/",(req,res,next)=>{
    console.log("New connection :",req.ip);
    next();
})

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"public/html/index.html"))
})
app.get("/join",(req,res)=>{
    res.sendFile(path.join(__dirname,"public/html/join.html"))
})

app.get("/404",(req,res)=>{
    res.sendFile(path.join(__dirname,"public/html/404.html"))
})

const io = new Server(https);

https.listen(port, ()=>{
    console.log("HTTPS server listening at https://nodejshttps.ddns.net/");
})

// https.on("stream",(stream,headers)=>{
//     stream.respond({
//         "content-type": "application/json",
//         "status": 200
//     })
// })

let games = [];

io.on("connection", (socket)=>{
    console.log(socket.id);
    socket.on("pseudo",(pseudo,createGame,ID)=>{
        if(pseudo.length<5){
            socket.emit("tooshort");
            return;
        }
        if(pseudo.includes("\n")||pseudo.includes(" ")||pseudo.includes("\t")){
            socket.emit("nospaces");
            return;
        }
        socket.pseudo = pseudo;
        socket.isConnected = true;
        socket.emit("pseudoOk");
        const id = ID;
        if(id!==null){
            let validId = false;
            games.forEach((game)=>{
                if(game.id===id&&game.connected===undefined){
                    validId = true;
                }
            })
            if(!validId){
                socket.emit("invalidId");
                return;
            }
        }
        let stop = false;
        if(games.length>0){
            games.forEach((game)=>{
                stop = true;
                // console.log(games);
                if(game.owner===socket.pseudo){
                    socket.emit("alreadycreatedparty");
                    return;
                }else if(game.connected===socket.pseudo){
                    socket.emit("alreadyinaparty");
                    return;
                }else{
                    stop=false;
                }
            })
        }
        if(stop) return;
        let game;
        let turn;
        if(createGame){
            socket.emit("successfullyCreatedParty");
            game = {id: socket.id,owner: socket,connected:undefined,table:[' ',' ',' ',' ',' ',' ',' ',' ',' '],turn:socket.pseudo};
            games.push(game);
        }else{
            games = games.filter((game1)=>{
                if(game1.id===id){
                    if(game1.connected===undefined){
                        game1.connected=socket;
                        game = game1;
                        game.connected.emit("playerJoined",game.owner.pseudo);
                        game.owner.emit("playerJoined",game.connected.pseudo);
                        return game1;
                    }
                }
                return game1;
            })
        }
        
        socket.on("play",(number)=>{
            if(!(number>=0&&number<=8)){
                socket.emit("invalidnumber");
                return;
            }
            if(game.turn===socket.pseudo&&game.table[number]===' '){
                game.table[number]=socket.pseudo;
                if(socket.pseudo===game.owner.pseudo){
                    game.turn=game.connected.pseudo;
                    let win = checkWin(game);
                    if(win!==undefined){
                        win[0].emit("youwon");
                        win[1].emit("youlose");
                        game.turn = null;
                    }else{
                        game.connected.emit("yourturn");
                        game.owner.emit("notagainyourturn");
                    }
                    
                }else{
                    game.turn=game.owner.pseudo;
                    let win = checkWin(game);
                    if(win!==undefined){
                        win[0].emit("youwon");
                        win[1].emit("youlose");
                        game.turn = null;
                    }else{
                        game.owner.emit("yourturn");
                        game.connected.emit("notagainyourturn");
                        
                    }
                    
                }
                game.connected.emit("successturn",game.table);
                game.owner.emit("successturn",game.table);
            }else if(turn!==socket.pseudo){
                socket.emit("notturn");
            }else{
                socket.emit("invalidnumber");
            }
        });
    })
    socket.on("disconnect",(raison)=>{
        socket.isConnected = false;
        games = games.filter((game)=>{
            if(game.owner.pseudo===socket.pseudo){
                if(game.connected!=undefined){
                    if(game.turn!==null){
                        game.connected.emit("ownerQuit");
                    }
                }
            } else if(game.connected.pseudo===socket.pseudo){
                if(game.turn!==null){
                    game.owner.emit("playerQuit");
                }
            } else{
                return true;
            }
            return false;
        })
    })
})

const checkWin = require("./modules/checkWin");