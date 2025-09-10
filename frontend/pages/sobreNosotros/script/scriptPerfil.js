function AdminPanel() {
  const boto = document.getElementById("botonSesion");
  if (!boto) return;

  const usuarioJSON = localStorage.getItem("usuarioActivo");

  if (!usuarioJSON) {
    boto.setAttribute("href", "/frontend/pages/LoginRegistro/components/Login/login.html");
    boto.innerHTML = `<i class="bi bi-person-fill letrasLogin me-2"></i><strong>Iniciar Sesión</strong>`;
    boto.onclick = null;
    return;
  }

  const usuario = JSON.parse(usuarioJSON);

  if (usuario.rol && usuario.rol.toLowerCase() === "admin") {
    boto.setAttribute("href", "../../dashboardAdmin/components/dashboard.html");
    boto.innerHTML = `<i class="bi bi-speedometer2 me-2"></i><strong>Admin Panel</strong>`;
    boto.onclick = null;
    return;
  }

  boto.removeAttribute("href");
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
        window.location.href = "../components/index.html";
      }
    });
  };
}

// ============================
// FUNCIONALIDAD ADICIONAL
// ============================

document.addEventListener("DOMContentLoaded", () => {
  AdminPanel();

  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  const btnLogin = document.getElementById("btnLogin");
  const btnPerfil = document.getElementById("btnPerfil");
  const perfilModal = document.getElementById("perfilModal");
  const btnLogout = document.getElementById("btnLogout");
  const nombreUsuario = document.getElementById("nombreUsuario");
  const correoUsuario = document.getElementById("correoUsuario");
  const rolUsuario = document.getElementById("rolUsuario");

  if (!usuarioActivo) {
    if (btnLogin) btnLogin.classList.remove("d-none");
  } else {
    if (btnPerfil) btnPerfil.classList.remove("d-none");

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

    if (btnPerfil && perfilModal) {
      btnPerfil.addEventListener("click", () => {
        perfilModal.style.display = perfilModal.style.display === "none" ? "block" : "none";
      });

      window.addEventListener("click", (e) => {
        if (!perfilModal.contains(e.target) && e.target !== btnPerfil) {
          perfilModal.style.display = "none";
        }
      });
    }

    if (btnLogout) {
      btnLogout.addEventListener("click", () => {
        localStorage.removeItem("usuarioActivo");
        window.location.reload();
      });
    }
  }

  // ============================
  // Scroll Reveal Animations
  // ============================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.team-card').forEach(card => {
    observer.observe(card);
  });

  // Scroll suave a enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});
