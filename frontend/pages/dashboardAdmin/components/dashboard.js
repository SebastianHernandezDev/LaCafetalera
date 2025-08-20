document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario');
    const contenedor = document.getElementById('contenedor-card');
    const imagenInput = document.getElementById('nuevaImagen');
    const imgPreview = document.getElementById('preview');

    // Vista previa de la imagen
    imagenInput.addEventListener('change', function () {
        const archivo = imagenInput.files[0];
        if (archivo) {
            const urlTemporal = URL.createObjectURL(archivo);
            imgPreview.src = urlTemporal;
            imgPreview.style.display = 'block';
        } else {
            imgPreview.style.display = 'none';
            imgPreview.src = '';
        }
    });

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        const titulo = document.getElementById('nuevoTitulo').value;
        const descripcion = document.getElementById('nuevaDescripcion').value;
        const imagenArchivo = imagenInput.files[0];

        const card = document.createElement('div');
        card.className = 'card mt-3';
        card.style.width = '18rem';

        const contenidoCard = document.createElement('div');
        contenidoCard.className = 'card-body';

        const tituloElem = document.createElement('h5');
        tituloElem.className = 'card-title';
        tituloElem.textContent = titulo;

        const descripcionElem = document.createElement('p');
        descripcionElem.className = 'card-text';
        descripcionElem.textContent = descripcion;

        // Botón de Like
        const likeBtn = document.createElement('button');
        likeBtn.className = 'btn btn-outline-danger btn-sm';
        likeBtn.innerHTML = '❤️ Like';

        const contadorLikes = document.createElement('span');
        contadorLikes.textContent = ' 0';
        contadorLikes.className = 'ms-2';

        let likes = 0;
        likeBtn.addEventListener('click', () => {
            likes++;
            contadorLikes.textContent = ` ${likes}`;
        });

        // Agregar imagen si hay
        if (imagenArchivo) {
            const lector = new FileReader();
            lector.onload = function (evento) {
                const imagen = document.createElement('img');
                imagen.src = evento.target.result;
                imagen.className = 'card-img-top';
                imagen.alt = 'Imagen de la publicación';

                contenidoCard.appendChild(tituloElem);
                contenidoCard.appendChild(descripcionElem);
                contenidoCard.appendChild(likeBtn);
                contenidoCard.appendChild(contadorLikes);

                card.appendChild(imagen);
                card.appendChild(contenidoCard);
                contenedor.appendChild(card);
            };
            lector.readAsDataURL(imagenArchivo);
        } else {
            contenidoCard.appendChild(tituloElem);
            contenidoCard.appendChild(descripcionElem);
            contenidoCard.appendChild(likeBtn);
            contenidoCard.appendChild(contadorLikes);

            card.appendChild(contenidoCard);
            contenedor.appendChild(card);
        }

        // Limpiar formulario y preview
        formulario.reset();
        imgPreview.style.display = 'none';
        imgPreview.src = '';
    });
});