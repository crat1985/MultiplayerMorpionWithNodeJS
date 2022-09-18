const advQuit = (turnLabel,success)=>{
        turnLabel.innerText = "Tu as gagné car ton adversaire a quitté !";
        turnLabel.style.color = "green";
        success.play();
        success.volume = 1;
}