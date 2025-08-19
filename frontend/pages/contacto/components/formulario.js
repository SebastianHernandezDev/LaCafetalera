// Formulario
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const mensaje = document.getElementById('mensaje');
    
    // Validar límite de 300 caracteres
    if (mensaje.value.length > 300) {
        alert('El mensaje no puede exceder los 300 caracteres.');
        return; 
    }

    // Simulación de envío
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = '¡Mensaje enviado!';
        submitBtn.style.background = 'linear-gradient(135deg, #93BB88, #8CC637)';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = 'linear-gradient(135deg, #8CC637, #4B6950)';
            this.reset();
        }, 2000);
    }, 1500);
});

// FAQ Toggle con animación
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const answer = faqItem.querySelector('.faq-answer');
        const isActive = faqItem.classList.contains('active');

        // Cerrar todas las FAQ
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
            const ans = item.querySelector('.faq-answer');
            ans.style.maxHeight = null;
            ans.style.padding = '0 20px';
        });

        if (!isActive) {
            // Abrir la seleccionada
            faqItem.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + "px";
            answer.style.padding = "15px 20px";
        }
    });
});

// Efecto en labels al enfocar/desenfocar inputs
const inputs = document.querySelectorAll('input, textarea');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.querySelector('label').style.color = '#8CC637';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.querySelector('label').style.color = '#562919';
    });
});