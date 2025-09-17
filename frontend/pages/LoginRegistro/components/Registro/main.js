const form = document.getElementById("registerForm");

// Regex
const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;
const passwordRegex = {
  upper: /[A-Z]/,
  lower: /[a-z]/,
  number: /[0-9]/,
  special: /[^A-Za-z0-9]/,
};

// Obtener usuarios guardados
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

// Inputs
const nombres = document.getElementById("nombres");
const apellidos = document.getElementById("apellidos");
const correo = document.getElementById("correo");
const celular = document.getElementById("celular");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const passwordFeedback = document.getElementById("passwordError");

// Input-group de password y confirm
const passwordGroup = password.closest(".input-group");
const confirmPasswordGroup = confirmPassword.closest(".input-group");

// Validación en tiempo real para campos comunes
function validarCampo(input, regex, feedbackId = null, mensaje = "") {
  input.addEventListener("input", () => {
    const valor = input.value.trim();
    const valido = regex.test(valor);

    if (!valido) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");

      if (feedbackId && mensaje) {
        const feedback = document.getElementById(feedbackId);
        if (feedback) feedback.innerText = mensaje;
      }
    } else {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");

      if (feedbackId) {
        const feedback = document.getElementById(feedbackId);
        if (feedback) feedback.innerText = "";
      }
    }
  });
}

validarCampo(nombres, nameRegex);
validarCampo(apellidos, nameRegex);
validarCampo(celular, phoneRegex);
validarCampo(correo, emailRegex, "correoError", "Ingrese un correo válido.");

// Validación en tiempo real de password
password.addEventListener("input", () => {
  const value = password.value;
  const errores = [];

  if (value.length < 8) errores.push("Debe tener al menos 8 caracteres.");
  if (!passwordRegex.upper.test(value)) errores.push("Debe contener una mayúscula.");
  if (!passwordRegex.lower.test(value)) errores.push("Debe contener una minúscula.");
  if (!passwordRegex.number.test(value)) errores.push("Debe contener un número.");
  if (!passwordRegex.special.test(value)) errores.push("Debe contener un carácter especial.");

  if (errores.length > 0) {
    password.classList.add("is-invalid");
    password.classList.remove("is-valid");
    if (passwordGroup) passwordGroup.classList.add("is-invalid");
    passwordFeedback.innerHTML = errores.join("<br>");
    passwordFeedback.style.display = "block";
  } else {
    password.classList.remove("is-invalid");
    password.classList.add("is-valid");
    if (passwordGroup) passwordGroup.classList.remove("is-invalid");
    passwordFeedback.style.display = "none";
  }
});

// Confirmar contraseña en tiempo real
confirmPassword.addEventListener("input", () => {
  if (confirmPassword.value !== password.value || !confirmPassword.value) {
    confirmPassword.classList.add("is-invalid");
    confirmPassword.classList.remove("is-valid");
    if (confirmPasswordGroup) confirmPasswordGroup.classList.add("is-invalid");
  } else {
    confirmPassword.classList.remove("is-invalid");
    confirmPassword.classList.add("is-valid");
    if (confirmPasswordGroup) confirmPasswordGroup.classList.remove("is-invalid");
  }
});

// Validación al enviar el formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let valid = true;

  // Limpiar clases viejas
  [nombres, apellidos, correo, celular, password, confirmPassword].forEach((input) => {
    input.classList.remove("is-invalid", "is-valid");
  });
  if (passwordGroup) passwordGroup.classList.remove("is-invalid");
  if (confirmPasswordGroup) confirmPasswordGroup.classList.remove("is-invalid");

  // Validar nombres y apellidos
  if (!nameRegex.test(nombres.value.trim())) {
    nombres.classList.add("is-invalid");
    valid = false;
  }

  if (!nameRegex.test(apellidos.value.trim())) {
    apellidos.classList.add("is-invalid");
    valid = false;
  }

  // Validar correo
  const correoVal = correo.value.trim();
  const correoExistente = usuarios.some((u) => u.correo === correoVal);
  if (!emailRegex.test(correoVal)) {
    correo.classList.add("is-invalid");
    document.getElementById("correoError").innerText = "Ingrese un correo válido.";
    valid = false;
  } else if (correoExistente) {
    correo.classList.add("is-invalid");
    document.getElementById("correoError").innerText = "Este correo ya está en uso.";
    valid = false;
  }

  // Validar celular
  const celularVal = celular.value.trim();
  const celularExistente = usuarios.some((u) => u.celular === celularVal);
  if (!phoneRegex.test(celularVal)) {
    celular.classList.add("is-invalid");
    valid = false;
  } else if (celularExistente) {
    celular.classList.add("is-invalid");
    const feedback = celular.nextElementSibling;
    if (feedback) feedback.innerText = "Este número ya está registrado.";
    valid = false;
  }

  // Validar contraseña
  const passVal = password.value;
  let errores = [];
  if (passVal.length < 8) errores.push("Debe tener al menos 8 caracteres.");
  if (!passwordRegex.upper.test(passVal)) errores.push("Debe contener una mayúscula.");
  if (!passwordRegex.lower.test(passVal)) errores.push("Debe contener una minúscula.");
  if (!passwordRegex.number.test(passVal)) errores.push("Debe contener un número.");
  if (!passwordRegex.special.test(passVal)) errores.push("Debe contener un carácter especial.");

  if (errores.length > 0) {
    password.classList.add("is-invalid");
    if (passwordGroup) passwordGroup.classList.add("is-invalid");
    passwordFeedback.innerHTML = errores.join("<br>");
    passwordFeedback.style.display = "block";
    valid = false;
  }

  // Validar confirmación
  if (confirmPassword.value !== passVal || !confirmPassword.value) {
    confirmPassword.classList.add("is-invalid");
    if (confirmPasswordGroup) confirmPasswordGroup.classList.add("is-invalid");
    valid = false;
  }

  // Si todo es válido
  if (valid) {
    usuarios.push({
      nombres: nombres.value.trim(),
      apellidos: apellidos.value.trim(),
      correo: correoVal,
      celular: celularVal,
      password: passVal,
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    Swal.fire({
      icon: 'success',
      title: '¡Registro exitoso!',
      text: 'Usuario registrado con éxito.',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      backdrop: true,
    }).then(() => {
      window.location.href = "../Login/login.html";
    });

    form.reset();
    [nombres, apellidos, correo, celular, password, confirmPassword].forEach((i) =>
      i.classList.remove("is-valid")
    );
  }
});

// Mostrar/Ocultar contraseña
document.getElementById("togglePassword").addEventListener("click", function () {
  const input = document.getElementById("password");
  const icon = this.querySelector("i");

  input.type = input.type === "password" ? "text" : "password";
  icon.classList.toggle("bi-eye");
  icon.classList.toggle("bi-eye-slash");
});

document.getElementById("toggleConfirmPassword").addEventListener("click", function () {
  const input = document.getElementById("confirmPassword");
  const icon = this.querySelector("i");

  input.type = input.type === "password" ? "text" : "password";
  icon.classList.toggle("bi-eye");
  icon.classList.toggle("bi-eye-slash");
});

