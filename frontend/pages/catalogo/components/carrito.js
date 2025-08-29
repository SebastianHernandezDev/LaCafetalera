function obtenerCarrito(){     
    return JSON.parse(localStorage.getItem('cart'))||[]; 
}  
console.log("Carrito obtenido")   

function guardarCarrito(carrito){     
    localStorage.setItem('cart', JSON.stringify(carrito)); 
} 
console.log("Carrito guardado")  

function obtenerProductos() {     
    return JSON.parse(localStorage.getItem('products')) || []; 
}  
console.log("productos obtenidos de catalogo")   

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
    
    // Formatear el precio
    const totalFormateado = total.toLocaleString('es-CO');
    document.getElementById('totalProductos').innerHTML = `<span class="coste">$</span>${totalFormateado}`;
    document.getElementById('totalGeneral').innerHTML = `<span class="coste">$</span>${totalFormateado}`;
}

//mostrar productos en el carro   
function mostrarProductosCarrito(){             
    const productos = obtenerProductos();             
    const carrito = obtenerCarrito();             
        
    // En caso de que el carrito esté vacío             
    if(carrito.length === 0){                 
        document.getElementById('carritoVacio').style.display = 'block';                 
        document.getElementById('contenidoCarrito').style.display = 'none';                 
        console.log("mensaje de carrito vacio mostrado");
        actualizarResumen();             
    } else {                 
        // Si hay productos, mostrar contenido y ocultar mensaje vacío                 
        document.getElementById('carritoVacio').style.display = 'none';                 
        document.getElementById('contenidoCarrito').style.display = 'block';                 
        console.log("productos mostrados");
        
        // Buscar el contenedor donde insertar los productos
        const contenedorProductos = document.querySelector('#contenidoCarrito .card-body');
        
        // Si hay productos, crear el HTML dinámicamente
        let htmlProductos = '';
        
        carrito.forEach((itemCarrito, index) => {
            const producto = productos.find(p => p.id === itemCarrito.id);
            if (producto) {
                const subtotal = producto.price * itemCarrito.cantidad;
                const subtotalFormateado = subtotal.toLocaleString('es-CO');
                const precioFormateado = producto.price.toLocaleString('es-CO');
                
                htmlProductos += `
                    <div class="d-flex align-items-start border-bottom pb-3 mb-3" data-product-id="${producto.id}">
                        <input class="form-check-input me-3 mt-3" type="checkbox" id="product${index}">
                        <img src="${producto.image || 'https://via.placeholder.com/80x100'}" class="me-3" alt="${producto.name}" style="width: 80px; height: 100px; object-fit: cover;">
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <span class="badge bg-danger mb-2">OFERTA RELÁMPAGO</span>
                                    <h6 class="mb-1">${producto.name}</h6>
                                    <button class="btn btn-link p-0 text-primary eliminar-producto" 
                                            style="font-size: 0.9rem;" 
                                            data-product-id="${producto.id}">
                                        Eliminar
                                    </button>
                                </div>
                                <div class="text-end">
                                    <div class="d-flex align-items-center justify-content-end mb-2">
                                        <button class="btn btn-outline-secondary btn-sm btn-cantidad" 
                                                data-product-id="${producto.id}" 
                                                data-action="decrease">-</button>
                                        <span class="mx-3 cantidad-display">${itemCarrito.cantidad}</span>
                                        <button class="btn btn-outline-secondary btn-sm btn-cantidad" 
                                                data-product-id="${producto.id}" 
                                                data-action="increase">+</button>
                                    </div>
                                    <div>
                                        ${producto.originalPrice ? `<small class="text-muted text-decoration-line-through">$${producto.originalPrice.toLocaleString('es-CO')}</small>` : ''}
                                        <div class="fw-bold fs-5">$${precioFormateado}</div>
                                        <div class="text-muted small">Subtotal: $${subtotalFormateado}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
        
        // Encontrar el elemento después del cual insertar los productos
        const elementoReferencia = contenedorProductos.querySelector('.d-flex.align-items-center.mb-3');
        
        // Eliminar productos existentes si los hay
        const productosExistentes = contenedorProductos.querySelectorAll('[data-product-id]');
        productosExistentes.forEach(elemento => elemento.remove());
        
        // Insertar los nuevos productos después del elemento de referencia
        if (elementoReferencia) {
            elementoReferencia.insertAdjacentHTML('afterend', htmlProductos);
        }
        
        // Agregar event listeners a los botones
        agregarEventListeners();
        actualizarResumen();
    }          
}
function obtenerCarrito(){     
    return JSON.parse(localStorage.getItem('cart'))||[]; 
}  
console.log("Carrito obtenido")   

function guardarCarrito(carrito){     
    localStorage.setItem('cart', JSON.stringify(carrito)); 
} 
console.log("Carrito guardado")  

function obtenerProductos() {     
    return JSON.parse(localStorage.getItem('products')) || []; 
}  
console.log("productos obtenidos de catalogo")   

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
    
    // Formatear el precio
    const totalFormateado = total.toLocaleString('es-CO');
    document.getElementById('totalProductos').innerHTML = `<span class="coste">$</span>${totalFormateado}`;
    document.getElementById('totalGeneral').innerHTML = `<span class="coste">$</span>${totalFormateado}`;
}

//mostrar productos en el carro   
function mostrarProductosCarrito(){             
    const productos = obtenerProductos();             
    const carrito = obtenerCarrito();             
        
    // En caso de que el carrito esté vacío             
    if(carrito.length === 0){                 
        document.getElementById('carritoVacio').style.display = 'block';                 
        document.getElementById('contenidoCarrito').style.display = 'none';                 
        console.log("mensaje de carrito vacio mostrado");
        actualizarResumen();             
    } else {                 
        // Si hay productos, mostrar contenido y ocultar mensaje vacío                 
        document.getElementById('carritoVacio').style.display = 'none';                 
        document.getElementById('contenidoCarrito').style.display = 'block';                 
        console.log("productos mostrados");
        
        // Buscar el contenedor donde insertar los productos
        const contenedorProductos = document.getElementById('contenedorProductos');
        
        // Si hay productos, crear el HTML dinámicamente
        let htmlProductos = '';
        
        carrito.forEach((itemCarrito, index) => {
            const producto = productos.find(p => p.id === itemCarrito.id);
            if (producto) {
                const subtotal = producto.price * itemCarrito.cantidad;
                const subtotalFormateado = subtotal.toLocaleString('es-CO');
                const precioFormateado = producto.price.toLocaleString('es-CO');
                
                htmlProductos += `
                    <div class="d-flex align-items-start border-bottom pb-3 mb-3" data-product-id="${producto.id}">
                        <input class="form-check-input me-3 mt-3" type="checkbox" id="product${index}">
                        <img src="${producto.image || 'https://via.placeholder.com/80x100'}" class="me-3" alt="${producto.name}" style="width: 80px; height: 100px; object-fit: cover;">
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <span class="badge bg-danger mb-2">OFERTA RELÁMPAGO</span>
                                    <h6 class="mb-1">${producto.name}</h6>
                                    <button class="btn btn-link p-0 text-primary eliminar-producto" 
                                            style="font-size: 0.9rem;" 
                                            data-product-id="${producto.id}">
                                        Eliminar
                                    </button>
                                </div>
                                <div class="text-end">
                                    <div class="d-flex align-items-center justify-content-end mb-2">
                                        <button class="btn btn-outline-secondary btn-sm btn-cantidad" 
                                                data-product-id="${producto.id}" 
                                                data-action="decrease">-</button>
                                        <span class="mx-3 cantidad-display">${itemCarrito.cantidad}</span>
                                        <button class="btn btn-outline-secondary btn-sm btn-cantidad" 
                                                data-product-id="${producto.id}" 
                                                data-action="increase">+</button>
                                    </div>
                                    <div>
                                        ${producto.originalPrice ? `<small class="text-muted text-decoration-line-through">${producto.originalPrice.toLocaleString('es-CO')}</small>` : ''}
                                        <div class="fw-bold fs-5">${precioFormateado}</div>
                                        <div class="text-muted small">Subtotal: ${subtotalFormateado}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
        
        // Encontrar el elemento después del cual insertar los productos
        const elementoReferencia = document.getElementById('headerProductos');
        
        // Eliminar productos existentes si los hay
        const productosExistentes = contenedorProductos.querySelectorAll('[data-product-id]');
        productosExistentes.forEach(elemento => elemento.remove());
        
        // Insertar los nuevos productos después del header de productos
        if (elementoReferencia) {
            elementoReferencia.insertAdjacentHTML('afterend', htmlProductos);
        }
        
        // Agregar event listeners a los botones
        agregarEventListeners();
        actualizarResumen();
    }          
}

// Función para agregar event listeners a los botones dinámicos
function agregarEventListeners() {
    // Event listeners para botones de eliminar
    document.querySelectorAll('.eliminar-producto').forEach(boton => {
        boton.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            eliminarDelCarrito(productId);
        });
    });
    
    // Event listeners para botones de cantidad
    document.querySelectorAll('.btn-cantidad').forEach(boton => {
        boton.addEventListener('click', function() {
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

document.addEventListener('DOMContentLoaded', function() {   
    mostrarProductosCarrito();                      
    
    document.getElementById('vaciarCarrito').addEventListener('click', function() {                 
        localStorage.removeItem('cart');                
        mostrarProductosCarrito();
        actualizarResumen();
    });         
});