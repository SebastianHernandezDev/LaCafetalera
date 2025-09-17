function AdminPanel() {
  const boto = document.getElementById("botonSesion");
  if (!boto) return;

  const usuarioJSON = localStorage.getItem("usuarioActivo");

  // Si NO hay usuario, mostrar botón para iniciar sesión
  if (!usuarioJSON) {
    boto.setAttribute("href", "/frontend/pages/LoginRegistro/components/Login/login.html");
    boto.innerHTML = `<i class="bi bi-person-fill letrasLogin me-2"></i><strong>Iniciar Sesión</strong>`;
    boto.onclick = null; // Limpia cualquier evento anterior
    return;
  }

  const usuario = JSON.parse(usuarioJSON);

  // Si es admin, mostrar botón para ir al panel admin
  if (usuario.rol && usuario.rol.toLowerCase() === "admin") {
    boto.setAttribute("href", "/frontend/pages/dashboardAdmin/components/dashboard.html");
    boto.innerHTML = `<i class="bi bi-speedometer2 me-2"></i><strong>Admin Panel</strong>`;
    boto.onclick = null; // Limpia cualquier evento anterior
    return;
  }


  boto.removeAttribute("href"); // Quita el href para que use el onclick
  boto.innerHTML = `<i class="bi bi-box-arrow-right me-2"></i><strong>Cerrar Sesión</strong>`;
  boto.onclick = function (e) {
    e.preventDefault();
    Swal.fire({
      title: '¿Deseas cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        localStorage.removeItem("usuarioActivo");
        window.location.href = "../../../../index.html"; // Redirige a la página de inicio
      }
    });
  };
}

// ===== Navbar Toggle =====
const menuToggle = document.getElementById("menuToggle");
const navbarLinks = document.getElementById("navbarLinks");

if (menuToggle && navbarLinks) {
  menuToggle.addEventListener("click", () => {
    navbarLinks.classList.toggle("show");
  });
}

// Botones "Ver más" para historias
const botonesVerMas = document.querySelectorAll('.ver-mas-btn');

botonesVerMas.forEach(btn => {
  btn.addEventListener('click', () => {
    // Seleccionamos el párrafo dentro del mismo contenedor
    const parrafo = btn.parentElement.querySelector('.historia-parrafo');

    // Alternamos la clase expandido
    parrafo.classList.toggle('expandido');

    // Cambiamos el texto del botón
    btn.textContent = parrafo.classList.contains('expandido') ? 'Ver menos' : 'Ver más';
  });
});


function toggleTexto(boton) {
  // Obtener el contenedor padre del botón
  const contenedor = boton.closest('.col-12.col-md-6');
  const textoCorto = contenedor.querySelector('.texto-corto');
  const textoCompleto = contenedor.querySelector('.texto-completo');

  if (textoCompleto.style.display === 'none') {
    textoCorto.style.display = 'none';
    textoCompleto.style.display = 'block';
    boton.textContent = 'Ver menos';
  } else {
    textoCorto.style.display = 'block';
    textoCompleto.style.display = 'none';
    boton.textContent = 'Ver más';
  }
}

const carrusel = document.getElementById('carrusel');
const indicators = document.querySelectorAll('.indicator');
const totalCards = 6; // Total de cards
const visibleCards = 3; // Cards visibles a la vez
const cardWidth = 300; // Ancho de card + gap
let currentSlide = 0;
let isTransitioning = false;

// Función para mover el carrusel
function moveCarrusel(slideIndex) {
  if (isTransitioning) return;

  isTransitioning = true;
  const translateX = slideIndex * cardWidth * visibleCards;
  carrusel.style.transform = `translateX(-${translateX}px)`;

  // Actualizar indicadores
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === slideIndex);
  });

  setTimeout(() => {
    isTransitioning = false;
  }, 500);
}

// Función para el carrusel automático
function autoSlide() {
  currentSlide = (currentSlide + 1) % 2; // Solo 2 posiciones (0 y 1)
  moveCarrusel(currentSlide);
}

// Iniciar carrusel automático
let autoSlideInterval = setInterval(autoSlide, 8000); // Cambia cada 4 segundos

// Event listeners para los indicadores
indicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => {
    currentSlide = index;
    moveCarrusel(currentSlide);

    // Reiniciar el interval automático
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(autoSlide, 8000);
  });
});

// Pausar carrusel al hacer hover
const carruselContainer = document.querySelector('.carrusel-container');
carruselContainer.addEventListener('mouseenter', () => {
  clearInterval(autoSlideInterval);
});

carruselContainer.addEventListener('mouseleave', () => {
  autoSlideInterval = setInterval(autoSlide, 8000);
});


// Inicializar AdminPanel al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  AdminPanel();
});

document.addEventListener("DOMContentLoaded", function () {
  const mensajes = document.querySelectorAll(".chat-bubble");
  let index = 0;
  let iniciado = false; // para que solo se ejecute una vez

  // Ocultar todos los mensajes al inicio
  mensajes.forEach(msg => {
    msg.style.opacity = "0";
    msg.style.transform = "translateY(20px)";
  });

  function mostrarMensaje() {
    if (index < mensajes.length) {
      const msg = mensajes[index];
      msg.style.transition = "all 0.8s ease";
      msg.style.opacity = "1";
      msg.style.transform = "translateY(0)";
      index++;
      setTimeout(mostrarMensaje, 2500); // siguiente mensaje cada 2.5s
    }
  }

  // Usamos Intersection Observer
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !iniciado) {
        iniciado = true; // evita que se repita la animación al hacer scroll
        mostrarMensaje();
        observer.disconnect(); // deja de observar una vez iniciado
      }
    });
  }, { threshold: 0.3 }); // 30% visible en pantalla

  // Observar la sección de Nuestra Historia
  const section = document.querySelector("#storytelling");
  if (section) {
    observer.observe(section);
  }
});

//VIDEOVIDEOVIDEO
 // Variables principales
        const video = document.getElementById('heroVideo');
        const videoBackground = document.getElementById('videoBackground');
       
        // Manejar la carga del video
        video.addEventListener('loadeddata', () => {
            videoBackground.classList.add('loaded');
        });

        // Manejo de errores del video
        video.addEventListener('error', () => {
            console.warn('Video failed to load, using fallback background');
            videoBackground.classList.add('loaded');
        });

        // Asegurar reproducción en móviles
        function ensureVideoPlays() {
            if (video.paused) {
                video.play().catch(e => {
                    console.warn('Video autoplay failed:', e);
                });
            }
        }

        // Eventos para iniciar video en móviles
        document.addEventListener('touchstart', ensureVideoPlays, { once: true });
        document.addEventListener('click', ensureVideoPlays, { once: true });

        // Scroll suave al hacer click en el indicador
        document.querySelector('.scroll-indicator').addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });