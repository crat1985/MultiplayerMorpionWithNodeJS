const pseudoInput = document.querySelector(".pseudo");
const submit = document.querySelector(".createGame");
const form = document.querySelector("form");
const morpion = document.querySelector(".morpion");
const buttons = document.getElementsByClassName("btn");
const waiting = document.querySelector(".waiting");
const link = document.querySelector(".link");
const turnLabel = document.querySelector(".turn");
const roomList = document.querySelector(".rooms");
const searchForRooms = document.querySelector(".search");
const ou = document.querySelector(".ou");
const replayButton = document.querySelector(".replay");
replayButton.addEventListener("click",(e)=>{
    socket.emit("replay");
})
var id;
if(location.pathname==="/join"){
    document.querySelector(".createGame").value = "Rejoindre";
    id = location.search.substring(1);
    if(!(location.search.charAt(0)==="?"&&location.search.length>5)){
        location.replace("/404");
    }
}else{
    id="?";
    document.querySelector(".publicOrPrivate").classList.remove("d-none");
}
const join = id!=="?" ? true : false;
let socket = null;
let searchSocket = null;
let advPseudo = null;
let pseudo = null;
let public = true;
const success = new Audio("/mp3/success.mp3");
const music = new Audio("/mp3/music.mp3");
music.play();
music.loop = true;
music.volume = 0.5;
controlMusic(music);
const clickSound = new Audio("/mp3/click.mp3");
const gameOverSound = new Audio("/mp3/gameover.mp3");
searchForRooms.addEventListener("click",(e)=>{
    if(searchSocket===null){
        searchSocket=io();
        document.querySelector(".searchingRooms").classList.remove("d-none");
        searchSocket.on("rooms",(rooms)=>{
            roomList.innerHTML = "";
            rooms.forEach(room => {
                roomList.innerHTML+='<div class="room"><p>Salon de '+room.owner+'</p><button class="join'+room.id+'">Rejoindre</button></div>';
                document.querySelector(".join"+room.id).addEventListener("click",(e)=>{
                    location.replace("/join?"+room.id);
                });
            });
        })
    }
    searchSocket.emit("iWantToKnowTheRoomsAvailable");
})
submit.addEventListener("click",(e)=>{
    e.preventDefault();
    searchSocket.disconnect();
    searchSocket = null;
    document.querySelector(".searchingRooms").classList.add("d-none");
    pseudo = pseudoInput.value;
    public = document.querySelector(".public").checked ? true : false;
    if(socket===null){
        socket = io();
        replayButton.addEventListener("click",(e)=>{
            socket.emit("replay");
        })
        socket.on("1",()=>{
            replayButton.innerText = "Rejouer 1/2";
        });
        socket.on("2",()=>{
            replayButton.innerText = "Rejouer 2/2";
        });
        if(join){
            socket.on("invalidId",()=>{
                location.replace("/404");
            });
        }
        checkPseudo(socket);
        if(!join){
            socket.on("successfullyCreatedParty",()=>{
                if(searchSocket!=null){
                    searchSocket.disconnect();
                }
                form.classList.add("d-none");
                searchForRooms.classList.add("d-none");
                ou.classList.add("d-none");
                waiting.classList.remove("d-none");
                link.classList.remove("d-none");
                link.href = "https://"+location.hostname+"/join?"+socket.id;
                link.innerText = "https://"+location.hostname+"/join?"+socket.id;
                roomList.innerHTML = "";
            })
        }
        //Quand l'adversaire quitte
        socket.on("advQuit",()=>{advQuit(turnLabel,success)});
        // advQuit(socket,turnLabel,success);
        socket.on("playerJoined",(player)=>{
            waiting.classList.add("d-none");
            form.classList.add("d-none");
            searchForRooms.classList.add("d-none");
            ou.classList.add("d-none");
            link.classList.add("d-none");
            morpion.classList.remove("d-none");
            morpion.style.backgroundColor = "black";
            advPseudo=player;
            turnLabel.classList.remove("d-none");
            if(join){
                turnLabel.innerText = "C'est au tour de "+player+" de jouer !";
                turnLabel.style.color = "red";
            }else{
                turnLabel.innerText = "C'est à ton tour de jouer !";
                turnLabel.style.color = "green";
            }
            buttonsEventsAdd(buttons);
            socket.on("yourturn",()=>{
                turnLabel.innerText = "C'est à ton tour de jouer !";
                turnLabel.style.color = "green";
            })
            socket.on("notagainyourturn",()=>{
                turnLabel.innerText = "C'est au tour de "+ advPseudo +" de jouer !";
                turnLabel.style.color = "red";
            })
        })
        socket.on("invalidnumber",()=>{
            alert("Erreur 102 : Nombre invalide !\nEnvoie ce code d'erreur au développeur en expliquant comment tu as eu ce bug !");
        })
        socket.on("notturn",()=>{
            // alert("Ce n'est pas ton tour, sois patient !")
        })
        socket.on("successturn",(table,replay)=>{
            successTurn(buttons,pseudo,table,replay);
        });
        wonOrLose(socket,turnLabel,success,gameOverSound);
    }
    socket.emit("pseudo",pseudo,id,public);
})