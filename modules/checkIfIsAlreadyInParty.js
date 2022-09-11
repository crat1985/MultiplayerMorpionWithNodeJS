module.exports = (socket,games)=>{
    if(games.length>0){
        let stop = false;
        games.forEach((game)=>{
            if(game.owner.pseudo===socket.pseudo){
                socket.emit("alreadycreatedparty");
                stop = true;
                return;
            }else if(game.connected===socket){
                socket.emit("alreadyinaparty");
                stop=true;
                return;
            }
        })
        if(stop) return true;
        return false;
    }
}