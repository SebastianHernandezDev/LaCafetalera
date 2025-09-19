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
        return;
    }

    boto.removeAttribute("href");
    boto.innerHTML = `<i class="bi bi-box-arrow-right me-2"></i><strong>Cerrar Sesión</strong>`;
    boto.onclick = function (e) {
        e.preventDefault();
        Swal.fire({
            title: '¿Deseas cerrar sesión?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-popup',
                title: 'swal2-title',
                htmlContainer: 'swal2-html-container',
                confirmButton: 'swal2-confirm',
                cancelButton: 'swal2-cancel'
            }
        }).then(result => {
            if (result.isConfirmed) {
                localStorage.removeItem("usuarioActivo");
                window.location.href = "http://127.0.0.1:5501/frontend/pages/LoginRegistro/components/Login/login.html";
            }
        });
    };
}

function showcart() {
    const adminbotton = document.getElementById("carritoFlotante");
    if (!adminbotton) return;

    const usuarioJSON = localStorage.getItem("usuarioActivo");

    if (!usuarioJSON) {
        adminbotton.setAttribute("hidden", "true");
        return;
    }

    const usuario = JSON.parse(usuarioJSON);

    if (usuario.rol && usuario.rol.toLowerCase() === "admin") {
        adminbotton.setAttribute("hidden", "true");
    } else {
        adminbotton.removeAttribute("hidden");
    }

    adminbotton.addEventListener("click", function (event) {
        event.preventDefault();

        const currentUser = localStorage.getItem("usuarioActivo");
        if (!currentUser) {
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
                customClass: {
                    popup: 'swal2-popup',
                    title: 'swal2-title',
                    htmlContainer: 'swal2-html-container'
                },
                didClose: () => {
                    window.location.href = "/frontend/pages/LoginRegistro/components/Login/login.html";
                }
            });
        } else {
            const carritoOffcanvas = document.getElementById('carritoOffcanvas');
            const offcanvas = new bootstrap.Offcanvas(carritoOffcanvas);
            offcanvas.show();
        }
    });
}

function eliminarProducto(productId) {
    let productos = getProducts();
    productos = productos.filter(p => Number(p.id) !== Number(productId));
    saveProducts(productos);
    renderProducts(productos);
}

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
            const productsWithIds = defaultProducts.map((product, index) => ({
                ...product,
                id: product.id || index + 1
            }));
            localStorage.setItem("products", JSON.stringify(productsWithIds));
        }
    }
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
                    cancelButtonText: "Cancelar",
                    customClass: {
                        popup: 'swal2-popup',
                        title: 'swal2-title',
                        htmlContainer: 'swal2-html-container',
                        confirmButton: 'swal2-confirm',
                        cancelButton: 'swal2-cancel'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        let productos = getProducts();
                        productos = productos.filter(p => Number(p.id) !== id);
                        saveProducts(productos);
                        renderProducts(productos);

                        Swal.fire({
                            title: "Eliminado",
                            text: "El producto fue eliminado correctamente.",
                            icon: "success",
                            customClass: {
                                popup: 'swal2-popup',
                                title: 'swal2-title',
                                htmlContainer: 'swal2-html-container',
                                confirmButton: 'swal2-confirm'
                            },
                            timer: 2000,
                            showConfirmButton: false
                        });
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
            allowEscapeKey: false,
            customClass: {
                popup: 'swal2-popup',
                title: 'swal2-title',
                htmlContainer: 'swal2-html-container'
            }
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
