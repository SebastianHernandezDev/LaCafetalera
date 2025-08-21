let imagenBase64 = "";

// 🔄 Inicializar productos desde localStorage
function initializeProducts() {
  const existingProducts = JSON.parse(localStorage.getItem("products")) || [];
  if (existingProducts.length === 0) {
    localStorage.setItem("products", JSON.stringify([])); // Inicializa vacío si no hay productos
  }
}

// ➕ Agregar producto desde el formulario
document.getElementById("admin-insert").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const producto = {
    id: formData.get("id"),
    name: formData.get("name"),
    price: formData.get("price"),
    description: formData.get("description"),
    stock: formData.get("stock"),
    nuevoStock: formData.get("nuevoStock"),
    status: formData.get("status"),
    imageName: formData.get("imagenProducto")?.name || "",
    image: imagenBase64
  };

  guardarProducto(producto);           // Guarda en localStorage
  renderPreviewCard(producto);         // Muestra la card
  cargarInventario();                  // Actualiza la tabla

  this.reset();                        // Limpia el formulario
  document.getElementById("nombreImagen").textContent = "";
  imagenBase64 = "";                   // Reinicia la imagen
});

// 💾 Guardar producto en localStorage
function guardarProducto(producto) {
  const productos = getProducts();
  productos.push(producto);
  localStorage.setItem("products", JSON.stringify(productos));
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

// 🖼️ Renderizar todas las cards de vista previa
function renderAllPreviewCards() {
  const container = document.getElementById("previewCards");
  container.innerHTML = "";
  const productos = getProducts();
  productos.forEach(renderPreviewCard);
  activarBotonesEliminar(); // 
}
// 🖼️ Renderizar una card individual
function renderPreviewCard(producto) {
  const container = document.getElementById("previewCards");

  const card = document.createElement("div");
  card.className = "col-md-4 fade-in";

  card.innerHTML = `
    <div class="card h-100">
      <img src="${producto.image}" class="card-img-top" alt="${producto.name}" onerror="this.src='https://via.placeholder.com/300x180?text=Sin+imagen'">
      <div class="card-body">
        <h5 class="card-title">${producto.name}</h5>
        <p class="card-text text-truncate" title="${producto.description}">${producto.description}</p>
        <p class="card-text"><strong>Precio:</strong> ${producto.price} COP</p>
        <p class="card-text"><strong>Stock:</strong> ${producto.stock} → ${producto.nuevoStock}</p>
        <span class="badge bg-secondary">${producto.status}</span>
        <button class="btn btn-sm btn-danger mt-3 eliminar-btn" data-id="${producto.id}">🗑️ Eliminar</button>
      </div>
    </div>
  `;

  container.appendChild(card);
}

function activarBotonesEliminar() {
  const botones = document.querySelectorAll(".eliminar-btn");
  botones.forEach(boton => {
    boton.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      eliminarProducto(id);
    });
  });
}

function eliminarProducto(id) {
  let productos = getProducts();
  productos = productos.filter(p => p.id !== id);
  localStorage.setItem("products", JSON.stringify(productos));
  renderAllPreviewCards(); // Actualiza cards
  cargarInventario();      // Actualiza tabla
}

// 📋 Cargar inventario en la tabla
function cargarInventario() {
  const productos = getProducts();
  const tabla = document.getElementById("tabla-inventario");
  tabla.innerHTML = "";

  productos.forEach(producto => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${producto.id}</td>
      <td>${producto.name}</td>
      <td>${producto.price}</td>
      <td>${producto.description}</td>
      <td>${producto.stock || "-"}</td>
      <td>${producto.nuevoStock || "-"}</td>
      <td><img src="${producto.image}" alt="${producto.name}" style="width: 50px; height: auto;" onerror="this.src='https://via.placeholder.com/50?text=Sin+imagen'"></td>
      <td>${producto.status}</td>
    `;
    tabla.appendChild(fila);
  });
}

// 🚀 Inicializar todo al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  initializeProducts();
  renderAllPreviewCards();
  cargarInventario();
});