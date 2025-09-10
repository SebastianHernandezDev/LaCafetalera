
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
