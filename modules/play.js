const checkWin = require("./checkWin");
const checkTie = require("./checkTie");

module.exports = (socket,game)=>{
    socket.on("play",(number)=>{
        replay(socket,game);
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
            game.connected.emit("successturn",game.table,false);
            game.owner.emit("successturn",game.table,false);
        }else if(game.turn!==socket.pseudo){
            socket.emit("notturn");
        }else{
            socket.emit("invalidnumber");
        }
    });
}
const replay = (socket,game)=>{
    socket.on("replay",()=>{
        if(game.turn===null){
            socket.wantReplay = true;
            if(game.owner.wantReplay&&game.connected.wantReplay){
                game.owner.emit("2");
                game.connected.emit("2");
                game.table=[' ',' ',' ',' ',' ',' ',' ',' ',' '];
                game.turn=game.owner.pseudo;
                game.owner.emit("successturn",game.table,true);
                game.connected.emit("successturn",game.table,true);
                game.owner.emit("yourturn");
                game.connected.emit("notagainyourturn");
                socket.wantReplay = false;
            }else{
                game.owner.emit("1");
                game.connected.emit("1");
            }
        }
    });
}