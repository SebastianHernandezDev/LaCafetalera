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
            const response = await fetch("../../assets/data/admin.json");
            const admin = await response.json();

            if (correo === admin.correo && password === admin.password) {
                localStorage.setItem("usuarioActivo", JSON.stringify({
                    correo: admin.correo,
                    rol: "admin"
                }));

                await Swal.fire({
                    icon: "success",
                    title: "Bienvenido Admin",
                    text: "Accediendo al panel administrativo...",
                    timer: 2000,
                    showConfirmButton: false
                });

                return window.location.href = "../../../dashboardAdmin/components/dashboard.html";
            }

            // Buscar entre usuarios normales
            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            const user = usuarios.find(u => u.correo === correo && u.password === password);

            if (!user) {
                return Swal.fire({
                    icon: "error",
                    title: "Correo o contraseña incorrectos",
                    text: "Por favor verifica tus credenciales.",
                });
            }

            localStorage.setItem("usuarioActivo", JSON.stringify({
                correo: user.correo,
                rol: "usuario"
            }));

            await Swal.fire({
                icon: "success",
                title: `¡Bienvenido, ${user.nombres}!`,
                text: "Redirigiendo al inicio...",
                timer: 2000,
                showConfirmButton: false
            });

            window.location.href = "../../../../../index.html";

        } catch (error) {
            console.error("Error al verificar el login:", error);
            Swal.fire({
                icon: "error",
                title: "Error inesperado",
                text: "Hubo un problema al iniciar sesión. Inténtalo más tarde."
            });
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
