// ---------------- URLs Backend ----------------
const PRODUCTOS_URL = "http://localhost:8080/productos";

// ---------------- Variables globales ----------------
let productosBack = [];

// ---------------- Traer productos desde backend ----------------
async function fetchProductsBackend() {
    try {
        const res = await fetch(PRODUCTOS_URL);
        if (!res.ok) throw new Error("No se pudieron cargar los productos del backend");

        const data = await res.json();

        // Mapea los productos usando los campos reales del backend
        productosBack = data.map(p => ({
            id: p.id || p.id_producto, // <-- usa el campo real que devuelve tu API
            name: p.nombre || "Producto sin nombre",
            description: p.descripcion || "Sin descripción",
            image: p.imagen || "../assets/img/placeholder.png",
            price: Number(p.precioUnitario) || 0
        }));

        // Guarda los productos en localStorage para el carrito
        localStorage.setItem("products", JSON.stringify(productosBack));
    } catch (err) {
        console.error("Error cargando productos:", err);
        productosBack = [];
    }
}

// ---------------- DELETE producto ----------------
async function deleteProductBackend(id) {
    try {
        const token = localStorage.getItem("token"); // si tu API requiere auth
        const res = await fetch(`${PRODUCTOS_URL}/${id}`, {
            method: "DELETE",
            headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });

        if (!res.ok) throw new Error(`No se pudo eliminar el producto ${id}`);
    } catch (err) {
        console.error(err);
        Swal.fire("Error", `No se pudo eliminar el producto ${id}`, "error");
    }
}

// ---------------- Render catálogo ----------------
function renderProducts(products = null) {
    const catalogGrid = document.getElementById("catalogGrid");
    if (!catalogGrid) return;

    const usuarioJSON = localStorage.getItem("usuarioActivo");
    const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;
    const isAdmin = usuario && usuario.rol === "admin";

    const lista = products || productosBack;

    catalogGrid.innerHTML = lista.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                ${isAdmin
                    ? `<button class="btn-delete-product btn btn-danger btn-sm" data-id="${product.id}">Eliminar</button>`
                    : `<button class="btn-cart btn btn-success btn-sm" data-id="${product.id}">Agregar al carrito</button>`}
            </div>
        </div>
    `).join('');

    // ---------- Eventos admin ----------
    if (isAdmin) {
        document.querySelectorAll(".btn-delete-product").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                const result = await Swal.fire({
                    title: "¿Estás seguro?",
                    text: "Esta acción eliminará el producto del catálogo.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, eliminar",
                    cancelButtonText: "Cancelar"
                });

                if (result.isConfirmed) {
                    await deleteProductBackend(id);
                    await fetchProductsBackend();
                    renderProducts();
                    Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
                }
            });
        });
    }
}

// ---------------- Inicialización ----------------
document.addEventListener("DOMContentLoaded", async () => {
    await fetchProductsBackend();
    renderProducts();
});

function showcart() {
    const carritoBtn = document.getElementById("carritoFlotante");
    if (!carritoBtn) return;

    const usuarioJSON = localStorage.getItem("usuarioActivo");
    if (!usuarioJSON) {
        carritoBtn.setAttribute("hidden", "true");
        return;
    }

    const usuario = JSON.parse(usuarioJSON);
    if (usuario.rol && usuario.rol.toLowerCase() === "admin") {
        carritoBtn.setAttribute("hidden", "true");
    } else {
        carritoBtn.removeAttribute("hidden");
    }

    carritoBtn.onclick = function (event) {
        event.preventDefault();
        if (!localStorage.getItem("usuarioActivo")) {
            Swal.fire({
                icon: 'warning',
                title: '¡Atención!',
                text: 'Debes iniciar sesión para usar el carrito.',
                timer: 2500,
                showConfirmButton: false,
                timerProgressBar: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                backdrop: true,
                didClose: () => {
                    window.location.href = "/frontend/pages/LoginRegistro/components/Login/login.html";
                }
            });
        } else {
            const carritoOffcanvas = document.getElementById('carritoOffcanvas');
            const offcanvas = new bootstrap.Offcanvas(carritoOffcanvas);
            offcanvas.show();
        }
    };
}

function actualizarBotonSesion() {
    const boton = document.getElementById("botonSesion");
    if (!boton) return;

    const usuarioJSON = localStorage.getItem("usuarioActivo");
    const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;

    if (!usuario) {
        // Sin usuario: Iniciar sesión
        boton.innerHTML = `<i class="bi bi-person-fill me-2"></i><strong>Iniciar sesión</strong>`;
        boton.setAttribute("href", "../../LoginRegistro/components/Login/login.html");
        boton.onclick = null;
    } else if (usuario.rol && usuario.rol.toLowerCase() === "admin") {
        // Admin: Panel Admin
        boton.innerHTML = `<i class="bi bi-speedometer2 me-2"></i><strong>Panel Admin</strong>`;
        boton.removeAttribute("href");
        boton.onclick = () => {
            window.location.href = "/frontend/pages/dashboardAdmin/components/dashboard.html"; // Ruta al panel admin
        };
    } else {
        // Usuario normal: Cerrar sesión
        boton.innerHTML = `<i class="bi bi-box-arrow-right me-2"></i><strong>Cerrar sesión</strong>`;
        boton.removeAttribute("href");
        boton.onclick = () => {
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
                    window.location.reload();
                }
            });
        };
    }
}

// Llamamos al cargar la página
window.addEventListener("DOMContentLoaded", actualizarBotonSesion);

document.addEventListener("DOMContentLoaded", actualizarBotonSesion);
