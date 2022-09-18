const checkPseudo = (socket)=>{
    socket.on("tooshort",()=>{
        alert("Pseudo trop court !");
    });
    socket.on("nospaces",()=>{
        alert("Espaces, tabulations et retours à la lignes interdits !")
    });
    socket.on("alreadycreatedparty",()=>{
        alert("Tu es encore dans la partie que tu as créé.e !");
    })
    socket.on("alreadyinaparty",()=>{
        alert("Tu es déjà dans une autre partie !");
    })
}