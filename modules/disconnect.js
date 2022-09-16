module.exports = (socket,sockets,games,sendRooms)=>{
    socket.on("disconnect",(raison)=>{
        socket.isConnected = false;
        sockets = sockets.filter((socket1)=>{
            if(socket1===socket){
                return false;
            }
            return true;
        })
        games = games.filter((game)=>{
            // if(game.connected!=undefined){
            if(game.connected===socket||game.owner===socket){
                if(game.turn!==null){
                    if(game.connected!=undefined){
                        game.connected.emit("advQuit");
                    }
                    game.owner.emit("advQuit");
                }
                // }
            } else{
                return true;
            }
            return false;
        })
        sendRooms(sockets,games);
    })
}