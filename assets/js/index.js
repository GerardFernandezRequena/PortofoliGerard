// Actualizar la hora en tiempo real
function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('currentTime');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Actualizar la hora cada segundo
setInterval(updateTime, 1000);
updateTime(); // Llamar una vez al cargar la página

// Añadir smooth scrolling para los enlaces de navegación
document.querySelectorAll('a.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId && targetId !== '#') {
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Efecto de scroll para la barra de navegación
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
    }
});

// Animación de aparición para las tarjetas de contacto
function animateCards() {
    const cards = document.querySelectorAll('.contact-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Inicializar la opacidad de las tarjetas
document.querySelectorAll('.contact-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Ejecutar la animación cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    animateCards();
});