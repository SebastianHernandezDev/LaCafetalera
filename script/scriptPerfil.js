// Scroll animación
const observerOptions = {
    threshold: 0.1,  // El 10% del elemento debe ser visible para activar la animación
    rootMargin: '0px 0px -50px 0px' // Margen del área de visualización, activa antes de que esté completamente visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {

            // Si el elemento está entrando en la vista, se le añade la clase 'animate' o la animacion definida en el scroll
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Aumento mouse (Cuando alguien observa cada tarjeta del equipo)
document.querySelectorAll('.team-card').forEach(card => {
   
    observer.observe(card);
});

// Links (scroll suave al hacer clic en un enlace interno)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();  // Evita el comportamiento por defecto del enlace
        const target = document.querySelector(this.getAttribute('href')); // Dirige al enlace

        if (target) {
            // Desplazamiento suave hacia el elemento destino
            target.scrollIntoView({
                behavior: 'smooth',  
                block: 'start'    
            });
        }
    });
});

// Animación de transformacióno rebote
const style = document.createElement('style'); // Crea una etiqueta <style>
style.textContent = `
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0); // Posición original
        }
        40% {
            transform: translateY(-10px); // Rebote hacia arriba
        }
        60% {
            transform: translateY(-5px);  // Segundo rebote más leve
        }
    }
`;
document.head.appendChild(style); 
