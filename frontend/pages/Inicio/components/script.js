// ===== Navbar Toggle =====
const menuToggle = document.getElementById("menuToggle");
const navbarLinks = document.getElementById("navbarLinks");

if (menuToggle && navbarLinks) {
  menuToggle.addEventListener("click", () => {
    navbarLinks.classList.toggle("show");
  });
}

// Botones "Ver más" para historias
const botonesVerMas = document.querySelectorAll('.ver-mas-btn');

botonesVerMas.forEach(btn => {
  btn.addEventListener('click', () => {
    // Seleccionamos el párrafo dentro del mismo contenedor
    const parrafo = btn.parentElement.querySelector('.historia-parrafo');
    
    // Alternamos la clase expandido
    parrafo.classList.toggle('expandido');

    // Cambiamos el texto del botón
    btn.textContent = parrafo.classList.contains('expandido') ? 'Ver menos' : 'Ver más';
  });
});
