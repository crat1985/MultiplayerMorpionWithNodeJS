module.exports = (sockets,games)=>{
    sockets.forEach((socket)=>{
        socket.emit("rooms",games.filter((game)=>{
            if(game.connected===undefined) return true;
            return false;
        }).map((game)=>{
            return {id:game.id,owner:game.owner.pseudo};
        }));
    })
}