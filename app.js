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

require("./modules/router")(app,express,__dirname);
require("./modules/routes")(app,__dirname);

const io = new Server(https);

https.listen(port, ()=>{
    console.log("HTTPS server listening at https://nodejshttps.ddns.net/");
})

let games = [];
let sockets = [];

io.on("connection", (socket)=>{
    console.log(socket.id);
    sockets.push(socket);
    socket.on("pseudo",(pseudo,createGame,ID)=>{
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
                        if(checkTie(game)){
                            game.owner.emit("tie");
                            game.connected.emit("tie");
                            game.turn = null;
                        }else{
                            game.connected.emit("yourturn");
                            game.owner.emit("notagainyourturn");
                        }
                    }
                }else{
                    game.turn=game.owner.pseudo;
                    let win = checkWin(game);
                    if(win!==undefined){
                        win[0].emit("youwon");
                        win[1].emit("youlose");
                        game.turn = null;
                    }else{
                        if(checkTie(game)){
                            game.owner.emit("tie");
                            game.connected.emit("tie");
                            game.turn = null;
                        }else{
                            game.owner.emit("yourturn");
                            game.connected.emit("notagainyourturn");
                        }
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
        sockets = sockets.filter((socket1)=>{
            if(socket1===socket){
                return false;
            }
            return true;
        })
        games = games.filter((game)=>{
            if(game.connected!=undefined){
                if(game.connected===socket||game.owner===socket){
                    if(game.turn!==null){
                        game.connected.emit("advQuit");
                        game.owner.emit("advQuit");
                    }
                }
            } else{
                return true;
            }
            return false;
        })
        sendRooms(sockets,games);
    })
    socket.on("iWantToKnowTheRoomsAvailable",()=>{
        socket.emit("rooms",games.filter((game)=>{
            if(game.connected===undefined) return true;
            return false;
        }).map((game)=>{
            return {id:game.id,owner:game.owner.pseudo};
        }));
    })
})

const checkWin = require("./modules/checkWin");
const checkTie = require("./modules/checkTie");
const sendRooms = require("./modules/sendRooms");