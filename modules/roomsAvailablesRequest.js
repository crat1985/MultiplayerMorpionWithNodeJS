module.exports = (socket,sockets,games)=>{
    socket.on("iWantToKnowTheRoomsAvailable",()=>{
        if(!sockets.includes(socket)) return;
        socket.emit("rooms",games.filter((game)=>{
            if(game.connected===undefined&&game.public) return true;
            return false;
        }).map((game)=>{
            return {id:game.id,owner:game.owner.pseudo};
        }));
        socket.emit("invalidnumber");
    })
}