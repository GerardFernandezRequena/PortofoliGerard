'use strict';
const timer = document.getElementById('stopwatch');
let sec = 0;
let min = 0;
let actualSeconds = 0;
let actualMinutes = 0;
let stoptime = true;
let jaHaGuanyat = false;

let matriu = [
  [1, 2, 3],
  [4, 0, 6],
  [7, 5, 8]
];
// let filaBuida = 1;
// let coluBuida = 1;
let mida = 3;

window.onload = ompleMatriuHTML();

function mostraMatriu() {
  for (let i = 0; i < mida; i++) {
    console.log('|' + matriu[i][0] + '|' + matriu[i][1] + '|' + matriu[i][2] + '|');

  }
}
/*
var x = document.getElementById("myBtn");
x.addEventListener("mouseover", fMouseOver);
x.addEventListener("click", fClick);
x.addEventListener("mouseout", fMouseOut);
 */

function ompleMatriuHTML() {
  let cellaAOmplir;
  for (let i = 0; i < mida; i++) {
    for (let j = 0; j < mida; j++) {
      if (matriu[i][j]==0){
        cellaAOmplir = document.getElementById("c" + i + j);
        cellaAOmplir.src = 'img/' + matriu[i][j] + '.png';
        cellaAOmplir.addEventListener("click", function () { canvia(this); startTimer(); ganar(); });
      } else {
        cellaAOmplir = document.getElementById("c" + i + j);
        cellaAOmplir.src = 'img/' + matriu[i][j] + '.png';
        cellaAOmplir.addEventListener("click", function () { canvia(this); startTimer(); ganar(); });
      }
    }
  }
}

function obteCoorCelBuida() {
  for (let i = 0; i < mida; i++) {
    for (let j = 0; j < mida; j++) {
      if (matriu[i][j] == 0) {
        return ("c" + i + "f" + j);
      };
    }
  }
}

function esCorrecte() {
  let comptador = 1;
  for (let i = 0; i < mida; i++) {
    for (let j = 0; j < mida; j++) {
      if (matriu[i][j] != comptador) {
        return false;
      };
      comptador++;
    }
  }
  return true;
}

function canvia(objecte) {
  if (jaHaGuanyat){
    alert("Bro, ya has ganado, si quieres volver a jugar reinicia la pagina web");
  } else {
    let filaACanviar = objecte.id.substr(1, 1);
    let coluACanviar = objecte.id.substr(2, 1);

    let coorCellaBuida = obteCoorCelBuida();

    let filaBuida = coorCellaBuida.substr(1, 1);
    let coluBuida = coorCellaBuida.substr(3, 1);

    if (adjacents(filaACanviar, coluACanviar, filaBuida, coluBuida)){

      matriu[filaBuida][coluBuida]=matriu[filaACanviar][coluACanviar];
      matriu[filaACanviar][coluACanviar]=0;

      let cellaCanviar;
      for (let i = 0; i < mida; i++) {
        for (let j = 0; j < mida; j++) {
            cellaCanviar = document.getElementById("c" + i + j);
            cellaCanviar.src = 'img/' + matriu[i][j] + '.png';  
        }
      }
    }
  }
}

function adjacents(fila1, colu1, fila2, colu2) {
  let hoSon = false;
  if ((fila1 == fila2) && (Math.abs(colu1 - colu2) == 1)) {
    hoSon = true;
  }
  if ((colu1 == colu2) && (Math.abs(fila1 - fila2) == 1)) {
    hoSon = true;
  }

  return hoSon;
};

function startTimer() {
  if (!jaHaGuanyat) {
    if (stoptime) {
      stoptime = false;
      timerCycle();
    }
  }
}
function stopTimer() {
  if (!stoptime) {
    stoptime = true;
    jaHaGuanyat = true;
  }
}
function timerCycle() {
  if (stoptime == false) {
    sec = parseInt(sec);
    min = parseInt(min);
    sec = sec + 1;
    actualMinutes = min;
    actualSeconds = sec;

    if (sec == 60){
      min = min + 1;
      sec = 0;
    }

    if (sec < 10 || sec == 0) {
      sec = '0' + sec;
    }
    if (min < 10 || min == 0){
      min = '0' + min;
    }

    timer.innerHTML = min+':'+sec;

    setTimeout("timerCycle()", 1000);
  }
}

function ganar() {
  if (!jaHaGuanyat) {
    if (matriu[0][0]==1 && matriu[0][1]==2 && matriu[0][2]==3 && matriu[1][0]==4 && matriu[1][1]==5 && 
      matriu[1][2]==6 && matriu[2][0]==7 && matriu[2][1]==8 && matriu[2][2]==0) {
      if (min>0){
        alert("Has Ganado con el tiempo de " + actualMinutes + " minutos y " +actualSeconds+ " segundos");
        stopTimer(); 
      } else {
        alert("Has Ganado con el tiempo de " + actualSeconds + " segundos");
        stopTimer();
      }
    }
  }
}