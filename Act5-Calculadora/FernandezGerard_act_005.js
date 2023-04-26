let cientificaDisplay = document.getElementById('cientifica');
let nomBotoCientific = document.getElementById('cambiar');

/*Mostra el Modó científic i viceversa i fa funcionar l'animació*/

let esCientifica = false;
let nombreActual = 0;
let resultat = 0;

function appearCientifica() {
    if (!esCientifica) {
        nomBotoCientific.innerHTML = 'Basic';
        cientificaDisplay.className = 'cientific';
        esCientifica = true;
    } else {
        nomBotoCientific.innerHTML = 'Cientifica';
        cientificaDisplay.className = 'basic';
        esCientifica = false;
    }
}


let input = document.getElementById('input');

let calcul = new Array();
// let compt = 0;

function borrar() {
    input.value = '';
}


function introNumero(objecte) {
    if (objecte.innerHTML == "π") {
        input.value += Math.PI;
    } else if (objecte.innerHTML == "e") {
        input.value += Math.E;
    } else {
        input.value += objecte.innerHTML;
    }
}

function operacio(objecte) {
    calcul.push(parseFloat(input.value));
    if (objecte.innerHTML == "=") {
        for (let i = 0; i < calcul.length; i++) {
            if (i % 2 == 0) { //--------------------------nombres
                nombreActual = calcul[i];
            } else { //-----------------------------------operacions
                if (calcul[i] == "+") {
                    resultat = nombreActual + calcul[i + 1]; // Suma 
                } else if (calcul[i] == "-") {
                    resultat = nombreActual - calcul[i + 1]; // Resta
                } else if (calcul[i] == "*") {
                    resultat = nombreActual * calcul[i + 1]; // Multiplicació
                } else if (calcul[i] == "/") {
                    resultat = nombreActual / calcul[i + 1]; // Divisió
                } else if (calcul[i] == "Ln 10") {
                    resultat = Math.log10(nombreActual); // Ln 10
                } else if (calcul[i] == "Sinus") {
                    resultat = Math.sin(nombreActual); // Sinus
                } else if (calcul[i] == "Cosinus") {
                    resultat = Math.cos(nombreActual); // Cosinus
                } else if (calcul[i] == "Tangent") {
                    resultat = Math.tan(nombreActual); // Tangent
                } else if (calcul[i] == "ASinus") {
                    if (nombreActual > 1 || nombreActual < -1) {
                        resultat = "Te que ser entre 1 i -1 (NaN)";
                    } else {
                        resultat = Math.asin(nombreActual); // Asinus
                    }
                } else if (calcul[i] == "Secant") {
                    resultat = 1 / Math.cos(nombreActual); // Secant
                } else if (calcul[i] == "Cotangent") {
                    resultat = 1 / Math.tan(nombreActual); //Cotangent
                } else if (calcul[i] == "Logartime") {
                    resultat = Math.log(nombreActual); // Logartime
                } else if (calcul[i] == "xº") {
                    resultat = Math.pow(nombreActual, calcul[i + 1]); // xº
                } else if (calcul[i] == "√") {
                    resultat = Math.sqrt(nombreActual); // √
                }
            }
        }
        input.value = resultat;
        calcul.length = 0;
    } else {
        calcul.push(objecte.innerHTML);
        input.value = '';
    }
}




function mesMenys() {
    if (input.value.charAt(0) != "-" && input.value != '') {
        input.value = '-' + input.value;
    } else if (input.value.charAt(0) == "-" && input.value != '') {
        input.value = input.value.substring(1);
    }
}

function arrodonirDalt() {
    input.value = Math.ceil(input.value);
}

function arrodonirBaix() {
    input.value = Math.floor(input.value);
}

function arrodonirMitg() {
    input.value = Math.round(input.value);
}