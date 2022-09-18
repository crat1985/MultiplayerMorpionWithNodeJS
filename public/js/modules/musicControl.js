const controlMusic = (music)=>{
    const checkbox = document.querySelector('input[type="checkbox"]');
    checkbox.addEventListener("click",(e)=>{
        if(!checkbox.checked){
            music.pause();
            music.currentTime = 0;
        }else{
            music.play();
        }
    })
}