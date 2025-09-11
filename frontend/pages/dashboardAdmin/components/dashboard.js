// ====== CATALOGO ======
function AdminPanel() {
    const boto = document.getElementById("botonSesion");
    if (!boto) return;

    const usuarioJSON = localStorage.getItem("usuarioActivo");

    // Si NO hay usuario, mostrar botón para iniciar sesión
    if (!usuarioJSON) {
        boto.setAttribute("href", "../../LoginRegistro/components/Login/login.html");
        boto.innerHTML = `<i class="bi bi-person-fill letrasLogindebes iniciarme-2"></i><strong>Iniciar Sesión</strong>`;
        boto.onclick = null; // Limpia cualquier evento anterior
        return;
    }

    const usuario = JSON.parse(usuarioJSON);

    // Si es admin, mostrar botón para ir al panel admin
    if (usuario.rol && usuario.rol.toLowerCase() === "admin") {
        boto.setAttribute("href", "../../dashboardAdmin/components/dashboard.html");
        boto.innerHTML = `<i class="bi bi-speedometer2 me-2"></i><strong>Admin Panel</strong>`;
        boto.onclick = null; // Limpia cualquier evento anterior
        return;
    }


    boto.removeAttribute("href"); // Quita el href para que use el onclick
    boto.innerHTML = `<i class="bi bi-box-arrow-right me-2"></i><strong>Cerrar Sesión</strong>`;
    boto.onclick = function (e) {
        e.preventDefault();
        Swal.fire({
            title: '¿Deseas cerrar sesión?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then(result => {
            if (result.isConfirmed) {
                localStorage.removeItem("usuarioActivo");
                window.location.href = "http://127.0.0.1:5501/frontend/pages/LoginRegistro/components/Login/login.html";
            }
        });
    };
}
let imagenBase64 = "";
let productosEnPreview = [];

// Inicializar productos desde JSON local
async function initializeProducts() {
  const existingProducts = JSON.parse(localStorage.getItem("products"));
  if (!existingProducts || existingProducts.length === 0) {
    try {
      const response = await fetch("../assets/data/products.json");
      if (!response.ok) throw new Error('No se pudo cargar productos.json');
      const productosIniciales = await response.json();
      localStorage.setItem("products", JSON.stringify(productosIniciales));
    } catch (error) {
      console.error("Error cargando productos iniciales:", error);
      localStorage.setItem("products", JSON.stringify([]));
    }
  }
}

// Obtener productos
function getProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
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
      <div class="product-price">$${parseFloat(producto.price).toFixed(2)}</div>
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
    imageName: formData.get("imagenProducto")?.name || "",
    image: imagenBase64 || "https://via.placeholder.com/300x180?text=Sin+imagen"
  };

  productosEnPreview.push(nuevoProducto);
  renderPreviewCard(nuevoProducto);

  // Limpiar formulario
  this.reset();
  document.getElementById("nombreImagen").textContent = "";
  imagenBase64 = "";

  // Actualizar el campo ID al siguiente valor
  campoId.value = `ID ${idGenerado + 1}`;

  // Mostrar botón confirmar guardar para guardar todos los productos en preview
  document.getElementById("confirmar-guardar").classList.add("visible");
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
      <td><img src="${producto.image}" alt="${producto.name}" style="width: 50px;" onerror="this.src='https://via.placeholder.com/50?text=Sin+imagen'"></td>
      <td>${producto.status}</td>
      <td><button class="btn-eliminar btn btn-danger btn-sm" data-id="${producto.id}"><i class="bi bi-trash3-fill"></i></button></td>
    `;

    tabla.appendChild(fila);
  });
  conectarBotonesEliminar();
}

// 🧼 Normalizar producto
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

// 📷 Imagen base64
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

  const promedioPrecio = (sumaPrecios / totalProductos).toFixed(2);

  animarCampo("total-registros", totalProductos);
  animarCampo("valor-total", `$${sumaPrecios.toLocaleString("es-CO")}`);
  animarCampo("precio-promedio", `$${promedioPrecio}`);
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
