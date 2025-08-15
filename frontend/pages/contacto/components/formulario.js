 document.getElementById('contactForm').addEventListener('submit', function(e) {
            const submitBtn = document.getElementById('submitBtn');
            const successMsg = document.getElementById('successMessage');
            const errorMsg = document.getElementById('errorMessage');
            
            // Cambiar texto del botón mientras se envía
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            // Ocultar mensajes previos
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';
            
            // Usar fetch para envío AJAX
            fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: {
                    'Accept': 'application/json'
                }

            }).then(response => {
                if (response.ok) {
                    successMsg.style.display = 'block';
                    this.reset(); // Limpiar formulario
                } else {
                    throw new Error('Error en el envío');
                }
            }).catch(error => {
                errorMsg.style.display = 'block';
            }).finally(() => {
                submitBtn.textContent = 'Enviar mensaje';
                submitBtn.disabled = false;
            });
            
            e.preventDefault(); // Prevenir envío tradicional
        });

        // Contador de caracteres para el mensaje
        const mensajeTextarea = document.getElementById('mensaje');
        const maxLength = 300;
        
        // Contador visual
        const contador = document.createElement('div');
        contador.style.textAlign = 'right';
        contador.style.fontSize = '0.8rem';
        contador.style.color = '#666';
        contador.style.marginTop = '5px';
        mensajeTextarea.parentNode.appendChild(contador);
        
        mensajeTextarea.addEventListener('input', function() {
            const remaining = maxLength - this.value.length;
            contador.textContent = `${remaining} caracteres restantes`;
            contador.style.color = remaining < 50 ? '#f44336' : '#666';
        });
        
        // Inicializar contador
        mensajeTextarea.dispatchEvent(new Event('input'));
