const click = ()=>{
    clickSound.currentTime = 0;
    clickSound.play();
}
const buttonsEventsAdd = (buttons)=>{
    for(i = 0;i<9;i++){
        buttons[i].classList.remove("d-none");
    }
    buttons[0].addEventListener("click",(e)=>{
        socket.emit("play",0);
        click();
    });
    buttons[1].addEventListener("click",(e)=>{
        socket.emit("play",1);
        click();
    });
    buttons[2].addEventListener("click",(e)=>{
        socket.emit("play",2);
        click();
    });
    buttons[3].addEventListener("click",(e)=>{
        socket.emit("play",3);
        click();
    });
    buttons[4].addEventListener("click",(e)=>{
        socket.emit("play",4);
        click();
    });
    buttons[5].addEventListener("click",(e)=>{
        socket.emit("play",5);
        click();
    });
    buttons[6].addEventListener("click",(e)=>{
        socket.emit("play",6);
        click();
    });
    buttons[7].addEventListener("click",(e)=>{
        socket.emit("play",7);
        click();
    });
    buttons[8].addEventListener("click",(e)=>{
        socket.emit("play",8);
        click();
    });
}