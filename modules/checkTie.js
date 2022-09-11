module.exports = (game)=>{
    if(game.table[0]!==' '&&game.table[1]!==' '&&game.table[2]!==' '&&game.table[3]!==' '&&game.table[4]!==' '&&game.table[5]!==' '&&game.table[6]!==' '&&game.table[7]!==' '&&game.table[8]!==' '){
        return true;
    }
    return false;
}