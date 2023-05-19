function order_results(rezultati){
    for (let i = 0; i< rezultati.length; i++)
        for (let j = 0; j<rezultati.length - i - 1; j++){
            num1 = rezultati[j].split(": ");
            num2 = rezultati[j+1].split(": ");
            if (parseInt(num1[1]) < parseInt(num2[1])){
                let temp = rezultati[j];
                rezultati[j] = rezultati[j+1];
                rezultati[j+1] = temp;
            }
        }
    let result = [];
    for (let i = 0; i<5; i++)
    result.push(rezultati[i]);
    return result;

}
function pregled(){
    let textRez = localStorage.getItem("rezultati");
    if (textRez==null) 
        $("#pregled").append("Trenutno nema igrača na rang listi.");
    else{
        let rezultati = textRez.split(",");
        /*ovde zadrzati samo top 5 rezultata*/
        if(rezultati.length>5){
            rezultati = order_results(rezultati);
        }
        for(let i = 0; i<rezultati.length; i++){
            $("#pregled").append(rezultati[i] + "<br>");
        }
    }
    let trenutniRez = localStorage.getItem("trenutni");
    if (trenutniRez==null) 
        $("#trenutni").append("Niste odigrali igru");
    else{
        $("#trenutni").append(trenutniRez);
        localStorage.removeItem("trenutni");        
    }
}

$(document).ready(function(){

$("#init").on("click", game_init);

function game_init(){
    let velicina; let tezina; let visina;
    if ($("#malo").is(":checked") == true)
        velicina=8, visina = 60;
    else if ($("#srednje").is(":checked") == true)
        velicina=10, visina = 45;
    else if ($("#veliko").is(":checked") == true)   
        velicina=15, visina = 30;
    else{
        alert("Niste odabrali veličinu!")
        return;
    }

    if ($("#lako").is(":checked") == true)
        tezina=1;
    else if ($("#normalno").is(":checked") == true)
        tezina=2;
    else if ($("#teško").is(":checked") == true)   
        tezina=3;
    else{
        alert("Niste odabrali težinu!")
        return;
    }   
    localStorage.setItem("velicina", velicina);
    localStorage.setItem("tezina", tezina);
    localStorage.setItem("visina", visina);
    window.location.href = "./zmijica-igra.html";
}
})

var zmijica = []; var velicina = 8; var tezina = 1; 
var score = 0; var visina = 60; var min; var max=0;

function game_setup(){    
    $("#current_score").append(score);
    max = localStorage.getItem("max");
    if(max != null) 
        $("#high_score").append(max);
    else
        $("#high_score").append(0);

    setup_first();

    let hrana = Math.floor(Math.random()*velicina*velicina);
    $("#"+hrana).css("background-color", "red");
    let zmija_start = hrana;
    while(zmija_start==hrana){
        zmija_start = Math.floor(Math.random()*velicina*velicina);
    }
    $("#"+zmija_start).css("background-color", "blue");
    if(Math.floor(zmija_start/velicina)==0)
        zmijica.push([zmija_start, 1]);
    else
        zmijica.push([zmija_start, 0]);
    alert("Pritisnite space da započnete igru!");
    play();
}
function setup_first(){
    zmijica = [];
    score = 0;
    velicina = localStorage.getItem("velicina");     
    visina = localStorage.getItem("visina");
    $("#game").css("visibility", "visible");
    first=false;
    for(let i = 0; i < velicina; i++){
        let red = $("<tr></tr>");
        red.addClass("row").addClass("text-light");
        for(let j = 0; j < velicina; j++){
            if(i%2==0 && j%2 ==0 || i%2==1 && j%2==1){
                let kolona = $("<td></td>").attr("id", i*velicina+j)
                                            .addClass("cell-light").addClass("col")
                                            .css({
                                                "height": visina,
                                                "width": visina,
                                                "background-color":"#595959"
                                            })
                                            .show();
                red.append(kolona);
            }
            else{
                let kolona = $("<td></td>").attr("id", i*velicina+j)
                                            .addClass("cell-dark").addClass("col")
                                            .css({
                                                "height": visina,
                                                "width": visina,
                                                "background-color":"#303030"
                                            })
                                            .show();
                red.append(kolona);
            }
        }
        $("#igra").append(red);
    }
}

var in_progress = false;
function play(){
    tezina = localStorage.getItem("tezina");
    let vreme;
    if (tezina == 1) vreme = 500;
    else if(tezina == 2) vreme = 300;
    else if(tezina == 3) vreme = 150;
    else vreme = 500;
    //smerovi kretanja
        //0: up
        //1: down
        //2: left
        //3: right
    $(document).keydown(function(event){
        let key = event.which;
        if(key==32 && !in_progress){
            in_progress = true;
            start(vreme);
        }
        else if(key==38){//up
            zmijica[0][1] = 0;
        }
        else if(key==40){//down
            zmijica[0][1] = 1;
        }
        else if(key==37){//left
            zmijica[0][1] = 2;
        }
        else if(key==39){//right
            zmijica[0][1] = 3;
        }
    });
}

//stoperica
let pomeranje_timer;
function start(vreme){
    pomeranje_timer = setInterval(move, vreme);
    start_superfood();
} 
let superfood_timer;
function start_superfood(){
    superfood_timer = setInterval(generate_superfood, 15000);
} 
function stop_superfood(){
    clearInterval(superfood_timer);
}
function generate_superfood(){
    let superfood = zmijica[0][0];
    while($("#" + superfood).css("background-color")=='rgb(0, 0, 255)'
    || $("#" + superfood).css("background-color")=='rgb(255, 0, 0)'){
        superfood = Math.floor(Math.random()*velicina*velicina);
    }
    let color = $("#"+superfood).css("background-color")
    $("#"+superfood).css("background-color", "#FFD700")
    setTimeout(function(){
        $("#"+superfood).css("background-color", color);
    }, 5000);
}

function stop(){
    alert("Kraj igre! Vaš rezultat je: " + score);
    clearInterval(pomeranje_timer);
    stop_superfood();
    
    let korisnik = null;
    while(korisnik == null){
        korisnik = prompt("Unesite svoje ime: ");
        if(korisnik==null){
            let leave = confirm("Ako ne unesete ime nećete biti na rang listi!");
            if (leave) {
                window.location.href="./zmijica-igra.html";
                return;
            }
            else continue;
        }
    }
    if(score > localStorage.getItem("max")){
        localStorage.setItem("max", score);
        $("#high_score").innerText=score;
    }
    let textRez = localStorage.getItem("rezultati");
    let rezultati = textRez==null? [] :textRez.split(",");
    let trenutni = korisnik + ": " + score;
    rezultati.push(trenutni);

    localStorage.setItem("trenutni", trenutni);
    localStorage.setItem("rezultati", rezultati);

    prelaz = prompt("Da li želite da vidite rang listu? (da/ne)");
    if(prelaz=="da")
        window.location.href="./zmijica-rezultati.html";
    else
        window.location.href="./zmijica-igra.html";
}

//ovde implementiram pomeranje
function move(){
    //prvo pomeram svaki clanak za jedno mesto
    let duzina = zmijica.length;
    velicina = parseInt(velicina);
    let eaten = false; let position; let direction; let last_pos;
    last_pos=zmijica[zmijica.length-1][0];
    for(let i = 0; i<duzina; i++){
        position = parseInt(zmijica[i][0]);
        direction = parseInt(zmijica[i][1]);
        if(direction==0){//up
            if(i==0){
                if(position-velicina>=0){
                    if($("#" + (position-velicina)).css("background-color")=='rgb(0, 0, 255)') {
                        stop();
                    }
                    else if ($("#" + (position-velicina)).css("background-color") == 'rgb(255, 0, 0)'){
                        $("#" + (position-velicina)).css("background-color", "blue");
                        eaten=true;
                        score++;
                        $("#current_score").html("");
                        $("#current_score").append(score);
                        let hrana = position-velicina;
                        while($("#" + hrana).css("background-color")=='rgb(0, 0, 255)'){
                            hrana = Math.floor(Math.random()*velicina*velicina);
                        }
                        $("#"+hrana).css("background-color", "red");
                    }
                    else if ($("#" + (position-velicina)).css("background-color") == 'rgb(255, 215, 0)'){
                        $("#" + (position-velicina)).css("background-color", "blue");
                        score+=5;
                        eaten=true;
                        $("#current_score").html("");
                        $("#current_score").append(score)
                    }
                    
                    if(i==duzina-1){
                        let x = Math.floor(position/velicina);
                        let y = position%velicina;
                        if(x%2==0 && y%2 ==0 || x%2==1 && y%2==1)
                            $("#"+position).css("background-color", "#595959");
                        else
                            $("#"+position).css("background-color", "#303030");
                    }
                    position -= velicina;
                    $("#"+position).css("background-color", "blue");
                }
                else stop();
            }
            else if(i==duzina-1){
                let x = Math.floor(position/velicina);
                let y = position%velicina;
                if(x%2==0 && y%2 ==0 || x%2==1 && y%2==1)
                    $("#"+position).css("background-color", "#595959");
                else
                    $("#"+position).css("background-color", "#303030");
                    position -= velicina;
            }
            else position -= velicina;
            zmijica[i][0] = position;
        }
        else if(direction==1){//down
            if(i==0){
                if(position+velicina < velicina*velicina){
                    if($("#" + (position+velicina)).css("background-color")=='rgb(0, 0, 255)') {
                        stop();
                    }
                    else if ($("#" + (position+velicina)).css("background-color") == 'rgb(255, 0, 0)'){
                        $("#" + (position+velicina)).css("background-color", "blue");
                        eaten=true;
                        score++;
                        $("#current_score").html("");
                        $("#current_score").append(score);
                        let hrana = position+velicina;
                        while($("#" + hrana).css("background-color")=='rgb(0, 0, 255)'){
                            hrana = Math.floor(Math.random()*velicina*velicina);
                        }
                        $("#"+hrana).css("background-color", "red");
                    }
                    else if ($("#" + (position+velicina)).css("background-color") == 'rgb(255, 215, 0)'){
                        $("#" + (position+velicina)).css("background-color", "blue");
                        score+=5;
                        eaten=true;
                        $("#current_score").html("");
                        $("#current_score").append(score)
                    }
                    
                    if(i==duzina-1){
                        let x = Math.floor(position/velicina);
                        let y = position%velicina;
                        if(x%2==0 && y%2 ==0 || x%2==1 && y%2==1)
                            $("#"+position).css("background-color", "#595959");
                        else
                            $("#"+position).css("background-color", "#303030");
                    }
                    position += velicina;
                    $("#"+position).css("background-color", "blue");
                }
                else stop();
            }
            else if(i==duzina-1){
                let x = Math.floor(position/velicina);
                let y = position%velicina;
                if(x%2==0 && y%2 ==0 || x%2==1 && y%2==1)
                    $("#"+position).css("background-color", "#595959");
                else
                    $("#"+position).css("background-color", "#303030");
                position += velicina;
            }
            else position += velicina;
            zmijica[i][0] = position;
        }
        else if(direction==2){//left
            if(i==0){
                if(position%velicina>0){
                    if($("#" + (position-1)).css("background-color")=='rgb(0, 0, 255)') {
                        stop();
                    }
                    else if ($("#" + (position-1)).css("background-color") == 'rgb(255, 0, 0)'){
                        $("#" + (position-1)).css("background-color", "blue");
                        eaten=true;
                        score++;
                        $("#current_score").html("");
                        $("#current_score").append(score);
                        let hrana = position-1;
                        while($("#" + hrana).css("background-color")=='rgb(0, 0, 255)'){
                            hrana = Math.floor(Math.random()*velicina*velicina);
                        }
                        $("#"+hrana).css("background-color", "red");
                    }
                    else if ($("#" + (position-1)).css("background-color") == 'rgb(255, 215, 0)'){
                        $("#" + (position-1)).css("background-color", "blue");
                        score+=5;
                        eaten=true;
                        $("#current_score").html("");
                        $("#current_score").append(score)
                    }
                    
                    if(i==duzina-1){
                        let x = Math.floor(position/velicina);
                        let y = position%velicina;
                        if(x%2==0 && y%2 ==0 || x%2==1 && y%2==1)
                            $("#"+position).css("background-color", "#595959");
                        else
                            $("#"+position).css("background-color", "#303030");
                    }                   
                    position -= 1;
                    $("#"+position).css("background-color", "blue");
                }
                else stop();
            }
            else if(i==duzina-1){
                let x = Math.floor(position/velicina);
                let y = position%velicina;
                if(x%2==0 && y%2 ==0 || x%2==1 && y%2==1)
                    $("#"+position).css("background-color", "#595959");
                else
                    $("#"+position).css("background-color", "#303030");
                position -= 1;
            }
            else position -= 1;
            zmijica[i][0] = position;
        }
        else if(direction==3){//right
            if(i==0){
                if(position%velicina!=velicina-1){
                    if($("#" + (position+1)).css("background-color")=='rgb(0, 0, 255)') {
                        stop();
                    }
                    else if ($("#" + (position+1)).css("background-color") == 'rgb(255, 0, 0)'){
                        $("#" + (position+1)).css("background-color", "blue");
                        eaten=true;
                        score++;
                        $("#current_score").html("");
                        $("#current_score").append(score);
                        let hrana = position+1;
                        while($("#" + hrana).css("background-color")=='rgb(0, 0, 255)'){
                            hrana = Math.floor(Math.random()*velicina*velicina);
                        }
                        $("#"+hrana).css("background-color", "red");
                    }
                    else if ($("#" + (position+1)).css("background-color") == 'rgb(255, 215, 0)'){
                        $("#" + (position+1)).css("background-color", "blue");
                        score+=5;
                        eaten=true;
                        $("#current_score").html("");
                        $("#current_score").append(score)
                    }
                    
                    if(i==duzina-1){
                        let x = Math.floor(position/velicina);
                        let y = position%velicina;
                        if(x%2==0 && y%2 ==0 || x%2==1 && y%2==1)
                            $("#"+position).css("background-color", "#595959");
                        else
                            $("#"+position).css("background-color", "#303030");
                    }
                    position += 1;
                    $("#"+position).css("background-color", "blue");
                }
                else stop();
            }
            else if(i==duzina-1){
                let x = Math.floor(position/velicina);
                let y = position%velicina;
                if(x%2==0 && y%2 ==0 || x%2==1 && y%2==1)
                    $("#"+position).css("background-color", "#595959");
                else
                    $("#"+position).css("background-color", "#303030");
                position += 1;
            }
            else position += 1;
            zmijica[i][0] = position;
        }
    }
    //povecavam ako sam ulovio
    if(eaten){
        eaten = false;
        zmijica.push([last_pos, direction]); 
    }   
     //onda shiftujem direction
    for(let i = duzina-1; i>0; i--){
        zmijica[i][1] = zmijica[i-1][1];
    }
    //ako se igra zavrsava zovem stop!
}
