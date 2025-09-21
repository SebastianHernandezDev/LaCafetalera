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

        productosBack = data.map((p, index) => ({
            id: p.id_producto || index + 1,
            name: p.nombre || "Producto sin nombre",
            description: p.descripcion || "Sin descripción",
            image: p.imagen || "../assets/img/placeholder.png",
            price: Number(p.precioUnitario) || 0
        }));

        // Guarda los productos en localStorage para el carrito flotante
        localStorage.setItem("products", JSON.stringify(productosBack));
    } catch (err) {
        console.error("Error cargando productos:", err);
        productosBack = [];
    }
}


// ---------------- Carrito en localStorage ----------------
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function agregarAlCarrito(productId) {
    const cart = getCart();
    const product = productosBack.find(p => p.id === productId);
    if (!product) return;

    const existente = cart.find(p => p.id === productId);
    if (existente) {
        existente.cantidad += 1;
    } else {
        cart.push({ ...product, cantidad: 1 });
    }
    saveCart(cart);
    showcart(); // <-- Actualiza el carrito flotante y el contador
}

// ---------------- Render catálogo ----------------
function renderProducts(products = null) {
    const catalogGrid = document.getElementById("catalogGrid");
    if (!catalogGrid) return;

    const usuarioJSON = localStorage.getItem("usuarioActivo");
    const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;
    const isAdmin = usuario && usuario.rol === "admin";

    const lista = products || productosBack;

    if (lista.length === 0) {
        catalogGrid.innerHTML = `<div class="no-products">No hay productos disponibles.</div>`;
        return;
    }

    catalogGrid.innerHTML = lista.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image" 
                onerror="this.src='../assets/img/placeholder.png'">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                ${isAdmin
            ? `<button class="btn-delete-product" data-id="${product.id}"><i class="fas fa-trash"></i> Eliminar del Catálogo</button>`
            : `<button class="btn-cart" data-id="${product.id}"><i class="fas fa-shopping-cart"></i> AGREGAR AL CARRITO</button>`}
            </div>
        </div>
    `).join('');

    // Evento para eliminar producto (solo admin)
    if (isAdmin) {
        document.querySelectorAll(".btn-delete-product").forEach(btn => {
            btn.addEventListener("click", async function () {
                const id = Number(btn.getAttribute("data-id"));
                Swal.fire({
                    title: "¿Estás seguro?",
                    text: "Esta acción eliminará el producto del catálogo.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, eliminar",
                    cancelButtonText: "Cancelar"
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            // Petición DELETE al backend
                            const res = await fetch(`${PRODUCTOS_URL}/${id}`, {
                                method: "DELETE"
                            });
                            if (!res.ok) throw new Error("No se pudo eliminar el producto del backend");

                            // Actualiza la lista local y vuelve a renderizar
                            productosBack = productosBack.filter(p => p.id !== id);
                            localStorage.setItem("products", JSON.stringify(productosBack));
                            renderProducts();

                            Swal.fire("Eliminado", "El producto fue eliminado correctamente.", "success");
                        } catch (error) {
                            Swal.fire("Error", "No se pudo eliminar el producto.", "error");
                        }
                    }
                });
            });
        });
    }

    // Evento para agregar al carrito o pedir login
    if (!isAdmin) {
        document.querySelectorAll(".btn-cart").forEach(btn => {
            btn.addEventListener("click", e => {
                const usuarioJSON = localStorage.getItem("usuarioActivo");
                if (!usuarioJSON) {
                    e.preventDefault();
                    Swal.fire({
                        icon: 'info',
                        title: 'Debes iniciar sesión',
                        text: 'Por favor inicia sesión para poder comprar.',
                        confirmButtonText: 'Ir a iniciar sesión'
                    }).then(() => {
                        window.location.href = "../../LoginRegistro/components/Login/login.html";
                    });
                    return;
                }
                const id = Number(btn.getAttribute("data-id"));
                agregarAlCarrito(id);

                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
                btn.style.background = 'linear-gradient(135deg, #4CAF50, #66BB6A)';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '#8C5637';
                }, 1500);
            });
        });
    }
}

// ---------------- Filtro ----------------
function aplicarFiltroNombre() {
    const input = document.getElementById("buscadorNombre").value.toLowerCase();
    const filtrados = productosBack.filter(p => p.name.toLowerCase().includes(input));
    renderProducts(filtrados);
}

// ---------------- Inicialización ----------------
document.addEventListener("DOMContentLoaded", async () => {
    await fetchProductsBackend(); // Trae productos desde backeWnd
    renderProducts(); // Renderiza catálogo
    showcart();

    const buscador = document.getElementById("buscadorNombre");
    if (buscador) buscador.addEventListener("input", aplicarFiltroNombre);
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
    const boto = document.getElementById("botonSesion");
    const usuarioJSON = localStorage.getItem("usuarioActivo");
    if (!boto) return;
    if (usuarioJSON) {
        boto.innerHTML = `<i class="bi bi-box-arrow-right me-2"></i><strong>Cerrar Sesión</strong>`;
        boto.removeAttribute("href");
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
                    window.location.href = "../../LoginRegistro/components/Login/login.html";
                }
            });
        };
    } else {
        boto.innerHTML = `<i class="bi bi-person-fill letrasLogin me-2"></i> <strong>Iniciar sesión</strong>`;
        boto.setAttribute("href", "../../LoginRegistro/components/Login/login.html");
        boto.onclick = null;
    }
}

document.addEventListener("DOMContentLoaded", actualizarBotonSesion);
