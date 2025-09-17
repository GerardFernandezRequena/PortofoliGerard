// Variables globales
let currentInput = '';
let previousInput = '';
let operation = null;
let shouldResetScreen = false;
let isScientificMode = false;

const display = document.getElementById('display');
const modeToggle = document.getElementById('mode-toggle');
const basicCalc = document.getElementById('basic-calc');
const scientificCalc = document.getElementById('scientific-calc');

// Función para alternar entre modos
function toggleMode() {
    isScientificMode = !isScientificMode;

    if (isScientificMode) {
        modeToggle.textContent = 'Básica';
        basicCalc.classList.add('scientific-active');
        scientificCalc.classList.add('active');
    } else {
        modeToggle.textContent = 'Científica';
        basicCalc.classList.remove('scientific-active');
        scientificCalc.classList.remove('active');
    }
}

// Función para agregar números
function appendNumber(number) {
    if (shouldResetScreen) {
        resetCalculator();
    }

    // Evitar múltiples ceros a la izquierda
    if (currentInput === '0' && number === '0') return;

    // Limitar la longitud de la entrada
    if (currentInput.length >= 12) return;

    currentInput += number;
    updateDisplay();
}

// Función para agregar constantes
function appendConstant(constant) {
    if (shouldResetScreen) {
        resetCalculator();
    }

    if (constant === 'π') {
        currentInput = Math.PI.toString();
    } else if (constant === 'e') {
        currentInput = Math.E.toString();
    }

    updateDisplay();
}

// Función para agregar operación
function appendOperation(op) {
    if (currentInput === '' && previousInput === '') return;

    if (previousInput !== '' && currentInput !== '') {
        calculate();
    }

    operation = op;
    previousInput = currentInput;
    currentInput = '';
}

// Función para operaciones especiales (potencia, etc.)
function setOperation(op) {
    operation = op;
    previousInput = currentInput;
    currentInput = '';
}

// Función para calcular
function calculate() {
    if (operation === null || currentInput === '') return;

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                result = 'Error: Div/0';
            } else {
                result = prev / current;
            }
            break;
        case 'pow':
            result = Math.pow(prev, current);
            break;
        default:
            return;
    }

    // Formatear el resultado para mostrar
    currentInput = result.toString();
    operation = null;
    previousInput = '';
    shouldResetScreen = true;

    updateDisplay();
}

// Función para cálculos con una entrada (funciones)
function calculateFunction(func) {
    if (currentInput === '') return;

    const value = parseFloat(currentInput);
    let result;

    switch (func) {
        case 'sin':
            result = Math.sin(value);
            break;
        case 'cos':
            result = Math.cos(value);
            break;
        case 'tan':
            result = Math.tan(value);
            break;
        case 'asin':
            if (value < -1 || value > 1) {
                result = 'Error: Fuera de rango';
            } else {
                result = Math.asin(value);
            }
            break;
        case 'sec':
            result = 1 / Math.cos(value);
            break;
        case 'cot':
            result = 1 / Math.tan(value);
            break;
        case 'log10':
            if (value <= 0) {
                result = 'Error: Valor inválido';
            } else {
                result = Math.log10(value);
            }
            break;
        case 'ln':
            if (value <= 0) {
                result = 'Error: Valor inválido';
            } else {
                result = Math.log(value);
            }
            break;
        case 'sqrt':
            if (value < 0) {
                result = 'Error: Raíz negativa';
            } else {
                result = Math.sqrt(value);
            }
            break;
        default:
            return;
    }

    currentInput = result.toString();
    shouldResetScreen = true;
    updateDisplay();
}

// Función para redondear números
function roundNumber(method) {
    if (currentInput === '') return;

    const value = parseFloat(currentInput);
    let result;

    switch (method) {
        case 'ceil':
            result = Math.ceil(value);
            break;
        case 'floor':
            result = Math.floor(value);
            break;
        case 'round':
            result = Math.round(value);
            break;
        default:
            return;
    }

    currentInput = result.toString();
    updateDisplay();
}

// Función para agregar punto decimal
function appendDecimal() {
    if (shouldResetScreen) {
        resetCalculator();
    }

    if (currentInput.includes('.')) return;

    if (currentInput === '') {
        currentInput = '0';
    }

    currentInput += '.';
    updateDisplay();
}

// Función para cambiar signo
function toggleSign() {
    if (currentInput === '' || currentInput === '0') return;

    currentInput = (parseFloat(currentInput) * -1).toString();
    updateDisplay();
}

// Función para limpiar pantalla
function clearDisplay() {
    resetCalculator();
    updateDisplay();
}

// Función para resetear calculadora
function resetCalculator() {
    currentInput = '';
    previousInput = '';
    operation = null;
    shouldResetScreen = false;
}

// Función para actualizar display
function updateDisplay() {
    display.value = currentInput || '0';
}

// Inicializar calculadora
resetCalculator();
updateDisplay();

// Manejo de eventos de teclado
document.addEventListener('keydown', function (event) {
    if (/[0-9]/.test(event.key)) {
        appendNumber(event.key);
    } else if (event.key === '.') {
        appendDecimal();
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        appendOperation(event.key);
    } else if (event.key === 'Enter' || event.key === '=') {
        calculate();
    } else if (event.key === 'Escape') {
        clearDisplay();
    } else if (event.key === 'Backspace') {
        currentInput = currentInput.slice(0, -1);
        updateDisplay();
    }
});