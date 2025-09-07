// ====== CATALOGO ======
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
function showcart() {
    const adminbotton = document.getElementById("carritoFlotante");
    if (!adminbotton) return;

    const usuarioJSON = localStorage.getItem("usuarioActivo");
    const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;

    if (!usuario || (usuario.rol && usuario.rol.toLowerCase() !== "admin")) {
        adminbotton.removeAttribute("hidden");
    }

    adminbotton.addEventListener("click", function (event) {
        event.preventDefault(); // ✅ evita que se dispare el offcanvas automáticamente

        if (!usuarioJSON) {
            Swal.fire({
                icon: 'warning',
                title: '¡Atención!',
                text: 'Debes iniciar sesión para usar el carrito.',
                timer: 2500,
                showConfirmButton: false,
                timerProgressBar: true,
                backdrop: true,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                window.location.href = "../../LoginRegistro/components/Login/login.html";
            });
        } else {
            const carritoOffcanvas = document.getElementById('carritoOffcanvas');
            const offcanvas = new bootstrap.Offcanvas(carritoOffcanvas);
            offcanvas.show();
        }
    });
}


function elminarproducto(products) {
    let productos = getProducts();
    productos = productos.filter(p => p.id !== products.id);
    saveProducts(productos);
    renderProducts(productos);
    cargarInventario();
}
// Obtener productos desde JSON local
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

// Inicializar productos si no existen en localStorage
async function initializeProducts() {
    const existingProducts = JSON.parse(localStorage.getItem("products")) || [];
    if (existingProducts.length === 0) {
        const defaultProducts = await fetchProducts();
        if (defaultProducts.length > 0) {
            localStorage.setItem("products", JSON.stringify(defaultProducts));
        }
    }
}

// Obtener productos desde localStorage
function getProducts() {
    return JSON.parse(localStorage.getItem("products")) || [];
}

// Guardar productos en localStorage
function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

// 🔍 Filtro por nombre (sin tildes y sin importar mayúsculas)
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

// 🖼 Renderizar productos
function renderProducts(productos = null) {
    const products = productos || getProducts();
    const catalogGrid = document.getElementById("catalogGrid");
    const isAdmin = localStorage.getItem("usuarioActivo") && JSON.parse(localStorage.getItem("usuarioActivo")).rol === "admin";
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
                ${isAdmin ? 'Eliminar del Catalogo' : 'AGREGAR AL CARRITO'}
            </button>

                </button>
            </div>
        </div>
    `).join('');
}

// 🛒 Agregar al carrito
function addToCart(productId, event) {
    const usuarioJSON = localStorage.getItem("usuarioActivo");

    // ❌ Si NO hay usuario, mostrar alerta y detener
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
            window.location.href = "../../LoginRegistro/";
        });
        return; // ⛔ Importante: NO ejecutar lo que viene después
    }

    // ✅ Usuario logueado, continuar normalmente
    const products = getProducts();
    const product = products.find(p => p.id === productId);

    if (product) {
        agregarAlCarrito(productId); // función externa que ya tienes

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



    // Evento de búsqueda por nombre
    const buscador = document.getElementById("buscadorNombre");
    if (buscador) {
        buscador.addEventListener("input", aplicarFiltroNombre);
    }
});
