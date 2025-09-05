let imagenBase64 = "";

// 🔄 Inicializar productos desde JSON local y guardar en localStorage si no existen
async function initializeProducts() {
  const existingProducts = JSON.parse(localStorage.getItem("products"));
  if (!existingProducts || existingProducts.length === 0) {
    try {
      const response = await fetch('productos.json');
      if (!response.ok) throw new Error('No se pudo cargar productos.json');
      const productosIniciales = await response.json();
      localStorage.setItem("products", JSON.stringify(productosIniciales));
    } catch (error) {
      console.error("Error cargando productos iniciales:", error);
      // Opcional: inicializar con array vacío
      localStorage.setItem("products", JSON.stringify([]));
    }
  }
}

// 📋 Obtener productos del localStorage
function getProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

// 🖼️ Renderizar todas las cards con id > 10
function renderAllPreviewCards() {
  const productos = getProducts();
  const container = document.getElementById("previewCards");
  container.innerHTML = ""; // Limpiamos antes de renderizar

  productos.forEach(producto => {
    if (Number(producto.id) > 10) {
      renderPreviewCard(producto);
    }
  });
}

// 🖼️ Renderizar una card individual (solo si id > 10)
function renderPreviewCard(producto) {
  if (Number(producto.id) <= 10) return;

  const container = document.getElementById("previewCards");

  // Evitar duplicados
  if (container.querySelector(`.product-card[data-id="${producto.id}"]`)) return;

  const card = document.createElement("div");
  card.className = "product-card col-12 col-md-6 col-lg-4"; 
  card.setAttribute("data-id", producto.id);

  card.innerHTML = `
    <img src="${producto.image}" alt="${producto.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x180?text=Sin+imagen'">
    <div class="product-info">
      <h3 class="product-name">${producto.name}</h3>
      <p class="product-description">${producto.description}</p>
      <p class="product-price">${producto.price} COP</p>      
      <button class="btn-cart eliminar-btn mt-2" data-id="${producto.id}">🗑️ Eliminar</button>
    </div>
  `;

  card.querySelector(".eliminar-btn").addEventListener("click", () => {
    eliminarProducto(producto.id);
  });

  container.appendChild(card);
}

// ➕ Agregar producto desde el formulario
document.getElementById("admin-insert").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const producto = {
    id: Number(formData.get("id")) || Date.now(),
    name: formData.get("name") || "Producto sin nombre",
    price: formData.get("price") || "0",
    description: formData.get("description") || "Sin descripción",
    stock: formData.get("stock") || "-",
    nuevoStock: formData.get("nuevoStock") || "-",
    status: formData.get("status") || "Sin estado",
    imageName: formData.get("imagenProducto")?.name || "",
    image: imagenBase64 || "https://via.placeholder.com/300x180?text=Sin+imagen"
  };

  const guardado = guardarProducto(producto);
  if (guardado && producto.id > 10) {
    renderAllPreviewCards(); // Renderizamos todas las cards para mantener consistencia
  }

  cargarInventario(); // Actualizar tabla

  this.reset();
  document.getElementById("nombreImagen").textContent = "";
  imagenBase64 = "";
});

// 💾 Guardar producto en localStorage
function guardarProducto(producto) {
  const productos = getProducts();
  const existe = productos.some(p => p.id === producto.id);
  if (existe) return false;

  productos.push(producto);
  localStorage.setItem("products", JSON.stringify(productos));
  return true;
}

// 🧹 Eliminar producto
function eliminarProducto(id) {
  let productos = getProducts();
  productos = productos.filter(p => p.id !== Number(id));
  localStorage.setItem("products", JSON.stringify(productos));
  cargarInventario();

  const card = document.querySelector(`.product-card[data-id="${id}"]`);
  if (card) {
    card.remove();
  }
}

// 📋 Cargar inventario en la tabla
function cargarInventario() {
  const productosRaw = getProducts();
  const productos = normalizarProductos(productosRaw);
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
      <td><img src="${producto.image}" alt="${producto.name}" style="width: 50px; height: auto;" onerror="this.src='https://via.placeholder.com/50?text=Sin+imagen'"></td>
      <td>${producto.status}</td>
    `;
    tabla.appendChild(fila);
  });
}

// Normalizar productos para evitar campos vacíos
function normalizarProductos(productos) {
  return productos.map(p => ({
    id: p.id,
    name: p.name || "Producto sin nombre",
    price: p.price || "0",
    description: p.description || "Sin descripción",
    stock: p.stock || "-",
    nuevoStock: p.nuevoStock || "-",
    status: p.status || "Sin estado",
    image: p.image || "https://via.placeholder.com/50?text=Sin+imagen"
  }));
}

// 📷 Manejar la selección de imagen
document.getElementById("imagenProducto").addEventListener("change", function (event) {
  const file = event.target.files[0];
  const nombrePreview = document.getElementById("nombreImagen");

  if (file) {
    nombrePreview.textContent = `📁 Archivo seleccionado: ${file.name}`;
    const reader = new FileReader();
    reader.onload = function (e) {
      imagenBase64 = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    nombrePreview.textContent = "";
    imagenBase64 = "";
  }
});

// 🚀 Inicializar todo al cargar la página
window.addEventListener("DOMContentLoaded", async () => {
  await initializeProducts();
  cargarInventario();
  renderAllPreviewCards();
});