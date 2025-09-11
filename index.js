$(document).ready(function () {
    // Cache de elementos jQuery para mejor performance
    const $signupSection = $('#signup');
    const $signinSection = $('#signin');
    const $singinButton = $('#singinbutton');
    const $singupButton = $('#singupbutton');

    // Función para cambiar entre formularios
    function switchForm(showForm, hideForm) {
        hideForm.attr('aria-hidden', 'true').css('display', 'none');
        showForm.attr('aria-hidden', 'false').css('display', 'block');

        // Enfocar el primer campo input del formulario mostrado
        const $firstInput = showForm.find('input:visible:first');
        if ($firstInput.length) {
            setTimeout(() => {
                $firstInput.focus();
            }, 100);
        }
    }

    // Event handlers con namespace para mejor manejo
    $singinButton.on('click.auth', function (e) {
        e.preventDefault();
        switchForm($signupSection, $signinSection);
        updateActiveState($(this), $singupButton);
    });

    $singupButton.on('click.auth', function (e) {
        e.preventDefault();
        switchForm($signinSection, $signupSection);
        updateActiveState($(this), $singinButton);
    });

    // Función para actualizar estado activo de botones
    function updateActiveState(activeButton, inactiveButton) {
        activeButton
            .attr('aria-pressed', 'true')
            .addClass('active')
            .removeClass('inactive');

        inactiveButton
            .attr('aria-pressed', 'false')
            .addClass('inactive')
            .removeClass('active');
    }

    // Manejo de teclado para accesibilidad
    $singinButton.add($singupButton).on('keydown.auth', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).trigger('click');
        }
    });

    // Inicializar estado inicial
    updateActiveState($singupButton, $singinButton);

    // Manejar cambios de tamaño de ventana (opcional)
    $(window).on('resize.auth', function () {
        // Aquí puedes añadir lógica responsive si es necesario
    });

    // Limpieza de event listeners si es necesario (para SPA)
    // function cleanupAuthEvents() {
    //     $singinButton.off('.auth');
    //     $singupButton.off('.auth');
    //     $(window).off('.auth');
    // }
});

// Versión alternativa más moderna con delegación de eventos
$(document).ready(function () {
    const $container = $('#auth-container'); // Añade un contenedor común

    // Delegación de eventos para mejor performance
    $container.on('click', '#singinbutton, #singupbutton', function (e) {
        e.preventDefault();

        const $clickedButton = $(this);
        const isSignInButton = $clickedButton.is('#singinbutton');

        if (isSignInButton) {
            $('#signup').removeClass('hidden').attr('aria-hidden', 'false');
            $('#signin').addClass('hidden').attr('aria-hidden', 'true');
        } else {
            $('#signin').removeClass('hidden').attr('aria-hidden', 'false');
            $('#signup').addClass('hidden').attr('aria-hidden', 'true');
        }

        // Actualizar estados ARIA
        $('#singinbutton').attr('aria-pressed', isSignInButton ? 'true' : 'false');
        $('#singupbutton').attr('aria-pressed', isSignInButton ? 'false' : 'true');

        // Focus management
        const $targetForm = isSignInButton ? $('#signup') : $('#signin');
        setTimeout(() => {
            $targetForm.find('input:visible:first').focus();
        }, 50);
    });
});