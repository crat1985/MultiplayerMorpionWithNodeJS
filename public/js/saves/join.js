submit.addEventListener("click",(e)=>{
    e.preventDefault();
    pseudo = pseudoInput.value;
    if(socket===null){
        socket = io();
        checkPseudo(socket);
        advQuit(socket,turnLabel,replayFunction,success,replay);
        socket.on("playerJoined",(player)=>{
            waiting.classList.add("d-none");
            form.classList.add("d-none");
            morpion.classList.remove("d-none");
            morpion.style.backgroundColor = "black";
            advPseudo=player;
            turnLabel.classList.remove("d-none");
            turnLabel.innerText = "C'est au tour de "+player+" de jouer !";
            turnLabel.style.color = "red";
            buttonsEventsAdd(buttons,click);
            turn(socket,turnLabel,advPseudo);
        })
        invalidNumber(socket);
        socket.on("notturn",()=>{
            // alert("Ce n'est pas ton tour, sois patient !")
        })
        successTurn(socket,buttons,pseudo);
        wonOrLose(socket,turnLabel,success,gameOverSound);
    }
})
const click = ()=>{
    clickSound.currentTime = 0;
    clickSound.play();
}