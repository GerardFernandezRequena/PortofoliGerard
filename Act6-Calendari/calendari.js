createTable();

function update_cal(n) {
    var offset = $("#id_month_offset");
    offset.val(parseInt(offset.val()) + n);
    $('#calendar').calendarWidget({});
}

function createTable(pos = 0, anyo = 0) {


    //-------------------- Arrays amb els Mesos i Anys --------------------

    let calendari = document.getElementById("calendari");
    let nom_mesos = Array("Gener", "Febrer", "Març", "Abril", "Maig",
        "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre",
        "Desembre");
    let data_actual = new Date();
    let caption = calendari.createCaption();
    caption.setAttribute("class", "calendari2");
    let Mes = nom_mesos[data_actual.getMonth() + pos + parseInt($("#id_month_offset").val())] + " " + (data_actual.getFullYear() + anyo);
    caption.innerHTML = Mes.toUpperCase();


    //--------------------Array amb Nom dels dies--------------------
    let nomDiesSetmana = Array("dilluns", "dimarts", "dimecres",
        "dijous", "divendres", "dissabte", "diumenge");

    let thead = calendari.createTHead();
    thead.setAttribute("class", "calendari2");
    for (let files = 0; files < 1; files++) {

        let fila = document.createElement("tr");

        for (let columnes = 0; columnes < 7; columnes++) {

            let casella = document.createElement("td");
            casella
            let casellaText = document.createTextNode(nomDiesSetmana[columnes]);
            casella.appendChild(casellaText);
            fila.appendChild(casella);

        }
        thead.appendChild(fila);
    }

    let tbody = calendari.createTBody();
    tbody.setAttribute("class", "calendari2");

    let month = data_actual.getMonth() + pos + 1;
    let year = data_actual.getFullYear();
    let daysInMonth = new Date(year, month, 0).getDate();
    let comptDies = 0;



    let d = new Date();
    let diaDelMes = d.getDate();
    let dia = new Date(d.getFullYear(), d.getMonth() + pos, 1);

    if (month == 5) {
        var primerDiaMes = 7;
    } else {
        var primerDiaMes = dia.getDay() + anyo;
        if (primerDiaMes == 0) {
            primerDiaMes = 7;
        }
    }
    let començaMes = false;

    comptBlanc = 0;

    //--------------------Array amb els dies--------------------

    for (let i = 0; i < 6; i++) {


        let fila = document.createElement("tr");

        for (let j = 0; j < 7; j++) {

            if (comptDies < primerDiaMes - 1 && començaMes == false) {

                comptDies++;
                comptBlanc++;
                let casella = document.createElement("td");
                let br = document.createElement("br");
                casella.classList.add("white");
                let casellaText = document.createTextNode("-");
                casella.appendChild(casellaText);
                casella.appendChild(br);
                fila.appendChild(casella);

            } else if (comptDies + primerDiaMes && comptDies >= primerDiaMes - 1 || començaMes == true) {

                if (començaMes == false) {
                    començaMes = true;
                    comptDies = 0;
                }
                if (comptDies < daysInMonth) {
                    comptDies++;
                    let casella = document.createElement("td");
                    let br = document.createElement("br");
                    let casellaText = document.createTextNode(comptDies);
                    casella.appendChild(casellaText);
                    casella.appendChild(br);

                    //S'afegeix una ID que serà el número del dia de la casella + el mes i l'any
                    casella.setAttribute("id", comptDies + " " + Mes);
                    //S'afegeix un onclick que crida una funció que enviarà la ID de la casella premuda, aquesta funció crearà les notes
                    casella.setAttribute("onclick", "crearText(this.id)");
                    //Es comprova si alguna ID (clau) del localStorage existeix a dins d'aquesta, si hi ha una clau, s'escriu el missatge guardat.
                    if (localStorage.getItem(comptDies + " " + Mes) != null) {
                        casella.innerHTML += localStorage.getItem(comptDies + " " + Mes);
                        casella.classList.add("noteStyle");
                    }




                    if (j == 5 || j == 6) {
                        casella.classList.add("vermell");
                    } else {
                        casella.classList.add("blau");
                    }
                    if (comptDies == diaDelMes && pos == 0 && anyo == 0) {
                        casella.classList.add("verd");
                    }
                    fila.appendChild(casella);
                }
            }
        }
        tbody.appendChild(fila);
    }

    calendari.appendChild(tbody);
    calendari.setAttribute("border", "2");
}


//Funció que demana un text que s'escriurà sota la casella premuda (Com una nota);
function crearText(clicked_id) {
    let promptNotes = document.getElementById("promptNotes");
    let diaClicat = document.getElementById("idclick");

    //Ensenyo la finestra
    promptNotes.style.display = "flex";

    //Afegeix La data del dia en què s'afegirà el comentari
    diaClicat.innerHTML = clicked_id;

    //Afegeixo la nota (En cas que en tingui) a dins de l'input
    document.getElementById("notaAfegida").value = localStorage.getItem(clicked_id);
}


function tancarNotes() {
    //Amago la finestra
    document.getElementById("promptNotes").style.display = "none";
}

function afegirNotes() {
    //Si l'input està buit, no afegirà res
    if (document.getElementById("notaAfegida").value != "") {

        //Agafo la ID, ja que aquest cop no el rebò per onclick()
        let clicked_id = document.getElementById("idclick").innerHTML;

        //Agafo el número del dia + el comentari que he escrit i el reemplaço amb el innerhtml que té actualment: 1 -> 1 <br> "Nota"
        let dia = document.getElementById(clicked_id).innerHTML.replace(/(^\d+)(.+$)/i, '$1');
        let text = document.getElementById("notaAfegida").value;
        document.getElementById(clicked_id).innerHTML = dia + "<br>" + text;

        //Afegeixo la classe per marcar els dies que tenen notes (Afegeix un border blanc molt maco)
        document.getElementById(clicked_id).classList.add("noteStyle");

        //Es guarda al localStorage, la clau és la ID del dia premut ("1 gener 2022") i el contingut és la nota.
        localStorage.setItem(clicked_id, text);

        //Amago la finestra
        promptNotes.style.display = "none";
    } else {
        promptNotes.style.display = "none";
    }
}

function eliminarNotes() {
    //Elimino tot el td i afegeixo el dia
    let clicked_id = document.getElementById("idclick").innerHTML;
    let dia = document.getElementById(clicked_id).innerHTML.replace(/(^\d+)(.+$)/i, '$1');

    //Elimino la classe dels dies que tenen notes
    document.getElementById(clicked_id).classList.remove("noteStyle");
    document.getElementById(clicked_id).innerHTML = dia;

    //Elimino la nota del localStorage
    localStorage.removeItem(clicked_id);

    //Amago la finestra
    promptNotes.style.display = "none";
}

$(document).ready(function() {

    let pos = 0;
    let anyo = 0;

    $("#next").click(function() {

        if (pos == 11) {
            pos = -1;
            anyo++;
        }
        $(".calendari2").remove();
        pos++;
        if (pos == 11) {
            createTable(-1, anyo + 1);
        } else {
            createTable(pos, anyo);
        }
    });




    $("#prev").click(function() {
        if (pos == 0) {
            pos = 12;
            anyo--;
        }
        $(".calendari2").remove();

        pos--;
        if (pos == 11) {
            createTable(-1, anyo + 1);

        } else {
            createTable(pos, anyo);

        }
    });
});