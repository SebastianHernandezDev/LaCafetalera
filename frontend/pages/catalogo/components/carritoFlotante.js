// ===== FUNCIONES BÁSICAS DEL CARRITO =====

// Obtener carrito del localStorage
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Guardar carrito en localStorage
function guardarCarrito(carrito) {
    localStorage.setItem('cart', JSON.stringify(carrito));
}

// Obtener productos originales
function obtenerProductos() {
    return JSON.parse(localStorage.getItem('products')) || [];
}




///////////////////////////////////////////ID NUEVOS SOLUCION SOLUCION SOLUCION//////////////////////
// Validar que un producto existe antes de agregarlo
function validarProducto(productoId) {
    const productos = obtenerProductos();
    return productos.some(p => p.id === productoId);
}
///////////////////////////////////////////ID NUEVOS SOLUCION SOLUCION SOLUCION//////////////////////




// ===== FUNCIÓN PRINCIPAL: MOSTRAR PRODUCTOS EN EL CARRITO =====

function mostrarProductosCarrito() {
    const carrito = obtenerCarrito();
    const productos = obtenerProductos();
    const contenedor = document.getElementById('productosCarrito');
    
    // Limpiar carrito de productos que ya no existen
    const carritoLimpio = carrito.filter(item => validarProducto(item.id));
    if (carritoLimpio.length !== carrito.length) {
        guardarCarrito(carritoLimpio);
    }
    
    // Si no hay productos en el carrito
    if (carritoLimpio.length === 0) {
        contenedor.innerHTML = '';
        document.getElementById('carritoVacio').style.display = 'block';
        document.getElementById('carritoFooter').style.display = 'none';
        actualizarContador();
        return;
    }
    
    // Si hay productos, crear el HTML
    let htmlProductos = '';
    let total = 0;
    
    // Ordenar carrito por ID para mantener consistencia
    carritoLimpio.sort((a, b) => a.id - b.id);
    
    carritoLimpio.forEach(itemCarrito => {
        const producto = productos.find(p => p.id === itemCarrito.id);
        if (producto) {
            const subtotal = parseFloat(producto.price) * itemCarrito.cantidad;
            total += subtotal;
            
            htmlProductos += `
                <div class="producto-carrito border-bottom py-3" data-producto-id="${producto.id}">
                    <div class="row g-3 align-items-center">
                        
                        <!-- Imagen del producto -->
                        <div class="col-3">
                            <img src="${producto.image}" alt="${producto.name}" 
                                 class="img-fluid rounded" 
                                 style="max-height: 160px; object-fit: cover;"
                                 onerror="this.src='../assets/img/placeholder.png'">
                        </div>
                        
                        <!-- Información del producto -->
                        <div class="col-6">
                            <h6 class="mb-1">${producto.name}</h6>
                            <small class="text-muted">$${parseFloat(producto.price).toFixed(2)}</small>
                            <br>
                            <small class="text-primary">Subtotal: $${subtotal.toFixed(2)}</small>
                        </div>
                        
                        <!-- Controles -->
                        <div class="col-3">
                            <div class="d-flex align-items-center justify-content-center mb-2">
                                <button class="btn btn-outline-secondary btn-sm" 
                                        onclick="disminuirCantidad(${producto.id})" 
                                        type="button">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="mx-2 fw-bold">${itemCarrito.cantidad}</span>
                                <button class="btn btn-outline-secondary btn-sm" 
                                        onclick="aumentarCantidad(${producto.id})" 
                                        type="button">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            
                            <div class="text-center">
                                <button class="btn btn-outline-danger btn-sm" 
                                        onclick="eliminarProducto(${producto.id})" 
                                        type="button">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        
                    </div>
                </div>
            `;
        }
    });
    
    // Mostrar productos y total
    contenedor.innerHTML = htmlProductos;
    document.getElementById('totalCarrito').textContent = `$${total.toFixed(2)}`;
    document.getElementById('carritoVacio').style.display = 'none';
    document.getElementById('carritoFooter').style.display = 'block';
    
    actualizarContador();
}

// ===== FUNCIONES DE CARRITO =====

function agregarAlCarrito(productoId) {
    // Validar que el producto existe
    if (!validarProducto(productoId)) {
        console.error(`Producto con ID ${productoId} no encontrado`);
        return false;
    }
    
    const carrito = obtenerCarrito();
    const itemExistente = carrito.find(item => item.id === productoId);
    
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({
            id: productoId,
            cantidad: 1,
            fechaAgregado: new Date().toISOString()
        });
    }
    
    guardarCarrito(carrito);
    mostrarProductosCarrito();
    return true;
}

function aumentarCantidad(productoId) {
    const carrito = obtenerCarrito();
    const item = carrito.find(item => item.id === productoId);
    if (item) {
        item.cantidad += 1;
        guardarCarrito(carrito);
        mostrarProductosCarrito();
    }
}

function disminuirCantidad(productoId) {
    const carrito = obtenerCarrito();
    const item = carrito.find(item => item.id === productoId);
    if (item && item.cantidad > 1) {
        item.cantidad -= 1;
        guardarCarrito(carrito);
        mostrarProductosCarrito();
    } else if (item && item.cantidad === 1) {
        eliminarProducto(productoId);
    }
}

function eliminarProducto(productoId) {
    const carrito = obtenerCarrito().filter(item => item.id !== productoId);
    guardarCarrito(carrito);
    mostrarProductosCarrito();
}

function vaciarCarrito() {
    localStorage.removeItem('cart');
    mostrarProductosCarrito();
}

function actualizarContador() {
    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const contador = document.getElementById('contadorCarrito');
    if (contador) {
        contador.textContent = totalItems;
    }
}


// ===== EVENTOS =====

document.addEventListener('DOMContentLoaded', async function() {
    // Inicializar productos del catálogo
    await initializeProducts();
    renderProducts();
    
    // Actualizar contador al cargar la página
    actualizarContador();
    
    // Evento para mostrar productos cuando se abra el carrito
    const carritoFlotante = document.getElementById('carritoFlotante');
    if (carritoFlotante) {
        carritoFlotante.addEventListener('click', function() {
            mostrarProductosCarrito();
        });
    }
    
    // Función para mostrar el modal de confirmación
    function mostrarConfirmacion(message, callback) {
        const modalMensaje = document.getElementById("confirmarMensaje");
        if (modalMensaje) {
            modalMensaje.innerText = message;
        }
        
        const confirmModal = new bootstrap.Modal(document.getElementById("confirmModal"));
        confirmModal.show();

        // Botones
        const okButton = document.getElementById("confirmarOk");
        const cancelButton = document.getElementById("confirmarCancelar");

        okButton.onclick = function () {
            callback(true);
            confirmModal.hide();
        };

        cancelButton.onclick = function () {
            callback(false);
            confirmModal.hide();
        };
    }

    // Evento para vaciar carrito con confirmación
    const btnVaciarCarrito = document.getElementById('vaciarCarrito');
    if (btnVaciarCarrito) {
        btnVaciarCarrito.addEventListener('click', function () {
            mostrarConfirmacion("¿Estás seguro de que quieres vaciar el carrito?", function (respuesta) {
                if (respuesta) {
                    vaciarCarrito();
                }
            });
        });
    }
    
    // Evento para proceder al checkout
    const btnCheckout = document.getElementById('procederCheckout');
    if (btnCheckout) {
        btnCheckout.addEventListener('click', function() {
            const resumen = obtenerResumenCarrito();
            console.log('Resumen del pedido:', resumen);
            // Aquí puedes agregar la lógica para proceder al checkout
            alert(`Total a pagar: $${resumen.totalPrecio.toFixed(2)}`);
        });
    }
});
