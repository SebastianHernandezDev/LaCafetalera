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
            // Verificar si es administrador desde admin.json
            const response = await fetch("../../assets/data/admin.json");

            const admin = await response.json();

            if (correo === admin.correo && password === admin.password) {
                localStorage.setItem("usuarioActivo", JSON.stringify({
                    correo: admin.correo,
                    rol: "admin"
                }));
                alert("Bienvenido Admin ");
                return window.location.href = "../../../dashboardAdmin/components/dashboard.html";
            }

            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            const user = usuarios.find(u => u.correo === correo && u.password === password);

            if (!user) {
                alert("Correo o contraseña incorrectos.");
                return;
            }

            localStorage.setItem("usuarioActivo", JSON.stringify({
                correo: user.correo,
                rol: "usuario"
            }));
            alert(`Bienvenido, ${user.nombres}`);
            window.location.href = "../../../index.html";

        } catch (error) {
            console.error("Error al verificar el login:", error);
            alert("Hubo un problema al iniciar sesión. Inténtalo más tarde.");
        }
    });

    // Mostrar/ocultar contraseña
    const toggleBtn = document.getElementById("togglePassword");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
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
