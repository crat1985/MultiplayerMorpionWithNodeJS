const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https").createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
},app);
const {Server} = require("socket.io");
const port = 443;

require("./modules/router")(app,express,__dirname);
require("./modules/routes")(app,__dirname);

const io = new Server(https);

https.listen(port, ()=>{
    console.log("HTTPS server listening at https://nodejshttps.ddns.net/");
})

let games = [];
let sockets = [];

io.on("connection", (socket)=>{
    console.log("[DEBUG] "+socket.id);
    sockets.push(socket);
    socket.on("pseudo",(pseudo,createGame,ID)=>{
        sockets = sockets.filter(socketE => {
            if(socketE===socket) return false;
            return true;
        })
        if(!require("./modules/verifyPseudo")(socket,pseudo)) return;
        socket.pseudo = pseudo;
        socket.isConnected = true;
        socket.emit("pseudoOk");
        const id = ID;
        if(id!==null){
            if(!require("./modules/verifyId")(id,games)){
                socket.emit("invalidId");
                return;
            };
        }
        if(require("./modules/checkIfIsAlreadyInParty")(socket,games)) return;
        let game;
        let turn;
        if(createGame){
            socket.emit("successfullyCreatedParty");
            game = {id: socket.id,owner: socket,connected:undefined,table:[' ',' ',' ',' ',' ',' ',' ',' ',' '],turn:socket.pseudo};
            games.push(game);
            console.log("before");
            console.log(games.map((game)=>{
                return {id:game.id,owner:game.owner.pseudo};
            }));
            sendRooms(sockets,games);
            console.log("after");
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
            sendRooms(sockets,games);
        }
        require("./modules/play")(socket,game);
    })
    require("./modules/disconnect")(socket,sockets,games,sendRooms);
    require("./modules/roomsAvailablesRequest")(socket,sockets,games);
})

const sendRooms = require("./modules/sendRooms");