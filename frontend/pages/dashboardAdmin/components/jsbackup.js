let imagenBase64 = "";

// 🔄 Inicializar productos desde localStorage
function initializeProducts() {
  const existingProducts = JSON.parse(localStorage.getItem("products")) || [];
  if (existingProducts.length === 0) {
    localStorage.setItem("products", JSON.stringify([]));
  }
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
    renderPreviewCard(producto); // ✅ Solo si es nuevo y válido
  }

  cargarInventario(); // ✅ Siempre actualiza la tabla

  this.reset();
  document.getElementById("nombreImagen").textContent = "";
  imagenBase64 = "";
});

// 💾 Guardar producto en localStorage
function guardarProducto(producto) {
  const productos = getProducts();
  const existe = productos.some(p => p.id === producto.id);
  if (existe) return false; // ❌ No se guarda

  productos.push(producto);
  localStorage.setItem("products", JSON.stringify(productos));
  return true; // ✅ Producto guardado
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

// 📦 Obtener productos del localStorage
function getProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

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

// 🖼️ Renderizar una card individual (solo si id > 10)
function renderPreviewCard(producto) {
  // ✅ Validamos primero si el producto es válido
  if (Number(producto.id) <= 10) return;

  const container = document.getElementById("previewCards");

  // ✅ Solo limpiamos si vamos a renderizar una nueva card
  container.innerHTML = "";

  const card = document.createElement("div");
  card.className = "product-card narrow-card";
  card.setAttribute("data-id", producto.id);

  card.innerHTML = `
    <img src="${producto.image}" alt="${producto.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x180?text=Sin+imagen'">
    <div class="product-info">
      <h3 class="product-name">${producto.name}</h3>
      <p class="product-description">${producto.description}</p>
      <p class="product-price">${producto.price} COP</p>
      <button class="btn-cart agregar-btn">➕ Agregar a mi inventario</button>
      <button class="btn-cart eliminar-btn mt-2" data-id="${producto.id}">🗑️ Eliminar</button>
    </div>
  `;

  card.querySelector(".agregar-btn").addEventListener("click", () => {
    agregarAlInventario(producto);
  });

  card.querySelector(".eliminar-btn").addEventListener("click", () => {
    eliminarProducto(producto.id);
  });

  container.appendChild(card);
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

function agregarAlInventario(producto) {
  let inventario = JSON.parse(localStorage.getItem("inventario")) || [];

  const existe = inventario.some(item => item.id === producto.id);
  if (existe) {
    alert("Este producto ya está en tu inventario.");
    return;
  }

  inventario.push(producto);
  localStorage.setItem("inventario", JSON.stringify(inventario));
  alert("Producto agregado al inventario ✅");
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

// 🚀 Inicializar todo al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  initializeProducts();
  cargarInventario();
});