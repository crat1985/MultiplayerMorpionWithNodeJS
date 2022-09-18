const successTurn = (buttons,pseudo,table,replay)=>{
    for(i=0;i<9;i++){
        if(table[i]===pseudo){
            buttons[i].classList.remove("you");
            buttons[i].classList.add("me");
        } else if(table[i]===' '){
            buttons[i].classList.remove("me");
            buttons[i].classList.remove("you");
        } else{
            buttons[i].classList.remove("me");
            buttons[i].classList.add("you");
        }
    }
    if(replay){
        document.querySelector(".replay").classList.add("d-none");
    }
}