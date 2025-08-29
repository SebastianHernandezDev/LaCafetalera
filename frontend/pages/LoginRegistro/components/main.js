const form = document.getElementById("registerForm");
const alertContainer = document.getElementById("alert-container");

// regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;
const passwordRegex = {
  upper: /[A-Z]/,
  lower: /[a-z]/,
  number: /[0-9]/,
  special: /[^A-Za-z0-9]/
};

// Usuarios guardados
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

// Mostrar alertas en pantalla
function showAlert(type, messages) {
  alertContainer.innerHTML = `
    <div class="alert alert-${type}" role="alert">
      ${Array.isArray(messages) ? `<ul>${messages.map(m => `<li>${m}</li>`).join("")}</ul>` : messages}
    </div>`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombres = document.getElementById("nombres");
  const apellidos = document.getElementById("apellidos");
  const correo = document.getElementById("correo");
  const celular = document.getElementById("celular");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  let errores = [];

  // resetear clases
  [nombres, apellidos, correo, celular, password, confirmPassword].forEach(i => {
    i.classList.remove("is-invalid","is-valid");
  });

  // validar nombres
  if (!nombres.value.trim()) {
    errores.push("El campo Nombres es obligatorio.");
    nombres.classList.add("is-invalid");
  } else {
    nombres.classList.add("is-valid");
  }

  // validar apellidos
  if (!apellidos.value.trim()) {
    errores.push("El campo Apellidos es obligatorio.");
    apellidos.classList.add("is-invalid");
  } else {
    apellidos.classList.add("is-valid");
  }

  // validar correo
  if (!emailRegex.test(correo.value.trim())) {
    errores.push("Ingrese un correo electrónico válido.");
    correo.classList.add("is-invalid");
  } else if (usuarios.some(u => u.correo === correo.value.trim())) {
    errores.push("El correo ya está registrado.");
    document.getElementById("correoError").innerText = "Este correo ya está en uso.";
    correo.classList.add("is-invalid");
  } else {
    correo.classList.add("is-valid");
  }

  // validar celular
  if (!phoneRegex.test(celular.value.trim())) {
    errores.push("El número de celular debe tener exactamente 10 dígitos.");
    celular.classList.add("is-invalid");
  } else {
    celular.classList.add("is-valid");
  }

  // validar contraseña
  let passErrors = [];
  if (password.value.length < 8) passErrors.push("Debe tener al menos 8 caracteres.");
  if (!passwordRegex.upper.test(password.value)) passErrors.push("Debe contener al menos una letra mayúscula.");
  if (!passwordRegex.lower.test(password.value)) passErrors.push("Debe contener al menos una letra minúscula.");
  if (!passwordRegex.number.test(password.value)) passErrors.push("Debe contener al menos un número.");
  if (!passwordRegex.special.test(password.value)) passErrors.push("Debe contener al menos un carácter especial.");

  if (passErrors.length > 0) {
    errores = errores.concat(passErrors);
    password.classList.add("is-invalid");
    document.getElementById("passwordError").innerText = passErrors.join(" ");
  } else {
    password.classList.add("is-valid");
  }

  // validar confirma password
  if (confirmPassword.value !== password.value || !confirmPassword.value) {
    errores.push("Las contraseñas no coinciden.");
    confirmPassword.classList.add("is-invalid");
  } else {
    confirmPassword.classList.add("is-valid");
  }

  // mostrar resumen arriba en la pantalla
  if (errores.length > 0) {
    showAlert("danger", errores);
  } else {
    // guardar en localStorage
    usuarios.push({
      nombres: nombres.value.trim(),
      apellidos: apellidos.value.trim(),
      correo: correo.value.trim(),
      celular: celular.value.trim(),
      password: password.value
    });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    showAlert("success", "Usuario registrado con éxito ✅");
    form.reset();
    [nombres, apellidos, correo, celular, password, confirmPassword].forEach(i => i.classList.remove("is-valid"));
  }
});
