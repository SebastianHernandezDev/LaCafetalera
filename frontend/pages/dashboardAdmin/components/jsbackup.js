


















let imagenBase64 = "";

// 🔄 Cargar productos desde archivo JSON si localStorage está vacío
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



// 💾 Guardar producto en localStorage
function guardarProducto(producto) {
  const productos = JSON.parse(localStorage.getItem("products")) || [];
  productos.push(producto);
  localStorage.setItem("products", JSON.stringify(productos));
}

// 📋 Mostrar productos en la tabla
function cargarInventario() {
  const productos = JSON.parse(localStorage.getItem("products")) || [];
  const tabla = document.getElementById("tabla-inventario");
  tabla.innerHTML = "";

  productos.forEach(producto => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${producto.id}</td>
      <td>${producto.name}</td>
      <td>${producto.price}</td>
      <td>${producto.description}</td>
      <td>${producto.stock}</td>
      <td>${producto.nuevoStock}</td>
      <td>${producto.imageName || "Sin imagen"}</td>
      <td>${producto.status}</td>
    `;
    tabla.appendChild(fila);
  });
}



// 🚀 Inicializar todo al cargar la página
window.addEventListener("DOMContentLoaded", async () => {
  await initializeProducts();
  cargarInventario();
});

window.addEventListener("DOMContentLoaded", async () => {
  await initializeProducts();
  cargarInventario();
  renderAllPreviewCards();
});

function renderAllPreviewCards() {
  const productos = JSON.parse(localStorage.getItem("products")) || [];
  productos.forEach(renderPreviewCard);
}

function renderPreviewCard(producto) {
  const container = document.getElementById("previewCards");

  const card = document.createElement("div");
  card.className = "col-md-4";

  card.innerHTML = `
    <div class="card h-100">
      <img src="${producto.image}" class="card-img-top" alt="${producto.name}" onerror="this.src='https://via.placeholder.com/300x180?text=Sin+imagen'">
      <div class="card-body">
        <h5 class="card-title">${producto.name}</h5>
        <p class="card-text">${producto.description}</p>
        <p class="card-text"><strong>Precio:</strong> ${producto.price} COP</p>
        <p class="card-text"><strong>Stock:</strong> ${producto.stock} → ${producto.nuevoStock}</p>
        <span class="badge bg-secondary">${producto.status}</span>
      </div>
    </div>
  `;

  container.appendChild(card);
}

















async function fetchProducts() {
    try {
        // Busca ruta JSON
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
 
// Función para inicializar productos, obteniéndolos del JSON y guardándolos en localStorage PRIMERA VEZ
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
 
// Generar ID único (se mantiene por si acaso)
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
                onerror="this.src=''">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${parseFloat(product.price).toFixed(3)}</div>
                <button class="btn-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                </button>
            </div>
        </div>
    `).join('');
 
}