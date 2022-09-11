module.exports = (pseudo)=>{
    if(pseudo.length<5){
        socket.emit("tooshort");
        return false;
    }
    if(pseudo.includes("\n")||pseudo.includes(" ")||pseudo.includes("\t")){
        socket.emit("nospaces");
        return false;
    }
    return true;
}