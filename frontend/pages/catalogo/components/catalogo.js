// ====== PANEL ADMIN ======
function AdminPanel() {
    const boto = document.getElementById("botonSesion");
    if (!boto) return;

    const usuarioJSON = localStorage.getItem("usuarioActivo");
    if (!usuarioJSON) return;

    const usuario = JSON.parse(usuarioJSON);
    if (usuario.rol && usuario.rol.toLowerCase() === "admin") {
        boto.setAttribute("href", "../../dashboardAdmin/components/dashboard.html");
        boto.innerHTML = `<i class="bi bi-speedometer2 letrasLogin me-2"></i> <strong>Admin Panel</strong>`;
    }
}

// ====== BOTÓN CARRITO FLOTANTE ======
function showcart() {
    const adminbotton = document.getElementById("carritoFlotante");
    if (!adminbotton) return;

    const usuarioJSON = localStorage.getItem("usuarioActivo");
    const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;

    // Mostrar botón solo si NO es admin
    if (!usuario || (usuario.rol && usuario.rol.toLowerCase() !== "admin")) {
        adminbotton.removeAttribute("hidden");
    }

    adminbotton.addEventListener("click", function (event) {
        event.preventDefault();

        if (!usuarioJSON) {
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
                    window.location.href = "../../LoginRegistro/components/Login/login.html";
                }
            });
        } else {
            const carritoOffcanvas = document.getElementById('carritoOffcanvas');
            const offcanvas = new bootstrap.Offcanvas(carritoOffcanvas);
            offcanvas.show();
        }
    });
}

// ====== PRODUCTOS ======
async function fetchProducts() {
    try {
        const response = await fetch("../assets/data/products.json");
        if (!response.ok) throw new Error("No se pudo cargar el archivo products.json");
        return await response.json();
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        return [];
    }
}

async function initializeProducts() {
    const existingProducts = JSON.parse(localStorage.getItem("products")) || [];
    if (existingProducts.length === 0) {
        const defaultProducts = await fetchProducts();
        if (defaultProducts.length > 0) {
            localStorage.setItem("products", JSON.stringify(defaultProducts));
        }
    }
}

function getProducts() {
    return JSON.parse(localStorage.getItem("products")) || [];
}

function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

// ====== ELIMINAR PRODUCTO (ADMIN) ======
function eliminarProducto(productId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar el producto con ID ${productId}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let productos = getProducts();
            productos = productos.filter(p => p.id !== productId);
            saveProducts(productos);
            renderProducts();
            cargarInventario?.();

            Swal.fire({
                icon: 'success',
                title: '¡Eliminado!',
                text: `El producto con ID ${productId} ha sido eliminado del catálogo.`,
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true
            });
        }
    });
}

// ====== RENDER DE PRODUCTOS ======
function renderProducts(productos = null) {
    const products = productos || getProducts();
    const catalogGrid = document.getElementById("catalogGrid");
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo") || "{}");
    const isAdmin = usuario.rol === "admin";

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
                <button class="${isAdmin ? 'btn-disabled' : 'btn-cart'}"
                    onclick="${isAdmin ? `eliminarProducto(${product.id})` : `addToCart(${product.id}, event)`}">
                    <i class="fas fa-${isAdmin ? 'trash' : 'shopping-cart'}"></i>
                    ${isAdmin ? 'Eliminar del Catálogo' : 'AGREGAR AL CARRITO'}
                </button>
            </div>
        </div>
    `).join('');
}

// ====== FILTRO DE BÚSQUEDA ======
function aplicarFiltroNombre() {
    const input = document.getElementById("buscadorNombre").value;
    const normalizar = str => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const nombreBuscado = normalizar(input);
    const productos = getProducts();

    const productosFiltrados = productos.filter(producto => {
        const nombreNormalizado = normalizar(producto.name);
        return nombreNormalizado.includes(nombreBuscado);
    });

    renderProducts(productosFiltrados);
}

// ====== AGREGAR AL CARRITO ======
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
            allowEscapeKey: false,
            didClose: () => {
                window.location.href = "../../LoginRegistro/components/Login/login.html";
            }
        });
        return;
    }

    const products = getProducts();
    const product = products.find(p => p.id === productId);

    if (product) {
        agregarAlCarrito?.(productId);

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

// ====== INICIALIZACIÓN GENERAL ======
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
