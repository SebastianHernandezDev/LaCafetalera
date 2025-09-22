// ====== CATALOGO ======

function AdminPanel() {
    const boto = document.getElementById("botonSesion");
    if (!boto) return;

    const usuarioJSON = localStorage.getItem("usuarioActivo");
    if (!usuarioJSON) {
        boto.setAttribute("href", "../../LoginRegistro/components/Login/login.html");
        boto.innerHTML = `<i class="bi bi-person-fill letrasLogindebes iniciarme-2"></i><strong>Iniciar Sesión</strong>`;
        boto.onclick = null;
        return;
    }

    const usuario = JSON.parse(usuarioJSON);

    if (usuario.rol && usuario.rol.toLowerCase() === "admin") {
        boto.setAttribute("href", "../../dashboardAdmin/components/dashboard.html");
        boto.innerHTML = `<i class="bi bi-speedometer2 me-2"></i><strong>Admin Panel</strong>`;
        boto.onclick = null;
    } else {
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
                    localStorage.removeItem("cart");
                    window.location.href = "/frontend/pages/LoginRegistro/components/Login/login.html";
                }
            });
        };
    }
}

function showcart() {
    const carritoBtn = document.getElementById("carritoFlotante");
    const carritoOffcanvas = document.getElementById("carritoOffcanvas");
    if (!carritoBtn || !carritoOffcanvas) return;

    const usuarioJSON = localStorage.getItem("usuarioActivo");
    const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;

    if (!usuario || (usuario.rol && usuario.rol.toLowerCase() === "admin")) {
        carritoBtn.setAttribute("hidden", "true");
        return;
    }

    carritoBtn.removeAttribute("hidden");

    // Evento de clic para mostrar el carrito
    carritoBtn.addEventListener("click", function (event) {
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
            const offcanvas = new bootstrap.Offcanvas(carritoOffcanvas);
            offcanvas.show();
        }
    });

    // Al abrir el carrito, ocultar el botón flotante
    carritoOffcanvas.addEventListener("show.bs.offcanvas", () => {
        carritoBtn.setAttribute("hidden", "true");
    });

    // Al cerrar el carrito, volver a mostrar el botón flotante
    carritoOffcanvas.addEventListener("hidden.bs.offcanvas", () => {
        carritoBtn.removeAttribute("hidden");
    });
}


async function eliminarProducto(productId) {
    try {
        const token = localStorage.getItem("token"); // Solo si usas auth
        const res = await fetch(`http://localhost:8080/productos/${productId}`, {
            method: "DELETE",
            headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });

        if (!res.ok) throw new Error(`No se pudo eliminar el producto ${productId}`);

        Swal.fire("Eliminado", "El producto fue eliminado correctamente.", "success");

        // Recargar productos desde el backend después de eliminar
        const productos = await fetchProducts();
        saveProducts(productos);
        renderProducts(productos);
    } catch (err) {
        console.error(err);
        Swal.fire("Error", `No se pudo eliminar el producto ${productId}`, "error");
    }
}

async function fetchProducts() {
    try {
        const res = await fetch("http://localhost:8080/productos");
        if (!res.ok) throw new Error("No se pudieron cargar los productos del backend");

        const data = await res.json();

        const productos = data.map(p => ({
            id: p.id || p.id_producto, // Usa el campo que tengas en tu entidad
            name: p.nombre || "Producto sin nombre",
            description: p.descripcion || "Sin descripción",
            image: p.imagen || "../assets/img/placeholder.png",
            price: Number(p.precioUnitario) || 0
        }));

        localStorage.setItem("products", JSON.stringify(productos));
        return productos;
    } catch (err) {
        console.error("Error al obtener productos:", err);
        return [];
    }
}

async function initializeProducts() {
    const productos = await fetchProducts();
    saveProducts(productos); // mantiene tu estructura local
}

function getProducts() {
    return JSON.parse(localStorage.getItem("products")) || [];
}

function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

function aplicarFiltroNombre() {
    const input = document.getElementById("buscadorNombre").value;

    const normalizar = str =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const nombreBuscado = normalizar(input);
    const productos = getProducts();

    const productosFiltrados = productos.filter(producto => {
        const nombreNormalizado = normalizar(producto.name);
        return nombreNormalizado.includes(nombreBuscado);
    });

    renderProducts(productosFiltrados);
}

function renderProducts(productos = null) {
    const products = productos || getProducts();
    const catalogGrid = document.getElementById("catalogGrid");
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
    const isAdmin = usuario && usuario.rol === "admin";

    if (!catalogGrid) return;

    if (products.length === 0) {
        catalogGrid.innerHTML = `<div class="no-products">No hay productos disponibles.</div>`;
        return;
    }

    catalogGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image"
                onerror="this.src='../assets/img/placeholder.png'">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                ${isAdmin
            ? `<button class="btn-delete-product" data-id="${product.id}">
                         <i class="fas fa-trash"></i> Eliminar del Catálogo
                       </button>`
            : `<button class="btn-cart" onclick="addToCart(${product.id}, event)">
                         <i class="fas fa-shopping-cart"></i> AGREGAR AL CARRITO
                       </button>`
        }
            </div>
        </div>
    `).join('');

    if (isAdmin) {
        document.querySelectorAll('.btn-delete-product').forEach(button => {
            button.addEventListener('click', function () {
                const id = Number(this.getAttribute('data-id'));

                Swal.fire({
                    title: "¿Estás seguro?",
                    text: "Esta acción eliminará el producto del catálogo.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, eliminar",
                    cancelButtonText: "Cancelar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        let productos = getProducts();
                        productos = productos.filter(p => Number(p.id) !== id);
                        saveProducts(productos);
                        renderProducts(productos);

                        Swal.fire("Eliminado", "El producto fue eliminado correctamente.", "success");
                    }
                });
            });
        });
    }
}

function addToCart(productId, event) {
    const usuarioJSON = localStorage.getItem("usuarioActivo");

    if (!usuarioJSON) {
        event.preventDefault();
        Swal.fire({
            icon: 'warning',
            title: '¡Atención!',
            text: 'Debes iniciar sesión para agregar productos al carrito.',
            timer: 2500,
            showConfirmButton: false,
            timerProgressBar: true,
            backdrop: true,
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(() => {
            window.location.href = "/frontend/pages/LoginRegistro/components/Login/login.html";
        });
        return;
    }

    const products = getProducts();
    const product = products.find(p => p.id === productId);

    if (product) {
        agregarAlCarrito(productId);

        const button = event.target.closest("button");
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
        button.style.background = 'linear-gradient(135deg, #4CAF50, #66BB6A)';

        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '#8C5637';
        }, 1500);
    }
}

// 🚀 Inicialización
document.addEventListener("DOMContentLoaded", async () => {
    showcart();
    await initializeProducts();
    renderProducts();
    AdminPanel();

    const buscador = document.getElementById("buscadorNombre");
    if (buscador) {
        buscador.addEventListener("input", aplicarFiltroNombre);
    }
});
