const form = document.getElementById("registerForm");

// Regex
const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // solo letras y espacios
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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombres = document.getElementById("nombres");
  const apellidos = document.getElementById("apellidos");
  const correo = document.getElementById("correo");
  const celular = document.getElementById("celular");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  let valid = true;

  // Resetear clases
  [nombres, apellidos, correo, celular, password, confirmPassword].forEach((i) => {
    i.classList.remove("is-invalid", "is-valid");
  });

  // Validaciones nombres
  
  if (!nombres.value.trim() || !nameRegex.test(nombres.value.trim())) {
    nombres.classList.add("is-invalid");
    valid = false;
  } else {
    nombres.classList.add("is-valid");
  }

  // Validaciones apellidos
  
  if (!apellidos.value.trim() || !nameRegex.test(apellidos.value.trim())) {
    apellidos.classList.add("is-invalid");
    valid = false;
  } else {
    apellidos.classList.add("is-valid");
  }

  // Validaciones correo
 
  if (!emailRegex.test(correo.value.trim())) {
    correo.classList.add("is-invalid");
    valid = false;
  } else if (usuarios.some((u) => u.correo === correo.value.trim())) {
    document.getElementById("correoError").innerText = "Este correo ya está en uso.";
    correo.classList.add("is-invalid");
    valid = false;
  } else {
    correo.classList.add("is-valid");
  }

  // Validaciones celular
  
  if (!phoneRegex.test(celular.value.trim())) {
    celular.classList.add("is-invalid");
    valid = false;
  } else if (usuarios.some((u) => u.celular === celular.value.trim())) {
    const celularFeedback = celular.nextElementSibling;
    celularFeedback.innerText = "Este número de celular ya está registrado.";
    celular.classList.add("is-invalid");
    valid = false;
  } else {
    celular.classList.add("is-valid");
  }

  // Validaciones contraseña

  let passErrors = [];
  if (password.value.length < 8) passErrors.push("Debe tener al menos 8 caracteres.");
  if (!passwordRegex.upper.test(password.value)) passErrors.push("Debe contener al menos una letra mayúscula.");
  if (!passwordRegex.lower.test(password.value)) passErrors.push("Debe contener al menos una letra minúscula.");
  if (!passwordRegex.number.test(password.value)) passErrors.push("Debe contener al menos un número.");
  if (!passwordRegex.special.test(password.value)) passErrors.push("Debe contener al menos un carácter especial.");

  const passwordFeedback = document.getElementById("passwordError");

  if (passErrors.length > 0) {
    password.classList.add("is-invalid");
    passwordFeedback.style.display = "block";
    passwordFeedback.innerHTML = passErrors.join("<br>");
    valid = false;
  } else {
    password.classList.remove("is-invalid");
    password.classList.add("is-valid");
    passwordFeedback.style.display = "none";
  }

  // Validaciones confirmación password
 
  const confirmFeedback = confirmPassword.nextElementSibling;
  if (confirmPassword.value !== password.value || !confirmPassword.value) {
    confirmPassword.classList.add("is-invalid");
    confirmFeedback.style.display = "block";
    valid = false;
  } else {
    confirmPassword.classList.remove("is-invalid");
    confirmPassword.classList.add("is-valid");
    confirmFeedback.style.display = "none";
  }

  // Guardar si todo es válido
  
  if (valid) {
    usuarios.push({
      nombres: nombres.value.trim(),
      apellidos: apellidos.value.trim(),
      correo: correo.value.trim(),
      celular: celular.value.trim(),
      password: password.value,
    });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Usuario registrado con éxito ✅");

    form.reset();
    [nombres, apellidos, correo, celular, password, confirmPassword].forEach((i) =>
      i.classList.remove("is-valid")
    );
  }
});


// Mostrar/Ocultar contraseñas

document.getElementById("togglePassword").addEventListener("click", function () {
  const passwordInput = document.getElementById("password");
  const icon = this.querySelector("i");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    icon.classList.replace("bi-eye", "bi-eye-slash");
  } else {
    passwordInput.type = "password";
    icon.classList.replace("bi-eye-slash", "bi-eye");
  }
});

document.getElementById("toggleConfirmPassword").addEventListener("click", function () {
  const confirmInput = document.getElementById("confirmPassword");
  const icon = this.querySelector("i");
  if (confirmInput.type === "password") {
    confirmInput.type = "text";
    icon.classList.replace("bi-eye", "bi-eye-slash");
  } else {
    confirmInput.type = "password";
    icon.classList.replace("bi-eye-slash", "bi-eye");
  }
});
