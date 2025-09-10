function BotonCerrarSesion() {
  const botonclogin = document.getElementById("botonSesion");
  const usuarioJSON = localStorage.getItem("usuarioActivo");
  if (usuarioActivo)
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
      window.location.href = "../../Inicio/components/index.html";
    }
  });
}};



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

document.head.appendChild(style);
document.addEventListener("DOMContentLoaded", () => {
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

  const btnLogin = document.getElementById("btnLogin");
  const btnPerfil = document.getElementById("btnPerfil");
  const perfilModal = document.getElementById("perfilModal");
  const btnLogout = document.getElementById("btnLogout");

  const nombreUsuario = document.getElementById("nombreUsuario");
  const correoUsuario = document.getElementById("correoUsuario");
  const rolUsuario = document.getElementById("rolUsuario");

  if (!usuarioActivo) {
    // Usuario no logueado
    btnLogin.classList.remove("d-none");
  } else {
    // Usuario logueado
    btnPerfil.classList.remove("d-none");

    // Buscar datos del usuario en localStorage (excepto si es admin hardcodeado)
    if (usuarioActivo.rol === "admin") {
      nombreUsuario.textContent = "Administrador";
      correoUsuario.textContent = usuarioActivo.correo;
      rolUsuario.textContent = `Rol: ${usuarioActivo.rol}`;
    } else {
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      const datosUsuario = usuarios.find(u => u.correo === usuarioActivo.correo);
      if (datosUsuario) {
        nombreUsuario.textContent = `${datosUsuario.nombres} ${datosUsuario.apellidos}`;
        correoUsuario.textContent = datosUsuario.correo;
        rolUsuario.textContent = `Rol: ${usuarioActivo.rol}`;
      }
    }

    // Mostrar y ocultar modal
    btnPerfil.addEventListener("click", () => {
      perfilModal.style.display = perfilModal.style.display === "none" ? "block" : "none";
    });

    // Cerrar sesión
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("usuarioActivo");
      window.location.reload(); // Recarga para actualizar la vista
    });

    // Cierra el modal si se hace clic fuera de él
    window.addEventListener("click", (e) => {
      if (!perfilModal.contains(e.target) && e.target !== btnPerfil) {
        perfilModal.style.display = "none";
      }
    });
  }
});
