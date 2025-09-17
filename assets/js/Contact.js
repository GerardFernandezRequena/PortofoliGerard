// contactForm.js - Validación del formulario de contacto

// Esperar a que el documento esté listo
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar el formulario
    initContactForm();
    initCharacterCounter();
});

/**
 * Inicializa la validación del formulario de contacto
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);

        // Añadir event listeners para quitar los mensajes de error al escribir
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function () {
                if (this.classList.contains('is-invalid')) {
                    this.classList.remove('is-invalid');
                    const feedback = this.nextElementSibling;
                    if (feedback && feedback.classList.contains('invalid-feedback')) {
                        feedback.remove();
                    }
                }
            });
        });
    }
}

/**
 * Maneja el envío del formulario
 * @param {Event} e - Evento de envío del formulario
 */
function handleFormSubmit(e) {
    e.preventDefault();

    // Validar el formulario
    const isValid = validateForm();

    if (isValid) {
        // Simular envío (aquí iría la lógica real de envío)
        simulateFormSubmission();
    }
}

/**
 * Valida todos los campos del formulario
 * @returns {boolean} - True si el formulario es válido, false en caso contrario
 */
function validateForm() {
    let isValid = true;
    const form = document.getElementById('contactForm');

    // Validar nombre
    const nameInput = form.querySelector('#name');
    if (!nameInput.value.trim()) {
        showError(nameInput, 'Si us plau, introdueix el teu nom');
        isValid = false;
    }

    // Validar email
    const emailInput = form.querySelector('#email');
    if (!emailInput.value.trim()) {
        showError(emailInput, 'Si us plau, introdueix el teu correu electrònic');
        isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
        showError(emailInput, 'Si us plau, introdueix un correu electrònic vàlid');
        isValid = false;
    }

    // Validar asunto
    const subjectInput = form.querySelector('#subject');
    if (!subjectInput.value.trim()) {
        showError(subjectInput, 'Si us plau, introdueix un assumpte');
        isValid = false;
    }

    // Validar mensaje
    const messageInput = form.querySelector('#message');
    if (!messageInput.value.trim()) {
        showError(messageInput, 'Si us plau, escriu el teu missatge');
        isValid = false;
    } else if (messageInput.value.length > 500) {
        showError(messageInput, 'El missatge no pot superar els 500 caràcters');
        isValid = false;
    }

    return isValid;
}

/**
 * Muestra un error en un campo del formulario
 * @param {HTMLElement} input - Elemento input que contiene el error
 * @param {string} message - Mensaje de error a mostrar
 */
function showError(input, message) {
    // Añadir clase de error al input
    input.classList.add('is-invalid');

    // Buscar o crear el elemento de feedback
    let feedbackElement = input.nextElementSibling;

    if (!feedbackElement || !feedbackElement.classList.contains('invalid-feedback')) {
        feedbackElement = document.createElement('div');
        feedbackElement.className = 'invalid-feedback';
        input.parentNode.appendChild(feedbackElement);
    }

    // Establecer el mensaje de error
    feedbackElement.textContent = message;
}

/**
 * Valida si una cadena es un email válido
 * @param {string} email - Email a validar
 * @returns {boolean} - True si el email es válido, false en caso contrario
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Simula el envío del formulario
 */
function simulateFormSubmission() {
    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;

    // Cambiar el texto del botón y deshabilitarlo
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviant...';
    submitButton.disabled = true;

    // Simular retraso de red
    setTimeout(() => {
        // Mostrar mensaje de éxito
        alert('Gràcies pel teu missatge! Et respondré aviat.');

        // Restaurar el botón
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;

        // Resetear el formulario
        form.reset();

        // Resetear el contador de caracteres
        const counter = document.querySelector('.form-text');
        if (counter) {
            counter.textContent = '0/500';
            counter.classList.remove('text-danger');
        }
    }, 1500);
}

/**
 * Función para contar caracteres del mensaje
 */
function initCharacterCounter() {
    const messageInput = document.getElementById('message');
    if (messageInput) {
        // Crear contador de caracteres
        const counter = document.createElement('small');
        counter.className = 'form-text text-muted text-end';
        counter.textContent = '0/500';

        messageInput.parentNode.appendChild(counter);

        // Actualizar contador al escribir
        messageInput.addEventListener('input', function () {
            const length = this.value.length;
            counter.textContent = `${length}/500`;

            if (length > 500) {
                counter.classList.add('text-danger');
            } else {
                counter.classList.remove('text-danger');
            }
        });
    }
}