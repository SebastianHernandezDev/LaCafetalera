// ====== CATALOGO ======

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
                <button class="btn-cart" onclick="addToCart(${product.id}, event)">
                    <i class="fas fa-shopping-cart"></i> AGREGAR AL CARRITO
                </button>
            </div>
        </div>
    `).join('');
}

// 🛒 Agregar al carrito
function addToCart(productId, event) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);

    if (product) {
        agregarAlCarrito(productId); // función externa

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
    await initializeProducts();
    renderProducts();

    // Evento de búsqueda por nombre
    const buscador = document.getElementById("buscadorNombre");
    if (buscador) {
        buscador.addEventListener("input", aplicarFiltroNombre);
    }
});
