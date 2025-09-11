// Funcionalidades adicionales para el portafolio

// Inicializar tooltips de Bootstrap
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Efecto de escritura para el título
    typeWriterEffect();

    // Animación de habilidades al hacer scroll
    initSkillAnimation();

    // Navegación suave
    initSmoothScrolling();
});

// Efecto de máquina de escribir para el título
function typeWriterEffect() {
    const titleElement = document.querySelector('.hero-section h1');
    if (!titleElement) return;

    const originalText = titleElement.textContent;
    titleElement.textContent = '';
    let i = 0;
    let speed = 100;

    function typeWriter() {
        if (i < originalText.length) {
            titleElement.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }

    // Solo ejecutar el efecto si el viewport es lo suficientemente ancho
    if (window.innerWidth > 768) {
        setTimeout(typeWriter, 500);
    } else {
        titleElement.textContent = originalText;
    }
}

// Animación de habilidades al hacer scroll
function initSkillAnimation() {
    const skillItems = document.querySelectorAll('.skill-item');
    if (!skillItems.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    skillItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
}

// Navegación suave
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Cambiar navbar al hacer scroll
let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar-custom');

window.addEventListener('scroll', () => {
    if (!navbar) return;

    if (window.scrollY > 100) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }

    // Ocultar/mostrar navbar al hacer scroll
    if (window.scrollY > lastScrollY && window.scrollY > 200) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }

    lastScrollY = window.scrollY;
});

// Cargar imágenes con lazy loading
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('img');

    if ('loading' in HTMLImageElement.prototype) {
        // El navegador soporta lazy loading nativo
        images.forEach(img => {
            if (!img.getAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    } else {
        // Cargar polyfill para lazy loading si es necesario
        // import('loading-attribute-polyfill');
    }
});