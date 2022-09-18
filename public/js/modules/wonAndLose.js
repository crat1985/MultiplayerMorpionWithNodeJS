const wonOrLose = (socket,turnLabel,success,gameOverSound)=>{
    socket.on("youwon",()=>{
        turnLabel.innerText = "Tu as gagné !";
        turnLabel.style.color = "green";
        success.volume = 1;
        success.play();
        replay();
    })
    socket.on("youlose",()=>{
        turnLabel.innerText = "Tu as perdu !";
        turnLabel.style.color = "red";
        gameOverSound.volume = 1;
        gameOverSound.play();
        replay();
    })
    socket.on("tie",()=>{
        turnLabel.innerText = "Egalité !";
        turnLabel.style.color = "orange";
        gameOverSound.volume = 1;
        gameOverSound.play();
        replay();
    });
}
const replay = ()=>{
    document.querySelector(".replay").classList.remove("d-none");
}