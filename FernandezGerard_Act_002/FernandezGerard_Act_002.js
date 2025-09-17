// Variables globales
let intervalId = null;
let mensajeVisible = false; // Cambiado a false para que empiece oculto

// Iniciar cuando la página cargue
window.onload = function () {
    actualitzaHora();
    iniciarRellotge();
    myFunction();

    // Ocultar el mensaje al inicio
    document.getElementById("missatge").classList.add("hidden");
};

// Función para iniciar el reloj en tiempo real
function iniciarRellotge() {
    // Limpiar intervalo previo si existe
    if (intervalId) {
        clearInterval(intervalId);
    }

    // Actualizar cada segundo
    intervalId = setInterval(actualitzaHora, 1000);
}

// Función para formatear números con dos dígitos
function formatDosDigits(num) {
    return num < 10 ? "0" + num : num;
}

// Función principal para actualizar la hora
function actualitzaHora() {
    const data = new Date();
    const hora = formatDosDigits(data.getHours());
    const minuto = formatDosDigits(data.getMinutes());
    const segundo = formatDosDigits(data.getSeconds());

    // Formato: HH : MM : SS (todos del mismo tamaño)
    const horaImprimible = `
        <span class="time-value">${hora}</span>
        <span class="separator">:</span>
        <span class="time-value">${minuto}</span>
        <span class="separator">:</span>
        <span class="time-value">${segundo}</span>
    `;

    document.getElementById("rellotge").innerHTML = horaImprimible;

    // Si el mensaje está visible, actualizar el saludo
    if (mensajeVisible) {
        actualitzaSalutacio(data);
    }
}

// Función para actualizar el mensaje de saludo
function actualitzaSalutacio(data) {
    const hora = data.getHours();
    let missatge = "";

    if (hora >= 7 && hora < 14) {
        missatge = "Bon Dia! ☀️";
    } else if (hora >= 14 && hora < 18) {
        missatge = "Bona Tarda! 🌤️";
    } else if (hora >= 18 && hora < 21) {
        missatge = "Bon Vespre! 🌙";
    } else {
        missatge = "Bona Nit! 🌙";
    }

    document.getElementById("missatge").textContent = missatge;
}

// Función para alternar la visibilidad del mensaje
function amagaMostraInfo() {
    const missatgeElement = document.getElementById("missatge");
    const boton = document.querySelector(".amaga-mostra");

    mensajeVisible = !mensajeVisible;

    if (mensajeVisible) {
        missatgeElement.classList.remove("hidden");
        const data = new Date();
        actualitzaSalutacio(data);
        boton.textContent = "Amaga Salutació";
    } else {
        missatgeElement.classList.add("hidden");
        boton.textContent = "Mostra Salutació";
    }
}

// Función para aplicar estilos al mensaje
function myFunction() {
    const element = document.getElementById("missatge");
    element.classList.add("mystyle");
}