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

// Inputs
const nombre = document.getElementById("nombres");
const apellido = document.getElementById("apellidos");
const correo = document.getElementById("correo");
const telefono = document.getElementById("celular");
const contraseña = document.getElementById("password");
const confirmContraseña = document.getElementById("confirmPassword");
const contraseñaFeedback = document.getElementById("passwordError");

// Input-groups
const contraseñaGroup = contraseña.closest(".input-group");
const confirmContraseñaGroup = confirmContraseña.closest(".input-group");

// Validación en tiempo real para campos comunes
function validarCampo(input, regex, feedbackId = null, mensaje = "") {
  if (!input) return;
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

validarCampo(nombre, nameRegex);
validarCampo(apellido, nameRegex);
validarCampo(telefono, phoneRegex);
validarCampo(correo, emailRegex, "correoError", "Ingrese un correo válido.");

// Validación en tiempo real de contraseña
contraseña.addEventListener("input", () => {
  const value = contraseña.value;
  const errores = [];

  if (value.length < 8) errores.push("Debe tener al menos 8 caracteres.");
  if (!passwordRegex.upper.test(value)) errores.push("Debe contener una mayúscula.");
  if (!passwordRegex.lower.test(value)) errores.push("Debe contener una minúscula.");
  if (!passwordRegex.number.test(value)) errores.push("Debe contener un número.");
  if (!passwordRegex.special.test(value)) errores.push("Debe contener un carácter especial.");

  if (errores.length > 0) {
    contraseña.classList.add("is-invalid");
    contraseña.classList.remove("is-valid");
    if (contraseñaGroup) contraseñaGroup.classList.add("is-invalid");
    contraseñaFeedback.innerHTML = errores.join("<br>");
    contraseñaFeedback.style.display = "block";
  } else {
    contraseña.classList.remove("is-invalid");
    contraseña.classList.add("is-valid");
    if (contraseñaGroup) contraseñaGroup.classList.remove("is-invalid");
    contraseñaFeedback.style.display = "none";
  }
});

// Confirmar contraseña en tiempo real
confirmContraseña.addEventListener("input", () => {
  if (confirmContraseña.value !== contraseña.value || !confirmContraseña.value) {
    confirmContraseña.classList.add("is-invalid");
    confirmContraseña.classList.remove("is-valid");
    if (confirmContraseñaGroup) confirmContraseñaGroup.classList.add("is-invalid");
  } else {
    confirmContraseña.classList.remove("is-invalid");
    confirmContraseña.classList.add("is-valid");
    if (confirmContraseñaGroup) confirmContraseñaGroup.classList.remove("is-invalid");
  }
});

// Enviar formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let valid = true;

  [nombre, apellido, correo, telefono, contraseña, confirmContraseña].forEach((input) => {
    input.classList.remove("is-invalid", "is-valid");
  });

  if (contraseñaGroup) contraseñaGroup.classList.remove("is-invalid");
  if (confirmContraseñaGroup) confirmContraseñaGroup.classList.remove("is-invalid");

  // Validaciones
  if (!nameRegex.test(nombre.value.trim())) {
    nombre.classList.add("is-invalid");
    valid = false;
  }

  if (!nameRegex.test(apellido.value.trim())) {
    apellido.classList.add("is-invalid");
    valid = false;
  }

  if (!emailRegex.test(correo.value.trim())) {
    correo.classList.add("is-invalid");
    document.getElementById("correoError").innerText = "Ingrese un correo válido.";
    valid = false;
  }

  if (!phoneRegex.test(telefono.value.trim())) {
    telefono.classList.add("is-invalid");
    valid = false;
  }

  const passVal = contraseña.value;
  const errores = [];

  if (passVal.length < 8) errores.push("Debe tener al menos 8 caracteres.");
  if (!passwordRegex.upper.test(passVal)) errores.push("Debe contener una mayúscula.");
  if (!passwordRegex.lower.test(passVal)) errores.push("Debe contener una minúscula.");
  if (!passwordRegex.number.test(passVal)) errores.push("Debe contener un número.");
  if (!passwordRegex.special.test(passVal)) errores.push("Debe contener un carácter especial.");

  if (errores.length > 0) {
    contraseña.classList.add("is-invalid");
    if (contraseñaGroup) contraseñaGroup.classList.add("is-invalid");
    contraseñaFeedback.innerHTML = errores.join("<br>");
    contraseñaFeedback.style.display = "block";
    valid = false;
  }

  if (confirmContraseña.value !== passVal || !confirmContraseña.value) {
    confirmContraseña.classList.add("is-invalid");
    if (confirmContraseñaGroup) confirmContraseñaGroup.classList.add("is-invalid");
    valid = false;
  }

  // Si todo es válido
  if (valid) {
    const nuevoUsuario = {
      nombre: nombre.value.trim(),
      apellido: apellido.value.trim(),
      email: correo.value.trim(),
      telefono: telefono.value.trim(),
      contrasena: contraseña.value,
    };

    fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoUsuario),
    })
      .then(response => {
        if (!response.ok) throw new Error("No se pudo registrar el usuario");
        return response.json();
      })
      .then(data => {
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
        [nombre, apellido, correo, telefono, contraseña, confirmContraseña].forEach((i) =>
          i.classList.remove("is-valid")
        );
      })
      .catch(error => {
        console.error("Error al registrar usuario:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al registrar el usuario.',
        });
      });
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
