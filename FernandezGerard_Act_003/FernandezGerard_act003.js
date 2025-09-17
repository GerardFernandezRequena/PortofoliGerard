let matriu_act03 = [];
let lastModified = null;

function afegeixElementAMatriu() {
    const inputElement = document.getElementById('elementAAfegir');
    const value = inputElement.value.trim();

    if (value === "") {
        mostraAlerta("Has d'introduir un valor (lletres, números, etc.)", "warning");
        return;
    }

    matriu_act03.push(value);
    actualitzaLastModified();

    mostraAlerta(`S'ha afegit correctament l'element "${value}"`, "success");
    inputElement.value = "";
    inputElement.focus();

    // Actualizar la cuenta de elementos
    actualitzaComptadorElements();
}

function mostraElementsMatriu() {
    const resultatDiv = document.getElementById('resultat');

    if (matriu_act03.length === 0) {
        resultatDiv.innerHTML = '<p class="placeholder">La matriu està buida</p>';
        return;
    }

    let html = '';
    matriu_act03.forEach((element, index) => {
        html += `<span class="matrix-element fade-in" style="animation-delay: ${index * 0.1}s">${element}</span>`;
    });

    resultatDiv.innerHTML = html;
}

function netejaMatriu() {
    if (matriu_act03.length === 0) {
        mostraAlerta("La matriu ja està buida", "info");
        return;
    }

    const confirmacio = confirm("Estàs segur que vols esborrar tots els elements de la matriu?");

    if (confirmacio) {
        matriu_act03 = [];
        lastModified = null;
        actualitzaComptadorElements();
        document.getElementById('resultat').innerHTML = '<p class="placeholder">La matriu està buida</p>';
        document.getElementById('lastModified').textContent = '-';
        mostraAlerta("S'ha esborrat la matriu correctament", "success");
    } else {
        mostraAlerta("No s'ha esborrat la matriu", "info");
    }
}

function mostraAlerta(missatge, tipus = 'info') {
    // Eliminar alertas anteriores si existen
    const alertesAnteriors = document.querySelectorAll('.custom-alert');
    alertesAnteriors.forEach(alerta => alerta.remove());

    // Crear nueva alerta
    const alertaDiv = document.createElement('div');
    alertaDiv.className = `custom-alert ${tipus}`;
    alertaDiv.textContent = missatge;

    // Estilos para la alerta
    Object.assign(alertaDiv.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        animation: 'fadeIn 0.5s ease forwards'
    });

    // Colores según tipo
    const colors = {
        success: '#2ecc71',
        warning: '#f39c12',
        error: '#e74c3c',
        info: '#3498db'
    };

    alertaDiv.style.backgroundColor = colors[tipus] || colors.info;

    // Añadir al documento
    document.body.appendChild(alertaDiv);

    // Eliminar después de 3 segundos
    setTimeout(() => {
        if (alertaDiv.parentNode) {
            alertaDiv.style.animation = 'fadeOut 0.5s ease forwards';
            setTimeout(() => alertaDiv.remove(), 500);
        }
    }, 3000);
}

function actualitzaComptadorElements() {
    document.getElementById('elementCount').textContent = matriu_act03.length;
}

function actualitzaLastModified() {
    lastModified = new Date();
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };
    document.getElementById('lastModified').textContent = lastModified.toLocaleString('ca-ES', options);
}

// Funcionalidad adicional: permitir añadir elementos con la tecla Enter
document.addEventListener('DOMContentLoaded', function () {
    const inputElement = document.getElementById('elementAAfegir');

    inputElement.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            afegeixElementAMatriu();
        }
    });

    // Inicializar el contador de elementos
    actualitzaComptadorElements();
});

// Añadir animación de fadeOut para las alertas
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
    }
`;
document.head.appendChild(style);