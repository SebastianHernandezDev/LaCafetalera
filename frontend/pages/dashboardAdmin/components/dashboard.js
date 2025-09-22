// ---------------- URLs Backend ----------------
const CATEGORIAS_URL = "http://localhost:8080/categorias";
const PRODUCTOS_URL = "http://localhost:8080/productos";

// ---------------- Variables globales ----------------
let productosEnPreview = [];
let archivoImagen = null;
let imagenBase64 = "";

// ---------------- Funciones Backend ----------------

// Cargar categorías (sin token)
async function cargarCategorias() {
  try {
    const res = await fetch(CATEGORIAS_URL);
    if (!res.ok) throw new Error("No se pudieron cargar las categorías");
    const categorias = await res.json();

    console.log("Categorías cargadas:", categorias); // depuración

    const select = document.getElementById("select-categoria");
    select.innerHTML = `<option value="">Seleccione una categoría</option>`;
    categorias.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.idCategoria;             // CORREGIDO
      option.textContent = cat.nombreCategoria;  // CORRECTO
      select.appendChild(option);
    });
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "No se pudieron cargar las categorías", "error");
  }
}

// Obtener productos (requiere token)
async function getProductsFromBackend() {
  try {
    const res = await fetch(PRODUCTOS_URL, {
      credentials: "omit" // ← para que no envíe cookies/session
    });
    if (!res.ok) throw new Error("Error al obtener productos del backend");

    const data = await res.json();
    console.log("Datos crudos del backend:", data);
    return data;
  } catch (err) {
    console.error("Error en getProductsFromBackend:", err);
    return []; // para que no devuelva null
  }
}
// Guardar producto (POST)
async function saveProductBackend(productoDTO) {
  try {
    const res = await fetch(PRODUCTOS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": "" // ← explícitamente evita token
      },
      body: JSON.stringify(productoDTO),
      credentials: "omit" // <----- CRUCIAL: NO ENVÍES COOKIES NI HEADERS DE SESIÓN
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error del backend:", res.status, res.statusText, errorText);
      throw new Error("Error guardando producto");
    }

    return await res.json();

  } catch (err) {
    console.error("Error en saveProductBackend:", err);
    Swal.fire("Error", "No se pudo guardar el producto", "error");
  }
}

// Eliminar producto
async function deleteProductBackend(id) {
  try {
    const res = await fetch(`${PRODUCTOS_URL}/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Error eliminando producto");
  } catch (err) {
    console.error(err);
    Swal.fire("Error", `No se pudo eliminar el producto ${id}`, "error");
  }
}


/// ---------------- Renderizado ----------------
function renderPreviewCard(producto) {
  const container = document.getElementById("previewCards");
  const card = document.createElement("div");
  card.className = "product-card col-12 col-md-6 col-lg-4 preview";
  card.setAttribute("data-id", producto.id);

  card.innerHTML = `
    <img src="${producto.image || 'https://via.placeholder.com/300x180?text=Sin+imagen'}" alt="${producto.name || producto.nombre}" class="product-image">
    <div class="product-info">
      <h3 class="product-name">${producto.name || producto.nombre}</h3>
      <p class="product-description">${producto.description || producto.descripcion}</p>
      <div class="product-price">${Number(producto.precioUnitario || 0).toLocaleString("es-CO", { style: "currency", currency: "COP" })}</div>
      <button class="btn-cart eliminar-btn mt-2" data-id="${producto.id}">Eliminar<i class="bi bi-trash3-fill"></i></button>
    </div>
  `;

  card.querySelector(".eliminar-btn").addEventListener("click", () => {
    card.remove();
    productosEnPreview = productosEnPreview.filter(p => p.id !== producto.id);
    if (productosEnPreview.length === 0) document.getElementById("confirmar-guardar").classList.remove("visible");
  });

  container.appendChild(card);
}

// ---------------- Cargar inventario ----------------
function actualizarResumenInventario(productos) {
  const totalProductos = productos.length;

  const valorTotal = productos.reduce((acum, prod) => {
    const precio = Number(prod.precioUnitario) || 0;
    const stock = Number(prod.stock) || 0;
    return acum + (precio * stock);
  }, 0);

  const precioPromedio = totalProductos > 0 ? valorTotal / totalProductos : 0;

  document.getElementById("total-registros").textContent = totalProductos;
  document.getElementById("valor-total").textContent = valorTotal.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP"
  });
  document.getElementById("precio-promedio").textContent = precioPromedio.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP"
  });
}

async function cargarInventarioBackend() {
  console.log("Inicio de cargarInventarioBackend");

  let productos = [];

  try {
    const resultado = await getProductsFromBackend();
    productos = resultado || [];
    console.log("Productos cargados:", productos);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    Swal.fire("Error", "No se pudieron cargar los productos", "error");
    return;
  }

  const tabla = document.getElementById("cuerpo-tabla-inventario");
  tabla.innerHTML = "";
  console.log("Renderizando productos...");

  productos.forEach(p => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td data-label="Id">${p.id}</td>
      <td data-label="Nombre del Producto">${p.nombre}</td>
      <td data-label="Precio (COP)">${Number(p.precioUnitario || 0).toLocaleString("es-CO", { style: "currency", currency: "COP" })}</td>
      <td data-label="Descripción del Producto" class="descripcion-truncada">
          <span class="texto-corto">${p.descripcion}</span>
          <span class="texto-completo d-none">${p.descripcion}</span>
          <button class="ver-mas-btn">Ver más</button>
      </td>
      <td data-label="Stock">${p.stock || 0}</td>
      <td data-label="Imagen"><img src="${p.imagen || 'https://via.placeholder.com/50'}" alt="${p.nombre}" style="width:50px;"></td>
      <td data-label="Estado mercancía">${p.status ?? "Disponible"}</td>
      <td data-label="Acciones"><button class="btn-eliminar btn btn-danger btn-sm" data-id="${p.id}">Eliminar</button></td>
    `;
    tabla.appendChild(fila);
  });

  conectarBotonesEliminarBackend();
  conectarBotonesVerMas();
  actualizarResumenInventario(productos);

}


// ---------------- Botones ----------------
function conectarBotonesEliminarBackend() {
  document.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (confirm(`¿Eliminar producto ${id}?`)) {
        await deleteProductBackend(id);
        cargarInventarioBackend();
      }
    });
  });
}

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

// ---------------- Crear producto (preview + POST) ----------------
const formAdminInsert = document.getElementById("admin-insert");
formAdminInsert.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  const categoriaIdStr = formData.get("categoria");
  if (!categoriaIdStr) {
    Swal.fire("Atención", "Debes seleccionar una categoría", "warning");
    return;
  }
  const categoriaId = Number(categoriaIdStr);

  const idGenerado = Date.now(); // temporal
  const nuevoProducto = {
    id: idGenerado,
    name: formData.get("name") || "Producto sin nombre",
    idCategoria: categoriaId,
    precioUnitario: formData.get("price") || 0,  // <-- aquí el cambio
    stock: formData.get("stock") || 0, // ✅ ¡AGREGADO!
    description: formData.get("description") || "Sin descripción",
    image: imagenBase64 || "https://via.placeholder.com/300x180?text=Sin+imagen",
    imageName: archivoImagen?.name || "",
  };
  productosEnPreview.push(nuevoProducto);
  renderPreviewCard(nuevoProducto);
  document.getElementById("confirmar-guardar").classList.add("visible");
  this.reset();
  document.getElementById("nombreImagen").textContent = "";
  archivoImagen = null;
  imagenBase64 = "";
});

// ---------------- Confirmar guardar ----------------
document.getElementById("confirmar-guardar").addEventListener("click", async () => {
  if (productosEnPreview.length === 0) {
    Swal.fire("Atención", "No hay productos en vista previa", "warning");
    console.log("entro a cancelado");

    return;
  }
  for (const p of productosEnPreview) {
    await saveProductBackend({
      nombre: p.name,
      precioUnitario: p.precioUnitario, // <-- aquí el cambio
      descripcion: p.description,
      stock: p.stock,
      imagen: p.image,
      idCategoria: p.idCategoria
    });

  }


  productosEnPreview = [];
  document.getElementById("previewCards").innerHTML = "";
  document.getElementById("confirmar-guardar").classList.remove("visible");
  try {
    await cargarInventarioBackend();
    console.log("correcto");

  } catch {
    console.log("error el catch");


  }

  Swal.fire("Guardado", "Productos guardados correctamente", "success");
});


// ---------------- Imagen base64 ----------------
document.getElementById("imagenProducto").addEventListener("change", function (event) {
  archivoImagen = event.target.files[0];
  if (archivoImagen) {
    const reader = new FileReader();
    reader.onload = e => imagenBase64 = e.target.result;
    reader.readAsDataURL(archivoImagen);
    document.getElementById("nombreImagen").textContent = `📁 ${archivoImagen.name}`;
  } else {
    imagenBase64 = "";
    document.getElementById("nombreImagen").textContent = "";
  }
});

// ---------------- Crear categoría ----------------
function initCrearCategoria() {
  const btnCrear = document.getElementById("crearCategoria");
  btnCrear.addEventListener("click", async () => {
    const nombre = document.getElementById("nombreCategoria").value.trim();
    if (!nombre) {
      Swal.fire("Atención", "Debes ingresar un nombre", "warning");
      return;
    }

    try {
      const res = await fetch(CATEGORIAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre })
      });
      if (!res.ok) throw new Error("Error creando categoría");

      const nuevaCategoria = await res.json();
      Swal.fire("Éxito", `Categoría "${nuevaCategoria.nombreCategoria}" creada`, "success");
      document.getElementById("nombreCategoria").value = "";
      await cargarCategorias();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo crear la categoría", "error");
    }
  });
}

// ---------------- Cerrar sesión ----------------
function cerrarSesion() {
  Swal.fire({
    title: '¿Deseas cerrar sesión?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar',
    customClass: {
      popup: 'swal-confirm-popup',
      title: 'swal-confirm-title',
      confirmButton: 'swal-confirm-btn',
      cancelButton: 'swal-cancel-btn'
    }
  }).then(result => {
    if (result.isConfirmed) {
      localStorage.removeItem("usuarioActivo");
      localStorage.removeItem("token");
      window.location.href = "/index.html";
    }
  });
}

const botonCerrar = document.getElementById("botonSesion");
if (botonCerrar) botonCerrar.addEventListener("click", e => { e.preventDefault(); cerrarSesion(); });

// ---------------- Inicialización ----------------
window.addEventListener("DOMContentLoaded", async () => {
  await cargarCategorias();
  await cargarInventarioBackend();
  initCrearCategoria();
  document.getElementById("actualizar-inventario").addEventListener("click", cargarInventarioBackend);

});
