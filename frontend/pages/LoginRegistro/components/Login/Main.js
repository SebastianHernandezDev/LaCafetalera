document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("LoginForm");

    if (!loginForm) {
        console.error("❌ No se encontró el formulario con id 'LoginForm'");
        return;
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const correo = document.getElementById("correo").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            const response = await fetch("https://8mq33rknsp.us-east-1.awsapprunner.com/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: correo, contrasena: password })
            });

            if (!response.ok) throw new Error("Correo o contraseña incorrectos");

            const data = await response.json();

            // Guardar JWT y datos del usuario en localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("usuarioActivo", JSON.stringify({
                correo: data.email,
                rol: data.rol || "usuario"
            }));

            // Mostrar alerta y redirigir según rol
            if (data.rol === "admin") {
                await Swal.fire({
                    icon: "success",
                    title: "Bienvenido Admin",
                    text: "Accediendo al panel administrativo...",
                    timer: 2000,
                    showConfirmButton: false
                });
                window.location.href = "../../../dashboardAdmin/components/dashboard.html";
            } else {
                await Swal.fire({
                    icon: "success",
                    title: `¡Bienvenido, ${data.nombre || ''}!`,
                    text: "Redirigiendo al inicio...",
                    timer: 2000,
                    showConfirmButton: false
                });
                window.location.href = "../../../../../index.html";
            }

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message
            });
        }
    });

    // Mostrar/ocultar contraseña
    const togglePassword = document.getElementById("togglePassword");
    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            const input = document.getElementById("password");
            const icon = this.querySelector("i");
            if (input.type === "password") {
                input.type = "text";
                icon.classList.replace("bi-eye", "bi-eye-slash");
            } else {
                input.type = "password";
                icon.classList.replace("bi-eye-slash", "bi-eye");
            }
        });
    }
});
