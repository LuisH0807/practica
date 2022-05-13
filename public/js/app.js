document.addEventListener('click', e =>{
    if(e.target.dataset.short){
        const url = `${window.location.origin}/${e.target.dataset.short}`
        //Esto de abajo es lo mismo que arriba, solo que llamando el PATHURL de .env
        //const url = `http://localhost:5000/${e.target.dataset.short}`;
        
        navigator.clipboard
            .writeText(url)
            .then(()=>{
                console.log("Texto copiado al Portapapeles...");
            })
            .catch((err)=>{
                console.log("Algo Salio mal", err);
            });
    }
});