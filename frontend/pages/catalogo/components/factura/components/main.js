document.addEventListener('DOMContentLoaded', function () {
    const carrito = JSON.parse(localStorage.getItem('cart')) || [];
    const productos = JSON.parse(localStorage.getItem('products')) || [];
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    if (!usuarioActivo) {
        Swal.fire({
            icon: 'warning',
            title: 'Usuario no autenticado',
            text: 'Debes iniciar sesión para generar la factura.',
        });
        return;
    }

    if (carrito.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Carrito vacío',
            text: 'No hay productos en el carrito para generar la factura.',
        });
        return;
    }

    const usuario = usuarios.find(u => u.correo === usuarioActivo.correo);

    if (!usuario) {
        Swal.fire({
            icon: 'error',
            title: 'Usuario no encontrado',
            text: 'No se encontraron los datos completos del usuario.',
        });
        return;
    }

    const fechaActual = new Date().toLocaleDateString('es-CO');

    // Insertar datos del cliente
    document.getElementById('nombreCliente').textContent = `${usuario.nombres} ${usuario.apellidos}`;
    document.getElementById('telefonoCliente').textContent = usuario.celular || 'No definido';
    document.getElementById('fechaFactura').textContent = fechaActual;

    // Insertar productos
    const cuerpoTabla = document.getElementById('tablaProductosFactura');
    let subtotal = 0;

    carrito.forEach(item => {
        const producto = productos.find(p => p.id === item.id);
        if (producto) {
            const itemSubtotal = producto.price * item.cantidad;
            subtotal += itemSubtotal;

            const fila = `
                <tr>
                    <td>${producto.name}</td>
                    <td>${item.cantidad}</td>
                    <td>$${producto.price.toLocaleString('es-CO')}</td>
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


// ========== FUNCIONES PDF Y WHATSAPP ==========

// Exportar solo el PDF
function exportarPDF() {
    const elemento = document.querySelector('.inovice');

    const opciones = {
        margin:       0,
        filename:     'Factura-LaCafetalera.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, scrollY: 0 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opciones).from(elemento).save();
}

// Exportar PDF y abrir WhatsApp
function realizarCompra() {
    const elemento = document.querySelector('.inovice');

    Swal.fire({
        title: 'Generando PDF...',
        text: 'Por favor espera unos segundos.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    const opciones = {
        margin:       0,
        filename:     'Factura-LaCafetalera.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, scrollY: 0 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opciones).from(elemento).save().then(() => {
        Swal.close();

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
