module.exports = (game)=>{
    if(game.table[0]!==' '&&game.table[0]===game.table[1]&&game.table[1]===game.table[2]){
        if(game.table[0]===game.owner.pseudo){
            return [game.owner,game.connected];
        } else if(game.table[0]===game.connected.pseudo){
            return [game.connected,game.owner];
        }
    }
    if(game.table[3]!==' '&&game.table[3]===game.table[4]&&game.table[4]===game.table[5]){
        if(game.table[3]===game.owner.pseudo){
            return [game.owner,game.connected];
        } else if(game.table[3]===game.connected.pseudo){
            return [game.connected,game.owner];
        }
    }
    if(game.table[6]!==' '&&game.table[6]===game.table[7]&&game.table[7]===game.table[8]){
        if(game.table[6]===game.owner.pseudo){
            return [game.owner,game.connected];
        } else if(game.table[6]===game.connected.pseudo){
            return [game.connected,game.owner];
        }
    }
    if(game.table[0]!==' '&&game.table[0]===game.table[3]&&game.table[3]===game.table[6]){
        if(game.table[0]===game.owner.pseudo){
            return [game.owner,game.connected];
        } else if(game.table[0]===game.connected.pseudo){
            return [game.connected,game.owner];
        }
    }
    if(game.table[1]!==' '&&game.table[1]===game.table[4]&&game.table[4]===game.table[7]){
        if(game.table[1]===game.owner.pseudo){
            return [game.owner,game.connected];
        } else if(game.table[1]===game.connected.pseudo){
            return [game.connected,game.owner];
        }
    }
    if(game.table[2]!==' '&&game.table[2]===game.table[5]&&game.table[5]===game.table[8]){
        if(game.table[2]===game.owner.pseudo){
            return [game.owner,game.connected];
        } else if(game.table[2]===game.connected.pseudo){
            return [game.connected,game.owner];
        }
    }
    if(game.table[2]!==' '&&game.table[2]===game.table[5]&&game.table[5]===game.table[8]){
        if(game.table[2]===game.owner.pseudo){
            return [game.owner,game.connected];
        } else if(game.table[2]===game.connected.pseudo){
            return [game.connected,game.owner];
        }
    }
    if(game.table[0]!==' '&&game.table[0]===game.table[4]&&game.table[4]===game.table[8]){
        if(game.table[0]===game.owner.pseudo){
            return [game.owner,game.connected];
        } else if(game.table[0]===game.connected.pseudo){
            return [game.connected,game.owner];
        }
    }
    if(game.table[2]!==' '&&game.table[2]===game.table[4]&&game.table[4]===game.table[6]){
        if(game.table[2]===game.owner.pseudo){
            return [game.owner,game.connected];
        } else if(game.table[2]===game.connected.pseudo){
            return [game.connected,game.owner];
        }
    }
    return undefined;
}