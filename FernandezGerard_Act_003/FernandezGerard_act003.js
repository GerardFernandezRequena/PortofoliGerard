let matriu_act03 = [];

function afegeixElementAMatriu() {
    if (document.getElementById('elementAAfegir').value == "") {
        alert("Has de posar un Camp (Lletres,Numeros,etc....)");
    } else {
        let añadir = document.getElementById('elementAAfegir').value;
        matriu_act03.push(añadir);
        alert(" S'ha afegit Correctament L'element " + añadir);
        document.getElementById('elementAAfegir').value = "";
    }
};

function mostraElementsMatriu() {
    if (matriu_act03 == "") {
        alert("No hi ha Res en la Matriu!!!")
    } else {
        document.getElementById('resultat').innerHTML = matriu_act03;
    }
};

function netejaMatriu() {
    if (matriu_act03 == "") {
        alert("No hi ha Res en la Matriu!!!")
    } else {
        let resultado = window.confirm("Vols esborrar l'Informació de la Matriu?");
        if (resultado == true) {
            matriu_act03.splice(0);
            alert("S'ha Esborrat Correctament.");
            location.reload();
        } else {
            alert("Okey! No vols Eliminar la Matriu.");
        }
    }
};

