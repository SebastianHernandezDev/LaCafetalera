// Función obtener productos desde JSON local
async function fetchProducts() {
    try {
        // Ruta JSON
        const response = await fetch("../assets/data/products.json");
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo products.json');
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        return [];
    }
}

// Función para inicializar productos, los obtiene del JSON y los guarda en localStorage POR PRIMERA VEZ
async function initializeProducts() {
    const existingProducts = JSON.parse(localStorage.getItem('products')) || [];
    if (existingProducts.length === 0) {
        const defaultProducts = await fetchProducts();
        if (defaultProducts.length > 0) {
            localStorage.setItem('products', JSON.stringify(defaultProducts));
        }
    }
}

// Obtener productos del localStorage
function getProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}

// Guardar productos en localStorage
function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

// Generar ID único.
function generateId() {
    return Date.now() + Math.random();
}

// Estabelcer los productos y definir cantidad de productos
function renderProducts() {
    const products = getProducts();
    const catalogGrid = document.getElementById('catalogGrid');
    
    if (products.length === 0) {
        catalogGrid.innerHTML = '<div class="no-products">No hay productos disponibles en el catálogo.</div>';
        return;
    }

    catalogGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image" 
                onerror="this.src='../assets/img/'">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${parseFloat(product.price).toFixed(3)}</div>
                <button class="btn-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> AGREGAR AL CARRITO
                </button>
            </div>
        </div>
    `).join('');


}

// Agregar al carrito
function addToCart(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // Logica carrito VA AQUI
        alert(`"${product.name}" agregado al carrito!\n(Funcionalidad carrito pendiente a implementación)`);
        
        // Animación del botón de agregar carrito.
        const button = event.target;
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
        button.style.background = 'linear-gradient(135deg, #4CAF50, #66BB6A)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = 'linear-gradient(135deg, #8C5637, #a4a977)';
        }, 1500);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', async function() {
    await initializeProducts();
    renderProducts();
});

