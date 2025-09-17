// Función cerrar sesión
function cerrarSesion() {
    Swal.fire({
        title: '¿Deseas cerrar sesión?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then(result => {
        if (result.isConfirmed) {
            localStorage.removeItem("usuarioActivo");
            window.location.href = "/index.html";
        }
    });
}
 
// Asignar listener al botón
const botonCerrar = document.getElementById("botonSesion");
if (botonCerrar) {
    botonCerrar.addEventListener("click", function(e) {
        e.preventDefault();
        cerrarSesion();
    });
}
 
// ---- Resto de tu código: productos, inventario, vista previa, etc ----
// Mantener todo igual que tu versión original
let imagenBase64 = "";
let archivoImagen = null;
let productosEnPreview = [];
 
// Inicializar productos desde JSON local
async function initializeProducts() {
  try {
    const response = await fetch("../assets/data/products.json", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar products.json");

    let productosIniciales = await response.json();

    // Normalización mínima
    productosIniciales = productosIniciales.map(p => ({
      ...p,
      stock: p.stock ?? "100",
      nuevoStock: p.nuevoStock ?? "0",
      status: p.status ?? "Disponible"
    }));

    localStorage.setItem("products", JSON.stringify(productosIniciales));
  } catch (error) {
    console.error("Error cargando productos iniciales:", error);
    localStorage.setItem("products", JSON.stringify([]));
  }
}


// Normalizar productos para usarlos en la tabla
function normalizarProductos(productosRaw) {
  return productosRaw.map(p => ({
    id: p.id ?? p._id ?? "-",
    name: p.name ?? "Sin nombre",
    price: p.price ?? "0",
    image: p.image ?? "./assets/img/default.png",
    description: p.description ?? p.descripcion ?? "Sin descripción",
    // ✅ Igual que en initializeProducts
    stock: (p.stock !== undefined && p.stock !== null && p.stock !== "") ? p.stock : "100",
    nuevoStock: p.nuevoStock ?? "0",
    status: p.status ?? "Disponible"
  }));
}

 
// Obtener productos
function getProducts() {
  const productos = localStorage.getItem("products");
  return productos ? JSON.parse(productos) : [];
}
 
// Renderizar una card individual
function renderPreviewCard(producto) {
  const container = document.getElementById("previewCards");
 
  const card = document.createElement("div");
  card.className = "product-card col-12 col-md-6 col-lg-4 preview";
  card.setAttribute("data-id", producto.id);
 
  card.innerHTML = `
    <img src="${producto.image}" alt="${producto.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x180?text=Sin+imagen'">
    <div class="product-info">
      <h3 class="product-name">${producto.name}</h3>
      <p class="product-description">${producto.description}</p>
      <div class="product-price">
      ${Number(producto.price).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 1 
      })}
      </div>
      <button class="btn-cart eliminar-btn mt-2" data-id="${producto.id}">Eliminar<i class="bi bi-trash3-fill"></i></button>
    </div>
  `;
 
  // Agregar listener para expandir descripción
  const descripcion = card.querySelector(".product-description");
  descripcion.addEventListener("click", () => {
    descripcion.classList.toggle("expandido");
  });
 
  // Evento para eliminar producto de la vista previa
  card.querySelector(".eliminar-btn").addEventListener("click", () => {
    card.classList.add("desaparecer");
    setTimeout(() => card.remove(), 500);
 
    // Eliminar producto del array productosEnPreview
    productosEnPreview = productosEnPreview.filter(p => p.id !== producto.id);
 
    // Si no quedan productos en preview, ocultar botón confirmar guardar
    if (productosEnPreview.length === 0) {
      document.getElementById("confirmar-guardar").classList.remove("visible");
    }
 
    // Actualizar el campo ID visualmente
    actualizarCampoIdPreview();
  });
 
  container.appendChild(card);
}
 
// ➕ Generar vista previa sin guardar (agregar múltiples productos)
const formAdminInsert = document.getElementById("admin-insert");
formAdminInsert.addEventListener("submit", function (e) {
  e.preventDefault();
 
  const agregarProducto = (base64) => {
    const formData = new FormData(this);
    const campoId = document.getElementById("campo-id");
    const idGenerado = Number(campoId.value.replace("ID ", "")) || 1;
 
    const nuevoProducto = {
      id: idGenerado,
      name: formData.get("name") || "Producto sin nombre",
      price: formData.get("price") || "0",
      description: formData.get("description") || "Sin descripción",
      stock: formData.get("stock") || "-",
      nuevoStock: formData.get("nuevoStock") || "-",
      status: formData.get("status") || "Sin estado",
      imageName: archivoImagen?.name || "",
      image: base64 || "https://via.placeholder.com/300x180?text=Sin+imagen"
    };
 
    productosEnPreview.push(nuevoProducto);
    renderPreviewCard(nuevoProducto);
 
    // Limpiar formulario
    this.reset();
    document.getElementById("nombreImagen").textContent = "";
    imagenBase64 = "";
    archivoImagen = null;
 
    // Actualizar el campo ID al siguiente valor
    campoId.value = `ID ${idGenerado + 1}`;
 
    // Mostrar botón confirmar guardar para guardar todos los productos en preview
    document.getElementById("confirmar-guardar").classList.add("visible");
  };
 
  if (archivoImagen) {
    const reader = new FileReader();
    reader.onload = function (e) {
      agregarProducto(e.target.result);
    };
    reader.readAsDataURL(archivoImagen);
  } else {
    agregarProducto("");
  }
});
 
// ✅ Confirmar y guardar todos los productos en preview
function confirmarGuardarHandler() {
  if (productosEnPreview.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: '⚠️ No hay productos en vista previa para guardar.'
    });
    return;
  }
 
  let productosGuardados = getProducts();
 
  // Evitar IDs duplicados
  const idsGuardados = new Set(productosGuardados.map(p => p.id));
  const productosNuevos = productosEnPreview.filter(p => !idsGuardados.has(p.id));
 
  if (productosNuevos.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: '⚠️ Todos los productos en vista previa ya existen.'
    });
    return;
  }
 
  productosGuardados = productosGuardados.concat(productosNuevos);
  localStorage.setItem("products", JSON.stringify(productosGuardados));
 
  cargarInventario();
 
  // Limpiar preview
  productosEnPreview = [];
  const container = document.getElementById("previewCards");
  container.innerHTML = "";
 
  const btnConfirmarGuardar = document.getElementById("confirmar-guardar");
  btnConfirmarGuardar.classList.remove("visible");
  formAdminInsert.reset();
  document.getElementById("nombreImagen").textContent = "";
  imagenBase64 = "";
 
  generarIdInventario();
 
  Swal.fire({
    icon: 'success',
    title: 'Guardado',
    text: '✅ Productos guardados correctamente.',
    timer: 2000,
    showConfirmButton: false
  });
}
 
// 📋 Cargar inventario en tabla
function cargarInventario() {
  const productosRaw = getProducts();  
  const productos = normalizarProductos(productosRaw);
  const tabla = document.getElementById("cuerpo-tabla-inventario");
  tabla.innerHTML = "";
 
  productos.forEach(producto => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td data-label="Id">${producto.id}</td>
      <td data-label="Nombre del Producto">${producto.name}</td>
      <td data-label="Precio (COP)">
      ${producto.price.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
      })}
      </td>
      <td data-label="Descripción del Producto" class="descripcion-truncada">
        <span class="texto-corto">${producto.description}</span>
        <span class="texto-completo d-none">${producto.description}</span>
        <button class="ver-mas-btn">Ver más</button>
      </td>
      <td data-label="Stock Actual">${producto.stock}</td>
      <td data-label="Nuevo Stock">${producto.nuevoStock}</td>
      <td data-label="Imagen"><img src="${producto.image}" alt="${producto.name}" style="width: 50px;"></td>
      <td data-label="Estado mercancía">${producto.status}</td>
      <td data-label="Acciones"><button class="btn-eliminar btn btn-danger btn-sm" data-id="${producto.id}">Eliminar</button></td>
    `;
 
    tabla.appendChild(fila);
  });
  conectarBotonesEliminar();
  conectarBotonesVerMas();

}


 
// 📷 Imagen base64
document.getElementById("imagenProducto").addEventListener("change", function (event) {
  archivoImagen = event.target.files[0];
  const nombrePreview = document.getElementById("nombreImagen");
  if (archivoImagen) {
    nombrePreview.textContent = `📁 Archivo seleccionado: ${archivoImagen.name}`;
  } else {
    nombrePreview.textContent = "";
    imagenBase64 = "";
  }
});
 
// 📊 Actualizar resumen inventario
document.getElementById("actualizar-inventario").addEventListener("click", () => {
  const data = localStorage.getItem("products");
  if (!data) return;
 
  const inventario = JSON.parse(data);
  const totalProductos = inventario.length;
  let sumaPrecios = 0;
 
  inventario.forEach(item => {
    const precio = parseFloat(item.price);
    if (!isNaN(precio)) sumaPrecios += precio;
  });
 
  const promedioPrecio = sumaPrecios / totalProductos;
 
  animarCampo("total-registros", totalProductos);
  animarCampo("valor-total", `$${sumaPrecios.toLocaleString("es-CO")}`);
  animarCampo("precio-promedio", promedioPrecio.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0
  }));
}); 

// ✨ Animación de campos
const animarCampo = (id, valor) => {
  const campo = document.getElementById(id);
  campo.textContent = valor;
  campo.classList.add("actualizado");
  setTimeout(() => campo.classList.remove("actualizado"), 800);
};

 
// 🆔 Generar nuevo ID
function generarIdInventario() {
  const productos = getProducts();
  const ids = productos.map(p => Number(p.id)).filter(id => !isNaN(id));
  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  const nuevoId = maxId + 1;
 
  const campoId = document.getElementById("campo-id");
  if (campoId) campoId.value = `ID ${nuevoId}`;
}
 
// Eliminar producto del inventario
function eliminarProducto(id) {
  Swal.fire({
    title: `¿Eliminar el producto con ID ${id}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      let productos = getProducts();
      productos = productos.filter(p => Number(p.id) !== id);
      localStorage.setItem("products", JSON.stringify(productos));
 
      cargarInventario();
      generarIdInventario();
 
      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: `🗑️ Producto con ID ${id} eliminado correctamente.`,
        timer: 2000,
        showConfirmButton: false
      });
    }
  });
}
 
// Conectar botones eliminar en tabla
function conectarBotonesEliminar() {
  const botonesEliminar = document.querySelectorAll(".btn-eliminar");
  botonesEliminar.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-id"));
      eliminarProducto(id);
    });
  });
}
 
// Actualizar campo ID en preview
function actualizarCampoIdPreview() {
  const campoId = document.getElementById("campo-id");
  const idsPreview = productosEnPreview.map(p => Number(p.id)).filter(id => !isNaN(id));
  const maxIdPreview = idsPreview.length > 0 ? Math.max(...idsPreview) : getMaxIdInventario();
  const nuevoId = maxIdPreview + 1;
  campoId.value = `ID ${nuevoId}`;
}
 
function getMaxIdInventario() {
  const productos = getProducts();
  const ids = productos.map(p => Number(p.id)).filter(id => !isNaN(id));
  return ids.length > 0 ? Math.max(...ids) : 0;
}
 
// Contador de caracteres para descripción
const descripcionInput = document.getElementById("description");
const contador = document.createElement("small");
contador.id = "contador-caracteres";
descripcionInput.parentNode.appendChild(contador);
 
descripcionInput.addEventListener("input", () => {
  const max = descripcionInput.getAttribute("maxlength");
  const actual = descripcionInput.value.length;
  contador.textContent = `Caracteres: ${actual}/${max}`;
});
 
// Inicialización al cargar la página
window.addEventListener("DOMContentLoaded", async () => {
  await initializeProducts();
  cargarInventario();
  generarIdInventario();
  document.getElementById("confirmar-guardar").classList.remove("visible");
 
  // Asignar listener al botón confirmar-guardar
  const btnConfirmarGuardar = document.getElementById("confirmar-guardar");
  if (btnConfirmarGuardar) {
    btnConfirmarGuardar.addEventListener("click", confirmarGuardarHandler);
  }
});
function conectarBotonesVerMas() {
  document.querySelectorAll('.ver-mas-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const td = btn.closest('.descripcion-truncada');
      td.querySelector('.texto-corto').classList.add('d-none');
      td.querySelector('.texto-completo').classList.remove('d-none');
      btn.style.display = 'none';
    });
  });
}