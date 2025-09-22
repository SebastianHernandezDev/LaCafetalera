document.getElementById("continuarCompra").addEventListener("click", async function () { 
    await enviarPedidoAlBackend(); // 👉 primero sincroniza carrito con backend
    window.open("../components/factura/components/factura.html", '_blank');
});

// ============================
// FUNCIONES BACKEND
// ============================

const API_URL = "https://8mq33rknsp.us-east-1.awsapprunner.com/"; // ajusta si cambia
const token = localStorage.getItem("token");

// Crear pedido vacío en backend
async function crearPedido() {
    const response = await fetch(`${API_URL}/pedidos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({}) // pedido vacío
    });
    if (!response.ok) throw new Error("Error al crear pedido");
    return await response.json();
}

// Agregar productos (detalles) al pedido
async function agregarDetalle(pedidoId, productoId, cantidad) {
    console.log(`Enviando: idPedido=${pedidoId}, idProducto=${productoId}, cantidad=${cantidad}`);
    
    const response = await fetch(`${API_URL}/detalle-pedidos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
            idPedido: pedidoId,      
            idProducto: productoId,   
            cantidad: cantidad 
        })
    });
    
    console.log(`Status: ${response.status}`);
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error ${response.status}:`, errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    console.log("Detalle agregado:", result);
    return result;
}
// Enviar todo el carrito al backend
async function enviarPedidoAlBackend() {
    try {
        // 1. Crear pedido
        const pedido = await crearPedido();
        console.log("Pedido creado:", pedido);

        // 2. Guardar ID en localStorage
        localStorage.setItem("pedidoId", pedido.id);

        // 3. Obtener carrito local
        const carrito = obtenerCarrito();

        // 4. Recorrer y enviar cada producto
        for (const item of carrito) {
            await agregarDetalle(pedido.id, item.id, item.cantidad);
        }

        console.log("Carrito sincronizado con backend ✅");
    } catch (error) {
        console.error("Error enviando pedido:", error.message);
    }
}


function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}
console.log("Carrito obtenido");

function guardarCarrito(carrito) {
    localStorage.setItem('cart', JSON.stringify(carrito));
}
console.log("Carrito guardado");

function obtenerProductos() {
    return JSON.parse(localStorage.getItem('products')) || [];
}
console.log("productos obtenidos de catalogo");

// Función para eliminar producto del carrito
function eliminarDelCarrito(productId) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.id !== productId);
    guardarCarrito(carrito);
    mostrarProductosCarrito();
    actualizarResumen();
}

// Función para cambiar cantidad
function cambiarCantidad(productId, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(productId);
        return;
    }

    let carrito = obtenerCarrito();
    const item = carrito.find(item => item.id === productId);
    if (item) {
        item.cantidad = nuevaCantidad;
        guardarCarrito(carrito);
        mostrarProductosCarrito();
        actualizarResumen();
    }
}

// Función para vaciar carrito con SweetAlert personalizado
function vaciarCarrito() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        Swal.fire({
            title: "Carrito Vacío",
            text: "No hay productos para eliminar.",
            icon: "info",
            customClass: {
                popup: 'swal2-popup',
                title: 'swal2-title',
                htmlContainer: 'swal2-html-container',
                confirmButton: 'swal2-confirm'
            },
            timer: 2000,
            showConfirmButton: false
        });
    } else {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Se eliminarán todos los productos del carrito",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, vaciar carrito',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-popup',
                title: 'swal2-title',
                htmlContainer: 'swal2-html-container',
                confirmButton: 'swal2-confirm',
                cancelButton: 'swal2-cancel'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('cart');
                mostrarProductosCarrito();
                actualizarResumen();

                Swal.fire({
                    title: '¡Eliminado!',
                    text: 'El carrito ha sido vaciado.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'swal2-popup',
                        title: 'swal2-title',
                        htmlContainer: 'swal2-html-container',
                        confirmButton: 'swal2-confirm'
                    }
                });
            }
        });
    }
}

// Función para actualizar el resumen de compra
function actualizarResumen() {
    const carrito = obtenerCarrito();
    const productos = obtenerProductos();
    let total = 0;

    carrito.forEach(itemCarrito => {
        const producto = productos.find(p => p.id === itemCarrito.id);
        if (producto) {
            total += producto.price * itemCarrito.cantidad;
        }
    });

    const totalFormateado = total.toLocaleString('es-CO');
    document.getElementById('totalProductos').innerHTML = `<span class="coste">$</span>${totalFormateado}`;
    document.getElementById('totalGeneral').innerHTML = `<span class="coste">$</span>${totalFormateado}`;
}

// Mostrar productos en el carrito
function mostrarProductosCarrito() {
    const productos = obtenerProductos();
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        document.getElementById('carritoVacio').style.display = 'block';
        document.getElementById('contenidoCarrito').style.display = 'none';
        console.log("mensaje de carrito vacio mostrado");
        actualizarResumen();
    } else {
        document.getElementById('carritoVacio').style.display = 'none';
        document.getElementById('contenidoCarrito').style.display = 'block';
        console.log("productos mostrados");

        const contenedorProductos = document.getElementById('contenedorProductos');
        let htmlProductos = '';

        carrito.forEach((itemCarrito) => {
            const producto = productos.find(p => p.id === itemCarrito.id);
            if (producto) {
                const subtotal = producto.price * itemCarrito.cantidad;
                const subtotalFormateado = subtotal.toLocaleString('es-CO');
                const precioFormateado = producto.price.toLocaleString('es-CO');

                htmlProductos += `
                    <div class="d-flex flex-column flex-md-row align-items-start border-bottom pb-3 mb-3" data-product-id="${producto.id}">
                        <img src="${producto.image || 'https://via.placeholder.com/120x140'}" 
                            class="me-0 me-md-3 mb-3 mb-md-0 rounded align-self-center align-self-md-start" 
                            alt="${producto.name}" 
                            style="width: 130px; height: 160px; object-fit: cover;">
                        
                        <div class="flex-grow-1">
                            <div class="d-flex flex-column flex-md-row justify-content-between align-items-start">
                                <div class="order-1 order-md-1 w-100 w-md-auto">
                                    <h4 class="mb-1">${producto.name}</h4>
                                    <button class="btn btn-outline-danger p-0 py-1 px-3 mt-2 eliminar-producto" 
                                            style="font-size: 0.9rem;" 
                                            data-product-id="${producto.id}">
                                        Eliminar
                                    </button>
                                    <div class="card mt-3">
                                        <div class="card-body">
                                            <p class="card-text">
                                                ${producto.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="order-2 order-md-2 text-start text-md-end mt-3 mt-md-0">
                                    <div class="d-flex align-items-center justify-content-start justify-content-md-end mb-2">
                                        <span class="m-2 text-muted">cantidad:</span>
                                        <button class="btn btn-outline-warning btn-sm btn-cantidad" 
                                                data-product-id="${producto.id}" 
                                                data-action="decrease">-</button>
                                        <span class="mx-3 cantidad-display">${itemCarrito.cantidad}</span>
                                        <button class="btn btn-outline-primary btn-sm btn-cantidad" 
                                                data-product-id="${producto.id}" 
                                                data-action="increase">+</button>
                                    </div>
                                    <div>
                                        ${producto.originalPrice ? `<small class="text-muted text-decoration-line-through">$${producto.originalPrice.toLocaleString('es-CO')}</small>` : ''}
                                        <div class="fw-bold fs-5 mt-1"><span class="fs-5">Precio: </span>$${precioFormateado}</div>
                                        <div class="text-muted small mt-2">Subtotal: $${subtotalFormateado}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        });

        const elementoReferencia = document.getElementById('headerProductos');
        const productosExistentes = contenedorProductos.querySelectorAll('[data-product-id]');
        productosExistentes.forEach(elemento => elemento.remove());
        if (elementoReferencia) {
            elementoReferencia.insertAdjacentHTML('afterend', htmlProductos);
        }

        agregarEventListeners();
        actualizarResumen();
    }
}

// Función para agregar event listeners a los botones dinámicos
function agregarEventListeners() {
    document.querySelectorAll('.eliminar-producto').forEach(boton => {
        boton.addEventListener('click', function () {
            const productId = parseInt(this.dataset.productId);
            eliminarDelCarrito(productId);
        });
    });

    document.querySelectorAll('.btn-cantidad').forEach(boton => {
        boton.addEventListener('click', function () {
            const productId = parseInt(this.dataset.productId);
            const action = this.dataset.action;
            const cantidadDisplay = this.parentElement.querySelector('.cantidad-display');
            let cantidadActual = parseInt(cantidadDisplay.textContent);

            if (action === 'increase') {
                cambiarCantidad(productId, cantidadActual + 1);
            } else if (action === 'decrease') {
                cambiarCantidad(productId, cantidadActual - 1);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    mostrarProductosCarrito();

    document.getElementById('vaciarCarrito').addEventListener('click', vaciarCarrito);
});
