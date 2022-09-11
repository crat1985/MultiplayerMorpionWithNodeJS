module.exports = (id,games)=>{
    let validId = false;
    games.forEach((game)=>{
        if(game.id===id&&game.connected===undefined){
            validId = true;
        }
    })
    return validId;
}