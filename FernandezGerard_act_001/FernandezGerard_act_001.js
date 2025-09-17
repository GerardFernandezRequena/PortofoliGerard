function leerNumeros() {
    const primerNumero = parseFloat(document.getElementById("primerNumero").value);
    const segundoNumero = parseFloat(document.getElementById("segundoNumero").value);

    if (isNaN(primerNumero) || isNaN(segundoNumero)) {
        mostrarError("Por favor, ingrese números válidos en ambos campos");
        return null;
    }

    return { primerNumero, segundoNumero };
}

function mostrarResultado(valor, operacion) {
    const operaciones = {
        'suma': '+',
        'resta': '-',
        'multiplicacion': '×',
        'division': '÷'
    };

    const simbolo = operaciones[operacion];
    const primerNumero = document.getElementById("primerNumero").value;
    const segundoNumero = document.getElementById("segundoNumero").value;

    document.getElementById("valorResultado").textContent =
        `${primerNumero} ${simbolo} ${segundoNumero} = ${valor}`;
}

function mostrarError(mensaje) {
    document.getElementById("valorResultado").textContent = "Error: " + mensaje;
    document.getElementById("valorResultado").style.color = "#e74c3c";

    // Restablecer el color después de 3 segundos
    setTimeout(() => {
        document.getElementById("valorResultado").style.color = "#2c3e50";
    }, 3000);
}

function operacion(tipo) {
    const numeros = leerNumeros();
    if (!numeros) return;

    const { primerNumero, segundoNumero } = numeros;
    let resultado;

    try {
        switch (tipo) {
            case 'suma':
                resultado = primerNumero + segundoNumero;
                break;
            case 'resta':
                resultado = primerNumero - segundoNumero;
                break;
            case 'multiplicacion':
                resultado = primerNumero * segundoNumero;
                break;
            case 'division':
                if (segundoNumero === 0) {
                    mostrarError("No se puede dividir por cero");
                    return;
                }
                resultado = primerNumero / segundoNumero;
                break;
            default:
                mostrarError("Operación no válida");
                return;
        }

        // Redondear si es necesario
        resultado = Math.round(resultado * 100) / 100;
        mostrarResultado(resultado, tipo);
    } catch (error) {
        mostrarError("Ha ocurrido un error inesperado");
        console.error(error);
    }
}