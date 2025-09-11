$(document).ready(function () {
    // Cache de elementos jQuery para mejor performance
    const $signupSection = $('#signup');
    const $signinSection = $('#signin');
    const $showSignup = $('#showSignup');
    const $showSignin = $('#showSignin');
    const $registerForm = $('#registerForm');
    const $loginForm = $('#loginForm');
    const $registerButton = $('#registerButton');

    // Elementos de contraseña
    const $toggleLoginPassword = $('#toggleLoginPassword');
    const $toggleRegPassword = $('#toggleRegPassword');
    const $toggleRepassPassword = $('#toggleRepassPassword');
    const $passwd = $('#passwd');
    const $pass = $('#pass');
    const $repass = $('#repass');
    const $passwordStrength = $('#passwordStrength');
    const $passwordHelp = $('#passwordHelp');
    const $repassFeedback = $('#repassFeedback');

    // Elementos de validación
    const $email = $('#email');
    const $emailFeedback = $('#emailFeedback');
    const $terms = $('#terms');

    // Inicializar tooltips de Bootstrap
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Función para cambiar entre formularios
    function switchForm(showForm, hideForm) {
        hideForm.addClass('d-none');
        showForm.removeClass('d-none');

        // Enfocar el primer campo input del formulario mostrado
        const $firstInput = showForm.find('input:visible:first');
        if ($firstInput.length) {
            setTimeout(() => {
                $firstInput.focus();
            }, 100);
        }

        // Scroll suave al formulario
        $('html, body').animate({
            scrollTop: showForm.offset().top - 100
        }, 500);
    }

    // Event handlers para cambiar entre formularios
    $showSignup.on('click', function (e) {
        e.preventDefault();
        switchForm($signupSection, $signinSection);
    });

    $showSignin.on('click', function (e) {
        e.preventDefault();
        switchForm($signinSection, $signupSection);
    });

    // Funcionalidad para mostrar/ocultar contraseña
    function setupPasswordToggle(toggleElement, passwordField) {
        toggleElement.on('click', function () {
            const type = passwordField.attr('type') === 'password' ? 'text' : 'password';
            passwordField.attr('type', type);

            // Cambiar icono
            const icon = toggleElement.find('i');
            if (type === 'password') {
                icon.removeClass('bi-eye-slash').addClass('bi-eye');
            } else {
                icon.removeClass('bi-eye').addClass('bi-eye-slash');
            }
        });
    }

    // Configurar toggles de contraseña
    setupPasswordToggle($toggleLoginPassword, $passwd);
    setupPasswordToggle($toggleRegPassword, $pass);
    setupPasswordToggle($toggleRepassPassword, $repass);

    // Validar fortaleza de contraseña
    function checkPasswordStrength(password) {
        // Al menos 8 caracteres, una mayúscula, una minúscula y un número
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        const mediumRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;

        if (strongRegex.test(password)) {
            return 'strong';
        } else if (mediumRegex.test(password)) {
            return 'medium';
        } else {
            return 'weak';
        }
    }

    // Visualizar fortaleza de contraseña
    $pass.on('input', function () {
        const password = $(this).val();
        const strength = checkPasswordStrength(password);

        $passwordStrength.removeClass('password-weak password-medium password-strong');

        if (password.length > 0) {
            switch (strength) {
                case 'strong':
                    $passwordStrength.addClass('password-strong');
                    $passwordHelp.removeClass('text-danger').addClass('text-success');
                    $passwordHelp.text('Contrasenya segura!');
                    break;
                case 'medium':
                    $passwordStrength.addClass('password-medium');
                    $passwordHelp.removeClass('text-danger text-success').addClass('text-warning');
                    $passwordHelp.text('Contrasenya mitjana. Afegeix una majúscula i un número per millorar-la.');
                    break;
                case 'weak':
                    $passwordStrength.addClass('password-weak');
                    $passwordHelp.removeClass('text-success').addClass('text-danger');
                    $passwordHelp.text('Contrasenya dèbil. Ha de tenir almenys 8 caràcters, una majúscula, una minúscula i un número.');
                    break;
            }
        } else {
            $passwordHelp.removeClass('text-danger text-success').addClass('text-muted');
            $passwordHelp.text('La contrasenya ha de tenir almenys 8 caràcters, una lletra majúscula, una minúscula i un número.');
        }

        validatePasswords();
    });

    // Validar coincidencia de contraseñas
    function validatePasswords() {
        if ($pass.val() !== $repass.val()) {
            $repass.addClass('is-invalid');
            $repassFeedback.text('Les contrasenyes no coincideixen');
            return false;
        } else {
            $repass.removeClass('is-invalid');
            return true;
        }
    }

    $repass.on('input', validatePasswords);

    // Validar email con expresión regular
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    $email.on('blur', function () {
        if (!validateEmail($email.val())) {
            $email.addClass('is-invalid');
            $emailFeedback.text('Si us plau, introdueix un correu electrònic vàlid');
        } else {
            $email.removeClass('is-invalid');
        }
    });

    // Habilitar/deshabilitar botón de registro según validación
    function validateRegisterForm() {
        const isEmailValid = validateEmail($email.val());
        const isPasswordStrong = checkPasswordStrength($pass.val()) === 'strong';
        const isPasswordMatch = validatePasswords();
        const isTermsAccepted = $terms.is(':checked');

        if (isEmailValid && isPasswordStrong && isPasswordMatch && isTermsAccepted) {
            $registerButton.prop('disabled', false);
        } else {
            $registerButton.prop('disabled', true);
        }
    }

    // Event listeners para validación en tiempo real
    $email.on('input', validateRegisterForm);
    $pass.on('input', validateRegisterForm);
    $repass.on('input', validateRegisterForm);
    $terms.on('change', validateRegisterForm);

    // Validación del formulario de registro al enviar
    $registerForm.on('submit', function (e) {
        validateRegisterForm();

        if ($registerButton.prop('disabled')) {
            e.preventDefault();

            // Mostrar mensajes de error
            if (!validateEmail($email.val())) {
                $email.addClass('is-invalid');
                $emailFeedback.text('Si us plau, introdueix un correu electrònic vàlid');
            }

            if (!validatePasswords()) {
                $repass.addClass('is-invalid');
            }

            if (!$terms.is(':checked')) {
                $terms.addClass('is-invalid');
            }

            // Scroll to first error
            const $firstError = $('.is-invalid:first');
            if ($firstError.length) {
                $('html, body').animate({
                    scrollTop: $firstError.offset().top - 100
                }, 500);
            }
        }
    });

    // Eliminar validación al enfocar
    $('input').on('focus', function () {
        $(this).removeClass('is-invalid');
    });

    // Inicializar validación
    validateRegisterForm();

    // Ajustar posición de los ojos de contraseña después de la carga
    setTimeout(function () {
        $('.password-toggle').css('top', '50%').css('transform', 'translateY(-50%)');
    }, 100);
});