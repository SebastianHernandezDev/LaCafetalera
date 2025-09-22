// === VARIABLES GLOBALES ===
let autoSlideInterval;
let currentSlide = 0;
const totalSlides = 2;


// === FUNCIÓN ADMIN PANEL ===
function AdminPanel() {
  const boton = document.getElementById("botonSesion");
  if (!boton) return;

  const usuarioJSON = localStorage.getItem("usuarioActivo");

  if (!usuarioJSON) {
    boton.setAttribute("href", "/frontend/pages/LoginRegistro/components/Login/login.html");
    boton.innerHTML = `<i class="bi bi-person-fill letrasLogin me-2"></i><strong>Iniciar Sesión</strong>`;
    return;
  }

  const usuario = JSON.parse(usuarioJSON);

  if (usuario.rol && usuario.rol.toLowerCase() === "admin") {
    boton.setAttribute("href", "/frontend/pages/dashboardAdmin/components/dashboard.html");
    boton.innerHTML = `<i class="bi bi-speedometer2 me-2"></i><strong>Admin Panel</strong>`;
    return;
  }

  boton.removeAttribute("href");
  boton.innerHTML = `<i class="bi bi-box-arrow-right me-2"></i><strong>Cerrar Sesión</strong>`;
  boton.onclick = function(e) {
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
        window.location.href = "../../../../index.html";
      }
    });
  };
}

// === CARRUSEL DE PRODUCTOS ===
function initCarrusel() {
  const carrusel = document.getElementById('carrusel');
  const indicators = document.querySelectorAll('.indicator');
  const carruselContainer = document.querySelector('.carrusel-container');
  
  if (!carrusel || !indicators.length) return;

  function moveCarrusel(slideIndex) {
    const cardWidth = 300;
    const visibleCards = 3;
    const translateX = slideIndex * cardWidth * visibleCards;
    
    carrusel.style.transform = `translateX(-${translateX}px)`;
    
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === slideIndex);
    });
  }

  function autoSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    moveCarrusel(currentSlide);
  }

  // Iniciar carrusel automático
  autoSlideInterval = setInterval(autoSlide, 8000);

  // Event listeners para indicadores
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentSlide = index;
      moveCarrusel(currentSlide);
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(autoSlide, 8000);
    });
  });

  // Pausar/reanudar al hover
  if (carruselContainer) {
    carruselContainer.addEventListener('mouseenter', () => {
      clearInterval(autoSlideInterval);
    });

    carruselContainer.addEventListener('mouseleave', () => {
      autoSlideInterval = setInterval(autoSlide, 8000);
    });
  }
}

// === VIDEO HERO ===
function initVideo() {
  const video = document.getElementById('heroVideo');
  const videoBackground = document.getElementById('videoBackground');
  
  if (!video || !videoBackground) return;

  video.addEventListener('loadeddata', () => {
    videoBackground.classList.add('loaded');
  });

  video.addEventListener('error', () => {
    console.warn('Video failed to load, using fallback background');
    videoBackground.classList.add('loaded');
  });

  function ensureVideoPlays() {
    if (video.paused) {
      video.play().catch(e => console.warn('Video autoplay failed:', e));
    }
  }

  // Eventos para móviles
  document.addEventListener('touchstart', ensureVideoPlays, { once: true });
  document.addEventListener('click', ensureVideoPlays, { once: true });
}

// === SCROLL INDICATOR ===
function initScrollIndicator() {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    });
  }
}

// === STORYTELLING ANIMATIONS ===
function initStorytellingAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observar elementos para animación
  document.querySelectorAll('.historia-card').forEach(card => {
    observer.observe(card);
  });

};


// === INICIALIZACIÓN ===
document.addEventListener("DOMContentLoaded", function() {
  AdminPanel();
  initCarrusel();
  initVideo();
  initScrollIndicator();
  initStorytellingAnimations();
});
