module.exports = (socket,sockets,games,sendRooms)=>{
    socket.isConnected = false;
    sockets = sockets.filter((socket1)=>{
        if(socket1===socket){
            return false;
        }
        return true;
    })
    games = games.filter((game)=>{
        if(game.connected===socket||game.owner===socket){
            if(game.turn!==null){
                if(game.connected!=undefined){
                    game.connected.emit("advQuit");
                    game.turn = null;
                }
                game.owner.emit("advQuit");
                game.turn = null;
            }
            return false;
        } else{
            return true;
        }
    })
    sendRooms(sockets,games);
    return [games,sockets];
}