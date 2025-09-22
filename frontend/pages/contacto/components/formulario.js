function AdminPanel() {
  const boto = document.getElementById("botonSesion");
  if (!boto) return;

  const usuarioJSON = localStorage.getItem("usuarioActivo");
  const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;

  if (!usuario) {
    // Usuario no logueado: botón Iniciar sesión
    boto.setAttribute("href", "/frontend/pages/LoginRegistro/components/Login/login.html");
    boto.innerHTML = `<i class="bi bi-person-fill me-2"></i><strong>Iniciar sesión</strong>`;
    boto.onclick = null;
    return;
  }

  if (usuario.rol && usuario.rol.toLowerCase() === "admin") {
    // Usuario administrador: redirige al panel admin
    boto.setAttribute("href", "/frontend/pages/dashboardAdmin/components/dashboard.html");
    boto.innerHTML = `<i class="bi bi-speedometer2 me-2"></i><strong>Admin Panel</strong>`;
    boto.onclick = null;
    return;
  }

  // Usuario normal: cerrar sesión
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
        localStorage.removeItem("token");
        window.location.href = "/index.html";
      }
    });
  };
}
document.getElementById('contactForm').addEventListener('submit', function (e) {
  const submitBtn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('successMessage');
  const errorMsg = document.getElementById('errorMessage');

  // Cambiar texto del botón mientras se envía
  submitBtn.textContent = 'Enviando...';
  submitBtn.disabled = true;

  // Ocultar mensajes previos
  successMsg.style.display = 'none';
  errorMsg.style.display = 'none';

  // Usar fetch para envío AJAX
  fetch(this.action, {
    method: 'POST',
    body: new FormData(this),
    headers: {
      'Accept': 'application/json'
    }

  }).then(response => {
    if (response.ok) {
      successMsg.style.display = 'block';
      this.reset(); // Limpiar formulario
    } else {
      throw new Error('Error en el envío');
    }
  }).catch(error => {
    errorMsg.style.display = 'block';
  }).finally(() => {
    submitBtn.textContent = 'Enviar mensaje';
    submitBtn.disabled = false;
  });

  e.preventDefault(); // Prevenir envío tradicional
});

// Contador de caracteres para el mensaje
const mensajeTextarea = document.getElementById('mensaje');
const maxLength = 300;

// Contador visual
const contador = document.createElement('div');
contador.style.textAlign = 'right';
contador.style.fontSize = '0.8rem';
contador.style.color = '#666';
contador.style.marginTop = '5px';
mensajeTextarea.parentNode.appendChild(contador);

mensajeTextarea.addEventListener('input', function () {
  const remaining = maxLength - this.value.length;
  contador.textContent = `${remaining} caracteres restantes`;
  contador.style.color = remaining < 50 ? '#f44336' : '#666';
});

// Inicializar contador
mensajeTextarea.dispatchEvent(new Event('input'));

document.addEventListener("DOMContentLoaded", () => {
  AdminPanel();
});