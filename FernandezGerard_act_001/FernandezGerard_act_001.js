let primerNombre;
let segonNombre;
let resultat;
let compracion;

function llegueixNombres() {
    primerNombre = parseInt(document.getElementById("primerNombre").value);
    segonNombre = parseInt(document.getElementById("segonNombre").value);
    if (isNaN(primerNombre) || isNaN(segonNombre)) {
        alert("Tens que posar un numero!!!")
    }
}

function suma() {
    llegueixNombres();
    resultat = primerNombre + segonNombre;
    compracion = Number.isNaN(resultat);
    if (compracion == false) {
        alert("El Resultat de la suma és " + resultat);
    }
};


function resta() {
    llegueixNombres();
    resultat = primerNombre - segonNombre;
    compracion = Number.isNaN(resultat);
    if (compracion == false) {
        alert("El Resultat de la resta és " + resultat);
    }
};

function producte() {
    llegueixNombres();
    resultat = primerNombre * segonNombre;
    compracion = Number.isNaN(resultat);
    if (compracion == false) {
        alert("El Resultat de la multipliació és " + resultat);
    }
};

function divisio() {
    llegueixNombres();
    resultat = primerNombre / segonNombre;
    compracion = Number.isNaN(resultat);
    if (compracion == false) {
        alert("El Resultat de la divisió és " + resultat);
    }
};