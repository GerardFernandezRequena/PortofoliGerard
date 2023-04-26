window.onload = actualitzaHora;
myFunction();

function actualitzaHora() {
    let data = new Date();
    let hora = data.getHours();
    let minuto = data.getMinutes();
    let segundo = data.getSeconds();
    if (hora < 10) {
        hora = "0" + hora;
    }
    if (minuto < 10) {
        minuto = "0" + minuto;
    }
    if (segundo < 10) {
        segundo = "0" + segundo;
    }
    horaImprimible = hora + " : " + minuto + " : " + segundo

    document.getElementById("rellotge").innerHTML = horaImprimible

    setTimeout(reloj(), 1000)
}

let x = new Boolean(false);
function amagaMostraInfo() {
    x = Boolean(true);
    let data = new Date();
    let hora = data.getHours();
    if (x == true) {
        if (hora >= 7 && hora < 14) {
            document.getElementById("missatge").innerHTML = "Bon Dia!";
        } else if (hora >= 14 && hora <= 18) {
            document.getElementById("missatge").innerHTML = "Bona Tarda!";
        } else if (hora >= 18 && hora <= 20) {
            document.getElementById("missatge").innerHTML = "Bon Vespre!";
        } else {
            document.getElementById("missatge").innerHTML = "Bona Nit!";
        }
    }
}

function myFunction() {
    let element = document.getElementById("missatge");
    element.classList.add("mystyle");
}