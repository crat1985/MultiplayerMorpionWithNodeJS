
const pseudoInput = document.querySelector(".pseudo");
const submit = document.querySelector(".createGame");
const form = document.querySelector("form");
const morpion = document.querySelector(".morpion");
const buttons = document.getElementsByClassName("btn");
const waiting = document.querySelector(".waiting");
const id = location.search.substring(1);
const turnLabel = document.querySelector(".turn");
const replay = document.querySelector(".replay");
let advPseudo;
let socket = null;
let pseudo = null;
if(!(location.search.charAt(0)==="?"&&location.search.length>5)){
    location.replace("/404");
}
const success = new Audio("/mp3/success.mp3");
const music = new Audio("/mp3/music.mp3");
music.play();
music.loop = true;
music.volume = 0.5;
controlMusic(music);
const clickSound = new Audio("/mp3/click.mp3");
const gameOverSound = new Audio("/mp3/gameover.mp3");
submit.addEventListener("click",(e)=>{
    e.preventDefault();
    pseudo = pseudoInput.value;
    if(socket===null){
        socket = io();
        socket.on("invalidId",()=>{
            location.replace("/404");
        });
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
    socket.emit("pseudo",pseudo,false,id);
})
const click = ()=>{
    clickSound.currentTime = 0;
    clickSound.play();
}