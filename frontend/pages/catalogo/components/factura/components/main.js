document.addEventListener('DOMContentLoaded', async function () {
    const carrito = JSON.parse(localStorage.getItem('cart')) || [];
    const productos = JSON.parse(localStorage.getItem('products')) || [];

    // ✅ Obtener usuario activo desde el token
    const usuario = obtenerInfoDelToken();
    const fechaActual = new Date().toLocaleDateString('es-CO');

    if (usuario) {
        document.getElementById('nombreCliente').textContent = `${usuario.nombre || 'No definido'}`;
        document.getElementById('telefonoCliente').textContent = usuario.telefono || 'No definido';
        document.getElementById('fechaFactura').textContent = fechaActual;
    } else {
        document.getElementById('nombreCliente').textContent = 'No disponible';
        document.getElementById('telefonoCliente').textContent = 'No definido';
        document.getElementById('fechaFactura').textContent = fechaActual;
    }

    // ✅ Mostrar productos del carrito
    const cuerpoTabla = document.getElementById('tablaProductosFactura');
    let subtotal = 0;

    carrito.forEach(item => {
        const producto = productos.find(p => p.id == item.id);

        if (producto) {
            const precioUnitario = Number(producto.price) || 0;
            const cantidad = Number(item.cantidad) || 1;
            const itemSubtotal = precioUnitario * cantidad;
            subtotal += itemSubtotal;

            const fila = `
                <tr>
                    <td>${producto.name}</td>
                    <td>${cantidad}</td>
                    <td>$${precioUnitario.toLocaleString('es-CO')}</td>
                    <td>$${itemSubtotal.toLocaleString('es-CO')}</td>
                </tr>
            `;
            cuerpoTabla.insertAdjacentHTML('beforeend', fila);
        }
    });

    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    document.getElementById('subtotalFactura').textContent = `$${subtotal.toLocaleString('es-CO')}`;
    document.getElementById('ivaFactura').textContent = `$${iva.toLocaleString('es-CO')}`;
    document.getElementById('totalFactura').textContent = `$${total.toLocaleString('es-CO')}`;
});

// ========== FUNCIONES TOKEN ==========

function obtenerInfoDelToken() {
    const token = localStorage.getItem("token");
    
    if (!token) {
        console.warn("No hay token en localStorage");
        return null;
    }
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            nombre: payload.nombre || payload.nombres || 'Sebastian Hernandez',
            telefono: payload.telefono || payload.celular || '3204823503',
            id: payload.id || payload.sub || null
        };
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
}

// ========== FUNCIONES PDF Y WHATSAPP ==========

function exportarPDF() {
    const elemento = document.querySelector('.inovice');

    const opciones = {
        margin: 0,
        filename: 'Factura-LaCafetalera.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opciones).from(elemento).save();
}

function realizarCompra() {
    const elemento = document.querySelector('.inovice');

    Swal.fire({
        title: 'Generando PDF...',
        text: 'Por favor espera unos segundos.',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    const opciones = {
        margin: 0,
        filename: 'Factura-LaCafetalera.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opciones).from(elemento).save().then(() => {
        Swal.close();
        localStorage.removeItem('cart');

        const mensaje = encodeURIComponent(
            "Muy buenas tardes, deseo realizar este pedido. (Señor usuario, por favor cargue el PDF generado previamente)"
        );
        const numero = "573212040057";
        const url = `https://wa.me/${numero}?text=${mensaje}`;
        window.open(url, '_blank');
    }).catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error al generar el PDF',
            text: 'Intenta nuevamente. Detalles: ' + error.message,
        });
    });
}
